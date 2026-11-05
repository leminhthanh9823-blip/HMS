# Gate C.1.2 — Owner Decision Package Correction Report

**Review status:** Corrections applied to the decision package for Owner review. Recommendations remain Proposed/Pending Owner Approval; this report does not approve any technology, resolve an OQ, or authorize implementation.

## 1. Executive Summary

`OWNER_DECISION_PACKAGE.md` was revised against the independent Gate C.1.1 findings and targeted BA source evidence. The three High findings have been corrected in the package: the GST chain-level BA behavior is now explicit, OQ-047 has its own dependency and approval entries, and D-01 maps NFR-DATA-001 capabilities to PostgreSQL and MySQL, including partial uniqueness and RLS distinctions.

Medium and Low findings were also addressed by exposing the BA Owner/system-role baseline, adding privacy and breach-accountability questions, surfacing the unapproved NFR-AVL-001 values, separating test types from environments, dating and bounding the Prisma version recommendation, and distinguishing migration metadata from business schema.

This is a corrected decision brief, not an approval record. OQ-034, OQ-041, OQ-047, OQ-019 and OQ-045 remain open. No database work is authorized by this correction.

## 2. Findings from Gate C.1.1

The independent review identified nine findings in `GATE_C1_1_DECISION_PACKAGE_REVIEW.md` §16: C1.1-01 through C1.1-03 High; C1.1-04 through C1.1-08 Medium; and C1.1-09 Low. The source report's exact finding IDs and severities are preserved below.

## 3. Findings fixed

| Finding | Severity | Status | Correction / residual decision |
|---|---|---|---|
| C1.1-01 — BA chain-level guest behavior not visible enough | High | **Fixed in package; Requires Owner Decision** | D-04 now cites FR-GST-001/003/007 and the chain-level acceptance scenarios, compares preserve-BA, property-isolated and hybrid options, and states that property isolation is a material BA change requiring Owner approval and BA change control. OQ-034 remains open. |
| C1.1-02 — OQ-047 omitted from dependency matrix | High | **Fixed in package; Requires Owner Decision** | OQ-047 now has a separate row in the OQ matrix and a separate Owner Approval Sheet entry. Its warning/block action is distinguished from OQ-034 sharing scope/authority. |
| C1.1-03 — NFR-DATA-001 capability comparison incomplete | High | **Fixed in package; Requires Owner Decision and Technical Validation** | D-01 now has the requested capability matrix, explains PostgreSQL partial unique indexes versus MySQL generated/functional-key workarounds, and distinguishes PostgreSQL RLS from MySQL alternatives and mandatory application authorization. NFR-DATA-001 remains `[A]`; engine and RLS policy are not approved. |
| C1.1-04 — BA Owner/system role baseline understated | Medium | **Fixed in package; Requires Owner Decision** | D-03 presents BA Part 2 pp.16–17 and FR-RBAC-002/003, FR-EMP-009 as a draft baseline to confirm or revise, with access scenarios and explicit active-context/revocation questions. OQ-041 remains open. |
| C1.1-05 — Privacy rights and breach accountability prompts incomplete | Medium | **Fixed in package; Requires Owner and legal/privacy advice** | D-05 now asks about viewing, editing, documents, exports, correction/deletion, sharing approval, breach triage/escalation/reporting and audit review. No legal conclusion or retention duration is added. |
| C1.1-06 — NFR-AVL-001 assumptions omitted | Medium | **Fixed in package; Requires Owner Decision and Technical Validation** | D-07 records the BA `[A]` values (availability 99.5% monthly, RPO ≤15 minutes, RTO ≤4 hours, encrypted/separated/immutable backups, quarterly restore test), their operational impact, and accept/revise/defer questions. They are not represented as SLA or approved targets. |
| C1.1-07 — Test types and release validation insufficiently separated | Medium | **Fixed in package; Requires Owner/Technical decisions** | D-08 separates test taxonomy from Local/CI/Staging/Production and adds selected-engine, synthetic-data, release-validation and production-safety boundaries. No environment was implemented. |
| C1.1-08 — Prisma version basis not dated/bounded | Medium | **Fixed in package; Pending Technical Validation** | D-02 names Prisma ORM 7.x as a candidate, gives the source-check date and status distinction from Prisma 8 RC, and leaves exact patch/adapter/Nest/PostgreSQL fit for revalidation. ORM approval remains independent of D-01. |
| C1.1-09 — Option A metadata ambiguity | Low | **Fixed in package; Requires bounded Owner authorization** | D-06 explicitly allows migration history metadata and an authorized disposable technical migration while excluding all HMS business entities and identity/authorization/PII. |

All nine Gate C.1.1 findings have a corresponding correction in `OWNER_DECISION_PACKAGE.md`. In particular, all High findings are fixed as decision-package deficiencies. This says nothing about whether the Owner has selected the underlying policy.

## 4. Findings not fixed

No C1.1 finding remains uncorrected in the document. The substantive policy questions remain unresolved by design; the correction does not close any OQ or authorize technical work.

## 5. Findings requiring Owner decision

C1.1-01, C1.1-02, C1.1-03, C1.1-04, C1.1-05, C1.1-06, C1.1-07 and C1.1-09 have Owner-dependent consequences, as shown in §3. Owner decisions include guest sharing/blacklist behavior, system/property roles and context switching, privacy responsibilities, recovery objectives, test-data boundaries and whether to authorize Option A. C1.1-08 requires independent ORM approval after validation. The fact that an item appears in the approval sheet does not make it approved.

## 6. Findings requiring technical validation

C1.1-03 needs selected-engine/version verification of constraints, partial uniqueness, RLS or alternatives, and transaction behavior. C1.1-06 needs provider/recovery evidence against any Owner-approved objectives. C1.1-07 needs engine-matched integration/release checks and approved data boundaries. C1.1-08 needs current Prisma/TypeORM/Drizzle and NestJS compatibility validation, including migration and raw SQL behavior. These are future bounded validations; none was run by this documentation task.

## 7. D-01 to D-08 changes

| Decision | Correction made | Current status |
|---|---|---|
| D-01 Database engine | Added NFR-DATA-001 capability-by-capability PostgreSQL/MySQL matrix; covered partial/conditional uniqueness, RLS, application authorization, reporting and recovery; split engine, version, provider, region/residency and RLS strategy. | PostgreSQL **Proposed / Pending Owner Approval**; version/provider/region/RLS are separate decisions. |
| D-02 ORM | Compared Prisma 7.x candidate, TypeORM and Drizzle consistently; added dated official version evidence, Nest integration, migration, transactions, SQL/reporting, tests and coupling validation. | ORM is an independent **Proposed / Pending Owner Approval** decision; implementation fit **Pending Technical Validation**. |
| D-03 Authorization | Added BA Owner/system role baseline, multiple-property employee roles, Owner access as confirm/revise, server context and five concrete access/job scenarios. | OQ-041 **Open Question**; no policy selected. |
| D-04 Guest sharing | Added the chain-level BA baseline and explicit compatibility/impact for Options A/B/C; separated identity, profile, contact, documents, booking history and matching. | OQ-034 **Open Question**; no sharing model selected. |
| D-05 Privacy and retention | Added explicit view/edit/document/export/correction/deletion/sharing and breach responsibilities across Owner, property operations, technical administrator and legal/privacy adviser. | OQ-019/OQ-045 remain open; no legal policy or duration asserted. |
| D-06 Foundation scope | Defined Option A technical metadata/history separately from business schema; listed exclusions and OQ boundary; separated authentication, authorization, identity, property context and business slice. | Options remain **Pending Owner Approval**; no implementation authorization. |
| D-07 Migration and recovery | Added the exact NFR-AVL-001 BA assumptions with `[A]`, status, impact and Owner confirmation prompts; separated disposable local work from production recovery. | Targets and operator **Pending Owner Approval**; provider feasibility **Pending Technical Validation**. |
| D-08 Environment and testing | Added test-type × environment matrix, synthetic-data controls and proposed release-validation checklist; distinguishes CI from test type and forbids destructive production tests. | Boundaries **Pending Owner Approval**; engine-specific plan **Pending Technical Validation**. |

## 8. OQ Dependency Matrix changes

The matrix now contains separately verified rows for OQ-019, OQ-031, OQ-033, OQ-034, OQ-036, OQ-037, OQ-041, OQ-045 and OQ-047. OQ-047 is explicitly separated from OQ-034: the latter concerns guest/blacklist scope and authority; the former concerns match response such as warning or block. The Option A column states which OQs can remain open only if the scope excludes business entities, identity, authorization, guest data, documents, exports and real PII.

The package classifies OQ-036 as blocking selection of the production-intended engine, OQ-031 as relevant to funded/provisioned production operations but not inherently to an authorized disposable local foundation, OQ-041 as blocking final identity/membership/authorization design, OQ-034/OQ-047 as blocking guest/blacklist behavior, OQ-019/OQ-045 as blocking real PII/document handling, OQ-033 as business scope, and OQ-037 as legal property/tax/invoice design. These descriptions do not alter OQ contents or statuses.

## 9. BA references verified

Targeted primary-source checks were made against the source PDFs; the cited content is reported as BA Requirement, BA Assumption `[A]`, or Open Question and is not treated as Owner approval:

- **NFR-DATA-001 and NFR-AVL-001:** `HMS_Tai-lieu-BA_Phan-1_v0.2.pdf`, p.9. The former is `[A]` and names transaction/constraint/index/locking/RLS capabilities and PostgreSQL as a proposal. The latter is `[A]` and contains the recovery/availability values reproduced in D-07.
- **Property scoping/privacy context:** BA Part 1 pp.22–23; `NFR-SEC-002`, `BR-060`, OQ-019/OQ-034. Labels and temporary answers remain unapproved unless separately confirmed.
- **Owner/system roles:** `HMS_Tai-lieu-BA_Phan-2_v0.1.pdf`, pp.16–17; FR-RBAC-002/003. Multi-property roles: BA Part 2 p.23, FR-EMP-009; unresolved answer: OQ-041, BA Part 2 p.41. Sensitive document access: OQ-045, BA Part 2 p.42.
- **Guest chain behavior:** `HMS_Tai-lieu-BA_Phan-3_v0.1.pdf`, pp.19–22; FR-GST-001/003/007, UC-GST-001/002, AC-GST-001-01 and AC-GST-003-01. The package states the cross-property behavior and limited stay-count visibility without treating it as unrestricted sharing of all fields.
- **Blacklist behavior:** BA Part 3 p.40, OQ-047; check-in override context in `HMS_Tai-lieu-BA_Phan-4_v0.1.pdf`, p.7. Warning/Manager approval is recorded as temporary/open, not decided.
- **Privacy and data requests:** BA Part 1 p.34, OQ-019; BA Part 2 p.42, OQ-045; FR-GST-009/010 and BR-062/067 as cited in the package. No legal conclusion is made.

The review was targeted to these decision-relevant pages; it is not a new page-by-page audit of all BA PDFs. The original PDFs were not changed.

## 10. Files modified

- Modified: `docs/knowledge/OWNER_DECISION_PACKAGE.md`.
- Created: `docs/knowledge/GATE_C1_2_CORRECTION_REPORT.md` (this report).
- No other files were intentionally changed. In particular, `DECISIONS.md`, `OPEN_QUESTIONS.md`, BA PDFs, source code, package manifests and lockfile are outside this work package.

## 11. Verification

Verification results:

| Check | Result |
|---|---|
| Markdown structure: 13 numbered report sections; required D/OQ/FR/NFR identifiers; referenced local Knowledge Base paths exist | **PASS** |
| `pnpm exec prettier --check docs/knowledge/OWNER_DECISION_PACKAGE.md docs/knowledge/GATE_C1_2_CORRECTION_REPORT.md` | **PASS** — both files use Prettier style |
| `git diff --check` | **PASS** — no whitespace errors; Git emitted existing LF-to-CRLF working-copy warnings for prior changes to ARCHITECTURE.md, PHASE_0_IMPLEMENTATION_PLAN.md and PROJECT_INDEX.md |
| `git status --short --untracked-files=all` | **PASS / reviewed** — this task's two target files are untracked because the baseline/index state is not staged; prior workspace items are also present as listed below |
| `git diff --cached --name-only` | **PASS** — empty; no staged files |
| Stage/commit and scope | **PASS** — no stage or commit performed; this task edited only OWNER_DECISION_PACKAGE.md and created this report |

Workspace status also contains pre-existing C.1/C.1.1 items: modified `ARCHITECTURE.md`, `PHASE_0_IMPLEMENTATION_PLAN.md`, `PROJECT_INDEX.md`, and untracked `GATE_C1_1_DECISION_PACKAGE_REVIEW.md`. They were not changed by this task. The current branch is `main`; no source-code, dependency, OQ or DECISIONS file appears in the working status.

## 12. Remaining risks

- The BA Guest module explicitly includes chain-level behavior, while OQ-034 and privacy decisions remain unresolved. Owner must choose to preserve, revise through BA change control, or specify a hybrid before guest schema/behavior implementation.
- OQ-047 separately affects booking/check-in behavior; warning, hard block, configurable policy, exceptions, evidence, expiry and correction/appeal remain undecided.
- NFR-DATA-001 and NFR-AVL-001 are BA assumptions. PostgreSQL, RLS and recovery targets are not approved merely because they are technically discussed or listed in the BA.
- Prisma release/support status and adapters are time-sensitive; recheck official documentation at technical validation and implementation. No package was installed and no benchmark was run.
- Privacy/legal advice, provider/region, operations ownership, retention, RPO/RTO and restore capability remain unknown. No compliance or service-level claim is made.
- Existing repository may contain unrelated prior changes. Git verification must distinguish those from the two files authorized in this work package; no unrelated file should be staged or committed.

## 13. Gate C readiness

The corrected package is ready for Owner review as a decision instrument, with the unresolved decisions visibly labeled. The Owner can answer database engine, guest sharing, authorization baseline, data responsibilities, scope, and the BA recovery assumptions independently. ORM selection needs current technical validation before implementation; privacy/data-subject and breach questions need qualified legal/privacy advice before real PII; production provider/region and recovery feasibility need later operational validation.

**Option A minimum prerequisites:** explicit bounded Owner authorization; OQ-036/engine selection; independent ORM selection plus compatibility/migration validation; approved local/test/CI and synthetic-data boundary; and acceptance criteria limiting the work to technical connectivity, ORM/migration infrastructure, metadata/history, health/readiness, transaction conventions and disposable integration tests. It must exclude business entities, identity/authentication/authorization, property context, guest/PII, and business seeds. The relevant decisions and validation are prerequisites; open business OQs may proceed in parallel only while these exclusions are maintained.

**Conclusion:** Gate C is **not yet authorized for Database Foundation implementation**. The next step is Owner review and independent responses in the approval sheet, followed by the technical validation and a separately approved, bounded implementation work package. No decision or implementation status is changed by this report.
