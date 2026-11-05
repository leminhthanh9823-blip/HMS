# Gate C.0 – Repository Baseline & Architecture Readiness Audit

**Status:** Proposed / Pending Approval. Read-only audit; no database, schema, migration, seed, package, source, OQ status, staging or commit changes were made. Audit date: 2026-11-05.

## 1. Executive summary

**Conclusion – Gate C is not authorized or ready for Database Foundation implementation.** Architecture preparation is ready to continue. OQ-036 database selection is open; ORM/provider, authorization and guest data policies are unapproved; several module-specific OQs affect schema. Owner confirmation is required for product scope and deployment/backup responsibilities. This report is a proposal, not approval.

The repository is initialized on `main`, but has no tracked files. All intended source, docs and configuration are untracked. `.gitignore` excludes dependencies, build output, environment secrets and caches. Seven source PDFs are present, readable as PDF containers and hashed below. `apps/api/.env.example` contains only `NODE_ENV=development`, loopback host and sample port; no password, token or API key was found.

Confirmed business direction: single owner, multiple properties from the first release, no unrelated-owner SaaS. Property sizing is 2–5 in year one and target 6–10 in months 12–24; initial room count is unknown. OQ-032 is answered, OQ-031 partially answered. Technology choices (including PostgreSQL, ORM, NestJS product adoption, Modular Monolith, Redis) remain Proposed / Pending Approval.

## 2. Repository and Git audit

Commands run: `git status --short --untracked-files=all`, `git ls-files`, `git ls-files --stage`, `git diff --check`, `git diff --cached --name-only`, `git branch --show-current`, and `git status --ignored --short`.

| Check | Result |
|---|---|
| Branch | `main` |
| Git history and tracked paths | Historical snapshot at commit `ade4d0d` / 2026-11-05: 7 commits and 81 paths. Current counts must be regenerated with the commands below. |
| Untracked | None at the snapshot before this documentation update |
| Staged | None at the snapshot before this documentation update |
| `git diff --check` | No whitespace errors in the checks recorded for the current changes |
| Ignored artifacts observed | root/app `node_modules`, API/worker `dist`, web `.next`, `*.tsbuildinfo` |

The previous statement that all workspace files were untracked is stale. The historical snapshot above was captured from `git rev-list --count HEAD`, `git ls-files | Measure-Object -Line` and `git log -1 --format='%h %cs'` at that time. Reproduce current counts on PowerShell with those commands; on a POSIX shell use `git rev-list --count HEAD`, `git ls-files | wc -l` and `git log -1 --format='%h %cs'`. Counts naturally change at later commits. Source code is under `apps/` and workspace `packages/config/`; test sources are `*.test.ts(x)`. Project knowledge is `docs/knowledge/`. Original BA and proposal PDFs are `docs/source/`. Generated files and local dependencies are ignored. No committed secret was found in `.env.example`; the audit only scanned files in the listed workspace and is not a forensic secret scanner.

`.gitignore` excludes `node_modules`, `dist`, `*.tsbuildinfo`, `.next`, `out`, `coverage`, `.turbo`, `.env`, `.env.*`, logs and OS files, and explicitly permits `.env.example`. Review any future env examples for real credentials before staging.

## 3. BA source document integrity

`docs/source/` contains exactly seven PDFs: four BA parts and three proposal documents. All have a `%PDF-` signature and nonzero content; available PDF utility validation was not installed, so “readable” here means valid PDF container signature and successful byte/hash read, not a full page-render or text-extraction validation. Files were not modified.

See §16 for exact byte sizes and SHA-256 digests.

## 4. Knowledge Base consistency

Reviewed `PROJECT_INDEX`, business overview/rules, architecture, requirements index, decisions, open questions, technology proposal, Phase 0 plan, KB audit, terminology, and all module documents (AST, AUD, BOOK, CAL, CFG, CHN, EMP, FO/FO-NA, GST, HK, INV, MNT, NTF, PAY, PROP, RATE, RBAC, ROOM, RPT).

Broadly consistent: source labels `[C]/[A]/[Q]` are preserved; BA module list is distinguished from approved MVP; technical selections remain proposals; single-owner/multi-property direction is recorded without inferring property-role or guest-sharing policy. Architecture and Phase 0 docs correctly say OQ-036, OQ-034, OQ-041 remain open.

Items to clarify before implementation, without changing their status:

- OQ-036 is recorded in the Knowledge Base as a technology-selection question sourced from the technology proposal (pp.1–3); it is not an OQ originating in the BA catalog. Its blocking effect is limited to choosing the HMS database engine and dependent schema/migrations.
- Some proposal text recommends PostgreSQL/Prisma while the decision register correctly marks both pending. Do not treat “recommended” as approval.
- OQ-034 BA has a chain-wide temporary assumption; the current decision register explicitly treats it as unresolved. Do not implement that assumption.
- OQ-041 source contains a “yes” assumption for one account/active property selection; the decision register correctly leaves cardinality and switching policy open.
- The BA set is explicitly draft/unbaselined in the Knowledge Base; `[C]` source labels are not stakeholder sign-off.
- OQ-019 privacy, OQ-037 legal/invoice requirements, OQ-033 product scope and many module OQs still affect durable data design.

No OQ, decision, or source document was altered.

## 5. Confirmed business decisions

**Confirmed – Owner:** one owner, multi-property from first release, no SaaS for unrelated property owners. **Confirmed input, not a delivery/capacity commitment:** 2–5 properties in first 12 months; target 6–10 in months 12–24. Initial room count remains unknown. OQ-032 answered; OQ-031 partial. These facts do not select a database, schema, role policy, guest sharing or hosting provider.

## 6. Pending technology decisions

**Pending Approval:** primary database and provider/version, ORM, architecture/process topology, Redis/queue, deployment/hosting, exact package versions. Current NestJS/Next.js/worker code is bounded Gate A/B prototype implementation, not product-stack approval. PostgreSQL is a candidate only (OQ-036).

## 7. OQ-036 – Database comparison

Evaluation is a technical proposal for the known multi-property relational workload, not an owner decision.

| Candidate | Strengths | Weaknesses / risks | Fit |
|---|---|---|---|
| PostgreSQL | Mature transactions, constraints, composite keys, partial/unique indexes, JSONB, rich SQL/reporting, indexes, extensions, PITR-capable backup ecosystem; supports tenant/property isolation patterns and RLS as defense in depth. | Needs competent operations, connection/pool sizing, backup/restore drills, upgrades, monitoring and query/index tuning; RLS session context is easy to misuse with pooled connections; managed service costs vary. | **Proposed preferred** for transactional booking, inventory, folio, payments and reporting with integrity needs. |
| MySQL / MariaDB | Mature relational engines, broad hosting/vendor availability, transactional InnoDB and familiar SQL. | PostgreSQL-specific features/SQL and selected constraints/reporting patterns may differ; choice still needs provider/version/operations review; switching engines later is costly. | Reasonable if existing operational expertise/provider requirements dominate and a prototype verifies required constraints. |
| SQL Server | Strong relational integrity, transaction support, reporting ecosystem and enterprise operational tooling. | License/provider cost and ecosystem fit may be heavier for a small owner-operated deployment; SQL portability and team expertise must be assessed. | Consider if existing Microsoft hosting, support or licensing is an explicit constraint. |

**Recommendation – Proposed / Pending Approval:** PostgreSQL, subject to Dev Lead fit validation and Owner choice of provider/version, region, cost, backup and recovery controls. No production sizing follows from property counts alone. PostgreSQL’s relational constraints and transaction model fit inventory uniqueness, same-property references, financial records and concurrent writes; JSON should complement, not replace, normalized critical data. RLS is optional additional containment, not authorization substitute.

**Owner decisions:** primary engine; managed vs self-managed/provider; version/support window; deployment region; recovery objectives and accountable operator. OQ-036 explicitly requires selection and Dev Lead technical validation.

## 8. B2 – ORM comparison

Scores are qualitative, version-sensitive and **Proposed / Pending Approval**. None can make invalid concurrency or ownership logic safe automatically.

| Criteria | Prisma | TypeORM | Drizzle |
|---|---|---|---|
| NestJS integration | Community Nest recipe/module; DI lifecycle needs deliberate setup | Strongest established Nest repository/module integration | Straightforward provider/factory pattern; more wiring is ours |
| Migration management | Integrated migration history and deploy workflow; generated SQL review/custom SQL needed; rollback generally compensating forward migration | CLI migrations, up/down methods; generated output needs review; down can be incomplete/data-destructive | Kit generates SQL migrations; SQL-first review; rollback usually author-managed/reverse migration |
| Multi-step transactions | Interactive and batch transactions; isolation controls; transaction client scope matters | EntityManager/query runner transaction; use transaction-scoped manager consistently | Callback transactions/savepoints/isolation options by dialect |
| Type safety | Strong generated client from schema; generator/schema dependency | TypeScript entities, but runtime metadata and query typing can be less exact | Strong SQL-like inferred types; closer to database but schema/type drift remains possible |
| Relationship modeling | Declarative models/relations; convenient CRUD; database constraints still need explicit schema/migration | Decorator/entity relations familiar; can hide SQL and relation loading behavior | Explicit schema/relations; relations API does not itself create database FK constraints |
| Query flexibility / reporting | CRUD ergonomic; complex SQL via TypedSQL/raw; generated abstractions may be cumbersome for specialized reporting | QueryBuilder and raw SQL; flexible, behavior can become opaque | SQL-oriented query builder; good joins/CTEs/reporting with explicit SQL knowledge |
| Constraints / SQL control | Supports native DB constraints through schema/migrations and custom SQL; verify composite FK and advanced index coverage at chosen version | Broad DB features; migration SQL/raw access; decorators may not represent every constraint cleanly | Fine SQL control, native PostgreSQL constructs; migration SQL visible; relational helpers do not replace FK constraints |
| Maintainability / ecosystem | Large ecosystem, polished developer experience; generated client and schema DSL create vendor/tool coupling | Mature Nest community; decorator/metadata complexity and broad feature surface | Smaller/younger ecosystem than Prisma/TypeORM; concise, SQL-literate design |
| Testing / mocking | Easy to mock client but mocks can diverge from real DB semantics; prefer PostgreSQL integration tests | Repository DI patterns support unit mocking; transaction and metadata config must match runtime | Inject database wrapper; lightweight mocks, but relational semantics require real DB |
| Long-term risk | Schema DSL/client generation and migration conventions; raw SQL needed for DB-specific capabilities; avoid leaking Prisma types into domain | Runtime decorators/metadata, eager/lazy relation pitfalls, framework-specific patterns; flexible but more implicit | Fewer abstraction barriers and migration lock-in, but smaller hiring/community pool and less high-level Nest integration |

| Option | Advantages | Disadvantages | Risk | Fit |
|---|---|---|---|---|
| Prisma | Fast onboarding, generated types, mature tooling/docs, approachable schema and Nest recipe | Specialized SQL/reporting/constraints need SQL escape hatch; generated workflow | Product-specific schema/client coupling; review migration output | **Recommended proposed default** if team values productivity and standard CRUD most |
| TypeORM | Nest integration, familiar decorators/repositories, SQL/query builder access | More implicit behavior and metadata; type inference less end-to-end; migration discipline needed | Relation loading and schema drift; broad abstraction increases debugging burden | Second choice if team has strong TypeORM/Nest operational experience or existing code standards |
| Drizzle | SQL-first and explicit, TypeScript inferred schema/query, natural raw SQL | More manual composition; smaller ecosystem; relationships distinct from DB constraints | Team must own conventions and lower-level details | Best if SQL control/complex reporting outweighs guided CRUD and team is SQL-proficient |

**Recommendation – Proposed / Pending Approval:** Prisma as a productivity-first candidate, with an explicit policy that PostgreSQL migrations are reviewed and custom SQL is allowed for constraints, indexes, concurrency primitives and reporting. Keep ORM types inside persistence adapters. Choose Drizzle instead if SQL transparency and database-specific design are dominant and the team accepts more manual Nest wiring. TypeORM is second choice when team skill/legacy familiarity materially reduces delivery risk.

Required implementation rules for any ORM: multi-step operation uses one transaction-scoped connection/context; use database unique/FK/check constraints as final arbiter; handle serialization/deadlock/unique conflicts intentionally; atomic conditional updates or row locks for inventory/folio race points; idempotency keys where retries are possible. ORM transaction APIs do not prevent lost updates if business logic reads then writes without locking/version predicates. Composite FKs may need custom SQL depending on ORM; verify emitted SQL. Raw SQL should be parameterized and reviewed; never concatenate untrusted values. PostgreSQL migrations are usually transactional for supported operations, but some operations (e.g., concurrent index creation) require special non-transaction handling. “Rollback” in production should normally mean a reviewed forward repair/compensating migration; destructive data cannot be restored by a down script.

## 9. OQ-041 – Multi-property authorization

**Open Question – do not close OQ-041.** BA describes multi-property assignments but role cardinality/context remains an Owner decision. Proposed conceptual entities: `UserIdentity` (global login); `SystemRole/Permission` (platform duties only); `Property`; `PropertyMembership` (user, property, status); `PropertyRoleGrant` (membership, role, validity); `RolePermission`; `ActivePropertyContext` (session/request selection, not a grant); optional `ApprovalGrant`/threshold; `AuditEvent`.

| Pattern | Strength | Limitation | Assessment |
|---|---|---|---|
| System-wide RBAC | Simple for true platform admin tasks | Cannot express per-property role differences; risks accidental portfolio-wide business access | Insufficient alone |
| Property RBAC | Directly models property boundary and least privilege | Does not model platform administration cleanly; role cardinality still needs decision | Strong baseline for operations |
| Combined system + property RBAC | Distinguishes platform administration from business grants; least privilege and explicit scope | More policy complexity; privilege escalation risks if roles are conflated | **Proposed recommendation**, with explicit deny-by-default and separate namespaces |

Request flow proposal: authenticate identity; derive or validate selected property against active membership server-side; authorize action and record scope; scope queries and writes by authorized property. Never trust a client-supplied `property_id` alone. A cross-property report receives an explicit set of authorized properties and remains read-only unless separately authorized. A property switch changes context, never grants.

Background job payloads should carry immutable `property_id` (or approved explicit property set for aggregation), actor/system identity, purpose, correlation/idempotency key and authorization context; worker revalidates applicable permission/state at execution. Cache keys, exports, notifications and object storage paths include property scope and are authorized on retrieval. Audit events record actor, action, target type/id, property scope, outcome, timestamp, correlation id and reason/approval reference where applicable; avoid duplicating sensitive PII in logs.

IDOR defenses: query by both resource ID and authorized property; use composite FKs to prevent cross-property references; negative tests for foreign IDs; scope list/count/export and error behavior; no UI-only checks. Owner access should be modeled as explicit Owner grants/permissions over all or selected properties, not a magic role-name bypass. **Owner must confirm:** multi-property staff membership; different role per property; Owner all-property authority and exceptions; system vs property roles; context/session switching; revoke/expiry semantics; cross-property report scope. These answer the user's nine questions without asserting them as decisions.

## 10. OQ-034 – Guest and blacklist sharing

**Open Question – do not close OQ-034.** No property may read another’s personal data by assumption. OQ-019 (legal purpose, retention, deletion, residency) and OQ-045 (identity-document viewing) also constrain this choice.

| Model | Duplicate/matching | Access/privacy | History/reporting | Evolution / fit |
|---|---|---|---|---|
| A Global Guest | Less duplicate data; matching/merge errors can merge different people and propagate widely | Largest breach/disclosure scope; every property can expose shared record absent fine controls | Easy consolidated history/reporting, highest disclosure risk | Easy global lookup, expensive separation later; not recommended absent explicit purpose/legal basis |
| B Property-specific Guest | Duplicates likely; matching/merge stays local | Strongest separation and least disclosure | Fragmented history; reporting limited to property | Simple isolation, later linking needs careful migration; safest interim if sharing not approved |
| C Hybrid identity + property profile | Global identity resolution remains difficult; property profile separates operational details | Fine-grained permissions possible; global identity itself remains sensitive and linkability must be controlled | Consolidation only through explicitly authorized links/aggregates | Most flexible, highest complexity; **proposed target only if Owner/legal approve cross-property identity linking** |

Blacklist must be decided separately from profile model: global, property-specific, or separate global and local lists with distinct purposes. Determine who may create/update/remove, who sees match details, whether a match blocks or only warns, evidence/reason, review/expiry, appeal/correction/deletion/legal hold and audit. Do not embed sensitive allegations in general guest notes. Audit actor/property, decision, reason and change history with restricted access; retention and erasure rules require Owner + legal counsel under OQ-019.

**Proposed recommendation:** preserve a conceptual hybrid option for future evaluation; do not implement shared identity/linkage now. If a bounded DB foundation must precede OQ-034, model only property-local guest records and explicitly avoid global matching/blacklist behavior, subject to separate scope approval. Owner must confirm guest identity scope, permitted matching, link visibility, history/reporting scope, blacklist scope/action, authorized roles, evidence/expiry/appeal and retention/deletion with counsel.

## 11. Multi-property database architecture proposal

All below is **Proposed**, conceptual only; no SQL schema.

| Entity group | Ownership / property relation | Access and integrity |
|---|---|---|
| System-level | Login identity, global role/permission definitions, platform settings | No `property_id` by default; access via system permission; no business authority implied |
| Owner-level | Owner account, portfolio settings, explicit cross-property report request | Owner identity boundary; an explicit authorized property set; distinguish from unrelated-owner tenancy |
| Property-owned | Rooms, bookings, inventory, folios, payments, cashier shifts, business dates, operational audit/export | Property FK on aggregate root; scope every access; same-property reference constraints |
| Property-scoped configuration | Local timezone, tax/legal values, room settings, property overrides | `property_id`; effective dates/versioning; global defaults only where deliberately inherited |
| Cross-property reporting | Usually a query/view over property-owned records, not duplicate source of truth | Authorized properties only; retain source property on every row; aggregate read scope audited |
| Shared reference data | Currency/country/code catalogs only where semantics are genuinely global | Versioned/global; business choices may still require property override |
| Guest data | OQ-034 unresolved | Do not choose global/property/hybrid operational behavior without Owner decision |

Integrity principles: FK every owned record to property or a property-owned aggregate; composite `(property_id, id)` references where needed to prevent cross-property links; unique `(property_id, natural_key)` for property-scoped identifiers; global uniqueness only when business semantics require it; CHECK constraints for row-local invariants; avoid cascades through financial/audit history. Prefer restrict/soft-close and explicit retention workflows for bookings, payments, audit and guest records. Cascade only dependent, disposable child rows under an approved lifecycle.

Index only measured/common access paths: property plus business date/status/foreign key; unique property-scoped code; booking room/date or inventory key; queue/status/time. Match order to query predicates/sort; avoid duplicate indexes already created by unique/FK constraints. Verify plans with representative data. Composite index is not automatically useful just because `property_id` exists.

Lifecycle proposal: UTC `created_at`/`updated_at`; actor IDs where attributable and lawful; immutable append-only audit events for sensitive actions (BR-061); explicit deleted/closed state by entity, not blanket soft-delete; retention/export/erase/legal hold derived from OQ-019. Archive only after retention and restore/query requirements are decided.

Time proposal: store instants as UTC-aware timestamps; store each Property IANA timezone and business date; derive a stay night using property-local dates, not UTC date; represent booking nights as local date ranges (typically half-open `[arrival, departure)`). Daylight-saving transitions and timezone rule changes need tests. Reports group by the property’s local business date; multi-property reports preserve each property's local date and timezone. BR-004/007 and Night Audit `(property_id, business_date)` are relevant; exact policy remains source constrained.

Example conceptual graph: `Property 1—* Room`; `Property 1—* Booking`; `Booking 1—* BookingRoom`; `BookingRoom *—1 Room` with same-property constraint; `Booking 1—1 Folio 1—* FolioEntry`; `UserIdentity *—* Property` via Membership and role grants. Whether `GuestIdentity` is shared and linked to property profiles is OQ-034, not selected.

## 12. Migration and database lifecycle

**Proposed:** migrations are immutable, versioned artifacts reviewed with code. Development generation can be tool-assisted; production applies only reviewed migrations through one controlled runner, with pre-deploy backup/restore readiness, lock/availability analysis and post-migration integrity checks. Avoid multiple app replicas racing migrations. Prefer expand → backfill → verify → contract for incompatible changes, with resumable bounded batches for large tables.

Do not depend on universal down migrations. Use rollback only when operation is safe and data-preserving; otherwise deploy a forward correction or restore from verified backup under an incident plan. Seed only deterministic reference/config data; never production-like personal data. Separate development/test DBs; ephemeral PostgreSQL per integration suite/CI job. Use transaction boundaries for business atomicity; long external calls do not belong inside DB transactions. Define backup frequency, encrypted offsite retention, PITR, RPO/RTO, restore permissions and periodic restore drills with Owner/operator after provider selection. Validate row counts, FK/unique violations, balances and application health after restore.

## 13. Database testing strategy

- Unit tests for pure domain/service logic and repository contract; mock only at boundary, not as proof of SQL semantics.
- PostgreSQL integration tests for repositories, migrations, transaction behavior, FK/unique/check constraints, JSONB/index-sensitive SQL, isolation and raw queries.
- Apply all migrations to empty DB and upgrade a prior-version fixture; verify migration status and data-preserving backfills.
- Constraint tests: duplicate property code, cross-property composite reference, invalid state/check, delete restriction.
- Transaction rollback: deliberately fail a later step and assert no partial durable writes.
- Concurrency: race booking inventory holds, room-night uniqueness, refunds/folio updates and idempotent retries; assert one valid outcome using separate connections and realistic isolation.
- Multi-property negative authorization tests: foreign IDs on read/write/search/report/export/job/cache paths; DB constraints are defense in depth, not user authorization.
- Backup/restore: restore into isolated environment, run integrity queries and representative application reads; measure RPO/RTO against approved objectives.
- SQLite can support some fast unit-level tests but is not an adequate substitute for PostgreSQL-specific constraints, locking/isolation, SQL syntax, JSON/index behavior or migration semantics.

## 14. Gate C readiness assessment

| Condition | Status | Evidence | Source / classification | Owner decision |
|---|---|---|---|---|
| Database technology | Needs Decision | OQ-036 open; PostgreSQL only proposed | Knowledge Base technology-selection question sourced from technology proposal, pp.1–3; not a BA-origin OQ | Select engine/provider/version/region |
| ORM | Needs Decision | No ORM approved or installed | Gate C technical proposal; no BA OQ selects an ORM | Select after DB/team review |
| Multi-property data model | Ready (preparation only) | Conceptual constraints documented; room count unknown | Conceptual proposal in this audit, §11; owner-confirmed business direction is single-owner/multi-property | Approve scope and later detailed model |
| Property isolation | Needs Decision | Principles proposed; no auth design approved | Architecture proposal, §11; authorization policy remains under OQ-041 | Confirm threat/control expectations |
| OQ-041 authorization | Blocked for final association/schema | Role cardinality/context unresolved | BA Part 2, p.41; OQ status preserved in `OPEN_QUESTIONS.md` | Answer nine policy points |
| OQ-034 guest sharing | Blocked for guest schema/behavior | Global/local/hybrid and blacklist open | BA Part 1, p.35; OQ status preserved in `OPEN_QUESTIONS.md` | Decide with OQ-019 legal input |
| Migration strategy | Needs Decision | Proposal in §12, no approved operator/release policy | Technical proposal in this audit, §12; no BA OQ selects a migration tool | Approve controlled production lifecycle |
| Environment configuration | Can Defer | `.env.example` safe; production environment/provider unknown | Repository configuration reviewed in §15; production provider remains unselected | Decide secrets/runtime configuration before deploy |
| Backup/restore | Needs Decision | No provider, RPO/RTO or owner identified | BA Part 1, NFR-AVL-001 `[A]`, p.9; operational owner unresolved | Assign operator and recovery objectives |
| Database testing strategy | Ready (preparation only) | PostgreSQL-specific plan in §13 | Technical testing proposal in this audit, §13 | Approve CI resource/test policy at implementation |
| Initial Git baseline | Completed in Git; rights review remains | Historical snapshot at `ade4d0d` / 2026-11-05; regenerate current count using the commands in §2 | `git rev-list --count HEAD`, `git ls-files | Measure-Object -Line` and `git log -1 --format='%h %cs'`; source-PDF distribution rights are a separate owner review | Confirm source-PDF distribution rights and any future baseline changes |

**Architecture Preparation:** may continue (concepts, diagrams, decision package). **Implementation Authorization:** absent. Do not create database/schema/migrations until Owner confirms database technology and scope; Dev Lead validates engine/provider fit; the relevant access/guest/legal policies are resolved for included entities; and a bounded implementation work package is explicitly authorized. OQ-041 and OQ-034 block their dependent schemas/behaviors even if unrelated neutral infrastructure is later authorized.

## 15. Initial Git baseline inventory

This section began as a candidate inventory. Its original snapshot was commit `ade4d0d` / 2026-11-05; that count is historical and the old “initial commit procedure” must not be read as a statement that the repository remains uncommitted. Regenerate current counts using the commands in §2. The inventory is retained as rationale, not as an instruction to stage files again.

### A. Required source, tests, configuration and build/run files – Include

`AGENTS.md`, `README.md`, `.editorconfig`, `.gitignore`, `.prettierignore`, `eslint.config.mjs`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.json`, `.github/workflows/ci.yml`; `apps/api/{package.json,tsconfig.json,.env.example,src/app.module.ts,src/health.controller.ts,src/health.test.ts,src/main.ts}`; `apps/web/{AGENTS.md,next-env.d.ts,next.config.ts,package.json,tsconfig.json,src/app/layout.tsx,src/app/page.test.tsx,src/app/page.tsx,src/app/styles.css}`; `apps/worker/{package.json,tsconfig.json,src/main.ts,src/worker.test.ts}`; `packages/config/{eslint.config.mjs,package.json,tsconfig.base.json}`. Reason: necessary project instructions, source, tests, CI and reproducible workspace configuration. `.env.example` is safe in current scan, but recheck before staging.

### B. Knowledge Base – Include

All `docs/knowledge/*.md` and `docs/knowledge/MODULES/*.md`, including this audit report after Owner review. These preserve project context, requirement/source traceability and decision status. Do not alter OQ/Decision states by adding report recommendations.

### C. Original source documents – Tracked; distribution-rights review remains an owner matter

All seven `docs/source/*.pdf` listed in §16 are currently tracked in the initial baseline. They are source-of-truth references; confirm redistribution/licensing and repository access policy. Do not edit/rename them.

### D. Excluded

Current ignored paths: `node_modules/`, `**/dist/`, `*.tsbuildinfo`, `**/.next/`, `**/out/`, `coverage/`, `.turbo/`, `.env`, `.env.*` (except `.env.example`), logs, `.DS_Store`, `Thumbs.db`. Also exclude caches, credentials, local databases/dumps, generated build output and real customer data if introduced. Do not commit `node_modules` or generated artifacts.

### E. Manual review

`docs/source/*.pdf` (rights/size decision), `.env.example` (secret recheck; currently safe), any unlisted/untracked files discovered immediately before staging. No other manual-review file surfaced in current inventory.

**Current task commit boundary:** no baseline files are being restaged as a whole. Changes are committed in bounded code and documentation commits with explicit file lists. The initial commit already contains the seven PDFs; no PDF content was modified in this work. Future additions/removals require a reviewed path list, secret scan, `git diff --cached --check`, and Owner decision before commit. Gate C remains unauthorized for Database Foundation implementation.

## 16. SHA-256 document integrity report

Hashes are SHA-256 over exact local file bytes; sizes in bytes.

| File | Bytes | SHA-256 |
|---|---:|---|
| `HMS_Tai-lieu-BA_Phan-1_v0.2.pdf` | 1,739,172 | `76BA3A615B701C241B37443004FBD3CC391271C4FFE7BEA86A2FC3D79BF60837` |
| `HMS_Tai-lieu-BA_Phan-2_v0.1.pdf` | 1,725,407 | `182ED208C4652734AFE12C577814BD7BBFD602DED92E2C3FC089B5D89D3555C6` |
| `HMS_Tai-lieu-BA_Phan-3_v0.1.pdf` | 1,619,048 | `7234A5D8327289CE74A2CD6A2E1A1F6D9B6DFC4D73DAB32E65421411377FF928` |
| `HMS_Tai-lieu-BA_Phan-4_v0.1.pdf` | 1,398,953 | `58CF0F3BB4D809163EA52C34110411E629227B497028F3FF886EB70C62CF5D20` |
| `hms-de-xuat-cong-nghe.pdf` | 49,334 | `F60F682461D67DC53507B64F01390F22F425444A198880F4F84240DB02E6BAF8` |
| `hms-de-xuat-giao-dien-v2.pdf` | 54,094 | `F77BFB679735E0FC18F1CC6968EE0C734E6E8EFAEFB2415FCA6A19E9CF6C8CB5` |
| `hms-de-xuat-trien-khai.pdf` | 55,178 | `F3ECC9353BFB0BCDC6B0656FF97E04B4D4716D17434D944DC6D0CB75346BA261` |

## 17. Risks and unresolved questions

OQ-036: DB engine/provider/version/region/operator/recovery. OQ-041: property memberships, role cardinality, Owner grants and context. OQ-034/OQ-019/OQ-045: guest linkage, blacklist and personal-data basis/access/retention. OQ-033 and OQ-031: included modules, room count, pilot, budget/team/timeline/operations. OQ-037 and tax/invoice OQs influence legal/property fields. Booking, inventory, payment and Night Audit OQs influence constraints and transaction workflows. RPO/RTO, backup cost and production operator have no confirmed values. ORM recommendations and all model examples remain proposals.

## 18. Recommended next steps

1. Owner resolves OQ-036 and selects provider/version/region and operational owner; Dev Lead validates technical fit and cost/operations.
2. Owner resolves OQ-041; obtain security review of the proposed scope and authorization controls.
3. Owner and legal counsel resolve OQ-019; Owner resolves OQ-034 and related OQ-045 access policy before guest schema.
4. Owner approves OQ-033 release scope and clarifies OQ-031 initial room count/pilot/resources before workload sizing or production commitments.
5. Select ORM and migration/backup/recovery/testing policies explicitly as Proposed → approved decisions only after review.
6. Owner reviews the already-created Git baseline, especially source-PDF distribution/access rights; do not recreate or restage the baseline wholesale.
7. Issue a separate, bounded Database Foundation authorization. This report itself does not authorize implementation.

### Exact Owner confirmations required before Database Foundation implementation

At minimum: (1) primary database technology and provider/version/region; (2) scope of the Database Foundation and included entities/modules; (3) whether staff can belong to multiple properties and hold different roles, Owner portfolio access and context semantics (OQ-041); (4) guest identity/history and blacklist scope, with personal-data purpose/retention/access policy coordinated with legal counsel (OQ-034/OQ-019/OQ-045), if guest data is included; (5) acceptable property-isolation and operational security controls; (6) migration operator/release and forward-recovery policy; (7) backup/restore ownership and RPO/RTO; and (8) explicit authorization to implement that bounded work. ORM choice and testing/environment policy also require explicit technical approval by the Owner/Dev Lead before they are installed or used. Module-specific OQs must be resolved before their schema is included. OQ-031 room count/resources are required for production sizing, not for a carefully bounded local technical foundation.

## Technical references consulted

- [PostgreSQL documentation](https://www.postgresql.org/docs/current/ddl-constraints.html) – constraints, transaction/concurrency, row security, backup/PITR.
- [Prisma transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions), [Prisma migrations](https://www.prisma.io/docs/orm/prisma-migrate), [raw SQL](https://www.prisma.io/docs/orm/prisma-client/using-raw-sql).
- [TypeORM transactions](https://typeorm.io/transactions), [migrations](https://typeorm.io/migrations), [relations](https://typeorm.io/relations).
- [Drizzle transactions](https://orm.drizzle.team/docs/transactions), [relations](https://orm.drizzle.team/docs/relations), [migrations](https://orm.drizzle.team/docs/migrations).
- [NestJS database integration](https://docs.nestjs.com/techniques/database).

Vendor documentation changes over time; pin exact ORM/database versions only after technology approval and verify features against those versions.
