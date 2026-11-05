# HMS terminology

Use these terms consistently; values tied to `[A]`/`[Q]` remain unapproved.

| Term | Meaning in HMS | Source |
|---|---|---|
| Business date | Property accounting/operating date; advances only through Night Audit, not automatically at midnight. | BR-004/BR-008; BA Part 1, §7.1, pp.15–16 |
| RoomNight | One active claim on a physical room and stay date, held by assigned booking, OOO block or day-use. | BR-010; BA Part 1, §7.1, p.16 |
| RoomTypeInventory | Per room-type/date capacity counter for assigned and unassigned inventory; `sold <= capacity`. | BR-013; BA Part 1, §7.1, p.17 |
| BookingRoom | Per-room portion of a booking; lifecycle and physical assignment are managed at this level. | BA Part 1, §7.3, pp.12–14; Part 3, §2, p.8 |
| Tentative | BookingRoom holds inventory while its hold is unexpired and awaits guarantee/deposit. | BR-012/BR-030; BA Part 1, pp.16, 19 |
| Confirmed | BookingRoom confirmed under its guarantee/deposit rule; price and policy are snapshotted. | BR-021/BR-030; BA Part 1, pp.18–19 |
| Conflict | Override/OTA overflow booking that does not hold RoomNight or exceed the inventory counter; requires resolution. `[Q]` OQ-005. | BR-014; BA Part 1, p.17 |
| OOO / OOS | Out of Order creates inventory-blocking RoomNight; Out of Service only warns in the current assumption. | BR-015; BA Part 1, p.17 |
| Folio | Immutable financial ledger for a booking/guest; a group may also have a master folio with charge routing. | BR-040–BR-042; BA Part 1, p.20 |
| Master folio | Group-level folio that receives configured charge types; individual folios hold guest-specific charges. `[A]` OQ-003. | BR-042; BA Part 1, pp.20, 33 |
| Pending / Matched payment | Noncash payment is Pending until verified against bank evidence; only Matched/reconciled money counts toward deposit or settlement. | BR-038; BA Part 1, p.20 |
| UnallocatedReceipt / Chờ phân bổ | Verified money that cannot safely be allocated, including receipt for Expired/Cancelled booking. | BR-037/BR-131; BA Part 1, p.20; Part 3, p.40 |
| GuestCredit | Guest credit balance usable for a later booking or refund; expiry remains OQ-053. | FR-INV-112; BA Part 4, §§6.2, 11.3, pp.26, 37 |
| AR | Accounts receivable for company or OTA; controlled by account, credit limit and allocation. | BR-047; BA Part 1, p.21; Part 4, §6, pp.25–29 |
| Maker–checker | Requester and approver are different, except a configured Owner exception with reason and exception reporting. | BR-064; BA Part 1, p.23 |
| Blind count | Cashier enters physical cash without first seeing expected system cash; variance is reviewed afterward. | FR-PAY-110; BA Part 4, §5.2, p.22 |
| PendingCharge | HK/MNT-proposed charge that FO/Manager must post or dismiss; unresolved items block checkout. | BR-057; BA Part 4, §§3, 11.2, pp.15–16, 36 |
| Night Audit | Sequential close of one business date, with room-charge posting, no-show handling, task/report generation and date advance. | FR-NA-001–011; BA Part 4, §2, pp.10–13 |
| ADR / RevPAR | Average Daily Rate / Revenue per Available Room, used with Occupancy in reporting goals. | BG-05; BA Part 1, §2.2, p.6 |

