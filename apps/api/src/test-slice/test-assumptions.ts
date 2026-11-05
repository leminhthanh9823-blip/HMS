function positiveInteger(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error("Test assumption configuration must be a positive integer");
  }
  return parsed;
}

function booleanValue(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error("Test assumption configuration must be true or false");
}

// TEST ASSUMPTION ASM-001, OQ-001 còn mở
// Configurable for the test slice; no parent/child inventory is implemented.
const saleUnits = (process.env.HMS_TEST_SALE_UNITS ?? "room,whole_unit")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
if (
  saleUnits.length === 0 ||
  saleUnits.some((value) => !["room", "whole_unit"].includes(value))
) {
  throw new Error("HMS_TEST_SALE_UNITS must contain room and/or whole_unit");
}

// TEST ASSUMPTION ASM-002, OQ-002 còn mở
// Other stay modes are unsupported by this test slice and can be selected only after implementation.
const stayMode = process.env.HMS_TEST_STAY_MODE ?? "nightly";
if (stayMode !== "nightly") {
  throw new Error(
    "Only the configurable nightly test assumption is currently implemented",
  );
}

// TEST ASSUMPTION ASM-004, OQ-004 còn mở
// This duration is configurable and is not a deposit/hold policy decision.
const holdTtlSeconds = positiveInteger(
  process.env.HMS_TEST_HOLD_TTL_SECONDS,
  900,
);

// TEST ASSUMPTION ASM-005, OQ-005 còn mở
// Keep false for the test slice; no overbooking override behavior is implemented.
const overbookingAllowed = booleanValue(
  process.env.HMS_TEST_OVERBOOKING_ALLOWED,
  false,
);

export const testAssumptions = Object.freeze({
  saleUnits: Object.freeze(saleUnits),
  stayMode,
  holdTtlSeconds,
  overbookingAllowed,
});
