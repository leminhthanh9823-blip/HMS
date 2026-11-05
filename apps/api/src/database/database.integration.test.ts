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

test("ROOM scopes types and rooms to a property and enforces same-property FK and daily capacity CHECK", async () => {
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
  const propertyIds: string[] = [];
  const address = app.getHttpServer().address() as { port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    for (const code of [
      `ROOM-A-${randomUUID().slice(0, 6)}`,
      `ROOM-B-${randomUUID().slice(0, 6)}`,
    ]) {
      const response = await fetch(`${baseUrl}/properties`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code,
          name: "Synthetic Room Test Property",
          timezone: "Asia/Ho_Chi_Minh",
          businessDate: "2026-11-05",
        }),
      });
      assert.equal(response.status, 201);
      propertyIds.push(((await response.json()) as { id: string }).id);
    }
    const [propertyA, propertyB] = propertyIds as [string, string];

    const typeResponse = await fetch(
      `${baseUrl}/properties/${propertyA}/room-types`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: "SYN-ROOM",
          name: "Synthetic Room Type",
          saleUnitKind: "room",
        }),
      },
    );
    assert.equal(typeResponse.status, 201);
    const roomType = (await typeResponse.json()) as {
      id: string;
      propertyId: string;
    };
    assert.equal(roomType.propertyId, propertyA);

    const roomResponse = await fetch(
      `${baseUrl}/properties/${propertyA}/rooms`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          roomTypeId: roomType.id,
          code: "SYN-101",
          name: "Synthetic Room 101",
        }),
      },
    );
    assert.equal(roomResponse.status, 201);

    const crossProperty = await fetch(
      `${baseUrl}/properties/${propertyB}/rooms`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          roomTypeId: roomType.id,
          code: "SYN-201",
          name: "Synthetic Cross Property",
        }),
      },
    );
    assert.equal(crossProperty.status, 404);

    const capacityResponse = await fetch(
      `${baseUrl}/properties/${propertyA}/room-types/${roomType.id}/capacity`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ stayDate: "2026-11-06", capacity: 1 }),
      },
    );
    assert.equal(capacityResponse.status, 200);
    assert.equal(
      ((await capacityResponse.json()) as { capacity: number; sold: number })
        .sold,
      0,
    );

    await assert.rejects(database.$executeRaw`
      INSERT INTO rooms (id, property_id, room_type_id, code, name)
      VALUES (${randomUUID()}::uuid, ${propertyB}::uuid, ${roomType.id}::uuid, 'DB-CROSS', 'Synthetic DB Cross Property')
    `);
    await assert.rejects(database.$executeRaw`
      INSERT INTO room_type_capacities (property_id, room_type_id, stay_date, capacity, sold)
      VALUES (${propertyA}::uuid, ${roomType.id}::uuid, '2026-11-07'::date, 1, 2)
    `);
  } finally {
    for (const propertyId of propertyIds) {
      await database.$executeRaw`DELETE FROM properties WHERE id = ${propertyId}::uuid`;
    }
    await app.close();
  }
});
