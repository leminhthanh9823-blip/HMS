import assert from "node:assert/strict";
import { test } from "node:test";
import { Controller, Get, Inject, Injectable, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

@Injectable()
class DiTestService {
  message(): string {
    return "constructor injection works";
  }
}

@Controller("di-test")
class DiTestController {
  constructor(@Inject(DiTestService) private readonly service: DiTestService) {}

  @Get()
  read(): { message: string } {
    return { message: this.service.message() };
  }
}

@Module({ controllers: [DiTestController], providers: [DiTestService] })
class DiTestModule {}

test("tsx runtime injects constructor service into controller", async () => {
  const app = await NestFactory.create(DiTestModule, { logger: false });
  try {
    await app.listen(0, "127.0.0.1");
    const address = app.getHttpServer().address();
    assert.ok(address && typeof address !== "string");

    const response = await fetch(`http://127.0.0.1:${address.port}/di-test`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      message: "constructor injection works",
    });
  } finally {
    await app.close();
  }
});
