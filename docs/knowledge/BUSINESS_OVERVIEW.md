# Business overview

## Product intent

HMS is a multi-property Property Management System for homestays. It replaces notebooks, Excel and fragmented messaging with one source of truth for inventory, bookings, money and operations. The principal problems are double booking, untraceable deposits/payments/refunds, inconsistent room state across Front Desk/Housekeeping/Maintenance, manual OTA operations, and handling personal data and statutory records. Most problem statements remain `[A]` until stakeholder interviews confirm them. (BA Part 1, pp.3–4.)

## Business goals

| ID | Goal | Measure/status | Source |
|---|---|---|---|
| BG-01 | Eliminate double booking | zero duplicate physical-room nights; inventory conflicts traceable | BA Part 1, pp.5, 27 |
| BG-02 | Control cash flow | booking-level reconciliation of deposits, payments, refunds and receivables | BA Part 1, p.5 |
| BG-03 | Reduce Front Desk handling time | target booking creation under 2 minutes; target requires baseline/Owner confirmation | BA Part 1, p.5; Part 3, p.8 |
| BG-04 | Synchronize room state | no unapproved handover of dirty/broken rooms; overrides reported | BA Part 1, p.6 |
| BG-05 | Manage revenue | Occupancy, ADR and RevPAR by day/property/channel, gross and net | BA Part 1, p.6 |
| BG-06 | Centralize multi-property management | Owner sees consolidated property data | BA Part 1, p.6 |
| BG-07 | Traceability and fraud control | audit sensitive actions; maker-checker or reasoned exception | BA Part 1, p.6 |
| BG-08 | Legal compliance | lodging declaration data, invoicing and personal-data handling | BA Part 1, p.6 |

Target values are not approved; measure a two-week baseline at the pilot property and have the Business Owner approve targets (`OQ-030`). (BA Part 1, pp.5, 34.)

## Scope

At module level, the project brief lists 19 modules and the BA marks that list `[C]`; detailed capabilities inside modules remain `[A]` until stakeholder validation. (BA Part 1, pp.2, 6–8.)

- Property and inventory: PROP, ROOM, CAL.
- Guest journey: BOOK, GST, FO with FO-NA.
- Pricing and finance: RATE, PAY, INV.
- Operations: HK, MNT, AST.
- Platform and governance: EMP, RBAC, NTF, RPT, CHN, CFG, AUD.

The end-to-end boundary runs from property setup through booking, stay, settlement and revenue reporting. HMS is intended as the source of truth for booking and room inventory; OTA/Channel Manager, payment, e-invoice, lodging declaration and messaging providers are external systems. This boundary is analytical, not an approved integration design. (BA Part 1, pp.6, 8.)

### Proposed out of scope `[A]`, awaiting `OQ-033`

- Public booking engine (proposed Phase 3), general ledger/tax filing, full F&B POS, detailed payroll/timekeeping, smart locks/IoT, automatic dynamic pricing, native guest app, loyalty, and multi-level procurement.
- MVP staff UI is Vietnamese; guest templates may be Vietnamese and English.
- Card number/CVV storage is prohibited by BR-046, not merely out of scope.

Source: BA Part 1, p.8.

## Proposed phasing, not approved

- Phase 1/MVP: proposed direct-booking lifecycle across multiple properties, 13 full modules plus 4 minimal modules; manual OTA entry/reconciliation; internal receipts/data export rather than confirmed e-invoice integration.
- Phase 2: Channel Manager, fuller asset/inventory and external integrations proposed.
- Phase 3: public booking engine and optional capabilities proposed.

The Owner-confirmed business direction is single-owner, multi-property from the first release, with no unrelated-owner SaaS (`OQ-032` answered). Planning ranges are 2–5 properties in the first 12 months and 6–10 in months 12–24; initial room count is unknown. Exact MVP scope, pilot, budget, deadline, team size, operational ownership and hosting model remain open (`OQ-031`, `OQ-033`). The ranges are sizing inputs rather than delivery or infrastructure commitments. (BA Part 1, pp.4, 34–38; Project Owner input, 2026-11-05.)

## Actors and approval authorities

Core stakeholder sign-off is required from Business Owner (`SH-01`), Property Manager (`SH-02`), Front Desk (`SH-03`) and Accounting/Cashier (`SH-04`). Other actors include Housekeeping, Maintenance, System Admin, Guest, OTA/Channel Manager, project team, HK Supervisor and Night Auditor. (BA Part 1, p.10.)

Operational role codes used by detailed BA include `R-OWN`, `R-MGR`, `R-FD`, `R-NA`, `R-ACC`, `R-HKS`, `R-HK`, `R-MNT`, and `R-ADM`. `R-ADM` has platform administration but no business-operation authority. (BA Part 2, pp.30–32; Part 4, pp.31–32.)

## Core lifecycle

1. Search availability and price; create/reuse guest.
2. Create Tentative booking, atomically hold inventory, open folio and issue deposit instructions.
3. Reconcile deposit; when sufficient, move to Confirmed and snapshot price/policy.
4. Before arrival, allow controlled modification/cancellation/room assignment.
5. Check in only against room, guest and payment controls; operate stay and Night Audit.
6. Settle folio to zero, check out, mark room Dirty, clean/inspect and return to saleable state.

Sources: BA Part 1, pp.14–15; Part 3, p.3; Part 4, pp.3–13.

