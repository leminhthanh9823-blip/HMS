# HMS architecture design and technology baseline proposal

> **Document status:** only the single-owner, multiple-properties-from-first-release, no-unrelated-SaaS business direction is owner-confirmed. All technology choices in this proposal—including framework families, database, cache/queue, architecture patterns, packages and versions—are Proposed / Pending Approval. The Gate A/B prototype implementation is recorded below; this does not change proposal approval status. Compatibility was checked against official documentation on 2026-11-05; exact pins must be rechecked before implementation.

### Bounded Gate A/B implementation note (2026-11-05)

The Owner authorized pnpm `10.34.9`, NestJS `11.1.16`, Next.js `16.4.5`, TypeScript `5.9.3`, ESLint `10.14.0` and Prettier `3.9.10` for the repository foundation and empty shells. Node.js `24.11.1` was the available runtime; NestJS 11 was used to fit it. This records what was implemented, not an Owner-approved architecture selection. API/Web/Worker process shape, exact versions and all technology families remain Proposed / Pending Approval for the HMS product. PostgreSQL is not installed or configured, and OQ-036 remains open.

**Later security maintenance overlay (snapshot `ade4d0d`, 2026-11-05):** the current API manifest uses NestJS `11.1.29` for `@nestjs/common`, `@nestjs/core` and `@nestjs/platform-express`, plus root override `multer@2.5.0`. The recorded Gate A/B baseline above remains `11.1.16`; written Owner confirmation for the patch/override is still requested in [OWNER_CONFIRMATION_CHECKLIST.md](OWNER_CONFIRMATION_CHECKLIST.md). This overlay does not update the Gate A/B authorization record or approve product technology.

## 1. Business direction and decision status

| Statement | Status in this proposal |
|---|---|
| Business model and launch scale: Single-owner, multiple properties from first release; no unrelated SaaS tenants | **Confirmed by Project Owner, 2026-11-05; recorded in `DECISIONS.md`; OQ-032 business direction answered.** |
| Operational property sizing: 2–5 properties in first 12 months; target 6–10 in months 12–24; initial room count unknown | **Owner-provided planning input, 2026-11-05. OQ-031 remains open for room count, pilot, resources, timeline and operational ownership. This is not an architecture or capacity approval.** |
| Backend: NestJS + TypeScript | **Proposed / Pending Approval.** |
| Frontend: Next.js + React + TypeScript | **Proposed / Pending Approval.** |
| Primary database: PostgreSQL | **Proposed / Pending Approval.** OQ-036 remains open. |
| Cache/queue: Redis + BullMQ | **Proposed / Pending Approval.** |
| “Prefer maintainability and avoid over-engineering” | **Proposed principle.** No explicit owner confirmation can be traced. |
| Tailwind CSS, ORM/validation/testing/logging libraries and all version pins | **Not confirmed in the approved list; proposed below.** |
| Existing BA rules, requirement IDs and `[C]`/`[A]`/`[Q]` labels | Preserve as documented. A technical proposal does not change their status. |

OQ-032's business direction is confirmed. OQ-036 is unresolved because the Owner did not explicitly approve PostgreSQL. Adjacent data sharing, role assignment, privacy and delivery constraints remain under OQ-034, OQ-041, OQ-019 and OQ-031. See `OPEN_QUESTIONS.md`. No unresolved ASM value, technology, version or library is owner-approved.

## 2. One recommended architecture

**Recommend a single-owner, multi-property Modular Monolith from the first release, delivered as a pnpm TypeScript monorepo: one NestJS REST API, one Next.js App Router staff application, PostgreSQL as the authoritative store, and Redis/BullMQ for retryable asynchronous work.** This is the proposed architecture, not yet an approval of those implementation choices. Keep the API and worker as separate process entry points from the same backend codebase while sharing application/domain modules. Use Docker Compose for local development. The Owner's property ranges do not by themselves justify microservices, Kubernetes or another distributed architecture. Do not introduce those patterns, native mobile, GraphQL or SaaS tenant infrastructure unless a documented requirement and measured need justify them. Production hosting/provider remains open.

This candidate fits HMS because booking, inventory, payments, folios and audit need coordinated database transactions, while the system must serve a portfolio with property-scoped access and authorized consolidated reporting. The confirmed planning context is 2–5 properties in the first 12 months and 6–10 in months 12–24. That count alone says nothing about workload. The BA's `20` concurrent users/property target remains `[A]`, and room count, bookings, users, revenue, request rate and concurrency are not Owner-confirmed. A Modular Monolith keeps atomic workflows local while clear module ownership leaves room to split a module later if measured load, team boundaries or external integrations justify it.

### Sizing interpretation for technology evaluation

- Treat the two property ranges as portfolio context for property isolation, authorization administration, jobs and reporting, not as infrastructure sizing data.
- Do not select instance sizes, database/storage capacity, connection pools, Redis memory, worker counts, autoscaling thresholds or availability topology without room count and workload measurements.
- Evaluate Modular Monolith as a candidate for the current portfolio range, but retain **Proposed / Pending Approval** status. Revisit service boundaries only from measured load, deployment independence, team ownership or integration isolation needs.
- A one-property pilot does not permit a single-property schema or authorization shortcut; the release architecture remains multi-property-capable from the start.

### Business architecture: one owner, multiple properties

- Model one owner organization/account as the system's business root. Do not model SaaS customer signup, tenant billing, tenant plans, or cross-customer support administration.
- Treat each **Property** as an independent operational and data-access boundary. Every booking, room, rate, payment, folio, shift, business date, night-audit run and property-specific configuration belongs to one `property_id` unless a documented business rule expressly defines a chain-wide record.
- A staff user has one identity and property-specific role/permission assignments. The active property in the UI is a selector only; backend authorization derives permitted properties from the authenticated account and assignment records, never from a client-supplied ID. Owner access can span the properties assigned to the Owner role; other roles are scoped by assignment. OQ-041 remains relevant to whether a staff member may hold different roles at multiple properties.
- Owner reporting may aggregate across properties, but every result remains filterable and traceable to its property. Store each property's timezone, legal identity and `business_date`; do not use one global business date. Preserve source rules BR-004 and BR-007.
- Do not add `tenant_id` everywhere as a proxy for SaaS isolation. If the owner later confirms a commercial multi-owner product, that is a new architectural decision affecting identity, isolation, operations and legal obligations.
- Property-linked guest/blacklist data may be shared chain-wide only if the business confirms it (OQ-034). Do not infer global visibility from single-owner status.
- The multi-property boundary is required from day one, not a later migration target. Every operational command resolves one authorized property explicitly; an Owner-level consolidated read is a separate permissioned use case and does not make a write property-agnostic.

### Property ownership and shared data classification

Do not mechanically add `property_id` to every table. Classify each record by business ownership and enforce cross-boundary references:

| Class | Examples / likely ownership | Boundary design |
|---|---|---|
| Owner-wide identity/configuration | Owner account, employee login identity, global role/permission definitions, system-level configuration | No property key where the entity is genuinely global. Property access is granted through explicit user × property × role/permission assignments. Do not encode a one-property-per-user assumption. |
| Property-scoped operations | Property configuration, room/type, rate plan, booking, allocation/inventory, cashier shift, payment/folio operations, Night Audit/business date, property-specific exports and operational settings | Carry explicit `property_id` on the aggregate/root or scoped record. Use tenant-safe relationships (composite FK or equivalent service validation) so a child cannot reference another property's record. The property key is the operational and authorization boundary. |
| Shared catalog/reference | Global role/permission vocabulary or controlled reference data with no property-owned mutable state | Share only immutable or centrally managed reference values. Property overrides become property-scoped records. |
| Potentially shared guest identity | Guest and blacklist records | Scope is unresolved under OQ-034. Keep identity ownership/linkage and operational booking/property references distinct; do not permit chain-wide lookup or blacklist visibility by assumption. |
| Cross-property audit/report result | Owner dashboard/report and audit of a cross-property action | Require an explicit authorized property set or an explicitly authorized owner-wide read. Record the actor, scope/property set and purpose as applicable. A missing `property_id` must never act as an authorization bypass. |

Property context comes from the authenticated identity's server-validated grant and an explicit request/job scope, not trust in a browser selector or payload. Reject or return the BA-prescribed cross-property not-found response for out-of-scope resource IDs and record the access attempt as applicable (BR-069 is a proposed addition in source). Owner users may use authorized consolidated dashboards/reports; business writes still resolve an explicit property. Cache keys, idempotency keys, exports, notification payloads, audit events and scheduled-job identities must include property scope or a deliberate owner-wide scope to prevent accidental cross-property reuse.

## 3. System architecture and module dependencies

### System view

```text
Staff browser
    │ HTTPS; secure session cookie; JSON REST API
    ▼
Next.js web app ─────────────── NestJS modular monolith API
                                      │
                         ┌────────────┴─────────────┐
                         ▼                          ▼
                 PostgreSQL (source of truth)   Redis + BullMQ
                         │                          │
                         └── durable outbox ────────┘
                                                    ▼
                                             Worker process

Private object storage ◄── short-lived authorized file access ── API
```

External providers (OTA/channel manager, bank/payment, e-invoice, lodging declaration, messaging) remain integration boundaries. Their inclusion, sequence and legal status depend on the relevant OQs and phase decisions; the architecture does not imply that any provider is selected.

### NestJS module boundaries

Use the BA's named modules as domain ownership boundaries. These groupings are code organization only; they do not merge BA modules, change scope or create unapproved FRs.

| Backend area | HMS modules | Responsibility / dependency direction |
|---|---|---|
| Identity and access | EMP, RBAC | Staff accounts, sessions, role/property assignments and approval authorization. Other modules call authorization/application interfaces; they do not implement their own access rules. |
| Property and catalog | PROP, ROOM, CFG | Property lifecycle/timezone/business-date settings; room types, physical rooms, parent/child definitions and property configuration. `PROP` is the source of property identity. |
| Pricing | RATE | The sole quote/rate/policy calculation interface used by BOOK and INV. Confirmed bookings retain a snapshot; financial history is not silently repriced. |
| Inventory and calendar | CAL, with allocation operations owned alongside BOOK | Availability projection, room-night allocation, capacity holds and room assignment. All writes pass through one atomic allocation operation; calendar is not an alternate write path. |
| Booking and guest | BOOK, GST | Booking state transitions, guest references, hold lifecycle and property scoping. Depends on RATE for quote and inventory operations for allocation. |
| Front office | FO, FO-NA | Check-in/out and stay operations; FO-NA owns exclusive, sequential per-property business-date closure and posting coordination. |
| Finance | PAY, INV | Payment matching, shifts, refunds, immutable folio entries, settlement, receivables and regulated-document references. Cross-module operations use explicit application services in the same transaction. |
| Operations | HK, MNT, AST | Housekeeping tasks/state, maintenance tickets and asset functions as specified by their approved scope. HK/MNT propose pending charges; only permitted finance/front-office paths post them. |
| Audit and integrations | AUD, NTF, RPT, CHN | AUD is a mandatory transactional audit interface. NTF/CHN perform outbound or inbound integration through durable jobs. RPT reads approved projections/queries and does not mutate operational records. BA Part 4 says detailed requirements for AST, NTF, RPT and CHN are incomplete; do not invent missing behavior. |

Allowed dependency direction: API/controller → application use case → owning module/domain → repository; a module may call another module's published application interface, not its tables or private internals. Avoid circular module imports. Cross-module workflows (for example booking confirmation + deposit match + audit) are orchestrated by an application use case and committed together where a single business transition requires atomicity.

## 4. Technology baseline candidates

> **Prototype Gate A/B actual (verified 2026-11-05):** Node.js `24.11.1`, NestJS `11.1.16`, TypeScript `5.9.3`, pnpm `10.34.9`. These are the bounded prototype runtime/tool versions, not approved HMS product selections. The candidates below remain Proposed / Pending Approval.

| Component | Proposed candidate in this document | Prototype Gate A/B actual |
|---|---|---|
| Node.js | `24.22.2` | `24.11.1` |
| NestJS | `12.3.0` | `11.1.16` |
| TypeScript | `6.0.x` | `5.9.3` |
| pnpm | `12.x` | `10.34.9` |

The word **Unverified** below means evidence has not established compatibility or a fact at the exact candidate/version level. Such entries must not be treated as validated comparison advantages or decision evidence; they are retained as unresolved validation work.

Every row below is a candidate and remains Proposed / Pending Approval. Official docs show a coherent candidate set in some areas, but this is not a package-manager peer-resolution check, build, or security audit. Node 26.13.0 entered LTS on Oct 28, but Prisma ORM 7's explicit supported runtime list does not include Node 26; Node 24.22.2 aligns with both NestJS 12 tooling and Prisma 7's documented ranges. NestJS 12's CLI tooling requires TypeScript 6 and a newer Node floor than its application runtime. ([Node.js releases](https://nodejs.org/en/about/previous-releases), [Node 26.13.0 LTS release](https://nodejs.org/en/blog/release/v26.13.0), [NestJS 12 migration guide](https://docs.nestjs.com/migration-guide), [Prisma 7 requirements](https://www.prisma.io/docs/orm/v7/reference/system-requirements))

| Layer | Version candidate | Recommendation and rationale | Risks / approval state |
|---|---|---|---|
| Runtime | Node.js 24.22.2 LTS observed Oct 28; candidate only | NestJS 12 CLI requires Node 24.15+ on the 24 line; Prisma 7 explicitly supports `^24.0.0`; Next.js 16 floor is 20.9. | Node 26.13.0 is also now LTS, but Prisma 7's listed runtime ranges do not include 26, so the Node 26 + Prisma 7 combination is unsupported/unverified. Recheck current patch before lock. Pending approval. |
| Backend framework | NestJS 12.3.0 stable candidate (released Oct 27); package set/patches Unverified | Modules, guards/pipes and explicit providers fit the API shell. Nest 12 supports Standard Schema and offers ESM or CommonJS layouts. | v12 changes ESM defaults, CLI/build tooling, `@nestjs/config`, NATS and error mapping. v12.3 recommends the new `@nestjs/platform-node`; existing proposal lists `platform-express`. Adapter, middleware and logger compatibility must be evaluated before selection. Pending approval. |
| Frontend framework | Next.js 16.4.5 candidate (Active LTS); App Router candidate | Official support policy lists 16.x Active LTS; install guide sets Node 20.9 and TypeScript 5.1 minimums. | Tagged 16.4.5 package metadata declares React/React DOM peers `^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0`; React 19.3 satisfies declared `^19.0.0`. App Router still integrates React canary internals; build/adapter compatibility remains to validate. Pending approval. |
| UI framework | React + React DOM 19.3.0 stable candidate | React official versions page identifies 19.3.0 as stable; keep `react` and `react-dom` aligned. | Next package peer metadata accepts React 19; framework-integrated canary behavior and actual production build remain to verify. Pending approval. |
| Language | TypeScript 6.0.x candidate; exact patch unverified | NestJS 12 schematics require TS 6; Next.js floor 5.1, Prisma 7 floor 5.4, Zod 4 tested with TS 5.5+. | TS 6 changes defaults (`strict`, `module`) and deprecates `moduleResolution: node10`; audit tsconfig/tooling before migration. Pending approval. |
| CSS | Tailwind CSS 4.3.4 stable candidate with `@tailwindcss/postcss` | Official release list marks 4.3.4 as current stable at review time; official guide documents Next/PostCSS integration. | v4 requires Safari 16.4+, Chrome 111+, Firefox 128+. Confirm staff browser floor; v3-to-v4 config/plugin migration is breaking. Pending approval. |
| Relational database | PostgreSQL 18.6 candidate (current minor observed); technology not approved | PostgreSQL 18 is supported through Nov 2030 and offers relational constraints and transactions relevant to BA requirements. | OQ-036 must be answered first. PostgreSQL major upgrades require dump/reload or `pg_upgrade`; choose provider, backup/recovery and operational owner separately. Prisma 7's PostgreSQL 18 support is documented, but extensions/provider behavior are not validated. Pending approval. |
| Cache/job broker | Redis 7.4.6 or 8.2 extended-support line candidates; exact patch and managed-service images unverified | Official lifecycle marks 7.4 extended through Dec 2029 and 8.2 extended through Sep 2030; 8.10/8.8/8.6/8.4 are GA standard lines. Official docs recommend latest available version. | BullMQ server floor is Redis 6.2+; managed service compatibility still needs confirmation. Compare supported lines, client protocol, lifecycle and major-version migration before selection. Pending approval. |
| Queue | BullMQ 6.6.0 stable candidate (listed Nov 4) | Supported Redis 7.4 and 8 lines exceed BullMQ's Redis 6.2 minimum; supports separate workers and retries. | v6 is breaking from v5: repeatable-job APIs are removed, Job Schedulers replace them, backend interfaces changed, and ioredis is an optional peer requiring explicit install. node-redis integration requires v5+ and BullMQ's adapter. Duplicate delivery still requires idempotent handlers. Pending approval. |
| ORM | Prisma ORM 7.x stable candidate, with matching adapter/driver; exact patch unverified | Prisma 7 supports PostgreSQL 18 and requires driver adapters for direct connections; ESM/config changes apply. | Prisma ORM 8 is Release Candidate, not a stable baseline. Prisma 7 migration concerns include ESM, explicit client output, adapter/client construction, CLI/config and removed behaviors. ORM pending approval. |
| Input validation | Zod 4.x; v4.5 release observed; newest patch Unverified | Runtime schemas and JSON Schema conversion can share validation intent between API/configuration. Zod supports TypeScript 5.5+ and requires `strict`; use `bundler`, `nodenext` or `node16` resolution. | Nest 12 Standard Schema support exists, but exact Zod-to-Nest/OpenAPI integration and peer set are not resolved; avoid relying on unverified `4.2+` claim. Pending approval. |
| Authentication | NestJS guards + opaque server-side sessions, secure HTTP-only cookies | Best fit for a first-party staff browser UI; easy immediate revocation and property-aware session context. Store session records in PostgreSQL initially; Redis may cache lookups but is not authoritative. Hash passwords with Argon2id. Require MFA for privileged/remote approvals per NFR-SEC-001, subject to OQ-043; do not invent the OTP channel. | Session lifetime, recovery, counter-device PIN and MFA enrollment remain OQ-040/042/043/044. No third-party identity provider selected. Candidate only. |
| API style | REST/JSON over HTTPS; Postman collection → generated OpenAPI 3.1 | Resource reads plus explicit commands (hold, confirm, allocate, match payment, post, settle, run Night Audit) map clearly to audited business transitions. The collection is runnable for callers and carries auth, examples and error cases; OpenAPI serves wider tooling/client generation. | Avoid generic CRUD for stateful financial/inventory objects. Keep one authoritative direction (collection → OpenAPI) and compare implementation-generated schemas against the contract. Candidate only. |
| API documentation | Postman collection as reviewed source of truth; Postman CLI OpenAPI 3.1 export; `@nestjs/swagger` as implementation-side OpenAPI 3.0 documentation | Makes operations, auth/scopes, inputs, examples and retryable errors reusable; Nest Swagger provides visibility into implemented routes. | No API contract exists in this repo. Do not invent endpoint details before BA decisions; keep Nest-generated docs subordinate to the approved collection to prevent competing definitions. Candidate only. |
| Unit/integration tests | Vitest 5.1 stable candidate (released Nov 2); exact patch Unverified; Nest `@nestjs/testing` | Vitest 5 requires Node 22.12+ and Vite 6.4+. NestJS 12 selects Vitest by default for ESM scaffolds. Use selected-database integration tests for locking/constraints after OQ-036. | Next.js supports Vitest for unit tests, but async Server Components are not fully supported by unit runners; use Playwright for those flows. Pending approval. ([Vitest 5.1 announcement](https://vitest.dev/blog)) |
| Browser tests | Playwright current supported 1.x | Validate staff workflows and property switching in real browser behavior. | Keep a small risk-based suite; tests must use seeded disposable test data. Candidate only. |
| Logging | Pino 10.x + pino-http 11 + nestjs-pino 5.x; exact patches Unverified | Adapter compatibility table documents NestJS 12.0.2+, Pino 10, pino-http 11 and Node 22.12+. Structured request/job logs. | Sanitize sensitive values before serialization; the adapter can log error stacks. Keep operational logs separate from AUD. Pending approval. ([nestjs-pino compatibility](https://github.com/iamolegga/nestjs-pino)) |
| File storage | Private S3-compatible object storage; AWS S3 as reference service if AWS is selected | Durable encrypted storage for guest identity documents and exports, separated from relational records; short-lived authorized downloads. | Choose provider/region after data-residency, legal and budget review. Use lifecycle/versioning policies consistent with OQ-019; never make public objects or log signed URLs. Candidate only. |
| Local containers | Docker Compose for API, web, PostgreSQL, Redis and optional S3-compatible local emulator | Consistent development environment without a cloud account; keep external integrations mocked or sandboxed. | Compose is development tooling, not production orchestration or backup. Candidate only. |

### Decision comparison matrix (all Proposed / Pending Approval)

| Choice and HMS role | Why proposed / advantages | Disadvantages and technical risks | Dependencies and compatibility to validate | Status |
|---|---|---|---|---|
| **NestJS** — backend HTTP/application framework | Modular providers, guards, pipes and test utilities map to HMS's explicit use cases and authorization boundary. | Framework conventions and adapter-specific middleware add learning/upgrade work; Nest 12 migration has ESM, config, CLI/build and HTTP error-mapping changes. | Node 24.15+ for Nest 12 CLI; TS 6 peer for v12 schematics; align all `@nestjs/*` majors. v12.3 recommends `@nestjs/platform-node`; Pino, uploads and middleware adapter support need exact peer/build verification. | Proposed / Pending Approval |
| **Next.js** — staff web shell and server-rendered UI | Integrated routing, server rendering and TypeScript tooling can support the staff portal. | Couples UI to framework lifecycle and App Router conventions; server/client component boundary and framework-integrated React canary complicate debugging and upgrades. | 16.x Active LTS; Node >=20.9, TS >=5.1. App Router embeds React canary functionality; exact declared React/React DOM peer graph and build must be checked. | Proposed / Pending Approval |
| **React** — web component model | Component composition and ecosystem suit form-heavy staff workflows. | Client state can become a second source of truth; SSR/server component and hydration behavior add complexity. | React 19.3 is stable; Next App Router's internal canary is not equivalent to an independently resolved `react` peer. Keep `react`/`react-dom` aligned and verify Next's exact peer ranges/build. | Proposed / Pending Approval |
| **TypeScript** — shared language/type checking | Shared contracts and compile-time feedback across API, web and worker. | Types do not validate untrusted runtime input; compiler/tooling changes may affect a monorepo. | TS 6 required by Nest 12 schematics; TS6 changes defaults (`strict`, `module`, `types`, `rootDir`) and deprecates `node10` resolution/`baseUrl`. Choose `nodenext` for Node or `bundler` for Next/Vite; confirm test/lint peers. | Proposed / Pending Approval |
| **PostgreSQL** — candidate authoritative relational database | Transactions, constraints and row-level mechanisms suit inventory, financial integrity and audit needs in BA drafts. | Requires operations/backup expertise; schema/migration and major upgrades are consequential; RLS context with pooled connections can fail open if designed incorrectly. | OQ-036 open. PostgreSQL 18.6 supported; Prisma 7 documents PostgreSQL 18 but requires adapters. Provider extensions, pooler, migration tooling and restore path need validation. | Proposed / Pending Approval |
| **Redis** — candidate cache/queue transport | Low-latency ephemeral cache and BullMQ datastore; supported 7.4 and 8.x lines are candidates. | Adds stateful operations and failure modes; stale cache or using it as authority can cause availability/financial errors. | Redis lifecycle lists 7.4 extended through 2029 and newer supported 8.x lines; BullMQ server floor is 6.2. Compare managed service lifecycle, persistence/eviction, TLS, client and reconnect behavior before choosing. | Proposed / Pending Approval |
| **BullMQ** — candidate asynchronous job queue | Separate workers, delayed/retried jobs and schedulers support reports, notifications and expiry work. | At-least-once processing means duplicate-safe consumers; v6 breaks v5 repeatable-job and client/backend APIs. Redis outages and stalled workers need operational handling. | BullMQ 6.6.0 observed; Node floor 14.17, Redis 6.2+. node-redis adapter requires `redis` v5+; ioredis is optional peer in v6. No need to add Redis if PostgreSQL backend or simpler durable work is approved. | Proposed / Pending Approval |
| **Prisma** — candidate ORM/schema and migration tooling | Generated types and migration workflow could speed ordinary relational work. | ORM does not guarantee concurrency correctness; partial indexes/row locks require reviewed SQL; Prisma 7 changes adapter, ESM, generated output, config and migration behavior. | Prisma 7 supports Node 20.19/22.12/24 and TS 5.4+; Prisma 7 direct connections require a driver adapter. Node 26 is not in its supported runtime list. Verify `@prisma/client`, CLI, `@prisma/adapter-pg`, `pg`, ESM and Nest runtime together. | Proposed / Pending Approval |
| **pnpm monorepo** — repository/package layout | One lockfile and atomic contract/client changes fit a single team and shared TypeScript. | Workspace dependency boundaries and CI filtering need discipline; package linking can mask undeclared dependencies. | pnpm 12 is current; official compatibility table supports Node 24. Pin via `packageManager`/lockfile only after approval; test Windows, Linux and CI. | Proposed / Pending Approval |
| **Modular Monolith** — application/domain boundary | Keeps booking, inventory, folio and audit transactions in one deployable codebase while defining module interfaces. | Requires dependency discipline; shared database/schema and one release unit can become coupled as teams grow. | Independent of library version; depends on agreed module ownership, transaction boundaries and OQ-resolved policies. No evidence warrants microservices yet, but this remains a proposal. | Proposed / Pending Approval |
| **REST/OpenAPI** — API contract and web/API boundary | Explicit commands, status codes and stable errors fit stateful HMS operations and can generate clients/docs. | Requires contract ownership and versioning; generated OpenAPI can drift from implementation; REST command modeling can become ad hoc. | OpenAPI export version and source-of-truth direction must be chosen. Postman collection currently does not exist; Nest Swagger's output version/validation integration must not compete with it. | Proposed / Pending Approval |
| **Docker Compose** — local multi-service development | Reproducible local PostgreSQL/Redis and shell environment with portable service definitions. | Does not establish production topology, backups, secret management or operational readiness; host performance differs. | Compose Specification is current; supported CLI generations include v2 and v5. Pin no file-format `version`; verify the target Docker Desktop/Engine and platform images. | Proposed / Pending Approval |

### Combined compatibility assessment

| Combination | Officially documented compatibility | Assessment / remaining check |
|---|---|---|
| Node.js 24 + NestJS 12 + TypeScript 6 | Nest 12 CLI supports Node 24.15+ and requires TS6 peer; Node 24.22.2 is an LTS release candidate. | **Documented floors align.** Nest 12 ESM package format and TS6 config changes still require toolchain build validation. |
| Node.js 24 + Prisma ORM 7 + PostgreSQL 18 | Prisma 7's explicit supported Node ranges include `^24.0.0`, TS 5.4+, and PostgreSQL 18. Direct connection requires a driver adapter. | **Documented floors align.** Pin compatible Prisma/CLI/client/adapter/driver majors and validate ESM/runtime. Node 26 is excluded by Prisma 7's listed version matrix; don't infer support from its LTS status. |
| Node.js 24 + pnpm 12 + workspaces | pnpm's current compatibility table lists Node 24 as supported by pnpm 12; Windows is a supported platform. | **Documented runtime/platform fit.** Exact pnpm release, workspace linker behavior, scripts and CI parity remain to be validated. |
| NestJS 12 + Prisma ORM 7 | Nest 12 and Prisma 7 both support ESM; Prisma 7's ESM setup and driver adapter fit Nest 12's ESM package environment. | **Compatible with ESM configuration.** Confirm Prisma Client generation, shutdown lifecycle and interactive transaction behavior in the later approved spike. |
| Next.js 16.4.5 + React/React DOM 19.3.0 + TypeScript 6 | Next tagged package peer metadata accepts `^19.0.0`; Next docs support TypeScript >=5.1; React 19.3 is stable. | **Declared peer range aligns.** This is not a build result. Confirm matching React DOM, production build, App Router behavior and dependency security before approval. |
| Next.js 16 + Tailwind CSS v4 | Tailwind official Next guide configures v4 with `@tailwindcss/postcss`; Next supports PostCSS. | **Integration documented, exact minor/patch Unverified.** Confirm supported browsers with staff devices; v4 assumes modern browsers. |
| NestJS 12 + Zod 4 | Nest 12 supports Standard Schema validation; Zod docs identify v4 as flagship and TypeScript 5.5+ tested. | **Partially verified; exact Nest Zod conversion package and Zod minimum Unverified.** Do not pin 4.2+ based on this review alone. |
| NestJS 12 + Vitest 5.1 + Node 24 | Nest 12 ESM projects default to Vitest. Vitest 5 requires Node 22.12+ and Vite 6.4+. | **Documented runtime floors align.** Validate Nest test adapter/build peers; async Next Server Component journeys need browser E2E coverage. Exact patch remains Unverified. |
| NestJS 12 + Pino 10 + pino-http 11 | `nestjs-pino` v5 documents Nest 12.0.2+, Pino 10, pino-http 11 and Node >=22.12. | **Compatible with `nestjs-pino` 5.x.** Pino error logging may include stacks; redaction and output policy must be configured before production. |
| Redis 7.4/8.2 + BullMQ 6.6 | BullMQ supports Redis 6.2+; node-redis adapter supports Redis package v5+. Both candidate Redis lines exceed server floor. | **Server floors align; exact client/managed-service combination and optional-peer install behavior need validation.** Redis 7-to-8 is a major-version migration; BullMQ v6 also changes repeatable jobs and ioredis peer behavior. |

This is a documentation-based compatibility review, not an installed dependency resolution or build. Node 24.15+ aligns with NestJS 12's CLI floor and Prisma 7's documented Node 24 range; Node 26 is not supported by Prisma 7's listed runtime matrix. The tagged Next 16.4.5 React peer range includes React 19.3.0, but that does not prove build compatibility. Exact Nest adapter peers, Prisma adapter versions, Tailwind/PostCSS build, Zod integration and package-manager workspace behavior remain Unverified. Candidate versions are not pins; run an approved lockfile/build only after the related decision and implementation gate.

### Prisma versus TypeORM

| Criterion | Prisma ORM 7 | TypeORM 1.1.x |
|---|---|---|
| TypeScript ergonomics | Generated, schema-derived query types; strong fit for a small TypeScript team | Decorator/entity model is familiar in NestJS; types are closer to entity classes |
| Migrations and constraints | Prisma Migrate with editable SQL migration files; use SQL for partial indexes/RLS/advanced constraints | TypeORM migrations and query builder; SQL is available for advanced database behavior |
| Locking and complex transactions | Transaction API plus raw SQL; use raw SQL carefully for explicit locks and inspect generated SQL | QueryRunner/transaction manager and lock options give more direct SQL-shaped control |
| HMS trade-off | Faster common data work and compile-time query feedback, with deliberate SQL escape hatch for integrity-critical paths | More direct persistence mapping, but decorators/entity coupling and broader ORM behavior can obscure SQL if conventions are loose |

**Recommendation: Prisma ORM 7**, with checked-in SQL migrations for database invariants and limited reviewed raw SQL for concurrency-critical operations. This chooses team maintainability for routine work without surrendering PostgreSQL controls. Before approval, the Dev Lead should demonstrate a `RoomNight` partial unique index, atomic room-type capacity update, `SELECT … FOR UPDATE`, audit append in one transaction and recoverable migration path. Do not use ORM schema sync in production. Prisma ORM 8 is still release candidate in the official docs at the review date; OQ-036 and this ORM choice are both unapproved.

## 5. API, authentication, authorization and security

The API and security recommendations in this section remain proposals. The actual Gate A/B prototype versions are listed in §4 and do not imply approval of these product choices.

### Next.js ↔ NestJS and API choice

- Next.js communicates with NestJS through REST/JSON over HTTPS. Keep separate origins only if deployment/CSRF/CORS behavior is deliberately configured; a same-site reverse-proxy route is a straightforward production option.
- Establish the API contract before implementing endpoints. Maintain the Postman collection as the reviewed runnable source of truth; export OpenAPI 3.1 from it with Postman CLI and generate `packages/api-client` from that export. Nest Swagger may describe implementation routes in its documented OpenAPI 3.0 output, but compare it against the collection and do not let it become a second manually maintained contract.
- For each operation, document required/optional inputs, auth and property scope, response shape, side effects, idempotency/retry rules and relevant success/error examples. Do not invent unresolved behavior from ASM values.
- Use REST for normal reads and explicit command endpoints for state transitions. Do not use GraphQL: HMS has no demonstrated need for arbitrary graph querying, while explicit command endpoints are easier to authorize, audit, make idempotent and document.
- Poll or refresh calendar data initially. Add Server-Sent Events only if measured freshness needs justify it; never make a browser push channel the authority for inventory.
- Standardize errors with stable machine-readable codes and an RFC 9457-style problem response. Never return stack traces or SQL errors. Include request/correlation ID and safe retry guidance for concurrency conflicts.

### Authentication and RBAC

- Individual employee accounts (BR-065), password hashing with Argon2id, server-side revocable sessions, secure/HttpOnly/SameSite cookies, CSRF protection on writes, login throttling and lockout policy.
- MFA for Owner/Manager/Admin and remote approvals follows the BA baseline NFR-SEC-001, but TOTP vs SMS/Zalo, recovery and cost remain unresolved in OQ-043. OQ-040, OQ-042 and OQ-044 also affect approval and counter behavior.
- NestJS guards check authenticated identity and coarse permissions; each application use case enforces action permission, approval thresholds and property scope. The browser's selected property is a requested context validated against the user's assignments, not an authority.
- Store role grants as user × property × role/permission assignments. Model an explicit Owner-level grant for cross-property operations, separated from System Admin platform functions. Preserve the rule that System Admin has no business-operation authority (RBAC source; BA Part 2, pp.30–32).
- Use PostgreSQL RLS only as defense in depth after selecting safe transaction/session-context handling with pooled connections. Application authorization remains mandatory. Test cross-property read and write denial, including background jobs.

### Security baseline

- TLS for all external connections; managed secrets/KMS outside source control and container images.
- Encrypt identity documents and sensitive fields with authenticated encryption and KMS-managed keys; use a keyed HMAC blind index only for approved equality matching. Argon2id is password hashing, not encryption. Mask personal fields in responses, exports and operational logs; full view/export is permissioned and audited (BR-063, BR-066).
- Never store card number/CVV/expiry (BR-046). Payment method integrations must use tokenized/provider-side data if later approved.
- Verify signatures, timestamps and idempotency on future webhooks; rate-limit login, guest lookup and external-reference lookup (BR-073/074).
- Keep audit trail separate from logs. Apply least-privilege DB credentials: migration role, app role, read/report role and audit-writer controls as feasible.
- OQ-019 blocks final retention/deletion/incident procedures. The five-year ASM is not a retention decision. Privacy behavior must include DB, object versions, exports, logs and backup expiry under counsel-approved rules.

## 6. Database relationships and transaction design

### Database relationship model

The logical relational shape should express:

```text
OwnerAccount 1 ── N Property
Employee 1 ── N PropertyRoleGrant N ── 1 Property
Property 1 ── N RoomType / Room / RatePlan / BusinessDate / CashierShift
Property 1 ── N Booking ── N BookingRoom ── N RoomNight
Booking 1 ── N GuestLink / Folio / PaymentAllocation
Folio 1 ── N ImmutableFolioEntry
Payment 1 ── N PaymentAllocation; Refund references original payment
Sensitive business action 1 ── 1+ AuditEvent (same transaction where required)
```

Exact entities and optional relationships remain subject to BA decisions (including OQ-001/OQ-003). Use foreign keys and explicit property ownership. Favor `property_id` on records that are scoped to a property; validate through composite foreign keys or service checks where it materially protects against cross-property reference errors. Keep money and inventory relational and normalized. JSONB is for genuinely variable metadata, never the authoritative ledger or allocation structure.

### Booking and Room Inventory

- A single allocation service owns all writes to `RoomNight` and `RoomTypeInventory`; booking, calendar, maintenance/OOO and front desk cannot independently reserve capacity.
- For assigned stays, enforce at most one active `(room_id, stay_date)` at the database layer with a partial unique index, including the appropriate booking/OOO/day-use active states. For unassigned inventory, lock the `(room_type_id, stay_date)` capacity row and atomically verify/update `sold <= capacity`.
- Multi-room booking hold is all-or-nothing (BOOK); validate all nights/units, lock rows in deterministic order, create holds and state change, and write audit in one transaction. Use optimistic version checks on later edits; reject stale calendar drag/drop rather than silently overwriting.
- Expired holds must be ignored for availability even before a cleanup job runs (BR-012). A background job may transition status and notify, but it is not responsible for correctness of the live inventory calculation.
- Conflict does not consume inventory until resolved. Parent/child exclusivity remains unresolved by OQ-001, so schema/algorithm must not hard-code the ASM as confirmed.
- Use idempotency keys for retried commands. Return a controlled conflict (409) with refreshed availability when a competing booking wins.

### Pricing snapshot

RATE remains the only pricing engine. Quote output includes nightly price/source, applicable supplements, tax treatment where confirmed, cancellation/deposit policy and currency/rounding details. BR-021 says snapshot price/policy at Confirmed; later changes do not rewrite the historical quote. Hotel-caused move vs guest-caused reprice follows BR-021 only after its rules are confirmed. Store a versioned snapshot/reference and line-level values used by the booking/folio; do not recalculate past charges from current rate configuration. Tax questions remain OQ-014/OQ-015/OQ-037/OQ-055 as applicable.

### Deposit, payment and folio

- Payment provider/bank observations are evidence records. A transfer remains Pending until verified/matched (BR-038); screenshots alone do not satisfy a deposit. Use a unique external bank reference and idempotent reconciliation.
- In one database transaction, match payment, allocate against the folio/deposit, transition booking if deposit sufficiency is reached, append immutable ledger/audit entries, and persist outbox notifications. OQ-011/012/021/048/049 still affect deposit, payment channels and reconciliation behavior.
- Store amounts in fixed-precision `NUMERIC` or integer minor units with explicit currency and rounding rules; never use binary floating point for money. Do not allow a refund total above net received (BR-033); lock the folio/payment allocation during refund execution and use maker-checker approval.
- Folio entries and posted payments/refunds are immutable; corrections are reversal/adjustment records referencing originals (BR-040/043). Use idempotency keys and row locks so concurrent payment/refund/settlement requests cannot over-allocate or settle twice.
- Checkout settlement reads a consistent folio snapshot and requires the approved zero-balance/AR/refund/GuestCredit treatment (BR-041); settlement and audit commit together. Receipt numbering/sequential-gap semantics depend on OQ-046 and must not be assumed from database sequence behavior.

### Night Audit

Night Audit is serialized per property and business date: acquire a DB lock/lease keyed by `(property_id, business_date)`, verify preconditions, post each eligible room charge at most once using a unique business key, persist checkpoints/no-show/task effects, append audit events, then advance only that property's `business_date`. Use one logical run ID with idempotent steps and resumable checkpoints. Do not advance the next date before all required postings succeed. Retry resumes the same run; manual repair/reopen is permissioned and audited. This preserves BR-004/008 and FO-NA's sequential/idempotent behavior. Manual vs scheduled timing stays OQ-052; revenue recognition remains OQ-016.

## 7. Redis, BullMQ and module coordination

- Redis is an optional accelerator and queue transport, not the source of truth. Do not place inventory holds, payment status, folio balance, audit chain or business-date state solely in Redis.
- Use BullMQ for retryable notifications, reports/exports, expiry processing and future signed integrations. For any DB commit that must emit work, write an outbox row in the same PostgreSQL transaction, then a dispatcher enqueues it. The consumer records completion/retry state and is idempotent by event/job key.
- Set bounded retries with exponential backoff and jitter, queue-age/failure alerts, dead-letter/manual review flow, graceful worker shutdown and concurrency limits. Jobs re-check authorization/scope where needed and always carry `property_id` explicitly.
- If Redis is unavailable, core booking/payment/folio transactions can still commit when no required durable asynchronous side effect is part of that synchronous acceptance contract; notifications and outbound integrations should be delayed and visible. Do not report a side effect as sent until provider response is recorded.
- Keep cross-module synchronous calls in-process through interfaces. Do not introduce a message broker or distributed transaction for internal module communication.

## 8. Audit, file storage, logs and error handling

The mechanisms below are technical proposals. Source-derived rules retain their BA labels; a proposal does not promote `[A]`/`[Q]` into policy. In particular, BR-010/011/013 are `[A]`, BR-014 and BR-060/062/067 have unresolved OQs, and NFR-DATA-001 contains candidate database controls. Business rules, database technology and provider must be approved before implementation.

| Concern | BA basis / status | Technical proposal | Gaps and risks before approval |
|---|---|---|---|
| Transaction boundaries | Atomic booking/payment/audit rules appear in BA drafts; detailed semantics are `[A]`/`[Q]`. NFR-AUD-001/BR-061 provide audit integrity constraints, qualified by draft-baseline status. | Put one business state transition, required audit append and durable outbox intent in the same DB transaction where the BA contract requires atomicity. Keep external calls outside transactions. | Approve database (OQ-036), actual command semantics and failure outcomes; test rollback and lock ordering on selected DB. |
| Booking concurrency / room availability | BR-010/011/013 `[A]`, BR-014 `[Q]` OQ-005; RC-01+ and CAL/BOOK draft requirements. | One allocation service; transactionally guard active `(room_id, stay_date)` uniqueness and atomically change room-type capacity; deterministic lock order, optimistic version for edits, conflict response on races. | OQ-001/002/005 and DB choice affect constraints. Partial indexes/locking are provider/ORM-specific; stale cache must never authorize a booking. |
| Payment idempotency | BR-030/033/038/040 and PAY/INV requirements are draft `[A]`/`[Q]`; RC-18/19 cover concurrency risks. | Unique external reference where confirmed; idempotency key per command; lock allocation/folio; append immutable reversal/adjustment and audit with transaction. | OQ-011/012/021/046 and payment provider outcome semantics remain open. Unknown external outcome requires reconciliation, not blind retry. |
| Audit trail | BR-061 `[C]` source label, NFR-AUD-001, AUD module; other AUD behavior includes OQ-019. | Append-only event written atomically with protected action, scoped to property or explicitly authorized owner-wide context; separate business audit from operational logs. Hash-chain details are proposed. | Retention/anonymization, key custody/rotation and legal deletion are not settled (OQ-019). Verify append failure rolls back action; do not treat SHA-256 choice as approved. |
| Outbox and retries | No queue implementation selected by BA; idempotency and notification/integration requirements are draft. | Persist job intent in the same DB transaction, dispatch asynchronously, deduplicate by stable event/job key, use bounded retry/backoff, and record terminal failure. | Redis/BullMQ are not approved; define retryable vs terminal failures, ordering, retention, dead-letter/manual repair and worker authorization before release. |
| Cache and invalidation | No BA rule approves a cache or consistency window. | Keep inventory allocation, payment, folio, business date and audit authoritative in the approved DB. If cache is approved, key by property and authorization scope; invalidate/version after committed changes (outbox is a candidate) and use bounded TTL. | Current proposal names property-scoped keys but does not define invalidation/version semantics. Do not serve cached availability as a write decision or reuse a response across user/property scopes. Staleness tolerance needs Owner/Dev decision per data class. |
| File/object storage | GST/AUD data handling and `OQ-019`; data region/provider and spend touch OQ-031. | Private object storage with opaque keys, encryption, short-lived authorized access, checksum and property/actor metadata; never log signed URLs or identity payloads. | S3 API/AWS is only a proposal. No real PII/file processing until legal basis, retention, deletion, backup/version expiry, region and provider are approved. |
| Backup and recovery | BA NFR-DATA-001 includes RPO/RTO values as `[A]`; operational owner and provider unresolved. | Encrypted backups/PITR candidate plus scheduled restore drills and migration replay from empty; production backup/restore owner and runbook required. | Do not publish RPO/RTO as approved SLA. Provider, retention/legal holds, encryption keys, restore isolation and acceptable data loss need explicit approval and a tested recovery design. |
| Logging and monitoring | BA security/audit requirements, draft NFR availability/performance targets `[A]`; no logging vendor selected. | Structured redacted request/job logs, metrics for API/DB/queue/storage/Night Audit and alerts tied to owners. Pino is a candidate implementation library. | Redaction must cover errors/traces/exports; log retention and incident process intersect OQ-019. Exact Nest adapter/logger compatibility and observability ownership are not verified. |

### Audit trail

AUD is a business integrity module, not application telemetry. Write audit entries in the same database transaction as the protected state change so an action cannot commit without its required audit record (NFR-AUD-001). Record actor, role/property context, action, entity/version, timestamp, correlation ID, reason/approval and masked before/after values. Enforce append-only permissions; hash-chain events per agreed scope and periodically verify/anchor checkpoints. No application or admin role may update/delete audit history (BR-061). Define key rotation, retention and verification recovery with the security owner; personal fields stay masked.

### File storage

Use private S3 API object storage, separate from application containers and ordinary relational rows. Store object key, property/guest reference, checksum, encryption metadata, upload actor and lifecycle status in PostgreSQL; never store public URLs. Use server-side upload authorization or short-lived signed URLs, content-type/size allowlists, malware scanning where operationally available, encryption at rest, versioning policy and audit on full view/export. Keep original document data out of logs and analytics. Region/provider and lifecycle depend on OQ-019 and OQ-031.

### Operational logs and monitoring

- Emit structured JSON logs via Pino. Include request/job ID, trace ID, route/operation, actor ID (not credentials), property ID where appropriate, outcome, duration and safe error code. Redact tokens, passwords, ID numbers, guest contact/document values, payment details and signed URLs before output.
- Keep a clear boundary: business audit events in AUD; operational logs/metrics/traces in observability tooling. Do not use log search as the only audit record.
- Instrument HTTP latency/error rate, DB connection/lock wait, queue depth/oldest age/retry rate, worker health, object-storage failures, Night Audit run state, backup/restore status and audit-chain verification. Add alerts tied to an on-call owner and runbook; retain the BA NFR availability/RPO/RTO figures as `[A]` until approved.
- Health endpoints distinguish liveness from readiness; do not expose secrets, DB versions or detailed dependency errors publicly. Graceful shutdown drains requests/jobs before container exit.

### Error handling

Use a global Nest exception filter to map validation, authorization, not-found, idempotency, concurrency and dependency failures to stable error codes and safe HTTP statuses. Include correlation ID and a message suitable for the UI. Never leak stack/SQL/provider details to clients. Log internal cause with redaction. Retries are limited to idempotent operations and known transient failures; validation, authorization and business-rule errors are not automatically retried. For uncertain payment provider outcomes, preserve a reconciliation state instead of creating a duplicate payment.

## 9. Repository structure and source control

### Monorepo vs separate repositories

| Choice | Benefits | Costs / HMS fit |
|---|---|---|
| One monorepo with separate app packages | One PR can update API schema and generated client together; one lockfile/CI policy; documentation, migrations and infra changes are traceable; fits one project team and shared TypeScript | Requires path/package boundaries and CI filtering; avoid coupling deployment releases. Recommended. |
| Separate backend/frontend repositories | Independent permissions and release cadence; useful for distinct teams/orgs | Contract changes need coordination/version publication; duplicate tooling and slower atomic review. No current organizational need supports this overhead. |

**Recommendation:** pnpm workspaces monorepo with independently buildable/deployable API and web applications. Start without Nx/Turborepo; add a build orchestrator only when CI time or team scale warrants it. Generated OpenAPI client/types are shared; domain logic and ORM models are not imported into the frontend.

```text
hms/
├─ apps/
│  ├─ api/                         # NestJS HTTP API
│  │  └─ src/modules/{identity,property,room,rate,inventory,booking,guest,
│  │     front-office,night-audit,finance,operations,audit,integration,reporting}/
│  ├─ worker/                      # BullMQ consumers; same domain/application packages
│  └─ web/                         # Next.js staff application
├─ packages/
│  ├─ api-client/                  # generated from collection's OpenAPI export
│  ├─ config/                      # shared lint/format/TS config only
│  └─ ui/                          # shared accessible presentational components
├─ database/
│  ├─ prisma/schema.prisma
│  ├─ prisma/migrations/           # checked-in migrations, including reviewed SQL
│  └─ seed/                        # deterministic non-production reference data
├─ infra/
│  ├─ docker/                      # Dockerfiles and local compose definitions
│  ├─ deployment/                  # provider-specific config after provider decision
│  └─ observability/               # dashboards/alerts/runbooks as selected
├─ docs/
│  ├─ knowledge/                   # BA-derived requirements and approved proposals/decisions
│  ├─ architecture/                # diagrams, ADRs after approval
│  └─ api/                         # published OpenAPI snapshots/examples
├─ postman/
│  ├─ collections/                 # authoritative runnable API contract
│  ├─ environments/                # non-secret environment configuration
│  └─ examples/                    # reviewed success/error scenarios
├─ tests/
│  ├─ integration/                # PostgreSQL/Redis-backed critical-flow tests
│  └─ e2e/                         # Playwright workflows
├─ pnpm-workspace.yaml
└─ package.json                    # scripts/constraints; no app generation in this proposal
```

Treat this as a proposed layout, not created files. Keep DB schema and migrations owned by backend/platform maintainers. CI should run changed-package checks plus contract compatibility and critical integration tests; deployments of API, worker and web can have separate release jobs while sharing one reviewed change.

## 10. Docker and deployment architecture

The PostgreSQL/Redis versions and deployment shapes below are proposals, not services present in the Gate A/B prototype. Its actual tool versions are listed in §4; no production provider or region is selected here.

### Development

- Docker Compose may start PostgreSQL 18 and a selected supported Redis line (7.4 or 8.2 are lifecycle candidates) with local API/web/worker processes; an optional S3-compatible local emulator can support file flows. All remain proposals and must follow OQ-036/runtime decisions. Persist only disposable developer data; provide safe seed/reset workflows after implementation is authorized.
- Use separate `.env.example` documentation and developer-local secret files excluded from Git; never put production credentials in Compose defaults.
- Keep local/test/prod configuration parity, but make production dependencies managed services rather than long-lived local container volumes.

### Production proposal

- Build immutable API, web and worker container images from the monorepo; run API/worker statelessly on a managed container platform. Keep web/API behind TLS reverse proxy or same-origin routing.
- Use managed PostgreSQL 18 with private network access, encrypted backups/PITR and tested restore; use a supported managed Redis line only if selected for BullMQ; private S3-compatible object storage with KMS-managed encryption. Provider, region and operating model remain pending approval.
- Use separate database identities for migrations and application runtime. Restrict network access to required service paths. Store secrets in the platform secret manager. Roll out backward-compatible database changes (expand/contract); rollback application images without dropping data.
- Begin in one region and one production environment with staging/test separated. Availability zones, read replicas and autoscaling should follow validated NFR targets and OQ-031 budget/support, not be added by default.
- Kubernetes is not recommended for the initial baseline: it adds cluster lifecycle, policy and on-call burden without a stated load or team need. Revisit only with measured scale, tenancy or platform constraints. Cloud/provider, region, residency and operating model remain unselected.

## 11. Business rule preservation checks

These checks describe proposed safeguards. They do not change BA requirements or select the tool versions used by the Gate A/B prototype; see §4 for the actual-versus-candidate distinction.

| Domain | Architectural safeguard | BA baseline to preserve / unresolved item |
|---|---|---|
| Booking + inventory | Single transactional allocation service; DB unique/capacity constraints; locks and idempotency; stale writes return conflict | BR-010–014 and BOOK/CAL. Parent/child rules remain `[Q]` OQ-001; hold deadlines OQ-004; overbooking OQ-005. |
| Pricing | One RATE quote service; snapshot on Confirmed; preserve snapshot on history and reference policy version | BR-020–026 and BOOK/RATE. Repricing behavior OQ-009; tax OQ-014. |
| Deposit + payment | Pending is not matched; unique bank reference; atomic payment allocation + booking transition + audit/outbox; maker-checker for sensitive actions | BR-030–039, PAY. Deposit OQ-011; payment/refund methods OQ-012; OTA OQ-021; one-person approval OQ-040; reconciliation OQ-048/049. |
| Folio + settlement | Immutable ledger; fixed precision; lock against concurrent refund/settlement; adjustments reference original; zero/approved AR settlement in one transaction | BR-040–048, INV. Group folio OQ-003; e-invoice/legal tax OQ-014/015/037/055; receipt sequence OQ-046. |
| Night Audit | Exclusive run per property/date, idempotency keys, unique posting key, durable checkpoints and sequential business-date advancement | BR-004/008 and FO-NA; trigger/time OQ-052; revenue basis OQ-016; room-charge integrity BR-134 is in a draft and not stakeholder-approved. |
| RBAC | Individual user; roles assigned per property; server-derived scope; Owner cross-property path explicit; System Admin separated | BR-060/064/065, RBAC/EMP. Multi-property roles OQ-041; MFA OQ-043; personal/counter device OQ-044; identity-document visibility OQ-045. |
| Audit trail | Audit event commits in same transaction; append-only DB permissions, masked payload and hash verification | BR-061 `[C]` source label and NFR-AUD-001; detailed drafts still require project baseline. PII retention/deletion OQ-019. |

Technical controls enforce approved business rules; they must not select unresolved policy. If an OQ affects data shape or behavior, keep it configurable or defer the behavior until an owner decision rather than encoding an ASM as fact.

## 12. Open decisions and approvals needed before Phase 0

| Decision | Current state | Required confirmation / owner |
|---|---|---|
| OQ-032 business boundary | Single-owner/no-SaaS with multiple properties from the first release is Owner-confirmed and recorded in `DECISIONS.md`. | The business direction is answered. Property-specific sharing/role policies remain under OQ-034/OQ-041. |
| OQ-031 sizing/resources | Partially answered: 2–5 properties in first 12 months and target 6–10 in months 12–24; initial room count unknown; no approved delivery envelope | Confirm room count, pilot/go-live sequence, budget, team roles/availability, implementation timeline, support/on-call owner and operational vendor budget. Do not translate property count into workload or infrastructure capacity. Owner. |
| OQ-036 database | PostgreSQL is a proposal; question unresolved | Explicitly approve PostgreSQL or select another primary database. Then decide major version, provider/hosting, backup/restore owner and any RLS operating design. Owner (technology selection), with Dev Lead for technical fit. |
| OQ-019 privacy | Five-year retention is only ASM-019 | Counsel/Owner determine lawful bases, per-category retention, request handling, legal holds, incident process, region/processor and backup lifecycle. |
| Backend/frontend versions | NestJS 12, Node 24, Next 16, React 19.3, TypeScript 6 are candidates | Approve version lines after confirming supported patches, adapters, deployment runtime and security posture. Dev Lead/UI owner. |
| ORM/validation/testing/logging | Prisma 7, Zod 4, Vitest 5, Pino 10 are candidates | Approve after a small compatibility spike for transaction/locking/migrations and ESM tooling. Dev Lead. |
| Redis/BullMQ | Proposed / Pending Approval | Confirm whether background work requires Redis/BullMQ, whether BullMQ 6 features/migration are acceptable, compatible Redis service/client, durability and operational ownership. Owner + Dev Lead. |
| Authentication/RBAC details | BA requires individual accounts and scoped controls; several details are open | Confirm session policy, MFA channel/recovery, one-person approval, session/approval expiry, counter devices and who may view full ID docs (OQ-040/042/043/044/045). Owner + Security/BA. |
| Property and guest sharing | Multi-property architecture proposed; chain-wide guest/blacklist rules open | Confirm property lifecycle/legal fields (OQ-037), staff role assignment across properties (OQ-041) and guest/blacklist sharing scope (OQ-034). Owner + Accounting/BA. |
| Mobile/offline | No mobile framework selected | Resolve HK offline conflict OQ-035, device constraints and whether responsive web is sufficient. Owner + HK/MNT. |
| API, file and hosting provider | REST/OpenAPI, S3 API and managed hosting proposed; no providers selected | Confirm external integrations, cloud provider/region, S3 provider, data residency, costs and production support. Owner + Dev Lead + Legal. |
| Remaining blocking business questions and MVP scope | Numerous `[Q]` remain, including OQ-001/004/005/008/009/014/015/016/019/020/031/032/037 | Complete Owner/Manager/Accounting workshops; legal/accounting sign-off for privacy, tax and invoice decisions; settle scope (OQ-033). Do not let this document implicitly answer them. |

After an explicit approval, update `DECISIONS.md` and applicable OQ/module/rule documents with source/evidence. Until that happens, this proposal remains a proposal and all cited `[A]`/`[Q]` labels remain intact.

## 13. Change impact and reversibility

| Decision changed later | Expected cost / affected areas |
|---|---|
| Single-owner to SaaS multi-tenant | Very high: account/tenant isolation, all module authorization queries, support/admin access, key strategy, backups/restore, data export/deletion, billing, terms, monitoring and incident response. Property scope alone is not a tenant boundary. |
| One property to multiple properties | Moderate if property scope is present from day one; high if records, business dates, roles or unique keys were made global. Impacts every operational/financial record and report. The recommended design includes property scope now. |
| PostgreSQL to another database | High after schema work: partial indexes, RLS, locking, SQL migrations, transaction behavior, reports, ORM mapping, backup and restore. Decide before schema implementation. |
| Prisma to TypeORM or another ORM | Moderate before many repositories/migrations; grows with schema/migration history and raw SQL integration. Keep business rules out of ORM-specific model hooks. |
| REST to GraphQL | Moderate-to-high: client contracts, auth at field/resolver level, caching, audit semantics and API clients. No present HMS requirement justifies the added surface. |
| Modular monolith to microservices | High: split transactional flows, data ownership, distributed consistency, outbox/events, tracing, deployments and operations. Easier if module interfaces and schema ownership are respected from the start. |
| Redis/BullMQ removed or replaced | Low-to-moderate if all authoritative job intent and business state are persisted in PostgreSQL outbox/status records. High if Redis is mistakenly treated as durable business storage. |
| S3 provider/region changed | Moderate: object migration, signed URL behavior, encryption keys, lifecycle and residency review. S3-compatible abstraction helps but is not perfect portability. |
| Node/Nest/Next/React major changed | Moderate: ESM/toolchain and adapter compatibility, security updates, framework APIs, build and test runner changes. Keep lockfiles, CI and upgrade cadence. |
| Privacy/retention policy changed | High and cross-cutting: DB, audit, object storage, logs, exports, backups, legal holds and restore semantics. Design lifecycle metadata early but do not set durations before counsel confirms them. |

## 14. Knowledge Base references

- `ARCHITECTURE.md` — constraints and advisory architecture baseline.
- `BUSINESS_OVERVIEW.md` — multi-property product scope, actors, goals and lifecycle.
- `BUSINESS_RULES.md` — BR-004/007/008, BR-010–014, BR-020–021, BR-030–048, BR-060–067 and audit/financial rules.
- `DECISIONS.md` — records the Project Owner-confirmed high-level directions; no detailed technology version, ORM or implementation pattern is approved.
- `OPEN_QUESTIONS.md` — OQ-019, OQ-031/032/036 plus property, privacy, security and finance questions.
- `KNOWLEDGE_BASE_AUDIT.md` — BA draft/source qualifications, open corrections and approval status.
- Modules: PROP, ROOM, CAL, BOOK, RATE, PAY, INV, FO, FO-NA, RBAC, EMP, AUD, HK and MNT.
- BA Part 1, pp.9, 16–23, 32–35; Part 2, pp.16–32, 41–42; Part 3, pp.3–18, 23–32, 39–40; Part 4, pp.10–13, 22–30, 36–37.

## 15. Official technology references checked

- [Node.js release status and LTS](https://nodejs.org/en/about/previous-releases), [Node 24.22.2 release](https://nodejs.org/en/blog/release/v24.22.2), and [Node 26.13.0 release](https://nodejs.org/en/blog/release/v26.13.0)
- [NestJS 12 migration guide, Node/TypeScript/testing/validation support](https://docs.nestjs.com/migration-guide) and [NestJS OpenAPI guide](https://docs.nestjs.com/openapi/introduction)
- [Next.js support policy](https://nextjs.org/support-policy), [Next.js 16.4 release](https://nextjs.org/blog/next-16-4), [Next 16.4.5 package peer metadata](https://github.com/vercel/next.js/blob/v16.4.5/packages/next/package.json), and [Next.js testing guide](https://nextjs.org/docs/app/guides/testing)
- [React versions](https://react.dev/versions) and [React 19.3 release](https://react.dev/blog/2026/09/09/react-19-3)
- [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)
- [Tailwind CSS updates](https://tailwindcss.com/blog), [Tailwind releases](https://github.com/tailwindlabs/tailwindcss/releases), [v4 upgrade/browser support](https://tailwindcss.com/docs/upgrade-guide), and [Next.js installation](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [PostgreSQL version support](https://www.postgresql.org/support/versioning/)
- [Redis supported version lines](https://redis.io/docs/latest/operate/oss_and_stack/install/version-mgmt/)
- [Prisma ORM v7 system requirements](https://www.prisma.io/docs/orm/v7/reference/system-requirements), [v7 PostgreSQL support](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql), [v7 upgrade guide](https://www.prisma.io/docs/orm/v6/more/upgrades/to-v7), and [Prisma ORM release status](https://www.prisma.io/docs/orm)
- [Zod v4 docs](https://zod.dev/packages/zod), [Vitest announcements](https://vitest.dev/blog), [BullMQ quick start and datastore floor](https://docs.bullmq.io/quick-start), [BullMQ changelog](https://docs.bullmq.io/changelog), [nestjs-pino compatibility](https://github.com/iamolegga/nestjs-pino), [AWS S3 security best practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html), [Postman CLI collection-to-spec generation](https://learning.postman.com/docs/postman-cli/postman-cli-collections)
- [Tailwind v4 browser support](https://tailwindcss.com/docs/upgrade-guide), [React versions](https://react.dev/versions), and [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)
- [pnpm runtime compatibility](https://pnpm.io/installation), [Docker Compose Specification](https://docs.docker.com/reference/compose-file/), and [NestJS HTTP adapter guidance](https://docs.nestjs.com/techniques/performance)
- Postman CLI contract generation and collection execution are proposed for a future approved API workstream; no Postman collection or workspace artifact was created in this architecture-only task.
