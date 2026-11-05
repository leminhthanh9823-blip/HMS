import assert from "node:assert/strict";
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { createApiApp } from "../main";
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

test("PROP creates, reads and changes a synthetic property without deriving business_date from UTC", async () => {
  assert.ok(
    process.env.DATABASE_URL,
    "DATABASE_URL must point to the ephemeral PostgreSQL test service",
  );
  const app = await createApiApp({
    databaseUrl: process.env.DATABASE_URL,
    corsOrigins: [],
  });
  await app.listen(0, "127.0.0.1");
  const database = app.get(DatabaseService);
  const code = `TEST-${randomUUID().slice(0, 8)}`;
  const address = app.getHttpServer().address() as { port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const create = await fetch(`${baseUrl}/properties`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        code,
        name: "Synthetic Test Property",
        timezone: "Asia/Ho_Chi_Minh",
        businessDate: "2026-11-05",
      }),
    });
    assert.equal(create.status, 201);
    const property = (await create.json()) as {
      id: string;
      status: string;
      businessDate: string;
    };
    assert.equal(property.status, "Draft");
    assert.equal(property.businessDate, "2026-11-05");

    const read = await fetch(`${baseUrl}/properties/${property.id}`);
    assert.equal(read.status, 200);
    assert.equal(((await read.json()) as { id: string }).id, property.id);

    const activate = await fetch(
      `${baseUrl}/properties/${property.id}/status`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "Active" }),
      },
    );
    assert.equal(activate.status, 200);
    assert.equal(
      ((await activate.json()) as { status: string }).status,
      "Active",
    );

    const invalidTimezone = await fetch(`${baseUrl}/properties`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        code: "SYNTHETIC-INVALID",
        name: "Synthetic Invalid Property",
        timezone: "Not/A_Timezone",
        businessDate: "2026-11-05",
      }),
    });
    assert.equal(invalidTimezone.status, 400);
    assert.deepEqual(await invalidTimezone.json(), {
      statusCode: 400,
      message: "Invalid request",
    });
  } finally {
    await database.$executeRaw`DELETE FROM properties WHERE code = ${code}`;
    await app.close();
  }
});
