import "reflect-metadata";
import { randomUUID } from "node:crypto";
import { Catch, HttpException, HttpStatus, Logger } from "@nestjs/common";
import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Pick<Logger, "error"> = new Logger(
      ApiExceptionFilter.name,
    ),
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const response = http.getResponse<{
      status(code: number): { json(body: unknown): void };
      setHeader(name: string, value: string): void;
    }>();
    const request = http.getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const suppliedRequestId = request.headers["x-request-id"];
    const requestId =
      typeof suppliedRequestId === "string" &&
      /^[A-Za-z0-9._-]{1,128}$/.test(suppliedRequestId)
        ? suppliedRequestId
        : randomUUID();

    response.setHeader("X-Request-Id", requestId);

    if (status >= 500) {
      const exceptionType =
        exception instanceof HttpException
          ? "HttpException"
          : exception instanceof Error
            ? "Error"
            : "Unknown";
      this.logger.error(
        JSON.stringify({
          event: "api.internal_error",
          requestId,
          statusCode: status,
          exceptionType,
        }),
      );
    }

    const message =
      status >= 500
        ? "Internal server error"
        : exception instanceof HttpException
          ? exception.message
          : "Internal server error";

    response.status(status).json({ statusCode: status, message });
  }
}

export async function createApiApp() {
  const app = await NestFactory.create(AppModule, { logger: ["error"] });
  app.getHttpAdapter().getInstance().disable("x-powered-by");
  app.enableShutdownHooks();
  app.useGlobalFilters(new ApiExceptionFilter());
  return app;
}

export function parseApiPort(value: string | undefined): number {
  const portValue = value ?? "3001";
  if (!/^\d+$/.test(portValue)) {
    throw new Error(
      "API_PORT must contain only digits and be between 1 and 65535",
    );
  }

  const port = Number(portValue);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      "API_PORT must contain only digits and be between 1 and 65535",
    );
  }

  return port;
}

async function bootstrap(): Promise<void> {
  const port = parseApiPort(process.env.API_PORT);
  const host = process.env.API_HOST ?? "127.0.0.1";

  const app = await createApiApp();

  await app.listen(port, host);
  console.info(`HMS API listening on http://${host}:${port}`);
}

if (require.main === module) {
  void bootstrap().catch((error: unknown) => {
    console.error("HMS API failed to start", error);
    process.exitCode = 1;
  });
}
