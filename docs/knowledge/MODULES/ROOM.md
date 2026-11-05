# ROOM — Room Type, Physical Room and Parent/Child Units

Purpose: define sale units and physical capacity. A room has kind room/unit/bed; room-type capacity changes by date and must never fall below sold inventory. (BA Part 2, pp.11–15.)

FR-ROOM-001–009 cover room types/capacity/amenities, parent-child structure, dated sale start/stop, bulk import and capacity validation. (BA Part 2, p.12.)

Key rules: BR-013, BR-016–019. Parent/child semantics and whether whole-unit/dorm inventory is sold remain `[Q]` under OQ-001. BR-019 requires immediate assignment and multi-counter updates for parent/child holds, but it is only a proposed later addition. (BA Part 2, pp.13, 15, 41.)

## Test slice implementation (not baseline)

The D8 synthetic test slice adds property-scoped room types, physical rooms and per-room-type/per-night capacity rows. Composite foreign keys prevent a room or capacity row from referencing a room type owned by a different property. PostgreSQL checks `sold <= capacity`; integration tests prove both constraints reject invalid rows at the database layer. No parent/child relationship is implemented.

ASM-001 (`room` and `whole_unit`, configurable through `HMS_TEST_SALE_UNITS`) and ASM-002 (nightly stay mode, configurable through `HMS_TEST_STAY_MODE`) are test assumptions only. OQ-001 and OQ-002 remain open; these values are not product baseline decisions. The slice has no authentication/RBAC, guest data, pricing, payment/folio behavior, or production policy.

