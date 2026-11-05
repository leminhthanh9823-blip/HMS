# Recorded decisions and source-marked baselines

No PDF contains evidence of a signed stakeholder decision or workshop approval. This file therefore records source-marked `[C]` baselines separately from approved decisions. It deliberately excludes unresolved ASM values and recommendations from technology, deployment and UI/UX reports.

## Source-status convention

The BA defines `[C]` as present verbatim in the project brief or stakeholder-confirmed, `[A]` as a BA assumption, and `[Q]` as dependent on a blocking OQ. Detailed capabilities are generally not confirmed merely because the module is in scope. Requirement IDs must never be reused. (BA Part 1, p.2.)

## Project Owner-confirmed decisions

The seven reviewed PDFs contain no signed workshop decision. The Project Owner explicitly confirmed the business direction below in conversation on 2026-11-05. Discussed or recommended technical choices are not owner-approved unless separately confirmed.

| Decision | Approved direction | Evidence / boundary |
|---|---|---|
| Business model and launch operating direction | Single-owner system; no SaaS for independent owners; operate multiple properties from the first release. | Project Owner confirmation in conversation, 2026-11-05. OQ-032's business direction is confirmed. OQ-034/OQ-041 and other property policies remain unresolved. No SaaS tenant billing/control plane is authorized. |
| D1 — Primary database | PostgreSQL is the primary database engine. | Owner confirmation in conversation, 2026-11-05. Provider, production version, region, backup and operations are D12 and remain unapproved. |
| D2 — Data access | Prisma 7 stable; no Prisma 8 RC. SQL migrations require review; raw SQL is allowed for constraints and locking. | Owner confirmation in conversation, 2026-11-05. This approves the tool choice and review boundary, not business schema. |
| D3 — Module system | ESM investigation is approved as a measurement spike only. | Owner confirmation in conversation, 2026-11-05. No official module-system change is approved. |
| D4 — Request validation | Zod with explicit Nest pipes. | Owner confirmation in conversation, 2026-11-05. |
| D5 — HTTP security | Narrow CORS allowlist, security headers and rate limiting. | Owner confirmation in conversation, 2026-11-05. |
| D6 — Authorization boundary | Document user × property × role with explicit Owner scope as the default boundary. | Owner confirmation in conversation, 2026-11-05. Documentation only; OQ-041 remains open; no authentication/RBAC implementation is approved in D8. |
| D7 — Guest and blacklist boundary | Do not share guest records or blacklist across properties as the default boundary. | Owner confirmation in conversation, 2026-11-05. Documentation only; OQ-034 remains open. |
| D8 — Experimental slice | Approve synthetic-data PROP → ROOM → BOOK (hold) slice. | Owner confirmation in conversation, 2026-11-05. Limited to the test slice; no authentication, real PII or production baseline. Accepted ASM values are experimental assumptions only; no OQ is closed. |
| D9 — Repository visibility and source PDFs | Not applicable (test project); do not change repository visibility or delete PDFs. | Owner confirmation in conversation, 2026-11-05. Close D9 for this reason. |
| D10 — CI dependency audit | CI blocks high/critical findings; exceptions require a reason and expiry. | Owner confirmation in conversation, 2026-11-05. |
| D11 — Redis/BullMQ | Defer Redis/BullMQ. | Owner confirmation in conversation, 2026-11-05. |
| D13 — Database CI | Use ephemeral PostgreSQL for Linux CI. | Owner confirmation in conversation, 2026-11-05. |

## Owner-accepted TEST assumptions (D8 slice only)

| ASM | Test-slice use | Boundary |
|---|---|---|
| ASM-001 | Sell a room and a whole unit; do not implement parent/child inventory. | Test assumption only; OQ-001 remains open; not a product baseline. |
| ASM-002 | Nightly stays only, with `[arrival, departure)` nights. | Test assumption only; OQ-002 remains open; not a product baseline. |
| ASM-004 | A configurable hold expiry is used for the synthetic hold flow. | Test assumption only; OQ-004 remains open; exact business policy is not decided; not a product baseline. |
| ASM-005 | No overbooking in the synthetic hold flow. | Test assumption only; OQ-005 remains open; not a product baseline. |

These ASM values are accepted only as test assumptions for D8. They are not business decisions or a product baseline, and their OQs remain open.

## Project Owner-provided operational sizing inputs

| Sizing input | Owner-provided value | Evidence / boundary |
|---|---|---|
| Expected property portfolio | **2–5 properties in the first 12 months; target 6–10 properties in months 12–24.** | Project Owner input, 2026-11-05. This is a planning range, not a business commitment, architecture approval or infrastructure-capacity decision. |
| Initial room count | **Unknown / not yet determined.** | No room, booking, user, revenue or concurrency quantity is inferred. Pilot property, budget, staffing, implementation timeline and operational ownership remain open under OQ-031. |

`OQ-032`'s confirmed business direction remains traceable in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md). OQ-031 is only partially answered by the property ranges above and remains open for room count, pilot, budget, staffing, timeline and operational ownership. OQ-036 is closed only for selecting PostgreSQL as the engine; provider, production version, region, backup and operating model remain open under D12. OQ-034 and OQ-041 remain open despite the documented default boundaries for D6/D7. OQ-019 and all other OQs remain open unless explicitly resolved above.

## Source-marked `[C]` items — not equivalent to sign-off

| Document baseline | Status | Source |
|---|---|---|
| Deliver analysis sufficient for PO, UI/UX, Dev and QA handoff | `[C]` | BA Part 1, p.6 |
| Separate MVP from later phases | `[C]` | BA Part 1, p.6 |
| Official scope contains 19 named modules; FO-NA is a FO submodule | `[C]` at module level only | BA Part 1, pp.2, 7–8 |
| Sensitive operations must be recorded in an append-only, tamper-evident audit log (BR-061) | `[C]` | BA Part 1, p.22 |
| At most one room-charge posting per `(booking_room, stay_date)` (BR-134) | `[C]` integrity requirement inside an unbaselined draft; also listed as a proposed addition | BA Part 4, §§0, 11.2, pp.1, 36 |

## Important qualification

BA Part 1 says no stakeholder had yet confirmed the overall scope and names this as the largest current risk. Parts 2–4 state that they are drafts written before workshop 0 and are not baselined. Therefore every `[C]` above is a document/source classification, not evidence of workshop, UAT or business sign-off. (BA Part 1, §1, p.4; Part 2, §0.1, p.1; Part 3, §0.1, p.1; Part 4, §0, p.1.)

## Not decisions

Other framework, frontend, architecture, runtime and provider choices remain proposed unless explicitly listed above. D1 approves PostgreSQL; D2 approves Prisma 7 stable with reviewed SQL migrations; D3 approves only an ESM measurement spike. D12 remains Proposed. The D8 assumptions are test-only and do not close business OQs. See [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) and [TECHNOLOGY_DECISION_PROPOSAL.md](TECHNOLOGY_DECISION_PROPOSAL.md).

