import assert from "node:assert/strict";
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { test } from "node:test";
import { DatabaseModule } from "./database.module";
import { DatabaseService } from "./database.service";

@Module({ imports: [DatabaseModule] })
class DatabaseTestModule {}

test("Prisma provider connects to PostgreSQL and runs SELECT 1", async () => {
  assert.ok(
    process.env.DATABASE_URL,
    "DATABASE_URL must point to the ephemeral PostgreSQL test service",
  );
  const app = await NestFactory.createApplicationContext(DatabaseTestModule, {
    logger: false,
  });

  try {
    const database = app.get(DatabaseService);
    const rows = await database.$queryRaw<
      Array<{ result: number }>
    >`SELECT 1 AS result`;
    assert.deepEqual(rows, [{ result: 1 }]);
  } finally {
    await app.close();
  }
});
