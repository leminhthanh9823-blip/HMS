# HMS Knowledge Base

This is the entry point for the Homestay Management System (HMS). The repository contains the BA/Knowledge Base and an Owner-authorized Gate A/B application prototype. This bounded implementation does not approve the product architecture or technology stack.

The Project Owner has confirmed a single-owner model, multiple properties from the first release, and no SaaS for unrelated property owners. The Owner also supplied operational planning ranges of **2–5 properties in the first 12 months** and **6–10 properties in months 12–24**; initial room count remains unknown. These inputs are recorded in [DECISIONS.md](DECISIONS.md). All technology selections—including NestJS/Next.js/PostgreSQL/Redis, packages, versions, ORM and architecture patterns—remain Proposed / Pending Approval. The property ranges are sizing context, not delivery commitments, architecture approval or infrastructure capacity.

The pnpm/NestJS/Next.js choices and package versions used for the bounded prototype are implementation choices authorized for Gate A/B only; product technology and architecture selections, including database, Redis, ORM and architecture patterns, remain Proposed / Pending Approval. The property ranges remain sizing context, not delivery commitments, architecture approval or infrastructure capacity. See [PHASE_0_IMPLEMENTATION_PLAN.md](PHASE_0_IMPLEMENTATION_PLAN.md) for the implementation record.

## How to use this Knowledge Base

1. Start here, then open only the topic or module needed for the task.
2. Preserve source labels: `[C]` confirmed/baselined in the BA convention, `[A]` assumption, `[Q]` dependent on an unresolved blocking question.
3. A technical/UI/deployment proposal is not an approved decision. See [DECISIONS.md](DECISIONS.md) and [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).
4. Use the PDFs only when a summary is insufficient. Short source aliases below resolve every citation to an exact PDF filename; `p.N` is the PDF page number.

## Knowledge map

| Need | Read |
|---|---|
| Purpose, users, scope, phases | [BUSINESS_OVERVIEW.md](BUSINESS_OVERVIEW.md) |
| Cross-module rules | [BUSINESS_RULES.md](BUSINESS_RULES.md) |
| Proposed architecture, property isolation, authorization, guest scope and timezone | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Technology comparison, candidate-version compatibility and approval proposal | [TECHNOLOGY_DECISION_PROPOSAL.md](TECHNOLOGY_DECISION_PROPOSAL.md) |
| Operational sizing baseline, Phase 0 gates, 19-module classification and Owner decision package | [PHASE_0_IMPLEMENTATION_PLAN.md](PHASE_0_IMPLEMENTATION_PLAN.md) |
| Gate C.0 repository/architecture readiness audit | [GATE_C0_READINESS_AUDIT.md](GATE_C0_READINESS_AUDIT.md) |
| Owner confirmations and pre-Gate C hardening backlog | [OWNER_CONFIRMATION_CHECKLIST.md](OWNER_CONFIRMATION_CHECKLIST.md) |
| Proposed owner decisions D1–D13 and conditional implementation plans | [DECISION_PROPOSALS.md](DECISION_PROPOSALS.md) |
| Gate C.1 Owner decisions D-01–D-08 and approval sheet | [OWNER_DECISION_PACKAGE.md](OWNER_DECISION_PACKAGE.md) |
| FR/NFR inventory and traceability | [REQUIREMENTS_INDEX.md](REQUIREMENTS_INDEX.md) |
| Approval status and source-marked baselines | [DECISIONS.md](DECISIONS.md) |
| Questions, assumptions, conflicts, approvals needed | [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) |
| Domain terms and state vocabulary | [TERMINOLOGY.md](TERMINOLOGY.md) |
| Latest Knowledge Base audit | [KNOWLEDGE_BASE_AUDIT.md](KNOWLEDGE_BASE_AUDIT.md) |
| A particular domain or module-classification summary | [MODULES/README.md](MODULES/README.md) |

### Minimal reading by task

| Task | Read first; add only if needed |
|---|---|
| Business change | relevant module → `BUSINESS_RULES` → `OPEN_QUESTIONS`/`DECISIONS` |
| Architecture or technology | `ARCHITECTURE` → relevant module/rules → `DECISIONS`/`OPEN_QUESTIONS` |
| Requirement or test analysis | `REQUIREMENTS_INDEX` → relevant module → cited PDF pages |
| Terminology/state question | `TERMINOLOGY` → relevant module/rule |
| Confirmed decision update | `OPEN_QUESTIONS` + affected files → `DECISIONS`; retain source evidence |

## Original source inventory (7 PDFs, preserved)

| Source | Pages | Primary use |
|---|---:|---|
| `docs/source/HMS_Tai-lieu-BA_Phan-1_v0.2.pdf` | 43 | overview, scope, shared BR/NFR, OQ/ASM, roadmap |
| `docs/source/HMS_Tai-lieu-BA_Phan-2_v0.1.pdf` | 43 | CFG, PROP, ROOM, RBAC, EMP, AUD |
| `docs/source/HMS_Tai-lieu-BA_Phan-3_v0.1.pdf` | 41 | RATE, BOOK, CAL, GST, PAY (deposit), INV (folio) |
| `docs/source/HMS_Tai-lieu-BA_Phan-4_v0.1.pdf` | 37 | FO, FO-NA, HK, MNT, PAY (refund/shift), INV (settlement/AR) |
| `docs/source/hms-de-xuat-cong-nghe.pdf` | 4 | proposed technology stack and go-live approach |
| `docs/source/hms-de-xuat-trien-khai.pdf` | 5 | proposed implementation/security solutions |
| `docs/source/hms-de-xuat-giao-dien-v2.pdf` | 3 | proposed UI template, navigation and visual rules |

Citation aliases used throughout the Knowledge Base:

- `BA Part 1` = `HMS_Tai-lieu-BA_Phan-1_v0.2.pdf`; `BA Part 2` = `HMS_Tai-lieu-BA_Phan-2_v0.1.pdf`; `BA Part 3` = `HMS_Tai-lieu-BA_Phan-3_v0.1.pdf`; `BA Part 4` = `HMS_Tai-lieu-BA_Phan-4_v0.1.pdf`.
- `technology proposal` = `hms-de-xuat-cong-nghe.pdf`; `deployment proposal` = `hms-de-xuat-trien-khai.pdf`; `UI proposal` = `hms-de-xuat-giao-dien-v2.pdf`.

The official scope has 19 modules; FO-NA is documented as a submodule of FO. The module folder provides 20 files so FO and FO-NA can be consulted independently. (BA Part 1, pp.2, 7–8.)

## Source precedence for current use

- BA documents define the current analytical baseline and preserve `[C]/[A]/[Q]` status.
- Later BA parts extend earlier catalogs with explicitly identified proposed BRs and FRs; they do not silently close OQs. (BA Part 2, pp.41–43; Part 3, pp.39–41; Part 4, pp.36–37.)
- Technology, deployment and UI/UX PDFs are advisory. Their language such as “chính thức lựa chọn” does not provide evidence of stakeholder approval by itself; approval remains open. (UI proposal, p.1; technology proposal, pp.1–3.)

## Maintenance rule

When a stakeholder confirms an OQ or changes a requirement: update the relevant module file, [BUSINESS_RULES.md](BUSINESS_RULES.md), [REQUIREMENTS_INDEX.md](REQUIREMENTS_INDEX.md), [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md), and [DECISIONS.md](DECISIONS.md) as applicable. Never delete or reuse an existing requirement ID; mark retired IDs `Deprecated`. (BA Part 1, p.2.)

