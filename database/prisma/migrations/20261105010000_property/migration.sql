CREATE TYPE "PropertyStatus" AS ENUM ('Draft', 'Active', 'Suspended', 'Closed');

CREATE TABLE "properties" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "timezone" VARCHAR(128) NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'Draft',
    "business_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "properties_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "properties_code_key" UNIQUE ("code")
);
