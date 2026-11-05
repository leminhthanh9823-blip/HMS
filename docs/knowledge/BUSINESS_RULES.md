# Business rules catalog

Labels are preserved from the source. `[A]` means assumed, not approved; `[Q]` means blocked by the cited OQ; `[C]` is baselined/confirmed under the BA convention. Later BA parts call their added rules “proposed additions,” even where the rule itself carries `[C]`.

## Time and business date

| ID | Rule (concise) | Status | Source |
|---|---|---|---|
| BR-001 | `created_at` supports lead-time/pace/audit only, not revenue recognition. | `[A]` | BA Part 1, p.15 |
| BR-002 | Stay is `[arrival, departure)`; nights = departure − arrival ≥1; departure date consumes no inventory. | `[Q]` OQ-002 | BA Part 1, p.15 |
| BR-003 | Room revenue posts by stay-night business date; services by posting date; deposits are advances; cancellation/no-show follows BR-036. | `[Q]` OQ-016 | BA Part 1, p.15 |
| BR-004 | Property `business_date` advances only through Night Audit; after-midnight/pre-audit transactions use the old date. | `[A]` | BA Part 1, p.15 |
| BR-005 | Standard arrival/departure times are property-configurable (proposal 14:00/12:00). | `[A]` OQ-006 | BA Part 1, p.15 |
| BR-006 | Early/late is allowed only without inventory collision; tiered surcharge; threshold crossing charges/holds another night. | `[A]` OQ-006 | BA Part 1, p.16 |
| BR-007 | Property timezone governs local deadlines; store instants UTC and use server time. | `[A]` | BA Part 1, p.16 |
| BR-008 | Night Audit runs once/sequentially per business date, locks that date, and missed days are caught up one by one. | `[A]` | BA Part 1, p.16 |
| BR-009 | Money-affecting config starts no earlier than business date +1, never recalculates posted data; tax uses the rule effective on posting business date. | `[A]` proposed addition | BA Part 2, p.41 |

## Inventory and sale units

| ID | Rule (concise) | Status | Source |
|---|---|---|---|
| BR-010 | At most one active `RoomNight` per `(room, stay_date)` across assigned booking, OOO block or day-use; enforce in DB. | `[A]` | BA Part 1, p.16 |
| BR-011 | Availability/hold is atomic; booking edits use versioning; money writes lock folio and are idempotent; bank transaction code is unique. | `[A]` | BA Part 1, p.16 |
| BR-012 | Tentative has independent hold/deposit deadlines; expired holds are excluded immediately and job later marks Expired/notifies. | `[A]` OQ-004 | BA Part 1, p.16 |
| BR-013 | Unassigned holds use atomic `RoomTypeInventory`; `sold <= capacity`; assign a physical room no later than check-in. | `[A]` | BA Part 1, p.17 |
| BR-014 | Overbooking is off by default; authorized override/overflow OTA creates urgent Conflict without consuming inventory. | `[Q]` OQ-005 | BA Part 1, p.17 |
| BR-015 | OOO creates RoomNight blocks; existing assigned stays must be moved first; OOS warns but does not block inventory. | `[A]` | BA Part 1, p.17 |
| BR-016 | Do not delete/stop-sale property, room type or room while future bookings exist. | `[A]` | BA Part 1, p.17 |
| BR-017 | Converted adults/children must not exceed room maximum plus permitted extra beds. | `[A]` OQ-007 | BA Part 1, p.17 |
| BR-018 | Parent booking holds parent+children; child booking holds child+parent to prevent whole-unit sale. | `[Q]` OQ-001 | BA Part 1, p.17 |
| BR-019 | A parent/child unit must be assigned when holding; update all affected room-type counters atomically. | `[Q]` OQ-001, proposed addition | BA Part 2, p.41 |
| BR-110 | Before holding, invalidate expired holds for the exact room/date and room-type/date set involved. | `[A]` proposed addition | BA Part 3, p.39 |

## Pricing

| ID | Rule (concise) | Status | Source |
|---|---|---|---|
| BR-020 | Nightly price priority: date override > season/event > weekday > base; equal-priority seasons cannot overlap. | `[A]` | BA Part 1, p.18 |
| BR-021 | Hold preserves quote; Confirmed snapshots price/policy; hotel-caused move keeps price, guest change reprices affected nights and revalidates stay rules. | `[A]` OQ-009 | BA Part 1, p.18 |
| BR-022 | Extra-person/child/bed/early-late/holiday supplements are separate folio lines. | `[A]` OQ-007 | BA Part 1, p.18 |
| BR-023 | Discount may be percent/fixed and booking/line level; net cannot be negative; role threshold is cumulative. | `[A]` OQ-010 | BA Part 1, p.18 |
| BR-024 | Inclusive/exclusive tax is configurable; calculate tax after discount per taxable line. | `[Q]` OQ-014 | BA Part 1, p.18 |
| BR-025 | Rate Plan may enforce min/max stay, CTA and CTD by date. | `[A]` | BA Part 1, p.18 |
| BR-026 | Allocate booking discount proportionally to nights/lines; configured rounding remainder goes to last line. | `[A]` | BA Part 1, p.18 |
| BR-027 | OTA booking stores gross guest price and commission; reporting exposes gross and net. | `[A]` OQ-038 | BA Part 1, p.19 |
| BR-120 | Missing/non-positive nightly rate blocks booking; complimentary stay uses approved 100% discount. | `[A]` proposed addition | BA Part 3, p.40 |

## Deposit, cancellation, payment and refund

| ID | Rule (concise) | Status | Source |
|---|---|---|---|
| BR-030 | Rate Plan defines percent/N-night deposit; reconciled sufficiency confirms booking, except no-deposit, OTA and guaranteed-AR cases. | `[A]` OQ-011 | BA Part 1, p.19 |
| BR-031 | Cancellation fee uses snapshotted policy and check-in reference; post fee, offset deposit, then refund/credit remainder. | `[Q]` OQ-008 | BA Part 1, p.19 |
| BR-032 | Night Audit timing and inventory release differ for guaranteed vs unguaranteed no-show; late arrival restoration needs Manager and inventory. | `[Q]` OQ-008 | BA Part 1, p.19 |
| BR-033 | Total refund ≤ net received under folio lock; original channel by default; noncash-to-cash exception needs Owner; maker-checker always. | `[A]` OQ-012 | BA Part 1, p.19 |
| BR-034 | Early-departure unused nights follow policy, require reason and release RoomNight. | `[Q]` OQ-008 | BA Part 1, p.19 |
| BR-035 | OTA-prepaid room revenue is OTA receivable; do not collect it from guest, only on-site extras. | `[A]` OQ-021 | BA Part 1, p.19 |
| BR-036 | Cancellation/no-show fee revenue posts on the business date the event occurs. | `[Q]` OQ-016 | BA Part 1, p.20 |
| BR-037 | Money arriving after Expired/Cancelled goes to Unallocated; restore at current price if inventory/consent, else original-method full refund. | `[A]` | BA Part 1, p.20 |
| BR-038 | Transfer/QR remains Pending until matched by verified bank notice or Accounting using unique reference; screenshot is not evidence. | `[A]` | BA Part 1, p.20 |
| BR-039 | OTA-collected room refund reduces OTA receivable through OTA, never creates cash refund to guest. | `[A]` OQ-021 | BA Part 1, p.20 |
| BR-130 | Deposit shortfall after Confirmed does not revert status; flag and queue for collection. | `[A]` proposed addition | BA Part 3, p.40 |
| BR-131 | Matched receipt for Cancelled/Expired always goes to Unallocated, not that folio. | `[A]` proposed addition | BA Part 3, p.40 |
| BR-132 | Remaining room amount must be guaranteed/collected at check-in. | `[A]` OQ-051, proposed addition | BA Part 4, p.36 |
| BR-133 | Guaranteed no-show holds first night; temporary fee converts to room charge if guest later arrives under the defined window. | `[A]` proposed addition | BA Part 4, p.36 |
| BR-135 | One open cashier shift per employee/property; every cash transaction belongs to an open shift. | `[A]` proposed addition | BA Part 4, pp.23, 36 |
| BR-136 | Refund to original channel and payer; different channel/name requires Owner and reason. | `[A]` proposed addition | BA Part 4, pp.23, 36 |

## Folio, invoice and receivables

| ID | Rule (concise) | Status | Source |
|---|---|---|---|
| BR-040 | Folio transactions are immutable; same-shift void or later adjustment requires authority, reason and maker-checker. | `[A]` | BA Part 1, p.20 |
| BR-041 | Check-out requires every folio balance zero via collection, permitted AR, refund or GuestCredit. | `[A]` | BA Part 1, p.20 |
| BR-042 | Booking may have multiple folios/master folio; routing is set at booking; line transfer requires permission/audit. | `[A]` OQ-003 | BA Part 1, p.20 |
| BR-043 | Issued invoice is immutable; correct by regulated adjustment/replacement. | `[Q]` OQ-015 | BA Part 1, p.21 |
| BR-044 | Cashier close reconciles physical cash; noncash reconciles to bank by date; variance needs reason and Manager confirmation. | `[A]` | BA Part 1, p.21 |
| BR-045 | Closed business date is locked; adjustment posts current date; only Owner may reopen with audit/notification. | `[A]` | BA Part 1, p.21 |
| BR-046 | Never store card number/CVV/expiry; block card-like strings in notes. | `[A]` | BA Part 1, p.21 |
| BR-047 | Only Accounting creates company/OTA AR accounts with limits; AR transfer needs permission; weekly aging. | `[A]` | BA Part 1, p.21 |
| BR-048 | Invoice proposed at service completion/check-out; deposit gets receipt only; long-stay timing unresolved. | `[Q]` OQ-055, proposed update | BA Part 4, pp.27, 36–37 |
| BR-134 | At most one room-charge posting per `(booking_room, stay_date)`. | `[C]` integrity requirement, proposed addition | BA Part 4, pp.11, 36 |

## Room operation and stay

| ID | Rule (concise) | Status | Source |
|---|---|---|---|
| BR-050 | Room state has independent Occupancy and Housekeeping axes; OOO/OOS derives from dated blocks; keep history. | `[A]` | BA Part 1, p.21 |
| BR-051 | Check-in requires Vacant, not OOO and configured cleanliness threshold; Manager override is audited/KPI-counted. | `[A]` OQ-017 | BA Part 1, p.21 |
| BR-052 | Check-out makes Dirty and creates checkout-clean task; Night Audit creates configured stayover task. | `[A]` | BA Part 1, p.21 |
| BR-053 | Late checkout charged as another night creates day-use RoomNight and consumes that night. | `[A]` | BA Part 1, p.22 |
| BR-054 | Extension checks new nights; offer split stay/move if occupied; extension nights use current price. | `[A]` | BA Part 1, p.22 |
| BR-055 | Daily room discrepancy report compares observed HK use/occupancy with system state; Manager explains each line. | `[A]` | BA Part 1, p.22 |
| BR-056 | Paid/late-arrival cancellation, no-show or undo requires Manager approval. | `[A]` | BA Part 1, p.22 |
| BR-057 | HK/MNT creates PendingCharge only; FO/Manager posts/dismisses; unresolved pending charges block checkout. | `[A]` proposed addition | BA Part 4, p.36 |

## Security, privacy and approval

| ID | Rule (concise) | Status | Source |
|---|---|---|---|
| BR-060 | Business data is property-owned and data-layer scoped; guest/blacklist may be chain-wide. | `[A]` OQ-034 | BA Part 1, p.22 |
| BR-061 | Audit sensitive actions with before/after; append-only/tamper-evident; mask personal data in log. | `[C]` | BA Part 1, p.22 |
| BR-062 | No hard delete of booking/transaction/guest; cancel/void/anonymize, including log and expired backups. | `[Q]` OQ-019 | BA Part 1, p.22 |
| BR-063 | Encrypt identity documents/images; match via KMS-protected HMAC blind index; audit every full view. | `[A]` | BA Part 1, p.22 |
| BR-064 | Maker cannot approve own request except configured Owner exception with reason; cumulative thresholds; remote approval requires 2FA. | `[A]` OQ-040 | BA Part 1, p.23 |
| BR-065 | Individual accounts only; counter switch by PIN/autolock; stopping employee revokes account and sessions immediately. | `[A]` | BA Part 1, p.23 |
| BR-066 | Mask ID/phone/email; full view/export needs separate permission and audit; HK never sees guest personal data. | `[A]` | BA Part 1, p.23 |
| BR-067 | Minimize personal data, give purpose notice, and handle data-subject/incident requests under applicable law. | `[Q]` OQ-019 | BA Part 1, p.23 |
| BR-068 | Approval freezes value/object version; changed object fails execution; overdue approval expires. | `[A]` OQ-042, proposed addition | BA Part 2, p.41 |
| BR-069 | Cross-property object is returned as not found and access attempt is logged. | `[A]` proposed addition | BA Part 2, p.41 |

## Channel and external access

| ID | Rule (concise) | Status | Source |
|---|---|---|---|
| BR-070 | HMS is intended inventory/rate source of truth; changes push to channel within configured latency. | `[A]` OQ-022 | BA Part 1, p.23 |
| BR-071 | Channel booking is idempotent by external code; channel changes/cancellation update the original. | `[A]` | BA Part 1, p.23 |
| BR-072 | Channel outage queues retry, alerts Manager and supports manual stop-sell. | `[A]` | BA Part 1, p.23 |
| BR-073 | Channel/bank/payment webhooks require signature; payment status comes only from authenticated source. | `[A]` | BA Part 1, p.23 |
| BR-074 | External booking code is random; external lookup also needs phone/email and rate limiting. | `[A]` | BA Part 1, p.23 |

## Catalog gaps and canonicalization

Rule numbers 028, 029 and 049 are not defined. BR-009, BR-019, BR-068–069, BR-110, BR-120, BR-130–136, BR-057 and BR-048 were introduced or updated in later parts and should be merged into a future canonical catalog only after PO/stakeholder approval. (BA Part 2, p.43; Part 3, p.41; Part 4, pp.36–37.)

