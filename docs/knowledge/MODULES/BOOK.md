# BOOK — Booking

Purpose: atomically hold inventory for direct, walk-in, group and manual OTA bookings; multi-room hold is all-or-nothing. State is tracked per `BookingRoom`. (BA Part 3, pp.8–15.)

FR-BOOK-001–018 cover availability/creation, guest and rate selection, atomic multi-room holds, totals/deposit, modification/history, cancellation, expiry, walk-in/manual OTA, external code/messages and property scoping. (BA Part 3, pp.8–10.)

Inventory-holding states are Tentative (unexpired), Confirmed and In-house. Conflict does not hold inventory. Snapshot pricing/policy occurs at Confirmed. (BA Part 1, pp.12–14; Part 3, pp.10–12.)

Key rules: BR-010–014, BR-017–019, BR-021, BR-030–038, BR-046, BR-056, BR-071, BR-074, BR-110, BR-130. Key open items: OQ-001, OQ-004–005, OQ-008–009, OQ-047. (BA Part 3, pp.10–15, 39–40.)

## Test slice implementation (not baseline)

The D8 synthetic slice creates a Tentative hold for one or more rooms in one transaction. Arrival is inclusive, departure is exclusive, and at least one night is required. It uses a partial unique index on `(room_id, stay_date)` for Active RoomNight rows, property/room/capacity locks in deterministic order, per-date `sold <= capacity`, an idempotency key and a configurable expiry. Expired RoomNights are ignored by availability immediately; a later hold releases the expired rows and updates their booking state. Multi-room requests are all-or-nothing. Competing connections yield one winner and one 409.

ASM-002 (nightly), ASM-004 (synthetic configurable hold TTL), and ASM-005 (no overbooking) are test assumptions only. OQ-002, OQ-004 and OQ-005 remain open; no OQ is closed. The only booking fields here are generated code, property, rooms, stay nights, state and hold expiry. There is no authentication/RBAC, guest, rate engine, payment, folio, Night Audit, CHN or production policy. All fixtures are synthetic and tests/ephemeral DB are cleaned after runs; `pnpm db:reset:dev` clears the local synthetic database volume.

