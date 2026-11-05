import "reflect-metadata";
import { Catch, HttpException, HttpStatus } from "@nestjs/common";
import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const response = http.getResponse<{
      status(code: number): { json(body: unknown): void };
    }>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
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
  const app = await NestFactory.create(AppModule, { logger: false });
  app.enableShutdownHooks();
  app.useGlobalFilters(new ApiExceptionFilter());
  return app;
}

async function bootstrap(): Promise<void> {
  const port = Number.parseInt(process.env.API_PORT ?? "3001", 10);
  const host = process.env.API_HOST ?? "127.0.0.1";

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("API_PORT must be an integer between 1 and 65535");
  }

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
