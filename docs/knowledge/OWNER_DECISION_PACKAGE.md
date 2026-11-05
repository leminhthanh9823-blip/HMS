# Gate C.1 — Owner Decision Package

**Status: Proposed / Pending Owner Approval.** This package supports independent decisions; approval of one row does not approve another. It records recommendations and consequences, not authorization to implement. The previously approved Gate A/B prototype scope does not approve the product database, ORM, production hosting, authentication, or business schema.

Prepared 2026-11-05. Read with [Gate C.0 Readiness Audit](GATE_C0_READINESS_AUDIT.md), [DECISIONS.md](DECISIONS.md), and [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).

## 1. Executive summary

The Owner has confirmed the business direction: one owner, multiple properties from the first release, no SaaS for unrelated owners. Planning inputs are 2–5 properties in the first 12 months and 6–10 in months 12–24; initial room count is unknown. These facts require property-aware design but do not settle staff permissions, guest-data sharing, database choice, or capacity.

**Proposed technical direction:** PostgreSQL with Prisma is a reasonable first candidate for a relational, transaction-heavy HMS, subject to technical validation and separate Owner approval of the database and ORM. This is not approval. Keep the database engine and ORM decisions independent. The key product decisions still needed are property-role rules, guest and blacklist sharing, privacy/retention rules, and the scope of Database Foundation.

Architecture preparation can continue. Database Foundation implementation is **not authorized** by this package. A technical-only compatibility spike can be considered as a separately bounded and explicitly authorized task; it must not create HMS business schema or imply OQ resolution.

## 2. How to use this package

- Choose an option for each decision independently, or defer it. “Approve recommendation” applies only to that decision.
- Recommendations are labeled **Proposed**. Owner choices remain **Pending Owner Approval** until explicitly confirmed.
- A technical choice that depends on another choice remains **Pending Technical Validation** until the Dev Lead verifies versions, drivers, hosting behavior, migrations, and operational fit.
- `OPEN_QUESTIONS.md` is unchanged. An answer from the Owner should be recorded there and then reflected in `DECISIONS.md` and affected KB documents through the project’s normal decision update process.
- Do not infer hosting provider, region, retention period, RPO/RTO, SLA, staff role matrix, or permission to share personal data from this document.

## 3. Confirmed baseline and boundaries

| Item | Status | Meaning |
|---|---|---|
| Single owner; multiple properties from first release; no unrelated-owner SaaS | **Confirmed – Owner** | Business direction only. |
| 2–5 properties in months 1–12; target 6–10 in months 12–24 | **Confirmed – Owner input** | Planning context, not a delivery or capacity commitment. |
| Initial room count | **Open Question** | Unknown; do not infer workload or production capacity. |
| Gate A/B repository, toolchain, and empty application shells | **Confirmed – bounded work authorization** | Records the completed prototype. Does not approve product architecture or technology. |
| PostgreSQL, MySQL, ORM, production provider/region, identity/access policy, guest sharing, retention | **Proposed / Pending Approval or Open Question** | No implementation authorization follows from this package. |

## 4. Decision packages

### D-01 — Primary database engine and deployment boundary

**Current status: Proposed / Pending Owner Approval (OQ-036).** PostgreSQL is the preliminary recommendation, not an approved selection.

| Consideration | PostgreSQL | MySQL (InnoDB) |
|---|---|---|
| Transactions and concurrent writes | Mature MVCC and isolation options; transaction and locking behavior must still be deliberately designed and tested. | Mature ACID transactions, row locks, and four standard isolation levels; default InnoDB isolation is Repeatable Read. Deadlocks/retries still need handling. |
| Constraints and integrity | Strong relational constraints, composite keys, checks, partial/unique indexes, and deferrable constraints suit property-scoped relationships. | Strong constraints with InnoDB, foreign keys and unique indexes; verify exact version/engine support and DDL behavior. |
| Indexing and JSON | Broad index choices and `jsonb`; relational columns/constraints should remain the source of truth for critical fields. | Mature indexing and native JSON; feature behavior and index options differ from PostgreSQL. |
| Reporting and SQL | Powerful SQL features and broad analytical query options; still requires query/index review as reporting grows. | Capable SQL/reporting and broad tooling; portability and feature differences matter if switching later. |
| Data integrity for multi-property HMS | Composite constraints can help ensure child rows refer to the same property as their parent. | Same-property integrity can also be modeled with composite keys/FKs; validate required constraint patterns against selected version and schema tooling. |
| Backup/restore | Self-managed PostgreSQL provides logical and physical/PITR approaches; managed provider controls, retention, cost and restore behavior vary. | Mature logical/physical backup options; provider features, PITR windows and restore process vary. |
| Ecosystem and maintenance | Broad managed-hosting, open-source and SQL ecosystem; requires PostgreSQL operations expertise and chosen-version lifecycle review. | Broad commercial and managed-hosting ecosystem; requires InnoDB-specific operations expertise and chosen-version lifecycle review. |
| Switching cost | High after schema, SQL, indexes, extensions and migrations rely on PostgreSQL features. | High after schema, SQL and migrations rely on MySQL behavior. No ORM removes this cost. |

Both engines are viable relational systems. Concurrency is not automatically safe because an ORM is used: booking/inventory writes need database-enforced uniqueness, an atomic transaction, suitable locking or isolation, idempotency, and defined retry/conflict behavior. PostgreSQL is preferred provisionally because the Gate C.0 analysis found its constraint/index/SQL flexibility a good fit for booking, inventory, payment and property-scoped integrity. MySQL remains reasonable if the Owner has established MySQL operations expertise, provider constraints, or cost/support reasons.

| D-01 subdecision | Proposed direction | What the Owner still decides |
|---|---|---|
| Engine | PostgreSQL | Approve PostgreSQL, choose MySQL, or defer pending a technical spike. |
| Version policy | Select a supported major line with a documented patch/update cadence; exact major/minor must be verified at implementation time. Candidate versions in other proposal documents are time-sensitive. | Approve lifecycle policy or ask Dev Lead to return a version proposal. |
| Local development | A reproducible disposable local database of the selected engine/version; no local production data. Container setup is a later authorized implementation choice. | Confirm whether this workflow is acceptable; exact tooling can be technical. |
| Production hosting/provider | Managed service is a proposed lower-operations option; self-managed is viable only with an accountable operator and recovery capability. | Provider and service model, budget, support, and named operational owner. |
| Region/data residency | No region selected. It depends on legal/privacy, business, provider, latency and backup requirements. | Approve region after OQ-019 and legal review. |
| Backup/recovery | Encrypted backups and verified restore are required design topics, but frequency, retention, RPO and RTO are not set here. | Set business recovery objectives and ownership under D-07. |

**If deferred:** no HMS database technology, schema, migration, or production database should be implemented. A separately authorized, disposable engine comparison may test compatibility only. Selecting an engine later can still affect schema, SQL, hosting and migration assets, so delay increases rework once business schema exists.

**Owner question:** Do you approve PostgreSQL as the primary HMS database engine, prefer MySQL, or want a bounded comparison before deciding? Provider, region, and recovery objectives remain separate decisions.

#### BA capability comparison (NFR-DATA-001)

`NFR-DATA-001` at BA Part 1 p.9 is labeled `[A]`. It proposes conditional uniqueness, CHECK constraints, row locking and RLS, and names PostgreSQL as a proposal. This is not Owner approval or a binding requirement. Property filtering is separately proposed by `NFR-SEC-002`/`BR-060` (BA Part 1 pp.9, 22; `FR-RBAC-003`, BA Part 2 p.16).

| BA Capability | BA Reference | PostgreSQL | MySQL (InnoDB) | Impact | Decision Needed |
|---|---|---|---|---|---|
| Transactions and isolation | NFR-DATA-001 `[A]`; BA Part 1 p.9; BA Part 3 §7 | ACID, MVCC and selectable isolation levels; serializable work may need retries. | ACID, four standard isolation levels, row/gap/next-key locks; deadlocks/retries remain. | Both can implement multi-step operations; constraints, locks/version checks, idempotency and conflict handling remain necessary. | Owner selects engine; Dev Lead validates actual transaction flows. |
| Referential integrity | NFR-DATA-001 `[A]`, `BR-060`; BA Part 1 pp.9, 22 | PK/unique/FK/CHECK, composite and deferrable constraints. | InnoDB PK/unique/FK/CHECK and composite keys; confirm selected major and DDL behavior. | Both can enforce same-property relationships using composite keys where modeled. Constraints do not authorize row access. | Validate approved schema patterns against selected engine/tooling. |
| Ordinary uniqueness | `BR-010–013`, `BR-038`; BA Part 1 pp.16–20 | Unique constraints/indexes, including multicolumn. | Unique constraints/indexes, including multicolumn. | Both can prevent duplicates at database layer. | Dev Lead derives keys from approved business rules. |
| Conditional / partial uniqueness | NFR-DATA-001 `[A]`; inventory BA Part 1 pp.9, 16–17 | Native partial unique index enforces uniqueness only for rows satisfying a predicate. | No PostgreSQL-style partial predicate. A workaround can use a generated/functional key that yields a unique value for included rows and `NULL` for excluded rows, relying on multiple-NULL behavior in unique indexes. Expression restrictions and NULL semantics require validation; this is not a drop-in equivalent. | PostgreSQL expresses conditional uniqueness directly; MySQL patterns need reviewed expressions and real-engine tests. | Confirm whether conditional uniqueness is required as written or equivalent patterns are acceptable. |
| CHECK constraints | NFR-DATA-001 `[A]`; BA Part 1 pp.9, 16–17 | Native CHECK; expression and NULL semantics matter. | Enforced CHECK in supported MySQL versions; validate selected major. | Both handle row-local invariants; cross-row rules need other constraints/transaction logic. | Technical validation of exact version and migration SQL. |
| Indexing | NFR-DATA-001 `[A]`; BA Part 1 pp.9, 16–17 | B-tree, GIN, GiST, BRIN, expression and partial indexes. | B-tree and engine-specific indexes including generated/functional and JSON multi-valued options with limitations. | Both support composite indexes; query plans/write costs need measured workload. Do not index `property_id` mechanically. | Dev Lead proposes from query patterns; no capacity inferred from property count. |
| JSON / semi-structured data | Technology proposal p.3 mentions JSONB snapshots; BA has no general core-data JSON requirement | `json`/`jsonb`; GIN can index JSONB. Keep critical identity, money and ownership relational. | Native JSON plus generated/functional and multi-valued index options with restrictions. | Both support JSON; it is not a demonstrated business requirement for core entities. | Do not select engine based on JSON alone. |
| RLS | NFR-DATA-001 `[A]`; `NFR-SEC-002` `[A]`; `BR-060` `[A]/OQ-034` | Native row security policies. Table owners, superusers and bypass roles can bypass unless controlled. | No PostgreSQL-style native row security policy layer. Alternatives include application authorization, carefully restricted views/procedures, or separate DB identities/data boundaries, each with tradeoffs. | Application authorization and scoped queries are mandatory either way. RLS is optional defense in depth only. | Owner decides whether RLS is a desired control; Security/Dev validates later. Do not enable automatically in Foundation. |
| Concurrency | BA Part 3 §7; `BR-010–013` | MVCC, locks, unique/exclusion constraints and isolation tools. | InnoDB MVCC, row/index/gap locks, constraints and isolation levels. | Neither engine nor ORM removes races; test concurrent inventory, payment, refund and audit writes. | Technical validation per approved slice. |
| Reporting/query capability | BG-05/06, BA Part 1 pp.5–6; RPT assumptions | Rich SQL, CTE/window functions and JSON operators. | Rich SQL, CTE/window functions; syntax and optimizer differ. | Both can serve current reporting needs; no approved workload supports capacity sizing. | Validate representative reports and targets before production sizing. |
| Backup/recovery | NFR-AVL-001 `[A]`, BA Part 1 p.9; OQ-019/OQ-031 | Logical/physical/PITR options depend on major and provider. | Backup/PITR options also depend on major and provider. | Engine capability does not establish RPO/RTO, retention, residency or restore success. | Owner sets objectives/ownership; validate provider recovery later. |

RLS is not an application-authorization replacement. If considered, design only after membership/context and connection pooling are specified; require transaction-local fail-closed context, pool cleanup, restricted runtime DB roles and API/worker tests. Never trust a client `property_id` as authorization. PostgreSQL RLS has owner/superuser/bypass caveats; MySQL must not be described as having equivalent native row policies.

**Subdecision boundary:** Engine is OQ-036 and Pending Owner Approval. Major/version policy needs supported lifecycle validation. RLS is a separate Owner control requirement and later Security/Dev design. Provider/hosting is an Owner choice after budget/operator review. Region/data residency require Owner plus legal/privacy review under OQ-019/OQ-031. No provider, version or region is selected here.

### D-02 — ORM

**Current status: Proposed / Pending Owner Approval; technical validation required.** This decision is independent of D-01. Prisma is a proposed preference, not a prerequisite to PostgreSQL approval.

**Version evidence checked 2026-11-05:** Prisma's official release-status page lists ORM 7 as the generally available supported line and ORM 8 as a release candidate. The official v8 database page lists PostgreSQL as release candidate and MySQL as “coming soon”; Prisma ORM 7 supports PostgreSQL and MySQL. NestJS integration guidance is available for v7 and v8 RC. This package therefore proposes **Prisma ORM 7.x as the candidate major if selected**, with exact patch, adapter/driver and support lifecycle Pending Technical Validation. Recheck before implementation; do not install an unpinned `latest`. Sources: [Prisma release status](https://www.prisma.io/docs/orm/release-status), [supported databases](https://www.prisma.io/docs/orm/supported-databases), [Prisma v7 NestJS guide](https://www.prisma.io/docs/guides/v7/frameworks/nestjs), checked 2026-11-05.

| Criterion | Prisma ORM 7.x candidate | TypeORM (stable line to validate) | Drizzle (stable line to validate) |
|---|---|---|---|
| NestJS integration | Official NestJS guides; provider/client lifecycle, adapter and ESM configuration need repo-baseline validation. | Mature Nest repository/DI patterns; manage migrations explicitly. | Injected provider/factory pattern; project owns lifecycle conventions. |
| Type safety | Generated client from schema gives ergonomic typed CRUD; generated API/schema conventions become part of the codebase. | Typed entities/repositories, with runtime metadata and query typing requiring care. | SQL-oriented inferred types; close to query shape and explicit, with more SQL knowledge needed. |
| Migrations | Versioned, reviewable SQL; advanced indexes/constraints may need custom SQL. | Versioned CLI migrations; inspect output and disable production auto-sync. | SQL-first migrations; generation, transactions and rollback are team-owned. |
| Multi-step transactions | Callback/batch; every query must use transaction client; isolation/retry is version/driver-specific. | Use transaction-provided manager/query runner throughout. | Callback transactions/savepoints; dialect behavior remains database-defined. |
| Complex SQL/reporting | Raw SQL/TypedSQL are available; query plans and result types still need review. | QueryBuilder/raw SQL available; inspect generated SQL and relation-loading effects. | SQL-oriented builder/raw SQL suit joins/CTEs with more SQL responsibility. |
| Relationships and constraints | Relation metadata is not database constraints; composite FK/partial index may need reviewed custom migration SQL. | Rich mappings; verify actual FK/index/cascade migrations. | Explicit schema; relation helper is not a substitute for FKs. |
| Testing | Mocks support unit tests only; selected-engine integration tests required. | DI supports unit tests; DB integration required for metadata/transaction behavior. | Wrapper can be mocked for units; SQL semantics require DB integration. |
| Maintainability/ecosystem | Mature docs/DX; schema, generated client, adapters and migrations create coupling. | Broad ecosystem; decorator/runtime complexity needs conventions. | Smaller high-level ecosystem; less abstraction, more SQL ownership. |
| Raw SQL and portability | Raw SQL is available; provider-specific SQL reduces portability. | Raw SQL is available; portability depends on query and migration choices. | SQL is a core strength; explicit database dependence should be treated as intentional. |

**Recommendation — Proposed:** Prisma ORM 7.x as a productivity-first candidate; exact patch and adapter remain Pending Technical Validation. Complex reporting is possible through raw SQL/TypedSQL; the tradeoff is that SQL-specific work needs review and increases engine coupling. Keep generated types behind persistence ports. TypeORM is reasonable where Nest/TypeORM expertise materially reduces risk; Drizzle fits SQL-first control where team skill outweighs integration/convention ownership. No option is approved.

Before selection, validate Nest provider/connection lifecycle; composite FK, CHECK, conditional unique-index and migration handling; forward correction/rollback; transaction isolation/concurrency/retry; a representative CTE/report with typed API and raw SQL; and clean install/build/typecheck. This is a future bounded technical validation, not authorized here.

No ORM guarantees concurrent correctness or safe rollback. Unique constraints, composite foreign keys, checks, indexes, and migration SQL must be reviewed in the actual database. Migration rollback cannot reliably undo destructive data transformations; prefer forward corrective migrations after production data exists, and rehearse recovery from backup.

**If deferred:** do not add any ORM dependency or schema. Engine selection can be approved independently, but Database Foundation implementation should wait until the Dev Lead validates the ORM, adapter/driver, migration workflow and PostgreSQL test compatibility.

**Owner question:** Approve Prisma as the proposed ORM, request Drizzle or TypeORM, or defer ORM selection for a technical validation? This does not alter D-01.

### D-03 — Multi-property authorization (OQ-041)

**Current status: Open Question / Proposed / Pending Owner Approval.** The BA records a temporary `yes` for different per-property roles and one account with active-property selection (OQ-041, BA Part 2 p.41); the KB correctly keeps this unresolved. This package does not close it.

**Plain-language terms**

- **User identity:** one person’s account/login, independent from any one property.
- **Owner:** the business owner/operator who oversees the single-owner HMS; the account’s exact permission policy still needs confirmation.
- **Employee:** staff identity that may be granted access to one or more properties.
- **Property membership:** an explicit assignment connecting an identity to a property.
- **Role per property:** the job permissions granted to that person at that property; the role may differ by property if approved.
- **Permission:** an allowed action such as viewing a booking or approving a refund.
- **Active property context:** a navigation/request context chosen by the user; it is not proof of permission.
- **Cross-property access:** a separately authorized owner-level read or explicitly scoped operation across properties; it must never arise from an untrusted property ID.
- **Consolidated reporting:** an authorized read that aggregates permitted properties, with property traceability; it does not grant cross-property writes.

| Policy option | Advantages | Costs / risks |
|---|---|---|
| One employee, one property only | Simplest grants and context. | Conflicts with staff rotation/coverage needs; moving staff requires reassignment and may not fit multi-property operations. |
| An employee can join multiple properties with one shared role | Supports coverage with simpler policy than per-property roles. | Least-privilege differences between properties cannot be expressed cleanly. |
| An employee can join multiple properties with a distinct role per property | Supports operational flexibility and least privilege; aligns with a property membership model. | More complex administration, authorization tests, revocation and audit. Recommended candidate. |

**Proposed model:** one user identity; property membership/grant records; role or permission bindings per property; optional system-level role/permission for narrowly global functions; owner-level grants for authorized consolidated reads. Owner access should be explicit and auditable. The Owner must decide whether the Owner account is always global, can be restricted, or has separate accounts/roles for distinct duties. Do not assume Owner writes can omit a property context.

**Threat and implementation consequences:**

- Prevent IDOR by loading target records through both resource ID and server-validated authorized property scope; client-provided `property_id` or hidden UI controls are not authorization.
- Switching active property changes UI context only. The API rechecks membership, permission and resource scope on every request; revoke access promptly when membership changes.
- Background jobs carry actor/system identity, explicit property ID or authorized property set, purpose, correlation/idempotency key and authorization provenance. A missing property scope fails closed.
- Exports and notifications carry property scope and recipient authorization; avoid cross-property file/link reuse.
- Cache keys include property and permission-relevant scope. Permission revocation must invalidate or bypass stale cached authorization/data.
- Audit records include actor, action, target, property or explicit property set, result/time, and reason/approval where the business rule requires it. Do not put secrets or unnecessary guest PII in logs.
- Consolidated reports require an explicit owner/report permission and preserve per-property attribution. They do not authorize an operational write against an arbitrary property.

**Conceptual entity groups:** UserIdentity; OwnerAccount/OwnerGrant; EmployeeProfile; Property; PropertyMembership; RoleDefinition; PermissionDefinition; PropertyRoleGrant (or explicit permission grant); Session; AccessAuditEvent. Exact role cardinalities, Owner policy, MFA/session and approval details remain tied to OQ-041/OQ-040/OQ-042/OQ-043/OQ-044/OQ-045.

#### BA role baseline and scenarios for Owner review

BA Part 2 pp.16–17 gives a draft model: R-OWN administers all; R-ADM assigns roles but has no money permission; roles are assigned by `(user, property)`; effective property permission combines property roles and chain-level roles. `FR-RBAC-002/003` describe role assignment and property filtering. `FR-EMP-009` says one employee account may work at multiple properties with different roles (Part 2 p.23); OQ-041's “yes” and active-property selector remain temporary, not approval (p.41). The Owner can confirm or revise this baseline.

1. Employee A belongs only to Property 1 and requests a Property 2 booking by guessed ID: deny without disclosing the record; audit the denied cross-property attempt.
2. Employee A is FD at Property 1 and HK at Property 2: ask whether both memberships and different roles are allowed; check each action against the selected, server-validated context.
3. Owner requests a report for Properties 1+2: require an authorized explicit property set and trace results to each property; this does not authorize writes across properties.
4. Owner limits an employee to Property 1: changing client `property_id`, URL or export parameters must not grant Property 2 access.
5. A job is queued while an employee has Property 2 access, then the membership is revoked: the worker revalidates authority/state and fails closed rather than using stale access.

The approval sheet should separately confirm who may switch context among assigned properties and how quickly revocation affects open sessions, caches, exports and queued jobs. Owner authority from a system-level role versus explicit grants must be decided, not inferred from the BA role name.

**Recommendation — Proposed:** multi-property membership with a role per property, server-validated active context, explicit Owner-wide read grants, property-bound writes, fail-closed jobs/cache/exports, and audit of sensitive/cross-property access. This fits the confirmed property portfolio without making every employee a global user. It needs Owner confirmation and security/technical review.

**If deferred:** do not finalize membership cardinality, property-role schema, or production authorization. Technical threat modeling with synthetic data may proceed; a final multi-property staff identity implementation is blocked.

**Owner question:** May an employee be assigned to multiple properties and hold different roles at each? Should the Owner have unrestricted all-property access, or should some Owner actions be separately granted/audited? How should authorized consolidated reporting differ from operational writes?

### D-04 — Guest and blacklist sharing (OQ-034)

**Current status: Open Question / Proposed / Pending Owner Approval.** OQ-034 asks whether guest/blacklist is chain-wide or property-specific and who may add/remove; its temporary chain-wide assumption is not approval. OQ-047 separately asks whether blacklist is a hard block or warning. No permission to share personal information between properties is inferred from single ownership.

| Model | Data treatment | Benefits | Risks / costs |
|---|---|---|---|
| 1. Independent guest data per property | Each property creates its own guest identity/profile and history. | Strong default separation and limited cross-property disclosure. | Duplicates, repeated entry, no automatic portfolio-level guest history; deduplication remains local. |
| 2. Shared global guest data | One guest identity/profile/history is available system-wide. | Fewer duplicates and simpler portfolio-wide lookup/reporting. | Broadens personal-data access; merge errors can combine people; requires explicit purpose, consent/legal basis, access and retention rules. |
| 3. Hybrid | A global identity key may link separate property-owned profiles; operational contacts, documents, booking history and notes stay property-scoped unless separately approved. | Supports future deduplication while limiting routine operational data sharing. | Identity matching/linking itself is sensitive; needs robust permissions, merge/unmerge audit and privacy governance. |

**Data classes must be decided separately:**

| Data | Candidate boundary for discussion | Open consequence |
|---|---|---|
| Guest identity/matching key | Property-specific by default, with an optional privacy-reviewed cross-property link in hybrid | Decide matching fields, false-positive handling, merge/unmerge authority and whether a global search is allowed. |
| Profile/contact details | Property-owned under options 1/3; global only if option 2 is deliberately approved | Decide who can view/edit and whether a booking at one property exposes the record elsewhere. |
| Booking/stay history | Owned by the property that created the stay | Cross-property reporting needs an explicit purpose and permission; should not expose operational notes by default. |
| Identity documents | Highly restricted and purpose/retention-bound; avoid global access by default | OQ-045 asks who can see full documents; OQ-019/OQ-045 must be resolved before real documents are stored or exposed. |
| Blacklist decision | Separate record with scope, reason, evidence reference, status, created/expiry/review times and actor/audit | Decide global/property scope, who can create/review/remove, who sees it, warning/block behavior and due process. |

**Blacklist scope choices:** global list; property-specific lists; or two explicitly separate levels (property decision plus a separately authorized system-wide warning/list). A global blacklist can affect admission at another property and therefore requires an explicit scope, qualified authority, reason/evidence handling, review/expiry/retention policy, restricted visibility and an auditable appeal/correction path. A property list reduces disclosure but cannot prevent a risky guest from booking elsewhere. A two-level model adds workflow and governance; do not create it unless the Owner actually needs both scopes.

For every choice, Owner/legal counsel should specify: who may create, review, see, amend, remove or override; which properties are in scope; minimum reason/evidence; expiry and periodic review; retention/deletion; correction/appeal; and immutable audit requirements. Do not store evidence content in general-purpose logs.

**Recommendation — Proposed:** do not select a guest data model until the Owner decides how to handle the existing chain-level BA behavior and field-specific privacy. Option A is the closest to the current BA baseline; Option B has a narrower routine sharing surface but changes/defer BA outcomes; Option C can separate identity linkage from property operations but adds matching, unlinking and migration complexity. No option is selected. Keep blacklist scope and match behavior as separate decisions.

#### BA chain-level behavior and impact of the options

BA Part 3 pp.19–22 explicitly describes chain-level guest behavior: `FR-GST-001` chain profile; `FR-GST-003` chain lookup by phone/email/name/document; `FR-GST-004/005` duplicate detection/merge; `FR-GST-007` chain blacklist; UC-GST-001 finds guests across the chain and shows a limited stay count without another property's booking details; UC-GST-002 raises a chain alert; AC-GST-001-01 and AC-GST-003-01 exercise these cases. `FR-GST-007` is marked `[A] OQ-034/OQ-047`; OQ-034's chain-wide ASM and OQ-047's warning/Manager approval are not approval. Documents/full views are separately limited by `FR-GST-002/006`, BR-063/066 and OQ-045.

Choosing property-isolated records would change or defer these current BA requirements/tests. This package does not alter them; the Owner must select an option and BA change control must then update requirements if needed.

| Guest option | BA compatibility | Business impact | Privacy impact | Data model implications | Operations / migration | Owner decision |
|---|---|---|---|---|---|---|
| **A — Preserve BA chain-level behavior** | Closest to FR-GST-001/003/007 and chain acceptance scenarios (Part 3 pp.19–22). | Enables returning-guest recognition and limited stay count; detailed bookings at other properties remain hidden per BA scenario. | Broadest linkage risk. Define minimum shared fields, role/field access, match errors, export and retention. Chain identity does not authorize sharing every field/document/note/history. | Chain identity/matching key; property-owned booking guest links, detailed stays and operational notes; separately restricted profile/document fields. | Preserves BA scenarios but requires scoped cross-property lookup, merge/unmerge audit, access logs and migration/matching rules. | Which exact fields/purpose are shared and who may search, merge, view, export or correct? |
| **B — Property-isolated guest data** | Material change/limitation to FR-GST-001/003/007 and cross-property scenarios; requires Owner approval and BA change control. | Each property recognizes its own guests; repeats elsewhere may be re-entered; history/reporting stay local. | Smaller routine disclosure surface, but local privacy/access/retention controls still apply. | Property-owned profile, contact/document data and booking links; duplicate/matching rules local. | Simple isolation; duplicates likely. Future linking requires controlled identity resolution, provenance and migration. | Accept changed recognition/history behavior and revised BA scope? |
| **C — Hybrid identity, property-owned operations** | Partial/conditional compatibility; limited chain-level matching may remain, but BA acceptance criteria must define sharing. | Supports controlled recognition while keeping operational records distinct. | A global identity link is itself sensitive. Search, link existence, false-positive handling and unlinking need permission/audit. | Global identity/link; property profiles, contact details, documents, bookings, history and notes stay property-scoped unless separately approved. | Most flexible and complex: merge/unmerge, conflict resolution, provenance, deletion across links and migration. | Is linking itself allowed? Which fields/purpose and who can see/correct/unlink a match? |

For all options, decide identity key, profile, contact information, documents, booking history, notes and reports/exports separately. Global identity does not mean global access to every guest attribute.

#### Blacklist is independent of guest sharing

OQ-034 covers sharing scope and add/remove authority; OQ-047 separately covers match behavior. BA Part 3 pp.20–22 presents chain-wide warning behavior as `[A]/[Q]`; BA Part 4 p.7 requires Manager approval for the check-in exception. Neither is approved.

| Behavior option | Match behavior | Risks / controls requiring decision |
|---|---|---|
| Warning only | Authorized staff see limited warning; proceed without distinct approval. | Lower disruption; may change temporary BA Manager-approval flow. Limit reason/evidence visibility and audit access/actions. |
| Hard block | Booking/check-in cannot proceed while match is active. | Strongest restriction; highest false-positive/fairness impact. Define correction/appeal and emergency handling. |
| Configurable per property | Each property uses warning or block from an approved policy set. | Could create inconsistent treatment; do not assume OQ-047 permits it. Needs governance/Owner approval. |

Separately decide who may create, edit, review, deactivate/remove, view reasons/evidence or override; scope; objective reason/evidence; expiry/review; audit actor/property/reason; false-positive correction/appeal/legal hold. Do not choose warning, block or per-property configuration here.

**Decision posture — Pending Owner Approval:** Option A is closest to current BA; Option B requires explicit BA change control; Option C requires field-level sharing rules. No option is selected. OQ-034 and OQ-047 remain open and independent.

**If deferred:** no shared guest identity, chain-wide guest search, blacklist propagation, or real guest PII implementation. A future business slice can use synthetic fixtures while requirements are clarified.

**Owner questions:** Which guest data may be shared between properties, for what purpose and who can see it? Is cross-property identity matching allowed? Should blacklist be property-specific, system-wide or two-tier? Who may add/review/remove it, what evidence and expiry are required, and may it warn or block? What correction/appeal process is required?

### D-05 — Privacy, retention and sensitive-data access

**Current status: Open Question / Pending Owner + legal counsel.** OQ-019 covers legal basis, retention, deletion and incident handling. OQ-045 asks who may view a full guest identity document; its BA temporary role list is not approval. OQ-034 controls cross-property data sharing. This package does not state legal policy.

Before storing real guest personal data or documents, decide by data class and purpose:

1. Who may view masked versus full identity/contact/document data, and who may export it?
2. Whether data is shared between properties, including matching, booking history, notes and blacklist evidence.
3. The business/legal purpose and approved collection scope for each data class.
4. Retention period, legal holds, deletion/anonymization behavior, and how deleted data expires from backups.
5. Audit of access, exports, unmasking, correction and deletion, including who can review audit records.
6. Data processor, storage region, encryption/key responsibility, incident handling and data-subject request ownership.

**Proposed control shape:** data minimization; separate permission for masked/full views and exports; log sensitive access without copying the sensitive value; property scope by default; retention and deletion rules per data class; private encrypted object storage only if documents are required; and a reviewed process for backups/legal hold. Confirm with qualified legal counsel. Do not treat these controls as a substitute for owner/legal decisions.

**If deferred:** real guest data, identity documents, production exports, final retention automation and claims of legal compliance remain blocked. Synthetic tests and conceptual design may proceed.

**Owner questions:** Can legal counsel and the Owner approve a data-purpose/retention/access matrix before real PII work? Who may see full identity documents, and under what audited purpose? Are cross-property guest visibility or exports permitted?

#### Decision and responsibility questions (OQ-019 / OQ-045 remain open)

| Responsibility | Candidate accountability to confirm | Questions for Owner/legal |
|---|---|---|
| Owner/business | Set business purposes, approved sharing and accountable operational roles. | Who approves collection purpose, cross-property sharing, exceptions/exports and incident decisions? Who owns guest requests? |
| Property operations | Staff view/edit guest data only within approved scope. | Who may see/search/edit each field at each property? Can a property see a shared identity or another property's history? |
| Technical administrator | Operate access controls, keys, DB/object storage, backups and secure deletion; technical access does not imply business permission to inspect guest records. | Who can administer database/storage/keys? Is break-glass access allowed, with what approval and audit review? |
| Legal/privacy advisor | Advise on applicable law, data-subject rights, retention, legal hold and incident duties; advice does not replace Owner accountability. | Which qualified counsel/advisor reviews purpose, processors, region and response procedures? |

Before real personal data work, explicitly decide: who can view and edit guest profiles; who can view full identity documents; who can download/export guest data; who may request access, correction, export or deletion and who verifies/approves; who may approve sharing across properties; who owns incident triage, containment, investigation, legal escalation and any required report/notification; who is the backup decision maker; and who reviews access/edit/export/delete audit events. Define no retention duration here; ASM-019's five years remains unapproved. Legal holds/statutory records versus anonymization require Owner and legal advice.

### D-06 — Database Foundation implementation scope

**Current status: Proposed / Pending Owner Approval.** The three options are separate work packages. None authorizes all 19 modules.

| Option | Included | Explicitly excluded | Dependencies and risk | Relative effort |
|---|---|---|---|---|
| A. Technical Database Foundation | Selected engine/driver connection; ORM/provider wiring; versioned migration framework; migration metadata/history table used only by tooling; disposable technical migration for validation if authorized; DB health/readiness; transaction conventions; integration-test harness; synthetic fixtures; local/test DB if approved. | **No HMS business schema/entity:** no User, Employee, Property, Membership, Role, Permission, Guest, Booking, Room, Invoice or other domain table. No authentication, authorization, identity, property context, real PII/documents, business seed, Redis, module workflow or vertical slice. Technical migration metadata is not business schema. | Requires OQ-036/engine, D-02 ORM/tooling technical validation, D-08 test/data boundary and explicit Owner authorization. OQ-019/033/034/037/041/045/047 can remain open if exclusions hold. | Low–medium (planning estimate; validate exact authorized scope). |
| B. Technical Foundation + Identity | Option A plus user identity/session, property membership, authorization foundation and negative property-isolation tests. | No general business modules, booking, guest PII, documents or production-ready access policy unless separately specified. | Requires D-03/OQ-041 and relevant identity/MFA/session decisions; privacy and security review. Risk: premature policy/schema locks unresolved access rules. | Medium–high. |
| C. Foundation + first business slice | Option B plus one Owner-selected, fully specified vertical slice with BA traceability and acceptance criteria. | All other modules and unsupported requirements. No automatic approval of the 19-module list. | Requires OQ-033 approved scope, slice-specific OQs and acceptance criteria, plus D-01–05 as applicable. Risk: dependencies reveal broader scope; scope must be bounded explicitly. | High; depends on selected slice. |

**Recommendation — Proposed:** decide engine/ORM first, then authorize Option A as its own bounded task. Treat Option B as a later gate after identity/access decisions. Treat Option C as a separate module authorization after scope and BA acceptance criteria. The Owner may choose another sequence.

**Option A OQ boundary:** OQ-036 blocks selection of the production-intended engine; D-02 technical choice and D-08 test boundary, plus explicit Owner scope authorization, are required. OQ-031 may block funded schedule/provider operations, but does not inherently block an explicitly authorized disposable local technical foundation. OQ-019, OQ-033, OQ-034, OQ-037, OQ-041, OQ-045 and OQ-047 do not block a foundation with no PII, identity, property/business entity, invoice/tax model or blacklist behavior. Option A does not imply B/C.

**If deferred:** no database foundation work begins. If Option A is selected while OQ-033 is open, it must remain genuinely technical and contain no business schema. Option B is not a shortcut around OQ-041. Option C is blocked until scope and the chosen slice are approved.

**Owner question:** Which work package do you authorize next: A, B, C, or none yet? This choice does not itself approve the technology or resolve dependent OQs.

### D-07 — Migration, backup and recovery

**Current status: Proposed / Pending Owner decisions for business objectives; technical proposal can follow later.** No RPO/RTO, service level, backup interval, retention or production owner is asserted here.

#### BA starting proposals — `[A]`, not approved targets

| BA Proposal | Source | Status | Operational Impact | Owner Confirmation |
|---|---|---|---|---|
| Availability 99.5% per month | NFR-AVL-001, BA Part 1 p.9 | BA Assumption `[A]`; not an SLA | Influences hosting redundancy, maintenance windows, monitoring and operations staffing/cost. | Accept as planning target, revise or defer? |
| RPO ≤15 minutes | NFR-AVL-001, BA Part 1 p.9 | BA Assumption `[A]`; not approved | Drives backup/WAL or binlog shipping/replication and restore-point design; provider capability must be validated. | Accept, revise or defer? |
| RTO ≤4 hours | NFR-AVL-001, BA Part 1 p.9 | BA Assumption `[A]`; not approved | Requires restore procedure, operator availability, provider support and evidence from drills. | Accept, revise or defer? |
| Encrypted, separated, immutable backups | NFR-AVL-001, BA Part 1 p.9 | BA Assumption `[A]`; not an approved control specification | Requires key ownership, separate access, retention/deletion and provider capability review. | Confirm the control objective; technical design later. |
| Restore test quarterly | NFR-AVL-001, BA Part 1 p.9 | BA Assumption `[A]`; cadence not approved | Requires named operator, isolated target, integrity checks, evidence/runbook and remediation. | Accept cadence, revise or defer? Who owns evidence? |

The BA page says the NFR targets need Owner and Dev Lead approval. They are displayed here as decision context only, not an SLA or commitment. Do not infer backup frequency or retention duration from these targets.

**Migration policy proposal:** version every schema change in Git; require peer review of generated and handwritten SQL; apply production migrations as a controlled release step; validate preconditions and postconditions; separate schema expansion from destructive cleanup when data exists; and record the deployed migration version. Prefer forward corrective migrations for production. A rollback script may be useful for reversible schema-only changes but cannot restore deleted/transformed data or safely reverse every DDL operation. Test rollback/recovery only against disposable copies; production recovery relies on a reviewed backup/PITR restore plan.

**Seed policy proposal:** keep test fixtures separate from production reference seeds; seed only minimum stable reference/configuration data; make seed operations repeatable and reviewable; never use real personal data in development or CI. Owner-approved property/business defaults must not be invented as seed values.

| Topic | Owner choice needed | Technical work after decision |
|---|---|---|
| Recovery objectives | Acceptable data loss window (RPO) and restore time (RTO), separately for pilot and production if they differ. | Map objectives to provider/PITR/backups and test evidence; make no SLA claim before verification. |
| Backup schedule and retention | Data retention/backup retention and legal-hold interaction; budget tolerance. | Choose frequency, encryption, off-site/provider copy and expiration policy. |
| Restore ownership | Named person/team accountable for routine restore tests and incidents. | Run restore drills, integrity checks, access review and documented runbook. |
| Production operations | Who monitors database health, capacity, patching/upgrades, failed migration and incident response. | Provider-specific alerts, dashboards, escalation and maintenance plan. |
| Migration approval | Who reviews/approves high-risk SQL and production run timing. | CI validation, migration rehearsal, lock/downtime analysis and post-deploy checks. |

**Risks once real data exists:** a migration can lock large tables, violate new constraints, lose or mis-map data, expand downtime, or leave application and schema versions incompatible. Backups that have not been restored are unproven. A rollback plan that omits writes made after deployment can lose valid data. Provider changes can alter recovery windows and data residency.

**If deferred:** technical migration conventions can be proposed, but production migrations, recovery guarantees and data-retention claims remain blocked. Before production, the Owner must set recovery objectives and name an operational owner.

**Owner questions:** What data-loss and restore-time objectives are acceptable? Who owns production database operations and restore drills? What budget/retention constraints apply? Approve forward corrective migration as the normal production recovery approach, with restore/PITR for data recovery?

### D-08 — Environments and database testing

**Current status: Proposed / Pending Owner Approval for operational environment boundaries; technical validation required.** No Docker database, CI service, or environment was created by this package.

| Environment | Proposed purpose and controls |
|---|---|
| Local development | Disposable database using the selected engine and compatible version. Synthetic data only; credentials local and ignored by Git. |
| Automated tests | Isolated database/schema per run or reliable cleanup; no shared developer state. Do not rely on mocks to establish constraints or isolation. |
| CI | Ephemeral service of the production engine/version family; run migrations from empty and supported upgrade paths. Keep credentials limited to the CI job. |
| Staging | Production-like topology and migration process, synthetic or approved anonymized data only; no copied PII without authorization and controls. |
| Production | Separate credentials/network/access, audited operations, encryption, backups and restore ownership; provider/region are D-01/D-05/D-07 decisions. |

#### Test type × environment

| Test Type | Local | CI | Staging | Production | Purpose |
|---|---|---|---|---|---|
| Unit | Fast logic tests with fakes where appropriate. | Run for relevant changes. | Not normally an environment-specific release gate. | Never run destructive unit actions on live data. | Verify isolated logic; mocks do not prove database behavior. |
| Integration | Disposable selected-engine DB; reset/isolate per run. | Dedicated ephemeral DB/schema/service per job. | Application/DB integration rehearsal with synthetic data. | No general integration suite against live guest records. | Verify SQL, driver, constraints, mapping and transactions. |
| Migration | Apply from empty; test supported upgrade path and correction on disposable DB. | Run empty and supported-upgrade migration paths. | Rehearse production order, lock/downtime and compatibility. | Controlled release migration only; no destructive test. | Verify versioned schema evolution and app/schema compatibility. |
| Transaction/concurrency | Rollback, lock/isolation, unique conflicts, retries with concurrent connections. | Required engine-matched automated suite. | Rehearse critical release scenarios where needed. | Observe signals only; no stress/race tests on live guests. | Demonstrate atomicity and race handling on selected engine. |
| Authorization/isolation | Synthetic identities/properties; foreign IDs, forged context, revocation. | API/worker negative cross-property suite on selected DB. | Verify jobs/cache/exports/property boundaries using synthetic data. | Safe approved synthetic canary only; no probing real guest data. | Detect IDOR and cross-property leakage. |
| End-to-end | Local app, disposable DB and synthetic accounts. | Isolated API/browser flow suites. | Business acceptance/release candidate checks. | Narrow non-destructive smoke/readiness checks only. | Verify integrated application behavior. |
| Security | Local/CI static and selected dynamic checks; no production data. | Least-privilege CI credentials. | Authorized security test with defined scope. | Planned production-safe monitoring only; no unapproved penetration test. | Validate access control, redaction, secrets and deployment boundaries. |
| Restore/recovery | Optional disposable restore mechanics. | Validate backup artifact flow where feasible without production records. | Preferred representative isolated restore drill and integrity verification. | Controlled maintenance/incident recovery exercise, never ad hoc destructive testing. | Prove backup usability and collect evidence against approved objectives. |

CI is an execution environment, not a test type. If PostgreSQL is selected, PostgreSQL must be used for its FK/unique/CHECK/partial-index, migration, transaction/locking and adopted RLS tests; if MySQL is selected, use the chosen MySQL/InnoDB line. SQLite/mocks may speed unit tests but do not replace engine-specific integration tests.

**Proposed release validation:** (1) confirm migration version/result; (2) readiness and dependency checks pass without leaking details; (3) approved non-destructive smoke checks pass; (4) observe latency, DB locks/connections, worker/audit signals and errors; (5) confirm migration/recovery owner and runbook availability; (6) check logs/artifacts for secrets and PII; (7) record evidence and release decision. Staging uses synthetic data by default; any anonymized or real dataset needs documented Owner/privacy approval and validated anonymization. Do not reset, stress-test, seed fixtures or run destructive tests in production.

**Required database-engine tests:** real PostgreSQL (if selected) for migrations, FK/unique/check constraints, transaction rollback, lock/isolation/concurrent writes, property-bound joins and negative cross-property access. SQLite or a mock may support fast unit tests but cannot prove PostgreSQL behavior. Also test backup restore and data integrity in a representative isolated environment before production. Include migration compatibility with deployed application versions and test idempotent retry behavior for deadlocks/serialization conflicts where applicable.

**If deferred:** no database service or CI changes. Until an engine is approved, tests can be designed but not treated as evidence of real database behavior.

**Owner question:** Approve separate disposable local/test databases and an ephemeral CI database using the selected production engine family? Who owns staging data approval and production access?

## 5. Decision Matrix

| ID | Decision | Recommendation / alternative | BA basis | OQ dependency | Risk / consequence of deferral | Owner approval | Technical validation | Blocking scope |
|---|---|---|---|---|---|---|---|---|
| D-01 | Database engine | Proposed PostgreSQL; alternative MySQL or defer | NFR-DATA-001 `[A]`, Part 1 p.9; property filter NFR-SEC-002/BR-060 `[A]` | OQ-036; OQ-019/OQ-031 for residency/spend/operations | Schema/SQL/backup choices wait; switching later costs more | **Pending Owner Approval** for engine, RLS objective, provider/region separately | **Pending Technical Validation** of feature/version/provider fit | Blocks selected-engine HMS foundation/schema; not a no-install discussion |
| D-02 | ORM | Proposed Prisma ORM 7.x candidate; TypeORM/Drizzle alternatives or defer | BA has data/transaction needs; ORM is technical proposal, not BA requirement | D-01; selected engine; Nest/toolchain compatibility | No ORM foundation until migration/transaction/reporting fit is proven | **Pending Owner Approval** independent of D-01 | **Pending Technical Validation** of exact patch/adapter/migrations/raw SQL | Blocks ORM-based Option A |
| D-03 | Multi-property authorization | Proposed memberships and role per property; explicit Owner/system grants; server validation | FR-RBAC-002/003, FR-EMP-009; OQ-041 temporary answer is not approval (Part 2 pp.16–17, 23, 41) | OQ-041 and related OQ-040/042/043/044/045 | Premature role schema can lock access policy | **Pending Owner Approval** | Security/API/worker/cache tests after policy | Blocks final Option B identity/access schema |
| D-04 | Guest sharing | A preserve BA chain behavior; B property isolation (BA change); C hybrid | FR-GST-001/003/007 and ACs, Part 3 pp.19–22; OQ-034 | OQ-034, OQ-019/OQ-045; OQ-047 separate | Wrong choice risks privacy, duplicate data or BA rework/migration | **Pending Owner Approval** | Matching/access/migration validation after policy | Blocks GST guest-sharing/profile behavior, not Option A |
| D-05 | Privacy/retention/access | Owner + legal data-class matrix before real PII | OQ-019; OQ-045; BR-062/067 `[Q]`; FR-GST-009/010 | OQ-019/OQ-045/OQ-034/OQ-031 | Unlawful/overbroad access, retention or incident response risk | **Pending Owner + Legal/Privacy Advice** | Technical lifecycle, audit, deletion and provider review | Blocks real PII/documents/export/lifecycle |
| D-06 | Foundation scope | Owner chooses A/B/C/none independently | Gate C plan; no BA scope approval implied | D-01/D-02/D-08; D-03 for B; OQ-033 and slice OQs for C | Scope creep or technical choices mistaken for business authorization | **Pending Owner Approval** | Validate bounded acceptance criteria | Blocks any implementation until scope is authorized |
| D-07 | Migration/recovery | Proposed forward correction; BA targets shown as `[A]`; accept/revise/defer | NFR-AVL-001 `[A]`, Part 1 p.9 | OQ-019/OQ-031; provider after D-01 | Production recovery claims remain unsupported | **Pending Owner Approval** for objectives/operator | Provider restore/migration rehearsal evidence | Production readiness; not a disposable Option A by itself |
| D-08 | Environments/testing | Proposed test/environment matrix and synthetic data | NFR-DATA-001/NFR-AVL-001 `[A]`; relevant FR/RC tests | D-01/D-02; OQ-019 for any PII test data; OQ-031 for ops | Cannot claim DB behavior or release confidence without target-engine evidence | **Pending Owner Approval** for data boundaries/scope | **Pending Technical Validation** for engine-matched tests/release controls | Acceptance of foundation and production confidence |

Every row is Proposed/Pending; none is Approved. An Owner may answer rows independently; technology approval does not authorize implementation.

## 6. OQ Dependency Matrix

Descriptions below follow the current `OPEN_QUESTIONS.md`; temporary ASM values are not treated as decisions.

| OQ | Verified current content | Category of impact | Blocks | Can defer for Option A? |
|---|---|---|---|---|
| OQ-019 | Legal basis, retention, deletion and incident handling for personal data; ASM five years is unapproved (BA Part 1 p.34; `OPEN_QUESTIONS.md`). | Blocking PII, privacy lifecycle and some production operations | Real guest PII/documents, retention/deletion, exports, backup expiry/incident policy. | **Yes**, if synthetic-only and no real PII/document/export. |
| OQ-031 | Budget, deadline, team/operations; confirmed 2–5 then 6–10 property planning ranges; room count unknown (BA Part 1 p.34 + Owner input). | Blocking production sizing/operations/funding | Capacity claims, funded schedule, provider spend and operational support. | **Yes**, for specifically authorized local technical work without commitments/provider operations. |
| OQ-033 | Owner approval of release out-of-scope list, BA Part 1 §3.2 temporary (pp.8, 35). | Blocking business scope | Option C and release-specific business modules/schema. | **Yes**, if no business entity/schema. |
| OQ-034 | Guest/blacklist chain-wide or property scope and who adds/removes; temporary chain-wide ASM (BA Part 1 p.35). | Blocking guest-sharing behavior/schema | Guest linking/profile/history/blacklist and GST acceptance behavior. | **Yes**, if no guest entity or behavior. |
| OQ-036 | Select primary DB engine; PostgreSQL remains proposed (BA Part 1 p.35; technology proposal pp.1–3). | Blocking engine selection | Production-intended selected-engine foundation and HMS schema/migrations. Separate comparison spike needs explicit authorization. | **No** for a selected-engine Option A; yes only to analysis/comparison that is separately authorized and disposable. |
| OQ-037 | Property legal form/revenue and e-invoice obligation (BA Part 1 p.35). | Blocking specific property/tax/invoice model | Legal Property fields, tax/e-invoice schema/workflow. | **Yes**, if no Property or finance entity/business slice. |
| OQ-041 | Whether employee can have different roles across properties; temporary yes/account/context (BA Part 2 p.41). | Blocking identity/authorization schema | Final membership cardinality, role grants, switching and cross-property access. | **Yes**, if no user/employee/membership/auth schema. |
| OQ-045 | Who may view full guest identity documents; temporary roles not approval (BA Part 2 p.42). | Blocking sensitive guest-document access | Real identity document view/storage/unmasking policy. | **Yes**, if no documents or real PII. |
| OQ-047 | Blacklist hard block or warning; temporary warning + Manager approval (BA Part 3 p.40). | Blocking guest/blacklist behavior | Match response on booking/check-in and related acceptance tests. | **Yes**, if no guest/blacklist schema or behavior. |

Other OQs in the current register can block individual domain designs. Examples include OQ-001/005 room inventory and overbooking; OQ-014/015 tax/e-invoice; OQ-016 revenue basis; and OQ-040/042/043/044 approval/session/MFA/device policy. Resolve only those relevant to an authorized slice; do not treat the list as approval to implement other modules. OQ-034 (sharing/authority) and OQ-047 (match action) are separate.

## 7. Owner Approval Sheet

Owner may answer any row independently. “Defer” is a valid answer and leaves the affected work blocked.

| ID | Recommendation | Alternative | If deferred | Owner response |
|---|---|---|---|---|
| D-01 | Approve PostgreSQL candidate; separately state whether RLS is desired | MySQL or bounded comparison; RLS may be deferred | No selected-engine foundation/schema; no provider/region choice | PostgreSQL / MySQL / comparison / defer ___; RLS desired / defer / alternative ___ |
| D-02 | Approve Prisma ORM 7.x as validation candidate (not implementation approval) | TypeORM / Drizzle / defer | No ORM foundation until fit is validated | Prisma 7.x candidate / TypeORM / Drizzle / defer ___ |
| D-03 | Confirm/revise BA multi-property membership and per-property role model; Owner/system grants explicit | One property per employee / shared role / other Owner limits | No final cross-property access schema or behavior | Confirm/revise membership ___; Owner scope ___; who can switch context ___; revocation policy ___ / defer |
| D-04 | Choose guest Option A (preserve BA chain behavior), B (property-only; BA change), or C (hybrid) with field-specific sharing | Any option may be deferred; do not infer profile/document/history sharing | No guest-sharing implementation, migration or shared search | A / B / C / defer ___; approved identity/profile/contact/document/history fields and purpose ___ |
| OQ-047 | Independently choose blacklist match behavior after deciding its scope (separate from D-04/OQ-034) | Warning / hard block / property-configurable only if explicitly approved | No blacklist match behavior in booking/check-in | Warning / block / configurable / defer ___; exceptions/override ___ |
| D-05 | Name Owner, property operations, technical admin and legal/privacy responsibilities; approve data-class matrix before real PII | Defer pending legal advice | No real PII, documents, exports or final retention automation | Who views/edits/docs/exports ___; who approves sharing ___; request owner ___; breach lead/escalation ___; counsel ___ / defer |
| D-06 | Authorize bounded Option A only if desired; explicitly exclude business schema/identity/PII | Option B/C with dependencies; or none | No implementation until an explicit bounded work authorization | A / B / C + slice / none ___; allow migration metadata only? ___ |
| D-07 | Accept/revise/defer each BA `[A]` NFR-AVL-001 target; name restore/recovery owner | Set alternative objectives after business review | No production SLA/recovery claim | Availability ___; RPO ___; RTO ___; restore cadence ___; primary/backup operator ___ / defer |
| D-08 | Approve data/environment boundaries and release-validation responsibility | Amend matrix; technical lead proposes tooling | No foundation acceptance/production confidence | Local/test/CI/staging boundaries ___; dataset approver ___; release evidence owner ___ / defer |

## 8. Repository baseline handoff

Historical repository snapshot for this package: at commit `7202145` / 2026-11-05, the branch was `main`, Git had 2 commits and 77 tracked paths. Reproduce counts at any later point with `git rev-list --count HEAD`, `git ls-files | Measure-Object -Line` (PowerShell) or `git ls-files | wc -l` (POSIX), and get the snapshot identifier/date with `git log -1 --format='%h %cs'`. The seven `docs/source/` PDFs are tracked in the existing history. Their rights/sharing review remains a **manual owner review** item; do not delete files or rewrite history as part of this decision package.

The original tracked candidate inventory was inspected at the snapshot above. Main groups are:

- Root policy/config/build: `.editorconfig`, `.gitignore`, `.prettierignore`, `AGENTS.md`, `README.md`, `eslint.config.mjs`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.json`.
- CI: `.github/workflows/ci.yml`.
- Apps: `apps/api/` (environment example, manifest, tsconfig, Nest source/tests), `apps/web/` (local instructions, Next config/types, manifest, tsconfig, app source/test/styles), `apps/worker/` (manifest, tsconfig, source/test).
- Shared config: `packages/config/` ESLint, TypeScript config and package manifest.
- Knowledge Base: all root documents under `docs/knowledge/` and all 20 module documents under `docs/knowledge/MODULES/`; includes this Gate C.0 audit.
- Source documents: all seven PDFs under `docs/source/`, subject to the Owner rights/sharing confirmation already noted.

Exact paths tracked in the existing baseline:

```text
.editorconfig
.github/workflows/ci.yml
.gitignore
.prettierignore
AGENTS.md
README.md
apps/api/.env.example
apps/api/package.json
apps/api/src/app.module.ts
apps/api/src/health.controller.ts
apps/api/src/health.test.ts
apps/api/src/main.ts
apps/api/tsconfig.json
apps/web/AGENTS.md
apps/web/next-env.d.ts
apps/web/next.config.ts
apps/web/package.json
apps/web/src/app/layout.tsx
apps/web/src/app/page.test.tsx
apps/web/src/app/page.tsx
apps/web/src/app/styles.css
apps/web/tsconfig.json
apps/worker/package.json
apps/worker/src/main.ts
apps/worker/src/worker.test.ts
apps/worker/tsconfig.json
docs/knowledge/ARCHITECTURE.md
docs/knowledge/BUSINESS_OVERVIEW.md
docs/knowledge/BUSINESS_RULES.md
docs/knowledge/DECISIONS.md
docs/knowledge/GATE_C0_READINESS_AUDIT.md
docs/knowledge/KNOWLEDGE_BASE_AUDIT.md
docs/knowledge/MODULES/AST.md
docs/knowledge/MODULES/AUD.md
docs/knowledge/MODULES/BOOK.md
docs/knowledge/MODULES/CAL.md
docs/knowledge/MODULES/CFG.md
docs/knowledge/MODULES/CHN.md
docs/knowledge/MODULES/EMP.md
docs/knowledge/MODULES/FO-NA.md
docs/knowledge/MODULES/FO.md
docs/knowledge/MODULES/GST.md
docs/knowledge/MODULES/HK.md
docs/knowledge/MODULES/INV.md
docs/knowledge/MODULES/MNT.md
docs/knowledge/MODULES/NTF.md
docs/knowledge/MODULES/PAY.md
docs/knowledge/MODULES/PROP.md
docs/knowledge/MODULES/RATE.md
docs/knowledge/MODULES/RBAC.md
docs/knowledge/MODULES/README.md
docs/knowledge/MODULES/ROOM.md
docs/knowledge/MODULES/RPT.md
docs/knowledge/OPEN_QUESTIONS.md
docs/knowledge/PHASE_0_IMPLEMENTATION_PLAN.md
docs/knowledge/PROJECT_INDEX.md
docs/knowledge/REQUIREMENTS_INDEX.md
docs/knowledge/TECHNOLOGY_DECISION_PROPOSAL.md
docs/knowledge/TERMINOLOGY.md
docs/source/HMS_Tai-lieu-BA_Phan-1_v0.2.pdf
docs/source/HMS_Tai-lieu-BA_Phan-2_v0.1.pdf
docs/source/HMS_Tai-lieu-BA_Phan-3_v0.1.pdf
docs/source/HMS_Tai-lieu-BA_Phan-4_v0.1.pdf
docs/source/hms-de-xuat-cong-nghe.pdf
docs/source/hms-de-xuat-giao-dien-v2.pdf
docs/source/hms-de-xuat-trien-khai.pdf
eslint.config.mjs
package.json
packages/config/eslint.config.mjs
packages/config/package.json
packages/config/tsconfig.base.json
pnpm-lock.yaml
pnpm-workspace.yaml
tsconfig.json
```

Ignored local artifacts observed and correctly excluded by `.gitignore`: root and app `node_modules/`; API/worker `dist/`; web `.next/`; API/web/worker `*.tsbuildinfo`. Also excluded by rules: coverage, Turbo cache, output folders, logs, `.env`/environment-specific files other than `.env.example`, and OS metadata. The existing `.env.example` has only development mode, loopback host and sample port; it has no DB setting because no DB has been approved. Secret-pattern scan found no matching credential/private-key/connection-string value in the reviewed text files. This is a best-effort scan, not a guarantee about all binary content.

### Initial commit candidate categories

| Category | Proposed handling | Reason |
|---|---|---|
| A. Include candidate | Root/app source, tests, manifests/lockfile, shared config, CI, README, AGENTS guidance, Knowledge Base and technical reports | Required to reproduce the authorized Gate A/B repository and preserve project context. All are already in the current commit. |
| B. Exclude | Dependencies, build output, `.next`, coverage, caches, logs, temporary files, local `.env`, credentials/private keys | Regenerable or sensitive; keep ignored and out of future commits. |
| C. Manual Owner review | Seven PDFs and any later document whose distribution/license, personal data or confidentiality status is unclear | Source PDFs are currently tracked; confirm rights/retention/sharing policy. Any newly found sensitive file should be reviewed before staging; never print secrets. |
| D. Needs investigation | Any future duplicate, generated file of uncertain source-of-truth, or production-affecting config without documented owner/purpose | Decide based on generation reproducibility, runtime need, deployment owner and secret boundary before adding. |

`.env.example` is appropriate to retain as a non-secret example for the current Gate A/B shells. Before future database work, add only placeholder variable names/values through an authorized change; do not put a real connection string in Git. The current initial commit is already present, so an owner review now is a review of committed baseline content and future handling, not permission to rewrite history. If the Owner wants a different treatment of PDFs or other files, agree on a deliberate follow-up history policy separately.

**Owner-safe review sequence:** inspect `git status --short --untracked-files=all`, `git ls-files`, `git ls-files --stage`, and `git diff --check`; review the exact inventory and secret scan; decide PDF handling; then, only if a baseline commit did not already exist, stage explicit approved paths with `git add -- <approved-paths>` (never `git add .`), review `git diff --cached --name-status`, `git diff --cached --check`, and `git diff --cached --` before the Owner chooses whether to commit. Since `ab873de` already exists, do not create a duplicate “initial” commit. Review this package’s changes as a separate follow-up and let the Owner decide their commit timing.

## 9. Sources and technical validation notes

Business/OQ references are traceable to `OPEN_QUESTIONS.md` and its cited BA sources: OQ-019 (BA Part 1 p.34), OQ-031 (BA Part 1 p.34 plus Owner input 2026-11-05), OQ-033 (BA Part 1 pp.8, 35), OQ-034 (BA Part 1 p.35), OQ-036 (technology proposal pp.1–3; approval not evidenced), OQ-037 (BA Part 1 p.35), OQ-041 (BA Part 2 p.41), OQ-045 (BA Part 2 p.42), and OQ-047 (BA Part 3 p.40). The BA PDFs remain source material; their ASM values are not approval.

Technical references (consult current versions again before implementation): [PostgreSQL partial indexes](https://www.postgresql.org/docs/current/indexes-partial.html), [PostgreSQL row security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html), [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html), [MySQL 8.4 generated-column index optimization](https://dev.mysql.com/doc/refman/8.4/en/generated-column-index-optimizations.html), [MySQL 8.4 InnoDB isolation](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html), [Prisma ORM release status](https://www.prisma.io/docs/orm/release-status), [Prisma supported databases](https://www.prisma.io/docs/orm/supported-databases), [Prisma v7 NestJS guide](https://www.prisma.io/docs/guides/v7/frameworks/nestjs), [TypeORM documentation](https://typeorm.io/), [Drizzle migrations](https://orm.drizzle.team/docs/migrations), and [Drizzle transactions](https://orm.drizzle.team/docs/transactions). Provider backup, regional residency, cost and support promises were not compared because no hosting provider/region has been selected.
