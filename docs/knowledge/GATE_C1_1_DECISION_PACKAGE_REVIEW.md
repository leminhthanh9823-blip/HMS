# Gate C.1.1 — Owner Decision Package Validation

**Review status: Independent review complete; Owner Decision Package needs targeted corrections before it is used as the final approval record.** No OQ or proposal status is changed by this report. This review does not authorize Database Foundation implementation.

## 1. Executive Summary

`OWNER_DECISION_PACKAGE.md` is a useful, readable decision brief. It consistently labels recommendations as Proposed/Pending Approval, separates the database engine from ORM selection, preserves the confirmed single-owner/multi-property direction, and provides meaningful scope choices. It is **not yet fully decision-ready** because some source conflicts and dependencies are not made sufficiently visible.

Main conclusions:

- **D-01:** PostgreSQL is a defensible preliminary recommendation, but the package should compare the BA's proposed database capabilities explicitly, especially partial/conditional indexes and row-level security (RLS). The BA marks its NFR values as assumptions, not approved requirements.
- **D-02:** The three ORM options are described across broadly comparable criteria and Prisma's SQL escape hatch is acknowledged. The recommendation needs a dated/versioned compatibility basis; current ORM documentation is version-sensitive, especially for Prisma 8, which is currently documented as a release candidate and whose MySQL support differs from PostgreSQL.
- **D-03:** The technical controls are strong and the package does not close OQ-041. It should more visibly reconcile the BA's draft role model (including Owner/system roles) and explicitly ask who may switch property context and how grants are revoked.
- **D-04:** The recommendation to begin with property-owned guest data is privacy-conscious, but it is a deliberate deviation from the BA's current chain-level guest profile, lookup, history and blacklist acceptance scenarios. The package mentions the unresolved assumption but does not explain the resulting BA change or acceptance-criteria conflict clearly enough for approval.
- **D-05:** The questions cover purpose, access, retention, legal hold, deletion/anonymization, export and incident handling. Explicit data-subject access/correction and breach-response responsibility should be added to the owner/legal decision checklist.
- **D-06:** Option A is separable from identity and business-slice work, and can avoid OQ-034/OQ-041/OQ-019/OQ-033 if it contains no business schema or real personal data. It still requires explicit authorization, an approved engine, ORM/tooling choice and technical validation.
- **D-07:** The package correctly does not invent RPO/RTO or backup frequency, but omits the BA's proposed `[A]` starting targets (99.5% monthly availability, RPO ≤15 minutes, RTO ≤4 hours, quarterly restore tests). These must be shown as unapproved context for the Owner, not silently discarded or treated as commitments.
- **D-08:** Environment boundaries and real-engine database testing are useful. Test types and post-deployment/production validation are not separated explicitly enough.
- **OQ matrix:** OQ-047 is absent as a row, even though blacklist warning-versus-block behavior is an independent decision and is referenced elsewhere in the package.

**Readiness:** Gate C.1 is suitable as a draft discussion package, but correct the High findings below before requesting approval. Gate C is **not ready** to enter Database Foundation Implementation: no engine/ORM/scope authorization has been approved, and current Owner Decision Package status is pending.

## 2. Review Methodology

1. Read the repository instructions and the specified Gate C.1 package first, followed by the Gate C.0 audit, decision/open-question registers, architecture, business overview/rules, requirement index and relevant module summaries.
2. Checked the exact current OQ entries and their temporary ASM status; treated BA `[C]`/`[A]`/`[Q]` labels as BA source classifications, not proof of Project Owner approval.
3. Used text extraction on the four BA PDFs for the pages relevant to database, privacy, authorization, guest and blacklist decisions. Text extraction was successful for the cited pages. The BA PDFs were not reviewed page-by-page for unrelated modules.
4. Extracted all pages of the three proposal PDFs. Their recommendations remain advisory; statements such as “chính thức lựa chọn” in a document titled as a proposal are not approval evidence.
5. Checked current official database/ORM documentation for claims that depend on engine/version behavior. No benchmark, package installation or repository implementation was performed.
6. Findings are limited to the decision package and its traceability. Proposed corrections below are not applied.

## 3. Source Documents Reviewed

### Repository and Knowledge Base

- `AGENTS.md`; `docs/knowledge/PROJECT_INDEX.md`.
- `OWNER_DECISION_PACKAGE.md`; `GATE_C0_READINESS_AUDIT.md`.
- `DECISIONS.md`; `OPEN_QUESTIONS.md`; `ARCHITECTURE.md`.
- `BUSINESS_OVERVIEW.md`; `BUSINESS_RULES.md`; `REQUIREMENTS_INDEX.md`.
- `TECHNOLOGY_DECISION_PROPOSAL.md`; `PHASE_0_IMPLEMENTATION_PLAN.md`.
- Relevant module documents: `MODULES/GST.md`, `RBAC.md`, `EMP.md`, `AUD.md`, `PROP.md`, plus module references from the index.

### Original PDFs

Text extraction succeeded for all seven source PDFs. Targeted BA review pages included:

- `HMS_Tai-lieu-BA_Phan-1_v0.2.pdf`: pp.9, 22–23, 34–35.
- `HMS_Tai-lieu-BA_Phan-2_v0.1.pdf`: pp.16–17, 22–23, 27–30, 41–42.
- `HMS_Tai-lieu-BA_Phan-3_v0.1.pdf`: pp.19–23, 39–40.
- `HMS_Tai-lieu-BA_Phan-4_v0.1.pdf`: pp.1–9, 10–11, 22–23, 36–37.
- `hms-de-xuat-cong-nghe.pdf`: all 4 pages.
- `hms-de-xuat-trien-khai.pdf`: all 5 pages.
- `hms-de-xuat-giao-dien-v2.pdf`: all 3 pages.

This is a targeted decision audit, not a full BA baseline revalidation. No PDF page or metadata was changed.

## 4. BA Consistency Review

The package correctly preserves the confirmed owner direction: **single-owner; multiple properties from the first release; not SaaS for unrelated owners; 2–5 properties in months 1–12 and 6–10 in months 12–24; initial room count unknown.** These are not translated into capacity or infrastructure commitments. (Package §3; `DECISIONS.md`; `OPEN_QUESTIONS.md` OQ-032 and OQ-031.)

The package generally handles BA source labels responsibly. It does not treat OQ temporary answers as approval, and it correctly keeps PostgreSQL, ORM, role policy, guest sharing and retention pending. However, it should distinguish three kinds of evidence more visibly within each decision: (1) BA functional requirement/acceptance scenario, (2) BA assumption/open question, and (3) Owner-confirmed business direction. The main material gap is D-04: the package compares sharing models but does not explain how its property-owned recommendation changes the extant chain-level BA behavior.

## 5. D-01 Database Review

**Assessment: direction is reasonable; comparison needs a clearer requirement-to-engine trace.**

The package correctly says both PostgreSQL and MySQL are viable relational engines; it covers transactions, isolation/locking, constraints, indexes, JSON, reporting, concurrency, backup/restore, ecosystem, maintainability and property-scoped integrity. It also correctly says concurrency safety must come from constraints and deliberate transaction/locking/retry design, not from ORM choice alone.

The main missing comparison is against BA `NFR-DATA-001`: the draft BA says the database should support conditional unique constraints, CHECK constraints, row locks and RLS, and names PostgreSQL as a proposal (`BA Part 1 p.9`; `OPEN_QUESTIONS.md` OQ-036). PostgreSQL provides partial indexes and RLS; MySQL/InnoDB has different mechanisms and does not provide PostgreSQL-style table row security policies. Since the BA NFR is `[A]`, the package must ask whether RLS is an actual requirement or whether application-level property scoping plus another defense is acceptable. It should not imply that the BA has mandated PostgreSQL or that MySQL cannot satisfy the business isolation goal.

The 2–5 / 6–10 property counts are insufficient to choose capacity or engine. The package appropriately avoids making that inference. Version, hosting/provider, region/data residency, and recovery are separated as subdecisions; keep that separation and distinguish Owner choices (budget, provider, region, recovery objectives) from technical version/lifecycle validation.

Official validation references: [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html), [PostgreSQL row security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html), [PostgreSQL JSON types](https://www.postgresql.org/docs/current/datatype-json.html), [MySQL InnoDB isolation](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html), [MySQL index features](https://dev.mysql.com/doc/refman/8.4/en/create-index.html).

## 6. D-02 ORM Review

**Assessment: broad, balanced comparison; recommendation needs explicit version boundary and evidence.**

The package covers Nest integration, types, migrations, transaction context, complex SQL/reporting, relationships, testing/mocking, maintainability, ecosystem, raw SQL and coupling. It accurately warns that mocks do not prove relational behavior, that transaction-scoped contexts must be used consistently, and that migration rollback cannot reverse every destructive data change. Prisma raw SQL/TypedSQL is recognized, so complex reporting is not incorrectly presented as impossible.

The comparison still needs a current version baseline. Official Prisma documentation currently identifies Prisma ORM 8 as a release candidate; PostgreSQL support and MySQL availability differ, with MySQL described as later/early-preview in current documentation. The package's generic “Prisma candidate” recommendation could therefore mean different capabilities depending on whether it means Prisma 7 or 8. Before approval, require a small, explicitly bounded technical validation against the selected database and candidate version: Nest provider lifecycle, composite FK/check/partial index migrations, transaction isolation/retry behavior, representative CTE/reporting SQL, TypedSQL/raw SQL, and clean-install/build path. Do not use latest docs as an implicit version approval.

The recommendation to keep generated ORM types inside persistence adapters is sound. Long-term coupling should also include ownership of custom SQL files, generated code policy, migration history portability, and replacement cost. The decision package says these points broadly but could state that SQL escape hatches reduce API limitations while increasing database-specific coupling.

Official references: [Prisma ORM status](https://www.prisma.io/docs/orm), [Prisma NestJS integration](https://www.prisma.io/docs/guides/frameworks/nestjs), [Prisma raw SQL](https://www.prisma.io/docs/orm/reference/raw-queries), [Prisma transactions](https://www.prisma.io/docs/orm/fundamentals/transactions), [TypeORM transactions](https://typeorm.io/docs/transactions/), [TypeORM migrations](https://typeorm.io/docs/migrations/setup/), [Drizzle transactions](https://orm.drizzle.team/docs/transactions), [Drizzle migrations](https://orm.drizzle.team/docs/migrations).

## 7. D-03 Authorization Review

**Assessment: strong security model; Owner policy and BA draft baseline need explicit reconciliation.**

The package correctly explains identity versus membership versus role/permission versus active context. It correctly treats the client property ID as untrusted, calls for server-side authorization on every request, scoped resource lookup (IDOR defense), immutable job scope, property-aware cache/export/notification, audit context and explicit authorization for consolidated reads. It separates read-only rollups from operational writes.

The BA draft already gives a candidate model: `R-OWN` manages all, `R-ADM`/`R-OWN` are chain-level, roles are assigned by `(user, property)`, and effective permissions are aggregated from property roles plus chain-level roles (`BA Part 2 pp.16–17`, FR-RBAC-002/003). FR-EMP-009 says a single account may work at multiple properties with different roles; OQ-041's temporary “yes” still is not approval (`BA Part 2 pp.23, 41`). The package should call this an existing BA baseline/temporary proposal and ask the Owner to confirm or revise it, rather than making the “Owner always global or restricted” question appear to have no existing source position.

Concrete scenarios for the Owner should include: an employee is FD at A and HK at B; an employee loses membership at B while a queued export is pending; an Owner views a combined occupancy report for A+B but attempts a write with no property; and a Manager guesses a booking ID belonging to another property. The package contains the controls, but adding these scenarios would make the policy decision easier to validate.

The approval sheet should explicitly ask who can switch active property, whether switching requires an active membership only or additional policy, and how revoke/session/cache/job handling behaves. Current package describes server validation, but does not separately ask for Owner confirmation of the switching and revocation policy. Do not close OQ-041.

## 8. D-04 Guest & Blacklist Review

**Assessment: options are useful; source conflict is material and the recommended default needs to be presented as a BA change proposal.**

OQ-034 itself asks chain-wide versus property-specific guest/blacklist and who can add/remove; its temporary ASM is chain-wide/Manager with reason, not approval (`BA Part 1 p.35`). OQ-047 separately asks hard block versus warning; the temporary source answer is warning with Manager approval (`BA Part 3 p.40`). The package preserves both OQs and does not infer permission to share personal data from single ownership.

However, the BA GST module goes beyond that temporary row: it explicitly specifies a chain-level guest profile, chain-wide phone/email/identity lookup, cross-property stay-count lookup without exposing detailed bookings, a chain-level blacklist and cross-property warning workflow (FR-GST-001/003/007; UC-GST-001/002; AC-GST-001-01 and AC-GST-003-01; `BA Part 3 pp.19–22`). D-04's recommendation to start with property-owned profile/contact/history/documents and no chain-wide search is therefore not merely a neutral interim schema. It would revise or defer material Phase 1 BA requirements and tests.

The report should state this conflict plainly and ask whether Owner wants to **retain the BA chain-level behavior with stronger field/property permissions**, **replace it with property isolation**, or **adopt a separately specified hybrid**. Identity linkage does not imply shared profile, ID documents, notes, booking history or blacklist evidence; the package correctly distinguishes data classes. Blacklist reason/evidence, warning/block, add/view/remove authority, expiry, review, appeal/correction, legal hold and audit are covered well, subject to OQ-019/legal advice.

## 9. D-05 Privacy Review

**Assessment: appropriate owner/legal boundary; add explicit data-subject access/correction and breach accountability questions.**

The package appropriately covers purpose, minimum collection, masked/full view, exports, sharing, retention, deletion/anonymization, backup lifecycle, legal hold, audit and incident handling. It does not assert compliance with law. That aligns with OQ-019 and OQ-045 (`BA Part 1 pp.22–23; BA Part 2 p.42`; BR-062/066/067; FR-GST-009/010 and FR-AUD-009).

Add explicit questions for data-subject access and correction (not only deletion/export), who is accountable for triage/notification/escalation after a breach, and how legal holds or statutory records override routine anonymization. These require Owner and qualified legal counsel; technical design then maps approved policy to database, document store, logs, exports and backup expiry. No legal interpretation should be added by the technical reviewer.

## 10. D-06 Scope Review

**Assessment: options are bounded and correctly separate technical, identity and business work.**

Option A does not need OQ-034, OQ-041, OQ-019, OQ-033, OQ-037 or any business schema if it remains limited to a selected engine connection, ORM/migration infrastructure, health/readiness, transaction conventions and disposable synthetic-only test infrastructure. OQ-036 and D-01 are still needed to select the engine; D-02 and D-08 require an approved bounded technical plan. Explicit Owner authorization for the work package is required independently of technology approval.

Option B depends on identity/session and authorization policies; it cannot use Option A as authority to settle OQ-041 or MFA/session questions. Option C additionally depends on approved product scope OQ-033 and slice-specific BA acceptance criteria/OQs. The package correctly avoids including all 19 modules.

The smallest useful scope is an **Option A technical-only foundation**, no HMS domain tables, no real PII, no authentication/authorization, no module seeds; however, it is only ready after D-01 engine approval, D-02 tool selection/technical validation, D-08 test environment boundary and explicit scope authorization. “No schema” should be clarified as no *business* schema: migration infrastructure may need a metadata table or a disposable demonstration migration, and the owner package should state whether such technical metadata is permitted.

## 11. D-07 Migration & Recovery Review

**Assessment: sound principles and no invented SLA; missing BA's unapproved recovery targets as decision context.**

Forward corrective migration as the normal production strategy is reasonable; the package correctly distinguishes schema rollback from data recovery and calls for review, rehearsal, backup/restore and accountable operations. It does not set backup frequency, RPO/RTO or SLA without owner evidence.

`BA Part 1 p.9` includes proposed NFR-AVL-001 values: 99.5% monthly availability, RPO ≤15 minutes, RTO ≤4 hours, encrypted/isolated/immutable backups and quarterly restore testing. The BA marks all NFRs `[A]` and says concrete values need Owner and Dev Lead approval. D-07 should present these exact values as **unapproved BA starting assumptions** beside “set/replace/defer,” with no claim they are an SLA. The same page's restore-test cadence should be included as a candidate question. Production data protection, restore owner and incident recovery are otherwise covered.

## 12. D-08 Environment & Testing Review

**Assessment: good environment coverage; separate test layers and production validation.**

Local, isolated automated test, CI, staging and production are distinguished, with synthetic-only data and real selected-engine tests. The package correctly cautions that SQLite/mocks cannot establish PostgreSQL constraint, transaction or locking behavior. Migration-from-empty/upgrade, rollback, constraints, transaction, concurrency, property isolation and restore are covered.

Make the test taxonomy explicit: unit tests for pure domain logic with fakes/mocks; integration tests against the actual selected engine for SQL, migrations, FKs/uniqueness/locking/transactions; CI as an execution environment rather than a test type; staging migration/rehearsal and post-deploy smoke/readiness/observability checks as release validation; and production backup/restore drills as a controlled operational exercise. No real guest PII in local/test/CI; any anonymized dataset needs explicit approval and a verified anonymization process. The package currently says “approved anonymized” but does not assign that approval/validation owner.

## 13. OQ Dependency Review

Descriptions below were checked against `OPEN_QUESTIONS.md` and cited source pages. The package does not change any OQ status.

| OQ | Current content verified | Actual impact on Option A | Impact on B/C or production | Package assessment |
|---|---|---|---|---|
| OQ-031 | Room count, pilot, budget, deadline/team/operations; 2–5 and 6–10 property inputs confirmed, room count unknown (`OPEN_QUESTIONS.md`; BA Part 1 p.34 + Owner input) | Does not block a specifically authorized local technical foundation; may block funded scheduling, provider spend or operational staffing. | Blocks production sizing/spend/support commitments, not conceptual design. | Broadly accurate. Distinguish resource authorization from technical dependency. |
| OQ-033 | Owner approval of release in/out scope, BA Part 1 §3.2 temporary (`BA Part 1 pp.8,35`) | Does not block no-business-schema Option A. | Blocks Option C and release-specific business schema/module work. | Accurate. |
| OQ-034 | Guest/blacklist cross-property scope and authorities; ASM chain-wide/Manager is temporary (`BA Part 1 p.35`) | Does not block Option A without guest tables/data. | Blocks guest linkage, shared profile/history, blacklist and GST behavior; current GST BA chain-level requirements must be accepted/revised. | Content broadly right, but underplays the source conflict (Finding C1.1-01). |
| OQ-036 | Primary database selection; PostgreSQL remains proposal (`BA Part 1 p.35`, technology proposal pp.1–3) | Blocks selecting/implementing the HMS database foundation. A disposable comparison is a separate authorized spike. | Blocks database schema/migrations and engine-dependent acceptance. | Accurate. |
| OQ-037 | Each property's legal form/revenue/e-invoice obligation (`BA Part 1 p.35`) | Does not block technical-only Option A with no Property business fields. | Blocks legal property, tax and invoice design/slice. | Accurate. |
| OQ-041 | Whether one employee works at multiple properties with different roles; temporary yes/account/context (`BA Part 2 p.41`) | Does not block Option A. | Blocks final membership/role schema and cross-property authorization in Option B; related OQ-040/042/043/044/045 remain dependencies. | Accurate. |
| OQ-019 | Legal basis, retention, deletion and incident handling (`BA Part 1 p.34`; BR-062/067) | Does not block synthetic-only technical Option A. | Blocks real PII/documents, retention/deletion lifecycle, production exports and PII handling. | Mostly accurate; extend explicit rights/breach responsibility (Finding C1.1-05). |
| OQ-045 | Who may see full guest identity documents; BA temporary roles are not approved (`BA Part 2 p.42`) | Does not block Option A without documents. | Blocks document-view authorization and real document flows, not unrelated identity-free database infrastructure. | Accurate. |
| OQ-047 | Blacklist hard block or warning; temporary warning + Manager approval (`BA Part 3 p.40`) | Does not block Option A without guest/blacklist schema or behavior. | Blocks guest admission/booking/check-in behavior and associated acceptance tests. | **Missing matrix row.** It is cited under D-04 but should be independent (Finding C1.1-02). |

Thus **no business/privacy OQ among this set blocks Option A solely on technical grounds**. OQ-036 does block selecting the production-intended engine, and OQ-031 can block resourced/provisioned work. Option A still needs explicit authorization and D-01/D-02/D-08 technical decisions. OQ-034/041/047/OQ-019/OQ-045 block only the named domain scope; they do not need to be closed for an empty technical foundation.

## 14. Cross-document Conflicts

1. **Guest data scope:** D-04 recommends a property-owned interim model, while BA Part 3 GST explicitly describes chain-level identity, search/history and blacklist behavior (pp.19–22). OQ-034 remains open, so neither side should silently prevail. Owner must decide whether this is a BA change or a permission design preserving chain-wide behavior. (High; C1.1-01.)
2. **Blacklist policy:** D-04 references OQ-047 but the dependency matrix omits it. OQ-047 changes admission behavior independently of profile sharing. (High; C1.1-02.)
3. **Database capability baseline:** D-01 discusses PostgreSQL features but does not explicitly reconcile MySQL to BA NFR-DATA-001's proposed RLS/conditional uniqueness capabilities (BA Part 1 p.9). The BA NFR is `[A]`, not an approved engine requirement. (High; C1.1-03.)
4. **Owner role baseline:** BA Part 2 p.16 gives R-OWN chain-wide administrative role and property-role grants. D-03 leaves Owner reach as a fresh question but does not present the BA draft position for explicit confirm/revise. (Medium; C1.1-04.)
5. **Recovery assumptions:** D-07 asks for objectives but does not surface BA's `[A]` NFR-AVL-001 values and quarterly restore test (BA Part 1 p.9). (Medium; C1.1-06.)

No mismatch was found between the confirmed owner sizing/business direction and the package. No unapproved PostgreSQL/ORM proposal was represented as Approved.

## 15. Missing Decisions

### Owner / joint business-legal decisions

- Approve or revise the BA's chain-level guest lookup/history/blacklist requirements; decide which data classes may cross property boundaries and for what purpose (OQ-034).
- Decide blacklist scope, authority and warning/block behavior (OQ-034/OQ-047), including review/expiry/correction/appeal.
- Confirm employee membership and per-property role cardinality; Owner/system-level grants; property context switching and revocation semantics (OQ-041 plus OQ-040/042/043/044 as applicable).
- Set privacy purpose, data-subject rights, retention/deletion/legal hold, full-document visibility and breach response ownership with legal counsel (OQ-019/OQ-045).
- Decide whether to accept/replace BA's proposed availability/recovery targets (NFR-AVL-001); set actual RPO/RTO and operational ownership before production (D-07/OQ-031).
- Authorize Option A/B/C separately; approval of the technology does not authorize implementation scope.

### Technical lead validation

- Verify chosen engine/version lifecycle and provider-specific feature/backup behavior.
- Spike ORM/version compatibility, migrations/custom SQL, constraints/composite FKs, transactions, reporting and integration test behavior.
- Define CI/staging data controls, test isolation, migration release procedure and production validation evidence.

## 16. Findings by Severity

| Finding ID | Severity | File / location | Current content | Problem and evidence | Proposed correction | Owner decision needed? |
|---|---|---|---|---|---|---|
| C1.1-01 | **High** | `OWNER_DECISION_PACKAGE.md` §D-04, pp.19–22 of PDF sources not cited there | Recommends property-owned guest profile/history/contact/documents as the starting approach; BA chain-wide assumption is described as temporary. | BA GST also has explicit chain-level FRs/acceptance scenarios: FR-GST-001/003/007; UC-GST-001/002; AC-GST-001-01 and AC-GST-003-01 (BA Part 3 pp.19–22). The recommendation would materially revise/defer these Phase 1 outcomes; a one-line ASM caveat does not communicate that impact. | Add a “BA baseline and impact” box with exact FR/AC citations and alternatives: retain chain behavior with controlled permissions, revise to property-isolated, or approve specified hybrid; state schema/test/data-migration consequences. Keep Proposed/Pending. | **Yes**, OQ-034 and privacy basis. |
| C1.1-02 | **High** | `OWNER_DECISION_PACKAGE.md` §6 OQ Dependency Matrix; §D-04 | Matrix lists OQ-034 but no OQ-047. | OQ-047 is an independent hard-block-versus-warning policy question (OPEN_QUESTIONS.md; BA Part 3 p.40). D-04's blacklist authority/scope answer does not decide match behavior; BA FO requires Manager approval on a match (BA Part 4 p.7) while this is still a temporary/open behavior. | Add OQ-047 row, distinguish scope/authority under OQ-034 from match outcome under OQ-047, and map to GST/booking/check-in acceptance tests. | **Yes**, owner/BA policy. |
| C1.1-03 | **High** | `OWNER_DECISION_PACKAGE.md` §D-01 and Decision Matrix | Gives PostgreSQL feature strengths and says MySQL can model same-property integrity; generalizes that both are viable. | Does not explicitly assess MySQL against BA NFR-DATA-001 (partial/conditional uniqueness, CHECK, row locking, RLS) or say whether RLS is desired/optional. PostgreSQL and MySQL differ in implementation capabilities; the NFR itself is `[A]`, not approved. BA Part 1 p.9; MySQL/PostgreSQL official docs above. | Add a capability matrix with native support/workaround and operational effect; separately ask Owner whether RLS is a required defense. Keep application property authorization mandatory whichever engine is chosen. | **Joint:** Owner decides policy requirement; Dev Lead validates capability. |
| C1.1-04 | **Medium** | `OWNER_DECISION_PACKAGE.md` §D-03; BA Part 2 pp.16–17 | Asks whether Owner should be globally unrestricted or restricted; recommends explicit grants. | The BA draft says R-OWN administers all and distinguishes R-ADM chain-level from per-property role assignment (FR-RBAC-002/003). The package does not present this source position as a candidate to confirm/revise; role grant semantics could be misunderstood as decided or absent. | Cite and label the BA role model as draft/unapproved; ask if Owner full access is retained, restricted, or split by duties. Add direct owner question for active-property switching and revocation/session semantics. | **Yes**, but not all belongs to OQ-041; preserve OQ status. |
| C1.1-05 | **Medium** | `OWNER_DECISION_PACKAGE.md` §D-05 and Owner Approval Sheet | Covers legal purpose, access, deletion/anonymization, retention, export, legal holds and incident handling. | No explicit prompt for data-subject access/correction rights or named breach triage/notification/escalation responsibility. BA Part 1 p.34 OQ-019 asks incident handling; BR-067 and FR-GST-010 cover data requests, but the owner sheet is not complete enough to elicit policy. | Add access/correction and breach responsibility/incident escalation questions, with legal counsel as required decision partner. | **Yes**, Owner + qualified legal counsel. |
| C1.1-06 | **Medium** | `OWNER_DECISION_PACKAGE.md` §D-07 / D-07 approval row | Says RPO/RTO, frequency and retention are not set and asks Owner to establish objectives. | It omits the actual BA proposed values: 99.5% monthly availability, RPO ≤15 min, RTO ≤4 h, encrypted isolated immutable backup, quarterly restore test (NFR-AVL-001, BA Part 1 p.9). These are `[A]`, not commitments; hiding them prevents informed accept/replace/defer. | Surface those values with `[A]` and “not approved” status; ask Owner to accept, revise or defer each relevant target; validate provider feasibility later. | **Yes**, Owner for objectives; Technical Lead/provider validation. |
| C1.1-07 | **Medium** | `OWNER_DECISION_PACKAGE.md` §D-08 | Lists environments and DB-engine tests, but not a clear test-layer matrix. | Unit, integration, CI execution, staging migration/release validation and production operational drills are not clearly distinguished. “Approved anonymized data” lacks named approval/validation owner. | Separate test type from environment; assign data approval, add migration rehearsal and post-deployment smoke/health/monitoring evidence, and production restore drill. | Owner for data policy/scope; Technical Lead for validation plan. |
| C1.1-08 | **Medium** | `OWNER_DECISION_PACKAGE.md` §D-02 and §9 technical references | Recommends Prisma without exact version baseline; cites general ORM docs. | Current official Prisma docs identify ORM 8 as a release candidate and distinguish its PostgreSQL support from MySQL availability; capabilities and adapters are version-dependent. A general Prisma recommendation is not yet comparable to fixed-version TypeORM/Drizzle options. | State candidate major/version policy/date; evaluate a supported stable version against the selected engine. Explicitly mark current docs as a moving target and validate Nest integration, migrations, raw SQL and transaction semantics before selecting. | Owner approves ORM after Dev Lead validation; no current approval. |
| C1.1-09 | **Low** | `OWNER_DECISION_PACKAGE.md` §D-06 Option A | Says no “HMS business tables” and includes migration framework. | It does not clarify whether technical migration metadata tables or a disposable throwaway migration are allowed; “no schema” could be read as incompatible with demonstrating migrations. | Define allowed technical metadata/demo objects as ephemeral and non-domain; prohibit durable business entities. | No policy decision beyond Option A scope authorization. |

## 17. Recommended Corrections

Before presenting the package for a formal approval meeting:

1. Resolve High findings C1.1-01 through C1.1-03 in the **package only**, preserving all OQ statuses.
2. Add a BA traceability/status panel per D-01 through D-08 that distinguishes Owner-confirmed facts, BA requirement, BA `[A]`/`[Q]`, proposed direction and technical validation.
3. Add OQ-047 explicitly and state that OQ-034 sharing scope and OQ-047 match behavior are separate decisions.
4. Add NFR-AVL-001 candidate targets and test taxonomy without turning the BA's `[A]` into a commitment.
5. Keep D-01 and D-02 approval independent; specify ORM validation evidence and a versioned candidate baseline.
6. Keep Option A strictly free of business schema, identity, real PII, Redis and module flows; clarify permitted disposable migration metadata.

These are review recommendations only. The package and source registers have not been edited.

## 18. Gate C Readiness Assessment

| Gate item | Status | Reason |
|---|---|---|
| Architecture preparation | **Ready to continue** | Conceptual options can be discussed; no OQ needs closure for analysis. |
| Owner decision package for discussion | **Needs targeted correction** | D-04 BA conflict, missing OQ-047, incomplete D-01 requirement mapping, recovery/test omissions. |
| Owner approval of database engine | **Not ready / Pending** | OQ-036 open; no engine approved. |
| Owner approval of ORM | **Not ready / Pending** | No ORM approved; version/engine validation required. |
| Option A authorization | **Not authorized** | No explicit Owner authorization to implement a bounded foundation. |
| Option B identity/authorization | **Blocked for final policy/schema** | OQ-041 and related auth/session decisions remain open. |
| Option C business slice | **Blocked** | OQ-033, selected slice acceptance criteria and its dependent OQs are unresolved. |
| Production readiness | **Blocked** | Hosting/region, OQ-019 privacy policy, OQ-031 operations, recovery objectives and validation are unresolved. |

## 19. Recommended Owner Decision Sequence

1. **Confirm the intended scope of the package corrections** and review the explicit conflict between the chain-level GST BA and the property-isolated D-04 candidate. Decide whether to retain, revise or hybridize that behavior; keep all other data classes separate.
2. **Answer D-01 independently:** PostgreSQL/MySQL/defer; decide whether BA-proposed RLS is required; leave exact hosting, region and production recovery as separate choices.
3. **Answer D-02 independently after technical validation:** choose ORM only after engine/version compatibility, migration SQL and reporting path have been reviewed.
4. **Authorize Option A (or defer)** as a separate bounded work package; state whether ephemeral technical migration metadata is allowed and exclude business schema/real data.
5. Resolve D-03/OQ-041 and related role/session questions before Option B. Resolve D-04/OQ-034/OQ-047 and D-05/OQ-019/OQ-045 before guest/blacklist/real PII work.
6. Before production, resolve D-07 recovery targets/ownership and D-08 environment, test-data and release-validation responsibilities. Use OQ-031 for budget, pilot, staffing and operational commitments.

The owner may answer decisions independently; no item automatically approves its dependencies or implementation.

## 20. Next Work Package

**Next package:** revise `OWNER_DECISION_PACKAGE.md` in a separately authorized documentation-only task to address C1.1-01 through C1.1-08, especially BA GST scope conflict, OQ-047, D-01 capability comparison, BA recovery assumptions and D-08 test layers. Then collect owner responses and record any confirmed choices through the project decision process.

Only after explicit engine and scope approval should a separate implementation package be proposed for Option A. That package should specify the chosen engine/version, ORM/provider/version, permitted technical metadata, local/test/CI setup, acceptance tests, rollback boundaries and explicit exclusions. Approval of this review or completion of documentation does not authorize implementation.

## 21. Verification and Scope Boundary

- Report links and source references were checked against repository paths and cited OQ/FR/BR IDs.
- PDF text extraction succeeded for the reviewed pages; the report states the pages inspected and does not claim a page-by-page review of every BA requirement.
- `git diff --check`: to be run after report creation.
- Only this review report is within this task's write scope. Existing pre-review workspace edits are treated as pre-existing and are not modified by this report.
- No source code, dependencies, database, schema, migrations or seeds were changed. No OQ or decision status was changed. No files were staged or committed.

## Sources

- Project records: `docs/knowledge/OPEN_QUESTIONS.md` (OQ-019/031/033/034/036/037/041/045/047); `BUSINESS_RULES.md` (BR-060–067); modules GST/RBAC/EMP/AUD/PROP; requirement references FR-GST-001–011, FR-RBAC-001–012, FR-EMP-009 and FR-AUD-001–009.
- BA sources: Part 1 pp.9, 22–23, 34–35; Part 2 pp.16–17, 22–23, 27–30, 41–42; Part 3 pp.19–23, 40; Part 4 pp.1–9, 36–37.
- Technology proposal documents are advisory: `docs/source/hms-de-xuat-cong-nghe.pdf` pp.1–4; `hms-de-xuat-trien-khai.pdf` pp.1–5; `hms-de-xuat-giao-dien-v2.pdf` pp.1–3.
