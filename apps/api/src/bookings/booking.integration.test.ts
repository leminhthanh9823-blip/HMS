import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { createApiApp } from "../main";
import { DatabaseService } from "../database/database.service";
import {
  addCalendarDays,
  propertyLocalDateAt,
} from "../test-slice/calendar-date";

type Fixture = {
  app: Awaited<ReturnType<typeof createApiApp>>;
  database: DatabaseService;
  baseUrl: string;
  propertyId: string;
  roomTypeId: string;
  roomIds: string[];
  timezone: string;
  close: () => Promise<void>;
};

async function createFixture(roomCount = 1): Promise<Fixture> {
  assert.ok(
    process.env.DATABASE_URL,
    "DATABASE_URL must point to the ephemeral PostgreSQL test service",
  );
  const app = await createApiApp({
    databaseUrl: process.env.DATABASE_URL,
    corsOrigins: [],
    rateLimit: { limit: 100, ttl: 60_000 },
  });
  await app.listen(0, "127.0.0.1");
  const address = app.getHttpServer().address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const database = app.get(DatabaseService);
  const timezone = "Asia/Ho_Chi_Minh";
  let propertyId = "";
  try {
    const propertyResponse = await fetch(`${baseUrl}/properties`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        code: `BOOK-${randomUUID().slice(0, 8)}`,
        name: "Synthetic Booking Test Property",
        timezone,
        businessDate: "2026-11-05",
      }),
    });
    assert.equal(propertyResponse.status, 201);
    propertyId = ((await propertyResponse.json()) as { id: string }).id;

    const activate = await fetch(`${baseUrl}/properties/${propertyId}/status`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "Active" }),
    });
    assert.equal(activate.status, 200);

    const roomTypeResponse = await fetch(
      `${baseUrl}/properties/${propertyId}/room-types`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: "BOOK-ROOM",
          name: "Synthetic Booking Room",
          saleUnitKind: "room",
        }),
      },
    );
    assert.equal(roomTypeResponse.status, 201);
    const roomTypeId = ((await roomTypeResponse.json()) as { id: string }).id;
    const roomIds: string[] = [];

    for (let index = 0; index < roomCount; index += 1) {
      const response = await fetch(
        `${baseUrl}/properties/${propertyId}/rooms`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            roomTypeId,
            code: `BOOK-${index + 1}`,
            name: `Synthetic Booking Room ${index + 1}`,
          }),
        },
      );
      assert.equal(response.status, 201);
      roomIds.push(((await response.json()) as { id: string }).id);
    }

    for (let day = 4; day < 16; day += 1) {
      const stayDate = `2026-11-${day.toString().padStart(2, "0")}`;
      const response = await fetch(
        `${baseUrl}/properties/${propertyId}/room-types/${roomTypeId}/capacity`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ stayDate, capacity: 10 }),
        },
      );
      assert.equal(response.status, 200);
    }

    return {
      app,
      database,
      baseUrl,
      propertyId,
      roomTypeId,
      roomIds,
      timezone,
      close: async () => {
        await database.$executeRaw`DELETE FROM properties WHERE id = ${propertyId}::uuid`;
        await app.close();
      },
    };
  } catch (error) {
    if (propertyId)
      await database.$executeRaw`DELETE FROM properties WHERE id = ${propertyId}::uuid`;
    await app.close();
    throw error;
  }
}

async function createHold(
  baseUrl: string,
  propertyId: string,
  roomIds: string[],
  arrival: string,
  departure: string,
  key: string = randomUUID(),
) {
  return fetch(`${baseUrl}/properties/${propertyId}/bookings/holds`, {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": key },
    body: JSON.stringify({ roomIds, arrival, departure }),
  });
}

test("BOOK concurrent holds from separate API connections yield exactly one winner", async () => {
  const fixture = await createFixture(1);
  const secondApp = await createApiApp({
    databaseUrl: process.env.DATABASE_URL,
    corsOrigins: [],
  });
  await secondApp.listen(0, "127.0.0.1");
  const secondAddress = secondApp.getHttpServer().address() as AddressInfo;
  const secondUrl = `http://127.0.0.1:${secondAddress.port}`;
  try {
    const results = await Promise.all([
      createHold(
        fixture.baseUrl,
        fixture.propertyId,
        fixture.roomIds,
        "2026-11-06",
        "2026-11-07",
        "race-a",
      ),
      createHold(
        secondUrl,
        fixture.propertyId,
        fixture.roomIds,
        "2026-11-06",
        "2026-11-07",
        "race-b",
      ),
    ]);
    assert.deepEqual(
      results.map((response) => response.status).sort(),
      [201, 409],
    );

    const indexes = await fixture.database.$queryRaw<
      Array<{ indexdef: string }>
    >`
      SELECT indexdef FROM pg_indexes WHERE indexname = 'room_nights_one_active_room_night_idx'
    `;
    assert.match(
      indexes[0]!.indexdef,
      /UNIQUE INDEX .*\(room_id, stay_date\).*WHERE \(status = 'Active'(::"RoomNightStatus")?\)/i,
    );
  } finally {
    await secondApp.close();
    await fixture.close();
  }
});

test("BOOK multi-room hold rolls back all nights when one requested room is occupied", async () => {
  const fixture = await createFixture(2);
  try {
    const [roomA, roomB] = fixture.roomIds as [string, string];
    assert.equal(
      (
        await createHold(
          fixture.baseUrl,
          fixture.propertyId,
          [roomB],
          "2026-11-06",
          "2026-11-07",
          "reserve-b",
        )
      ).status,
      201,
    );
    const losing = await createHold(
      fixture.baseUrl,
      fixture.propertyId,
      [roomA, roomB],
      "2026-11-06",
      "2026-11-07",
      "all-or-nothing",
    );
    assert.equal(losing.status, 409);

    const rows = await fixture.database.$queryRaw<
      Array<{ nights: number; sold: number; bookings: number }>
    >`
      SELECT
        (SELECT COUNT(*)::int FROM room_nights WHERE room_id = ${roomA}::uuid AND stay_date = '2026-11-06'::date) AS nights,
        (SELECT sold FROM room_type_capacities WHERE room_type_id = ${fixture.roomTypeId}::uuid AND stay_date = '2026-11-06'::date) AS sold,
        (SELECT COUNT(*)::int FROM bookings WHERE idempotency_key = 'all-or-nothing') AS bookings
    `;
    assert.deepEqual(rows[0], { nights: 0, sold: 1, bookings: 0 });
  } finally {
    await fixture.close();
  }
});

test("BOOK creates a multi-room multi-night hold and increments each daily capacity counter", async () => {
  const fixture = await createFixture(2);
  try {
    const response = await createHold(
      fixture.baseUrl,
      fixture.propertyId,
      fixture.roomIds,
      "2026-11-06",
      "2026-11-08",
      "multi-room-success",
    );
    assert.equal(response.status, 201);
    const booking = (await response.json()) as {
      id: string;
      roomIds: string[];
    };
    assert.deepEqual(booking.roomIds, [...fixture.roomIds].sort());
    const counts = await fixture.database.$queryRaw<
      Array<{ nights: number; firstNightSold: number; secondNightSold: number }>
    >`
      SELECT
        (SELECT COUNT(*)::int FROM room_nights WHERE booking_id = ${booking.id}::uuid) AS nights,
        (SELECT sold FROM room_type_capacities WHERE room_type_id = ${fixture.roomTypeId}::uuid AND stay_date = '2026-11-06'::date) AS "firstNightSold",
        (SELECT sold FROM room_type_capacities WHERE room_type_id = ${fixture.roomTypeId}::uuid AND stay_date = '2026-11-07'::date) AS "secondNightSold"
    `;
    assert.deepEqual(counts[0], {
      nights: 4,
      firstNightSold: 2,
      secondNightSold: 2,
    });
  } finally {
    await fixture.close();
  }
});

test("BOOK expired hold is immediately absent from availability before any expiry job runs", async () => {
  const fixture = await createFixture(1);
  try {
    const roomId = fixture.roomIds[0]!;
    const created = await createHold(
      fixture.baseUrl,
      fixture.propertyId,
      [roomId],
      "2026-11-06",
      "2026-11-07",
      "expiry-test",
    );
    assert.equal(created.status, 201);
    const booking = (await created.json()) as { id: string };
    await fixture.database.$executeRaw`
      UPDATE room_nights SET hold_expires_at = CURRENT_TIMESTAMP - INTERVAL '1 second' WHERE booking_id = ${booking.id}::uuid
    `;
    await fixture.database.$executeRaw`
      UPDATE bookings SET hold_expires_at = CURRENT_TIMESTAMP - INTERVAL '1 second' WHERE id = ${booking.id}::uuid
    `;

    const availability = await fetch(
      `${fixture.baseUrl}/properties/${fixture.propertyId}/availability?arrival=2026-11-06&departure=2026-11-07`,
    );
    assert.equal(availability.status, 200);
    assert.deepEqual(
      ((await availability.json()) as { availableRoomIds: string[] })
        .availableRoomIds,
      [roomId],
    );

    const replacement = await createHold(
      fixture.baseUrl,
      fixture.propertyId,
      [roomId],
      "2026-11-06",
      "2026-11-07",
      "after-expiry",
    );
    assert.equal(replacement.status, 201);
    const state = await fixture.database.$queryRaw<
      Array<{ bookingStatus: string; roomNightStatus: string }>
    >`
      SELECT b.status::text AS "bookingStatus", rn.status::text AS "roomNightStatus"
      FROM bookings b JOIN room_nights rn ON rn.booking_id = b.id
      WHERE b.id = ${booking.id}::uuid LIMIT 1
    `;
    assert.deepEqual(state[0], {
      bookingStatus: "Expired",
      roomNightStatus: "Released",
    });
  } finally {
    await fixture.close();
  }
});

test("BOOK cross-property room access returns 404 with the property ID in the path", async () => {
  const fixture = await createFixture(1);
  try {
    const other = await fetch(`${fixture.baseUrl}/properties`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        code: `OTHER-${randomUUID().slice(0, 8)}`,
        name: "Synthetic Other Property",
        timezone: fixture.timezone,
        businessDate: "2026-11-05",
      }),
    });
    const otherPropertyId = ((await other.json()) as { id: string }).id;
    await fetch(`${fixture.baseUrl}/properties/${otherPropertyId}/status`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "Active" }),
    });
    const response = await createHold(
      fixture.baseUrl,
      otherPropertyId,
      fixture.roomIds,
      "2026-11-06",
      "2026-11-07",
      "cross-property",
    );
    assert.equal(response.status, 404);
    await fixture.database
      .$executeRaw`DELETE FROM properties WHERE id = ${otherPropertyId}::uuid`;
  } finally {
    await fixture.close();
  }
});

test("BOOK rejects a stay shorter than one night and a non-Active property", async () => {
  const fixture = await createFixture(1);
  try {
    const sameDay = await createHold(
      fixture.baseUrl,
      fixture.propertyId,
      fixture.roomIds,
      "2026-11-06",
      "2026-11-06",
      "same-day",
    );
    assert.equal(sameDay.status, 400);

    const suspend = await fetch(
      `${fixture.baseUrl}/properties/${fixture.propertyId}/status`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "Suspended" }),
      },
    );
    assert.equal(suspend.status, 200);
    const denied = await createHold(
      fixture.baseUrl,
      fixture.propertyId,
      fixture.roomIds,
      "2026-11-06",
      "2026-11-07",
      "suspended-property",
    );
    assert.equal(denied.status, 409);
  } finally {
    await fixture.close();
  }
});

test("BOOK idempotency key returns the same hold result", async () => {
  const fixture = await createFixture(1);
  try {
    const first = await createHold(
      fixture.baseUrl,
      fixture.propertyId,
      fixture.roomIds,
      "2026-11-06",
      "2026-11-08",
      "same-key",
    );
    const firstBody = await first.json();
    assert.deepEqual(
      (firstBody as { roomIds: string[] }).roomIds,
      fixture.roomIds,
    );
    const second = await createHold(
      fixture.baseUrl,
      fixture.propertyId,
      fixture.roomIds,
      "2026-11-06",
      "2026-11-08",
      "same-key",
    );
    assert.equal(first.status, 201);
    assert.equal(second.status, 201);
    assert.deepEqual(await second.json(), firstBody);
  } finally {
    await fixture.close();
  }
});

test("BOOK rolls back the booking and earlier room-night inserts after a later insert fails", async () => {
  const fixture = await createFixture(1);
  const key = "forced-late-failure";
  try {
    await fixture.database.$executeRaw`
      CREATE FUNCTION fail_synthetic_room_night() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN
        IF NEW.stay_date = '2026-11-07'::date THEN
          RAISE EXCEPTION 'synthetic late room-night failure';
        END IF;
        RETURN NEW;
      END;
      $$
    `;
    await fixture.database.$executeRaw`
      CREATE TRIGGER fail_synthetic_room_night BEFORE INSERT ON room_nights
      FOR EACH ROW EXECUTE FUNCTION fail_synthetic_room_night()
    `;
    const response = await createHold(
      fixture.baseUrl,
      fixture.propertyId,
      fixture.roomIds,
      "2026-11-06",
      "2026-11-08",
      key,
    );
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), {
      statusCode: 500,
      message: "Internal server error",
    });
    const rows = await fixture.database.$queryRaw<
      Array<{ bookings: number; nights: number; sold: number }>
    >`
      SELECT
        (SELECT COUNT(*)::int FROM bookings WHERE idempotency_key = ${key}) AS bookings,
        (SELECT COUNT(*)::int FROM room_nights WHERE property_id = ${fixture.propertyId}::uuid) AS nights,
        (SELECT SUM(sold)::int FROM room_type_capacities WHERE room_type_id = ${fixture.roomTypeId}::uuid) AS sold
    `;
    assert.deepEqual(rows[0], { bookings: 0, nights: 0, sold: 0 });
  } finally {
    await fixture.database
      .$executeRaw`DROP TRIGGER IF EXISTS fail_synthetic_room_night ON room_nights`;
    await fixture.database
      .$executeRaw`DROP FUNCTION IF EXISTS fail_synthetic_room_night()`;
    await fixture.close();
  }
});

test("BOOK uses property-local midnight and excludes the departure night", async () => {
  const fixture = await createFixture(1);
  try {
    const beforeLocalMidnight = propertyLocalDateAt(
      new Date("2026-11-05T16:59:59.000Z"),
      fixture.timezone,
    );
    const afterLocalMidnight = propertyLocalDateAt(
      new Date("2026-11-05T17:00:00.000Z"),
      fixture.timezone,
    );
    assert.equal(beforeLocalMidnight, "2026-11-05");
    assert.equal(afterLocalMidnight, "2026-11-06");

    const first = await createHold(
      fixture.baseUrl,
      fixture.propertyId,
      fixture.roomIds,
      beforeLocalMidnight,
      afterLocalMidnight,
      "midnight-before",
    );
    assert.equal(first.status, 201);
    const firstBooking = (await first.json()) as { id: string };
    const firstNights = await fixture.database.$queryRaw<
      Array<{ stayDate: string }>
    >`
      SELECT to_char(stay_date, 'YYYY-MM-DD') AS "stayDate" FROM room_nights WHERE booking_id = ${firstBooking.id}::uuid
    `;
    assert.deepEqual(
      firstNights.map((row) => row.stayDate),
      ["2026-11-05"],
    );

    const nextDay = addCalendarDays(afterLocalMidnight, 1);
    const nextNight = await createHold(
      fixture.baseUrl,
      fixture.propertyId,
      fixture.roomIds,
      afterLocalMidnight,
      nextDay,
      "midnight-after",
    );
    assert.equal(nextNight.status, 201);
    const secondBooking = (await nextNight.json()) as { id: string };
    const secondNights = await fixture.database.$queryRaw<
      Array<{ stayDate: string }>
    >`
      SELECT to_char(stay_date, 'YYYY-MM-DD') AS "stayDate" FROM room_nights WHERE booking_id = ${secondBooking.id}::uuid
    `;
    assert.deepEqual(
      secondNights.map((row) => row.stayDate),
      ["2026-11-06"],
    );
  } finally {
    await fixture.close();
  }
});
