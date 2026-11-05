import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import { Prisma } from "../generated/prisma/client";
import { DatabaseService } from "../database/database.service";
import { stayNights } from "../test-slice/calendar-date";
import { testAssumptions } from "../test-slice/test-assumptions";
import type { AvailabilityQuery, CreateHoldInput } from "./booking.schemas";

type BookingRow = {
  id: string;
  code: string;
  propertyId: string;
  roomIds: string[];
  arrival: string;
  departure: string;
  status: string;
  holdExpiresAt: Date;
};

type RoomRow = { id: string; roomTypeId: string };
type CapacityRow = {
  roomTypeId: string;
  stayDate: string;
  capacity: number;
  sold: number;
};

export type BookingResponse = Omit<BookingRow, "holdExpiresAt"> & {
  holdExpiresAt: string;
};

@Injectable()
export class BookingService {
  constructor(
    @Inject(DatabaseService) private readonly database: DatabaseService,
  ) {}

  async availability(propertyId: string, query: AvailabilityQuery) {
    const dates = stayNights(query.arrival, query.departure);
    const [property] = await this.database.$queryRaw<
      Array<{ timezone: string }>
    >`
      SELECT timezone FROM properties WHERE id = ${propertyId}::uuid
    `;
    if (!property) throw new NotFoundException("Property not found");

    const dateValues = Prisma.join(
      dates.map((date) => Prisma.sql`(${date}::date)`),
    );
    const roomIds = await this.database.$queryRaw<
      Array<{ id: string }>
    >(Prisma.sql`
      SELECT r.id::text AS id
      FROM rooms r
      WHERE r.property_id = ${propertyId}::uuid
        AND NOT EXISTS (
          SELECT 1
          FROM (VALUES ${dateValues}) AS requested(stay_date)
          LEFT JOIN room_type_capacities cap
            ON cap.property_id = r.property_id
           AND cap.room_type_id = r.room_type_id
           AND cap.stay_date = requested.stay_date
          WHERE cap.capacity IS NULL
             OR cap.capacity <= (
               SELECT COUNT(*)
               FROM room_nights rn
               WHERE rn.property_id = r.property_id
                 AND rn.room_type_id = r.room_type_id
                 AND rn.stay_date = requested.stay_date
                 AND rn.status = 'Active'
                 AND rn.hold_expires_at > CURRENT_TIMESTAMP
             )
        )
        AND NOT EXISTS (
          SELECT 1
          FROM room_nights rn
          JOIN (VALUES ${dateValues}) AS requested(stay_date)
            ON requested.stay_date = rn.stay_date
          WHERE rn.property_id = r.property_id
            AND rn.room_id = r.id
            AND rn.status = 'Active'
            AND rn.hold_expires_at > CURRENT_TIMESTAMP
        )
      ORDER BY r.id
    `);

    return {
      propertyId,
      timezone: property.timezone,
      arrival: query.arrival,
      departure: query.departure,
      availableRoomIds: roomIds.map((room) => room.id),
    };
  }

  async createHold(
    propertyId: string,
    idempotencyKey: string,
    input: CreateHoldInput,
  ): Promise<BookingResponse> {
    if (testAssumptions.stayMode !== "nightly") {
      throw new ConflictException("Unsupported test-slice stay mode");
    }
    if (testAssumptions.overbookingAllowed) {
      throw new ConflictException(
        "Overbooking override is not implemented in this test slice",
      );
    }

    const roomIds = [...input.roomIds].sort();
    const dates = stayNights(input.arrival, input.departure);
    const requestHash = createHash("sha256")
      .update(
        JSON.stringify({
          roomIds,
          arrival: input.arrival,
          departure: input.departure,
        }),
      )
      .digest("hex");

    try {
      return await this.database.$transaction(async (transaction) => {
        const existing = await this.findByIdempotencyKey(
          transaction,
          propertyId,
          idempotencyKey,
        );
        if (existing) {
          if (existing.requestHash !== requestHash) {
            throw new ConflictException(
              "Idempotency-Key was already used for a different request",
            );
          }
          return this.toResponse(existing.booking);
        }

        const [property] = await transaction.$queryRaw<
          Array<{ status: string; timezone: string }>
        >`
          SELECT status::text, timezone FROM properties WHERE id = ${propertyId}::uuid FOR SHARE
        `;
        if (!property) throw new NotFoundException("Property not found");
        if (property.status !== "Active")
          throw new ConflictException("Property is not active");

        const roomIdList = Prisma.join(
          roomIds.map((id) => Prisma.sql`${id}::uuid`),
        );
        const rooms = await transaction.$queryRaw<RoomRow[]>(Prisma.sql`
          SELECT id::text AS id, room_type_id::text AS "roomTypeId"
          FROM rooms
          WHERE property_id = ${propertyId}::uuid AND id IN (${roomIdList})
          ORDER BY id
          FOR UPDATE
        `);
        if (rooms.length !== roomIds.length)
          throw new NotFoundException("Room not found");

        const capacityKeys = new Map<
          string,
          { roomTypeId: string; stayDate: string; requested: number }
        >();
        for (const room of rooms) {
          for (const stayDate of dates) {
            const key = `${room.roomTypeId}:${stayDate}`;
            const current = capacityKeys.get(key);
            capacityKeys.set(key, {
              roomTypeId: room.roomTypeId,
              stayDate,
              requested: (current?.requested ?? 0) + 1,
            });
          }
        }
        const sortedCapacityKeys = [...capacityKeys.values()].sort(
          (left, right) =>
            left.roomTypeId.localeCompare(right.roomTypeId) ||
            left.stayDate.localeCompare(right.stayDate),
        );
        const capacityPredicates = Prisma.join(
          sortedCapacityKeys.map(
            (key) =>
              Prisma.sql`(room_type_id = ${key.roomTypeId}::uuid AND stay_date = ${key.stayDate}::date)`,
          ),
          " OR ",
        );
        const capacities = await transaction.$queryRaw<
          CapacityRow[]
        >(Prisma.sql`
          SELECT room_type_id::text AS "roomTypeId", to_char(stay_date, 'YYYY-MM-DD') AS "stayDate", capacity, sold
          FROM room_type_capacities
          WHERE property_id = ${propertyId}::uuid AND (${capacityPredicates})
          ORDER BY room_type_id, stay_date
          FOR UPDATE
        `);
        if (capacities.length !== sortedCapacityKeys.length) {
          throw new ConflictException(
            "Room type capacity is not configured for every stay night",
          );
        }

        const roomNightPredicates = Prisma.join(
          rooms.flatMap((room) =>
            dates.map(
              (stayDate) =>
                Prisma.sql`(room_id = ${room.id}::uuid AND stay_date = ${stayDate}::date)`,
            ),
          ),
          " OR ",
        );
        const expired = await transaction.$queryRaw<
          Array<{ bookingId: string; roomTypeId: string; stayDate: string }>
        >(Prisma.sql`
          UPDATE room_nights
          SET status = 'Released'
          WHERE property_id = ${propertyId}::uuid
            AND status = 'Active'
            AND hold_expires_at <= CURRENT_TIMESTAMP
            AND (${roomNightPredicates})
          RETURNING booking_id::text AS "bookingId", room_type_id::text AS "roomTypeId", to_char(stay_date, 'YYYY-MM-DD') AS "stayDate"
        `);
        const expiredCounts = new Map<
          string,
          { roomTypeId: string; stayDate: string; count: number }
        >();
        for (const row of expired) {
          const key = `${row.roomTypeId}:${row.stayDate}`;
          const current = expiredCounts.get(key);
          expiredCounts.set(key, {
            roomTypeId: row.roomTypeId,
            stayDate: row.stayDate,
            count: (current?.count ?? 0) + 1,
          });
        }
        for (const value of expiredCounts.values()) {
          await transaction.$executeRaw`
            UPDATE room_type_capacities SET sold = GREATEST(sold - ${value.count}, 0)
            WHERE property_id = ${propertyId}::uuid AND room_type_id = ${value.roomTypeId}::uuid AND stay_date = ${value.stayDate}::date
          `;
        }
        const expiredBookingIds = [
          ...new Set(expired.map((row) => row.bookingId)),
        ];
        if (expiredBookingIds.length > 0) {
          const bookingIdList = Prisma.join(
            expiredBookingIds.map((id) => Prisma.sql`${id}::uuid`),
          );
          await transaction.$executeRaw(Prisma.sql`
            UPDATE bookings SET status = 'Expired'
            WHERE property_id = ${propertyId}::uuid AND id IN (${bookingIdList}) AND status = 'Tentative'
          `);
        }

        const [activeConflict] = await transaction.$queryRaw<
          Array<{ roomId: string }>
        >(Prisma.sql`
          SELECT room_id::text AS "roomId" FROM room_nights
          WHERE property_id = ${propertyId}::uuid AND status = 'Active'
            AND hold_expires_at > CURRENT_TIMESTAMP AND (${roomNightPredicates})
          LIMIT 1
        `);
        if (activeConflict)
          throw new ConflictException("Room is no longer available");

        const capacitiesAfterExpiry = await transaction.$queryRaw<
          CapacityRow[]
        >(Prisma.sql`
          SELECT room_type_id::text AS "roomTypeId", to_char(stay_date, 'YYYY-MM-DD') AS "stayDate", capacity, sold
          FROM room_type_capacities
          WHERE property_id = ${propertyId}::uuid AND (${capacityPredicates})
          ORDER BY room_type_id, stay_date
        `);
        for (const capacity of capacitiesAfterExpiry) {
          const requested = capacityKeys.get(
            `${capacity.roomTypeId}:${capacity.stayDate}`,
          )!.requested;
          if (capacity.sold + requested > capacity.capacity) {
            throw new ConflictException(
              "Room type capacity is no longer available",
            );
          }
        }

        const bookingId = randomUUID();
        const code = `H-${bookingId.slice(0, 12).toUpperCase()}`;
        const expiresAt = new Date(
          Date.now() + testAssumptions.holdTtlSeconds * 1000,
        );
        await transaction.$executeRaw`
          INSERT INTO bookings (id, property_id, code, idempotency_key, request_hash, arrival, departure, status, hold_expires_at)
          VALUES (${bookingId}::uuid, ${propertyId}::uuid, ${code}, ${idempotencyKey}, ${requestHash}, ${input.arrival}::date, ${input.departure}::date, 'Tentative', ${expiresAt}::timestamptz)
        `;

        const nightRows = rooms.flatMap((room) =>
          dates.map(
            (stayDate) => Prisma.sql`
          (${randomUUID()}::uuid, ${propertyId}::uuid, ${bookingId}::uuid, ${room.id}::uuid, ${room.roomTypeId}::uuid, ${stayDate}::date, 'Active'::"RoomNightStatus", ${expiresAt}::timestamptz)
        `,
          ),
        );
        await transaction.$executeRaw(Prisma.sql`
          INSERT INTO room_nights (id, property_id, booking_id, room_id, room_type_id, stay_date, status, hold_expires_at)
          VALUES ${Prisma.join(nightRows)}
        `);

        for (const key of sortedCapacityKeys) {
          await transaction.$executeRaw`
            UPDATE room_type_capacities SET sold = sold + ${key.requested}
            WHERE property_id = ${propertyId}::uuid AND room_type_id = ${key.roomTypeId}::uuid AND stay_date = ${key.stayDate}::date
          `;
        }

        const created = await this.findByIdempotencyKey(
          transaction,
          propertyId,
          idempotencyKey,
        );
        if (!created)
          throw new Error(
            "Created booking could not be read in its transaction",
          );
        return this.toResponse(created.booking);
      });
    } catch (error) {
      if (this.isPgError(error, "23505")) {
        const existing = await this.findByIdempotencyKey(
          this.database,
          propertyId,
          idempotencyKey,
        );
        if (existing?.requestHash === requestHash)
          return this.toResponse(existing.booking);
        throw new ConflictException("Room is no longer available");
      }
      if (this.isPgError(error, "23514")) {
        throw new ConflictException(
          "Room type capacity is no longer available",
        );
      }
      throw error;
    }
  }

  private async findByIdempotencyKey(
    queryable: Pick<DatabaseService, "$queryRaw"> | Prisma.TransactionClient,
    propertyId: string,
    idempotencyKey: string,
  ): Promise<{ requestHash: string; booking: BookingRow } | undefined> {
    const [row] = await queryable.$queryRaw<
      Array<BookingRow & { requestHash: string }>
    >`
      SELECT b.id::text, b.code, b.property_id::text AS "propertyId",
        COALESCE(array_agg(DISTINCT rn.room_id::text ORDER BY rn.room_id::text) FILTER (WHERE rn.room_id IS NOT NULL), ARRAY[]::text[]) AS "roomIds",
        to_char(b.arrival, 'YYYY-MM-DD') AS arrival,
        to_char(b.departure, 'YYYY-MM-DD') AS departure,
        b.status::text AS status, b.hold_expires_at AS "holdExpiresAt", b.request_hash AS "requestHash"
      FROM bookings b LEFT JOIN room_nights rn ON rn.booking_id = b.id AND rn.property_id = b.property_id
      WHERE b.property_id = ${propertyId}::uuid AND b.idempotency_key = ${idempotencyKey}
      GROUP BY b.id, b.code, b.property_id, b.arrival, b.departure, b.status, b.hold_expires_at, b.request_hash
    `;
    if (!row) return undefined;
    return { requestHash: row.requestHash, booking: row };
  }

  private toResponse(row: BookingRow): BookingResponse {
    return { ...row, holdExpiresAt: new Date(row.holdExpiresAt).toISOString() };
  }

  private isPgError(error: unknown, code: string): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "meta" in error &&
      typeof error.meta === "object" &&
      error.meta !== null &&
      "code" in error.meta &&
      error.meta.code === code
    );
  }
}
