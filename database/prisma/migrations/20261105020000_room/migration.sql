CREATE TABLE "room_types" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "sale_unit_kind" VARCHAR(32) NOT NULL,
    CONSTRAINT "room_types_pkey" PRIMARY KEY ("id", "property_id"),
    CONSTRAINT "room_types_property_code_key" UNIQUE ("property_id", "code"),
    CONSTRAINT "room_types_sale_unit_kind_check" CHECK ("sale_unit_kind" IN ('room', 'whole_unit')),
    CONSTRAINT "room_types_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "rooms" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "room_type_id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id", "property_id"),
    CONSTRAINT "rooms_property_code_key" UNIQUE ("property_id", "code"),
    CONSTRAINT "rooms_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "rooms_room_type_property_fkey" FOREIGN KEY ("room_type_id", "property_id") REFERENCES "room_types"("id", "property_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "room_type_capacities" (
    "property_id" UUID NOT NULL,
    "room_type_id" UUID NOT NULL,
    "stay_date" DATE NOT NULL,
    "capacity" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "room_type_capacities_pkey" PRIMARY KEY ("room_type_id", "stay_date"),
    CONSTRAINT "room_type_capacities_capacity_nonnegative_check" CHECK ("capacity" >= 0),
    CONSTRAINT "room_type_capacities_sold_nonnegative_check" CHECK ("sold" >= 0),
    CONSTRAINT "room_type_capacities_sold_within_capacity_check" CHECK ("sold" <= "capacity"),
    CONSTRAINT "room_type_capacities_room_type_property_fkey" FOREIGN KEY ("room_type_id", "property_id") REFERENCES "room_types"("id", "property_id") ON DELETE CASCADE ON UPDATE CASCADE
);
