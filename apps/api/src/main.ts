import "reflect-metadata";
import { randomUUID } from "node:crypto";
import { Catch, HttpException, HttpStatus, Logger } from "@nestjs/common";
import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";

export type ApiSecurityOptions = {
  corsOrigins?: string[];
  rateLimit?: { limit: number; ttl: number };
  databaseUrl?: string | null;
};

const DEFAULT_RATE_LIMIT = { limit: 60, ttl: 60_000 };

export function parseCorsOrigins(value: string | undefined): string[] {
  if (!value?.trim()) return [];

  const origins = value.split(",").map((origin) => origin.trim());
  if (origins.some((origin) => !origin || origin === "*")) {
    throw new Error("API_CORS_ORIGINS must contain explicit origins only");
  }

  for (const origin of origins) {
    let parsed: URL;
    try {
      parsed = new URL(origin);
    } catch {
      throw new Error("API_CORS_ORIGINS must contain valid origins only");
    }
    if (
      !["http:", "https:"].includes(parsed.protocol) ||
      parsed.origin !== origin
    ) {
      throw new Error("API_CORS_ORIGINS must contain valid origins only");
    }
  }
  return [...new Set(origins)];
}

function positiveInteger(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(value))
    throw new Error("Rate-limit settings must be positive integers");
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error("Rate-limit settings must be positive integers");
  }
  return parsed;
}

export function securityOptionsFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): ApiSecurityOptions {
  return {
    corsOrigins: parseCorsOrigins(env.API_CORS_ORIGINS),
    rateLimit: {
      limit: positiveInteger(env.API_RATE_LIMIT_MAX, DEFAULT_RATE_LIMIT.limit),
      ttl: positiveInteger(env.API_RATE_LIMIT_TTL_MS, DEFAULT_RATE_LIMIT.ttl),
    },
  };
}

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

export async function createApiApp(
  options: ApiSecurityOptions = securityOptionsFromEnv(),
) {
  const databaseEnabled =
    options.databaseUrl === undefined
      ? Boolean(process.env.DATABASE_URL)
      : options.databaseUrl !== null;
  const app = await NestFactory.create(
    AppModule.register(
      options.rateLimit ?? DEFAULT_RATE_LIMIT,
      databaseEnabled,
    ),
    { logger: ["error"] },
  );
  app.getHttpAdapter().getInstance().disable("x-powered-by");
  app.use(helmet());
  app.enableCors({ origin: options.corsOrigins ?? [], credentials: false });
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

  const app = await createApiApp(securityOptionsFromEnv());

  await app.listen(port, host);
  console.info(`HMS API listening on http://${host}:${port}`);
}

if (require.main === module) {
  void bootstrap().catch((error: unknown) => {
    console.error("HMS API failed to start", error);
    process.exitCode = 1;
  });
}
