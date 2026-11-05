# Recorded decisions and source-marked baselines

No PDF contains evidence of a signed stakeholder decision or workshop approval. This file therefore records source-marked `[C]` baselines separately from approved decisions. It deliberately excludes unresolved ASM values and recommendations from technology, deployment and UI/UX reports.

## Source-status convention

The BA defines `[C]` as present verbatim in the project brief or stakeholder-confirmed, `[A]` as a BA assumption, and `[Q]` as dependent on a blocking OQ. Detailed capabilities are generally not confirmed merely because the module is in scope. Requirement IDs must never be reused. (BA Part 1, p.2.)

## Project Owner-confirmed decisions

The seven reviewed PDFs contain no signed workshop decision. The Project Owner explicitly confirmed the business direction below in conversation on 2026-11-05. Discussed or recommended technical choices are not owner-approved unless separately confirmed.

| Decision | Approved direction | Evidence / boundary |
|---|---|---|
| Business model and launch operating direction | Single-owner system; no SaaS for independent owners; operate multiple properties from the first release. | Project Owner confirmation in conversation, 2026-11-05. OQ-032's business direction is confirmed. OQ-034/OQ-041 and other property policies remain unresolved. No SaaS tenant billing/control plane is authorized. |

## Project Owner-provided operational sizing inputs

| Sizing input | Owner-provided value | Evidence / boundary |
|---|---|---|
| Expected property portfolio | **2–5 properties in the first 12 months; target 6–10 properties in months 12–24.** | Project Owner input, 2026-11-05. This is a planning range, not a business commitment, architecture approval or infrastructure-capacity decision. |
| Initial room count | **Unknown / not yet determined.** | No room, booking, user, revenue or concurrency quantity is inferred. Pilot property, budget, staffing, implementation timeline and operational ownership remain open under OQ-031. |

`OQ-032`'s confirmed business direction remains traceable in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md). OQ-031 is only partially answered by the property ranges above and remains open for room count, pilot, budget, staffing, timeline and operational ownership. `OQ-036` remains open: PostgreSQL was discussed/retained as a proposal but was not explicitly approved. Adjacent policies OQ-034, OQ-041 and OQ-019 also remain open. All other OQs and BA `[A]` values remain open unless separately resolved.

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

The explicit Project Owner decisions recorded here are single-owner operation, multiple properties from first release, and no SaaS for unrelated property owners. The 2–5 and 6–10 property ranges are confirmed planning inputs, not approvals or delivery commitments. NestJS + TypeScript, Next.js + React + TypeScript, PostgreSQL, Redis + BullMQ, Prisma, Modular Monolith, pnpm monorepo, REST/OpenAPI, Docker Compose, API/worker topology, “prefer maintainability and avoid over-engineering,” and every version/library/provider remain proposed or pending approval. The confirmed multi-property direction requires property-aware design from the beginning but does not confirm specific access policies or schema choices. See [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) and [TECHNOLOGY_DECISION_PROPOSAL.md](TECHNOLOGY_DECISION_PROPOSAL.md).

