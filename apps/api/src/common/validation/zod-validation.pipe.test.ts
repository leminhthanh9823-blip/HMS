import assert from "node:assert/strict";
import { Controller, Post, Body, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { test } from "node:test";
import { z } from "zod";
import { ApiExceptionFilter } from "../../main";
import { ZodValidationPipe } from "./zod-validation.pipe";

const requestSchema = z.object({ label: z.string().min(1) }).strict();

@Controller("validation-probe")
class ValidationProbeController {
  @Post()
  validate(
    @Body(new ZodValidationPipe(requestSchema))
    body: z.infer<typeof requestSchema>,
  ) {
    return body;
  }
}

@Module({ controllers: [ValidationProbeController] })
class ValidationProbeModule {}

test("explicit Zod pipe returns a safe 400 without exposing rejected input or issues", async () => {
  const app = await NestFactory.create(ValidationProbeModule, {
    logger: false,
  });
  app.useGlobalFilters(new ApiExceptionFilter());
  await app.listen(0, "127.0.0.1");

  try {
    const address = app.getHttpServer().address() as { port: number };
    const response = await fetch(
      `http://127.0.0.1:${address.port}/validation-probe`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          label: "synthetic-secret-marker",
          extra: "must-not-leak",
        }),
      },
    );
    const responseText = await response.text();

    assert.equal(response.status, 400);
    assert.deepEqual(JSON.parse(responseText), {
      statusCode: 400,
      message: "Invalid request",
    });
    assert.equal(responseText.includes("synthetic-secret-marker"), false);
    assert.equal(responseText.includes("must-not-leak"), false);
  } finally {
    await app.close();
  }
});
