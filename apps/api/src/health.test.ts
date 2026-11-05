import assert from "node:assert/strict";
import { test } from "node:test";
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Module,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { createApiApp, ApiExceptionFilter } from "./main";

@Controller("test-errors")
class TestErrorsController {
  @Get("internal")
  internal(): never {
    throw new HttpException(
      "SECRET_INTERNAL_INFORMATION",
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get("client")
  client(): never {
    throw new HttpException("Booking is not available", HttpStatus.CONFLICT);
  }
}

@Module({ controllers: [TestErrorsController] })
class TestErrorsModule {}

async function createTestErrorsApp(logEntries: string[]) {
  const app = await NestFactory.create(TestErrorsModule, { logger: ["error"] });
  app.useGlobalFilters(
    new ApiExceptionFilter({
      error: (entry: string) => logEntries.push(entry),
    }),
  );
  return app;
}

test("API serves live and ready health checks over HTTP", async (t) => {
  const app = await createApiApp();
  await app.listen(0, "127.0.0.1");
  t.after(() => app.close());

  const address = app.getHttpServer().address();
  assert.ok(address && typeof address !== "string");
  const baseUrl = `http://127.0.0.1:${address.port}`;

  for (const [path, status] of [
    ["/health/live", "ok"],
    ["/health/ready", "ready"],
  ]) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status });
  }

  const missing = await fetch(`${baseUrl}/missing`);
  assert.equal(missing.status, 404);
  assert.deepEqual(await missing.json(), {
    statusCode: 404,
    message: "Cannot GET /missing",
  });
});

test("unexpected exceptions return a generic response without internal details", () => {
  let result: unknown;
  let statusCode = 0;
  const response = {
    status(code: number) {
      statusCode = code;
      return {
        json(body: unknown) {
          result = body;
        },
      };
    },
    setHeader() {},
  };
  new ApiExceptionFilter().catch(
    new Error("database password and stack trace"),
    {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => ({ headers: {} }),
      }),
    } as never,
  );

  assert.equal(statusCode, 500);
  assert.deepEqual(result, {
    statusCode: 500,
    message: "Internal server error",
  });
});

test("HTTP pipeline hides internal HttpException details for 5xx and preserves 4xx messages", async () => {
  const logEntries: string[] = [];
  const app = await createTestErrorsApp(logEntries);
  try {
    await app.listen(0, "127.0.0.1");
    const address = app.getHttpServer().address();
    assert.ok(address && typeof address !== "string");
    const baseUrl = `http://127.0.0.1:${address.port}`;

    const internal = await fetch(`${baseUrl}/test-errors/internal`, {
      headers: { "x-request-id": "request-123" },
    });
    const internalBody = await internal.json();
    assert.equal(internal.status, 500);
    assert.deepEqual(internalBody, {
      statusCode: 500,
      message: "Internal server error",
    });
    const serializedInternalBody = JSON.stringify(internalBody);
    assert.doesNotMatch(serializedInternalBody, /SECRET_INTERNAL_INFORMATION/);
    assert.doesNotMatch(serializedInternalBody, /stack|at\s+\S+\s*\(/i);
    assert.equal(internal.headers.get("x-request-id"), "request-123");
    assert.equal(logEntries.length, 1);
    assert.match(logEntries[0] ?? "", /request-123/);
    assert.doesNotMatch(
      logEntries[0] ?? "",
      /SECRET_INTERNAL_INFORMATION|stack/i,
    );

    const tooLongRequestId = await fetch(`${baseUrl}/test-errors/internal`, {
      headers: { "x-request-id": "a".repeat(129) },
    });
    assert.equal(tooLongRequestId.status, 500);
    assert.match(
      tooLongRequestId.headers.get("x-request-id") ?? "",
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );

    const invalidCharacterRequestId = await fetch(
      `${baseUrl}/test-errors/internal`,
      { headers: { "x-request-id": "invalid$request-id" } },
    );
    assert.equal(invalidCharacterRequestId.status, 500);
    assert.match(
      invalidCharacterRequestId.headers.get("x-request-id") ?? "",
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );

    const client = await fetch(`${baseUrl}/test-errors/client`);
    assert.equal(client.status, 409);
    assert.deepEqual(await client.json(), {
      statusCode: 409,
      message: "Booking is not available",
    });
  } finally {
    await app.close();
  }
});
