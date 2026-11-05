# BOOK — Booking

Purpose: atomically hold inventory for direct, walk-in, group and manual OTA bookings; multi-room hold is all-or-nothing. State is tracked per `BookingRoom`. (BA Part 3, pp.8–15.)

FR-BOOK-001–018 cover availability/creation, guest and rate selection, atomic multi-room holds, totals/deposit, modification/history, cancellation, expiry, walk-in/manual OTA, external code/messages and property scoping. (BA Part 3, pp.8–10.)

Inventory-holding states are Tentative (unexpired), Confirmed and In-house. Conflict does not hold inventory. Snapshot pricing/policy occurs at Confirmed. (BA Part 1, pp.12–14; Part 3, pp.10–12.)

Key rules: BR-010–014, BR-017–019, BR-021, BR-030–038, BR-046, BR-056, BR-071, BR-074, BR-110, BR-130. Key open items: OQ-001, OQ-004–005, OQ-008–009, OQ-047. (BA Part 3, pp.10–15, 39–40.)

