CREATE TYPE "BookingStatus" AS ENUM ('Tentative', 'Expired', 'Cancelled');
CREATE TYPE "RoomNightStatus" AS ENUM ('Active', 'Released');

CREATE TABLE "bookings" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "idempotency_key" VARCHAR(128) NOT NULL,
    "request_hash" CHAR(64) NOT NULL,
    "arrival" DATE NOT NULL,
    "departure" DATE NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'Tentative',
    "hold_expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id", "property_id"),
    CONSTRAINT "bookings_property_code_key" UNIQUE ("property_id", "code"),
    CONSTRAINT "bookings_property_idempotency_key_key" UNIQUE ("property_id", "idempotency_key"),
    CONSTRAINT "bookings_stay_minimum_one_night_check" CHECK ("departure" > "arrival"),
    CONSTRAINT "bookings_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "room_nights" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "room_type_id" UUID NOT NULL,
    "stay_date" DATE NOT NULL,
    "status" "RoomNightStatus" NOT NULL DEFAULT 'Active',
    "hold_expires_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "room_nights_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "room_nights_booking_property_fkey" FOREIGN KEY ("booking_id", "property_id") REFERENCES "bookings"("id", "property_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "room_nights_room_property_fkey" FOREIGN KEY ("room_id", "property_id") REFERENCES "rooms"("id", "property_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "room_nights_room_type_property_fkey" FOREIGN KEY ("room_type_id", "property_id") REFERENCES "room_types"("id", "property_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "room_nights_one_active_room_night_idx"
  ON "room_nights" ("room_id", "stay_date")
  WHERE "status" = 'Active';

CREATE INDEX "room_nights_expiry_lookup_idx"
  ON "room_nights" ("property_id", "hold_expires_at")
  WHERE "status" = 'Active';
