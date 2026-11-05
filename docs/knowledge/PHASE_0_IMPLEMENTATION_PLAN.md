# HMS Phase 0 implementation plan

### Gate C.0.1 / C.1 preparation boundary (2026-11-05)

Repository baseline review and the Owner Decision Package are preparation and documentation only. They do not authorize Database Foundation implementation, resolve any OQ, or approve PostgreSQL, an ORM, a provider/region, identity policy, guest sharing, or a business module. See [GATE_C0_READINESS_AUDIT.md](GATE_C0_READINESS_AUDIT.md) and [OWNER_DECISION_PACKAGE.md](OWNER_DECISION_PACKAGE.md). Implementation requires explicit Owner approval of the bounded work package and its dependencies; Database Foundation must not be inferred from completion of this preparation gate.

> **Status: Gate A and Gate B implemented within the bounded scope authorized by the Owner on 2026-11-05.** This implementation record does not approve the product architecture or technology stack. The remaining plan and technology choices remain proposals; no database creation or migrations were authorized.

### Gate A/B implementation record (2026-11-05)

The Owner authorized repository/toolchain initialization and empty API/web/worker shells. The repository now has a pnpm workspace pinned to pnpm `10.34.9`, shared TypeScript/ESLint/Prettier configuration, a lockfile, root scripts, GitHub Actions CI, and separate NestJS API, Next.js Web and Node.js Worker shells. The API exposes generic `GET /health/live` and `GET /health/ready` without database or Redis dependencies. These implementation choices reflect the supplied Gate A/B scope and environment; they are not a product architecture or stack decision.

The installed prototype versions are Node.js `24.11.1` (runtime used), NestJS `11.1.16`, Next.js `16.4.5`, TypeScript `5.9.3`, ESLint `10.14.0` and Prettier `3.9.10`. NestJS 11 accommodates the available Node.js runtime. All technology selections remain **Proposed / Pending Approval** in [TECHNOLOGY_DECISION_PROPOSAL.md](TECHNOLOGY_DECISION_PROPOSAL.md); PostgreSQL remains unselected and OQ-036 remains open. OQ-031, OQ-033, OQ-034, OQ-041 and all other open questions are unchanged. No BA baseline, business module, authentication, database schema, migration, Redis or production infrastructure was introduced.

**Owner confirmation required (recorded 2026-11-05):** The explicitly recorded Gate A/B NestJS version was `11.1.16`. The subsequent security maintenance update changes `@nestjs/common`, `@nestjs/core` and `@nestjs/platform-express` from `11.1.16` to `11.1.29`, and pins the transitive `multer` dependency to `2.5.0`. This exceeds the recorded version authorization and requires the Owner's written confirmation; carrying out this bounded repository task is not evidence of that confirmation or product-stack approval. The trigger was the production dependency audit, including Nest advisory `GHSA-36xv-jgw5-4q75` and Multer advisories `GHSA-wc9g-mqfw-jrwm`, `GHSA-qfvm-cv95-jqjf`, `GHSA-535w-7cp7-47q4`, `GHSA-q7qp-rjg7-q26m`, `GHSA-3pph-fpjx-jg34` and `GHSA-qvfw-j98x-7q72`. See [OWNER_CONFIRMATION_CHECKLIST.md](OWNER_CONFIRMATION_CHECKLIST.md). No Nest major-version change was made; technology status remains Proposed / Pending Approval.

Verification evidence is recorded in the implementation report for this work; local install/build/runtime checks do not establish production readiness or approval of any architecture choice.

## 1. Phase 0 objective and boundaries

**Objective:** establish a reproducible development foundation for a single-owner, multi-property HMS after the specific toolchain choices and bounded work are approved; validate runtime/toolchain compatibility; and gate contracts, identity, schema, personal-data handling and business modules separately.

Phase 0 does not deliver the complete HMS, implement unresolved business policies, create production tenant infrastructure, or introduce microservices/Kubernetes. Any schema/feature depending on unresolved `[Q]`/`[A]` waits for the relevant confirmation. See Phase 0 OQ triage in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).

### Operational sizing baseline

| Input | Current value | Boundary |
|---|---|---|
| Business/property model | Single-owner; multi-property from first release; no SaaS for unrelated owners | Owner-confirmed direction; it requires property-aware design but does not approve technology or implementation. |
| Expected properties, first 12 months | 2–5 | Owner-provided planning range, not a delivery commitment or capacity approval. |
| Target properties, months 12–24 | 6–10 | Owner-provided growth target, not a guarantee or automatic trigger for distributed architecture. |
| Initial room count | Unknown / not yet determined | Do not infer bookings, users, revenue, concurrency, database size, worker count or infrastructure capacity. |
| Still open under OQ-031 | Pilot property, budget, staffing, implementation timeline and operational ownership | These remaining decisions are still required for funded/scheduled work and production responsibility. |

The sizing baseline is an input to architecture review only. It does not approve the architecture, exact versions, Gate A/B, a business module, provider or infrastructure capacity.

| Dependent question | Impact of the sizing input | Status |
|---|---|---|
| OQ-033 — MVP scope | The ranges provide rollout context but do not select modules or approve an MVP. | Open |
| OQ-041 — cross-property roles | Reinforces the need for property-scoped grants and explicit context; does not decide role cardinality or switching policy. | Open |
| OQ-034/OQ-047 — guest/blacklist | More than one property makes sharing scope operationally relevant; does not decide profile/blacklist sharing or hard-block behavior. | Open |
| OQ-036 — database | Does not select PostgreSQL or any database and is insufficient for database/infrastructure capacity planning. | Open |
| OQ-019 — privacy | Does not change legal basis, retention, residency, access or deletion decisions. | Open |
| OQ-020 — OTA/Channel Manager | Does not identify channels, integration approach, workload or phase. | Open |

## 2. Approval gates before implementation

1. Owner approves the exact limited work package and the technical choices needed for it. All current technology choices remain proposals.
2. Owner/Dev Lead approves a compatible package/runtime baseline before installation or initialization.
3. OQ-019/OQ-020/OQ-033 do not block generic repository setup or empty shells; they block their dependent PII, channel-integration and business-module work as described in the gate matrix below.
4. OQ-031 sets the funded execution envelope and delivery commitments. It is required before making budget/team/date/support commitments, not a reason to assume unbounded implementation work.
5. Security/BA owners approve authentication/authorization design before implementing staff identity or granting access; Owner resolves property-role policy OQ-041 and guest-sharing policy OQ-034 before those behaviors are built.

OQ-032's single-owner, multi-property-from-first-release direction is owner-confirmed. OQ-031 is partially answered by the property ranges but remains open for room count, pilot, resources, timeline and operational ownership. OQ-036 is open: PostgreSQL remains proposed. Specific framework/database versions, ORM and implementation patterns remain pending approval. OQ-034, OQ-041 and OQ-019 remain open for guest sharing, property-role policy and privacy respectively.

### Phase 0 gate matrix

| Gate | Activities that may proceed within explicit approved scope | Required approval / OQs | Must wait |
|---|---|---|---|
| **A. Repository and toolchain initialization** | Repository structure, Git conventions, CI skeleton and toolchain setup using an explicitly approved set of tools/versions. Generic work is not blocked by unrelated module OQs. | Owner approves bounded initialization; Dev Lead validates/approves chosen technical baseline. OQ-031 is needed for funded team/date/vendor commitments, not for technical decisions. | Do not install or initialize based on unapproved candidate versions. No production credentials or production provisioning. |
| **B. API/web/worker application shells** | Empty API/web/worker entry points, configuration, generic health/readiness and request IDs; no business endpoints. | Gate A approvals; owner approves the shell scope. OQ-020/OQ-033 are not prerequisites for generic shells. | No business flow, external channel behavior or contract that presumes unresolved scope. |
| **C. Authentication and authorization** | Threat modeling and property-aware design review; synthetic local fixtures only. | Security/Owner approve identity/session baseline; resolve OQ-041 for cross-property roles and relevant OQ-040/042/043/044/045. | No operational login/access grants, final role matrix or cross-property role behavior until decided. Cross-property negative authorization tests are required before release. |
| **D. Database schema and migrations** | Database tooling/adapter compatibility review after Gate A; disposable technical spike only if separately approved and not a production/business schema. | Owner explicitly resolves OQ-036 database technology; Dev Lead approves ORM/provider/version. Relevant module OQs must be answered for that module's schema. | No HMS schema/migrations, `property_id`-dependent business entities or durable business state before database and dependent business rules are approved. |
| **E. Personal-data handling and file storage** | Synthetic-data security design, retention/deletion options and vendor assessment. | OQ-019 requires Owner + legal counsel; region/provider also needs operational and budget approval (OQ-031). | No real personal data, identity-document storage, retention/deletion jobs, production exports or final incident procedure. |
| **F. Business-module implementation authorization (outside the base Phase 0 foundation)** | Scope workshops, module planning and acceptance-criteria preparation. Implementation is a separate work package; an explicitly approved module may begin only after its own requirements and technical gates are resolved. | OQ-033 Owner approves scope; OQ-020 Owner approves OTA/Channel Manager boundary; resolve each module's applicable OQs and Gate C/D/E dependencies. | Base Phase 0 completion does not authorize a business module. Do not implement modules or integrations from ASM values. OQ-034 guest sharing and OQ-041 cross-property role policies remain open and must not be encoded as assumed. |

### Base Phase 0 boundary versus module implementation

The base Phase 0 foundation consists of four separable deliverables after their toolchain/scope approvals: **repository/toolchain setup**, **empty API/web/worker shells**, **CI foundation**, and **generic health/readiness checks**. These deliverables contain no HMS business workflow, business schema, real personal data, or integration behavior.

Gate C, D and E may include design review and synthetic technical validation within an expressly approved scope. Gate F is the authorization point for a later business-module work package; it is not implied by completing the base foundation. A module being necessary for a candidate MVP does not mean it must be implemented during Phase 0.

## 3. Proposed repository layout

Use one Git monorepo with independently buildable/deployable web, API and worker entry points. Keep core business/application modules in a shared backend package so API and worker use the same transactions and authorization services.

```text
hms/
├─ apps/
│  ├─ api/                         # NestJS REST bootstrap/controllers
│  ├─ web/                         # Next.js App Router staff UI
│  └─ worker/                      # Nest application context for BullMQ jobs
├─ packages/
│  ├─ backend/                     # domain/application modules and ports
│  ├─ database/                    # Prisma client/provider and migrations
│  ├─ api-client/                  # generated from the approved OpenAPI export
│  ├─ contracts/                   # API error/envelope primitives only if needed
│  ├─ config/                      # shared TS/lint/format configuration
│  └─ ui/                          # shared accessible UI components/tokens
├─ postman/
│  ├─ collections/                 # approved runnable API contract
│  ├─ environments/                # non-secret local/staging settings
│  └─ examples/                    # accepted error/success cases
├─ infra/
│  ├─ docker/                      # Dockerfiles and Compose definitions
│  ├─ deployment/                  # provider-specific files after approval
│  └─ observability/               # dashboards, alerts and runbooks
├─ docs/
│  ├─ knowledge/                   # BA baseline, OQs, decisions and proposals
│  ├─ architecture/                # diagrams/ADRs after approval
│  └─ api/                         # generated OpenAPI snapshots
├─ tests/
│  ├─ integration/                 # PostgreSQL/Redis critical-flow tests
│  └─ e2e/                         # Playwright workflows
├─ pnpm-workspace.yaml
├─ pnpm-lock.yaml
└─ package.json
```

Use pnpm workspaces first; do not add Nx/Turborepo until CI performance or team scale demonstrates a need. `apps/api` and `apps/worker` are process boundaries, not separate microservices with independent domain databases. `packages/backend` owns domain operations; `packages/database` owns Prisma setup and migrations. The web app consumes only the generated API client and UI package, never backend/ORM models.

## 4. Package plan (all versions pending approval)

**Prototype Gate A/B actual (verified 2026-11-05):** Node.js `24.11.1`, NestJS `11.1.16`, TypeScript `5.9.3` and pnpm `10.34.9`. The candidate versions in the table below are proposals, not the versions used by the bounded prototype and not product approvals.

| Component | Candidate in this plan | Prototype Gate A/B actual |
|---|---|---|
| Node.js | `24.22.2` | `24.11.1` |
| NestJS | `12.3.x` | `11.1.16` |
| TypeScript | `6.x` | `5.9.3` |
| pnpm | `12.x` | `10.34.9` |

| Workspace | Expected package(s) | Purpose / conditions |
|---|---|---|
| Root | pnpm 12 and TypeScript 6 candidate lines per the technology proposal | Exact releases, workspace behavior and peer compatibility remain Unverified until selected and resolved. |
| `apps/api` | `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-node` candidate; `@nestjs/platform-express` remains an alternative; config/Swagger packages pending | NestJS 12.3 recommends Node adapter, but adapter/middleware/logger compatibility must be checked before approval. Keep Nest packages aligned to one compatible 12.x patch. |
| `apps/web` | Next.js 16.4.5, React/React DOM 19.3.0 and Tailwind CSS 4.3.4 candidates | Declared Next React peer range includes 19.3.0; this is not a build verification. Tailwind v4 uses its separate PostCSS plugin and has a modern browser floor. |
| `packages/backend` | Zod 4.x and BullMQ 6.x candidates; Redis client and `nestjs-pino` candidates | BullMQ node-redis adapter requires `redis` v5+; ioredis is an optional peer in BullMQ 6. Verify exact package peers; do not let Redis own business state. |
| `packages/database` | Prisma ORM 7.x and PostgreSQL adapter candidates | OQ-036 must be resolved before choosing the production database technology; adapter/driver/config compatibility needs review. Prisma 7 direct connections require an adapter and ESM/config changes. |
| `apps/worker` | BullMQ candidate and shared backend package | Worker topology and queue dependency are proposals. If approved, reuse the same scoped application operations and idempotency rules as API. |
| Logging | `pino` 10.x, `pino-http` 11.x, `nestjs-pino` 5.x | Documented compatibility requires Nest 12.0.2+ and Node >=22.12; use a compatible Nest 12 patch and redact PII/secrets. |
| Tests | `vitest` 5.1, `@nestjs/testing`, `@testing-library/react`, `jsdom`, `playwright`, `supertest` candidates | Vitest for unit/component and API integration suites; Playwright for browser flows and async Server Components. Exact patches/peers remain pending and unverified. |
| Auth/session | `argon2` and a PostgreSQL-backed revocable session implementation; session middleware choice pending | OQ-040/043/044 determine MFA, recovery and counter-device behavior. Do not add a third-party identity provider or choose auth add-ons before approval. |
| File storage | S3 API SDK (provider-specific package such as `@aws-sdk/client-s3`, only if AWS is approved) | Private object access and encryption; keep provider package out of baseline until region/provider decision. |

These are candidate dependencies, not a package manifest. Avoid adding state-management, cache, UI, observability or ORM companion libraries without a requirement.

## 5. Implementation order

Steps 0–1 and the shell-only portions of Step 3 describe the base Phase 0 foundation; CI and generic health/readiness checks are part of those deliverables. Step 2 requires separate approval for local service choices. Steps 4–7 are conditional follow-on work packages and are not authorized by completing the base Phase 0 foundation.

The actual prototype toolchain is listed in §4. The steps below use candidate versions and remain conditional on separate Owner/Dev Lead approval; they do not describe an already approved upgrade.

### Step 0 — Confirm project gates

- Record Owner approval for business direction and architecture choices in `DECISIONS.md` only when explicitly approved.
- Resolve Phase 0 entry questions and module-specific schema blockers; retain unresolved entries in `OPEN_QUESTIONS.md`.
- Confirm team, schedule, dev OS/runtime support and who owns test/production environment operations.

### Step 1 — Repository/toolchain foundation

- Create the pnpm workspace and package boundaries from the approved tree.
- Select an approved active LTS Node line and exact supported patch after reviewing the compatibility matrix. Node 24.22.2 is a candidate because NestJS 12 CLI requires 24.15+ and Prisma 7 lists Node 24 support; Node 26 is an LTS line but is not in Prisma 7's documented supported runtime matrix. Pin pnpm and a resolved dependency lockfile only after approval.
- Select ESM consistently for NestJS/Prisma 7; set strict TypeScript config. Confirm package manager, build scripts and test scripts work on supported developer operating systems.
- Add `.editorconfig`, `.gitignore`, `.env.example` without credentials, shared lint/format/typecheck scripts and CI workflow.

### Step 2 — Local development services

- Only after OQ-036 and the relevant runtime/service choices are approved, define local services (candidate PostgreSQL 18 and Redis from a currently supported line) plus an optional storage emulator. Redis 7.4 remains supported, while newer Redis 8 lines are also listed by the official lifecycle page; select no line in this plan. Bind ports to localhost, use non-production credentials and health checks.
- Provide documented start/stop/reset commands and synthetic-only seed data. Keep local volumes disposable and out of versioned backup practice.
- Keep production service definitions outside Compose; no Kubernetes manifests in initial scope.

### Step 3 — API and web shells

- Establish NestJS REST bootstrap, config loading/validation, health/readiness endpoints, request IDs, safe error envelope and CORS/same-site routing policy.
- Establish Next.js App Router shell, Vietnamese locale foundation if confirmed, responsive staff layout and typed API client boundary. Do not implement business flows with mock assumptions.
- Create separate API and worker entry points from the shared backend module package. Worker may initially expose health only until a job is approved.

### Step 4 — API contract and authentication foundation

- Write the first reviewed Postman collection only after endpoint semantics are derived from approved FR/AC and OQ outcomes. Use it as runnable source of truth; export OpenAPI 3.1 and generate the typed client. Keep Nest Swagger output as implementation-side documentation and check for drift.
- Implement authentication/session behavior only after approval of session lifetime, MFA/recovery, device policy and staff access rules. Property scope must always be checked server-side.
- Document authorization scope and success/error cases per request; do not put secrets in collection files or local environment files.

### Step 5 — Database and migration foundation

- Select the database and ORM only after OQ-036 and technical approval; prepare schema/provider configuration only after relevant schema OQs are answered. Do not run schema sync in production.
- Use checked-in, reviewed migrations as the only schema change path. Generate draft migrations locally, inspect SQL, add hand-authored SQL for partial unique indexes, CHECK/foreign-key invariants, RLS and specialized constraints as approved, then apply to an empty disposable local DB.
- Verify restore from a clean database by replaying all migrations. Define migration ordering, backwards-compatible expand/contract for deployed releases, and backup-before-production-change ownership.
- Implement the transactional outbox and audit table only when approved event/audit retention rules are defined. Test rollback when the required audit append fails.

### Step 6 — Separately authorized first business vertical slices (not part of base Phase 0)

Build one approved flow at a time, in this order:

1. Property context/timezone/business-date read model and property-scoped authorization.
2. Room/room-type inventory constraints after OQ-001/002/005 and related BRs are approved.
3. Booking hold and confirmation with pricing snapshot after OQ-004/008/009/011 and rate rules are approved.
4. Payment match and immutable folio posting after OQ-012/014/015/016 and receipt numbering rules are approved.
5. Night Audit lock/checkpoint/idempotency after OQ-016/052 and FO-NA rules are approved.

This order is a dependency outline, not approval of the temporary ASM policies. Do not combine unresolved flows into a speculative schema.

### Step 7 — Operational readiness

- Add structured redacted logs, metrics/trace context, health probes, queue-age and Night Audit alerts, audit-chain verification, backup/restore runbook and rollback instructions.
- Select cloud, object-storage and managed-service providers only after budget, region/legal and support ownership approval.
- Verify the app and worker can deploy separately as containers while using the same PostgreSQL data and business modules; do not split into microservices.

## 6. Database setup and migration strategy

- **Local engine proposal:** PostgreSQL 18.x candidate, only after OQ-036 and version/provider approvals. Use disposable local volumes and synthetic fixtures.
- **Conditional proposal:** if PostgreSQL is explicitly approved, it is proposed as the authoritative store for business and durable job/outbox state. Redis is not authoritative in this proposal; use it only if approved for cache/queue roles.
- **Isolation:** model global identity/reference entities separately from property-owned operational aggregates; do not put `property_id` on every table by convention. Property-owned records carry validated property scope and cross-property references are rejected. A user's selected property is context, not an authorization claim. API and worker queries enforce user/job assignment scope. Cache keys, idempotency keys, exports, notifications, audit events and scheduled jobs carry property scope (or explicit authorized owner-wide scope). RLS is defense in depth only after connection pooling and transaction context have been designed.
- **Constraints:** if Prisma is approved, express relationships and ordinary constraints through it where supported; use reviewed SQL migrations for partial uniqueness, conditional indexes and specialized constraints. Keep DB constraints even when application validation exists.
- **Concurrency:** business writes require explicit transaction boundaries, row locking/version checks, deterministic lock ordering, idempotency and bounded retries. Database-specific implementation and tests wait for OQ-036 and related schema gates.
- **Migrations:** no `db push` in shared/staging/production environments. Use one migration per reviewed change; verify forward application from empty and previous schema, and document rollback/forward-fix limitations. Production deployment uses an explicit migration job after backup/approval.
- **Privacy:** no real guest/staff personal data in local development. OQ-019 must determine retention/deletion/export/backup behavior before PII lifecycle is implemented.

## 7. Testing strategy

- **Static checks:** TypeScript typecheck, lint/format, dependency audit and contract/schema lint.
- **Unit tests:** pure policy calculations, authorization decisions, command validation and idempotency behavior with Vitest.
- **Database integration tests:** the approved PostgreSQL version for partial unique constraints, capacity races, row locks, serializable conflicts, financial rollback and audit atomicity. Use disposable databases and deterministic data after schema gates.
- **Queue integration tests:** Redis/BullMQ retry, duplicate delivery, outbox publishing, worker shutdown and idempotent completion. A Redis outage must not lose committed business intent.
- **API tests:** Nest testing module + Supertest/HTTP; verify auth/property scope, stable errors, request IDs and replayed idempotency keys against the approved API contract.
- **Web tests:** Vitest/Testing Library for presentational/client components; Playwright for App Router async Server Components, login, property selection and risk-based booking/payment workflows.
- **Contract tests:** Postman collection examples/pm tests for approved API behavior, Postman CLI run against local API, and generated OpenAPI drift checks. Keep credentials in non-committed environment/secret variables.
- **No scope-by-assumption:** expected results for any unresolved `[Q]` case remain absent until the owner confirms the rule.

## 8. Security baseline

- Individual staff identities; Argon2id password hashing; secure HTTP-only/SameSite cookies; CSRF protection for cookie-authenticated writes; login throttling and immediate session revocation on deactivation.
- MFA for privileged/remote approval actions per NFR-SEC-001, with channel/recovery still gated by OQ-043. Do not treat OQ's ASM as approved.
- Authorize action and property scope in the API/application layer, not only UI or RLS. Operational commands require one explicit property context. Test cross-property denial for API, reports, file access, caches and worker contexts; consolidated owner reads require an explicit authorized scope.
- No secrets in Git, images, logs or Postman collection; environment-specific secrets are injected by the runtime secret manager.
- TLS in transit; KMS-managed encryption for sensitive fields/object files; keyed HMAC blind index only where matching is approved. Argon2id is hashing, not encryption.
- Never store card number/CVV/expiry (BR-046). Validate/verify signed webhooks and enforce idempotency before any integration is approved.
- AUD is append-only, hash-chained and committed with the protected business transaction (NFR-AUD-001). Operational logs are separate and redact personal data.
- Keep all guest identity data synthetic until OQ-019, data-region and file-storage lifecycle approvals are recorded.

## 9. Definition of Done by Phase 0 gate

- Each gate is closed against its own approved scope; unresolved OQs and their blocked gates are explicit, and no ASM is presented as confirmed. A and B can close without resolving unrelated business OQs.
- For Gate A, workspace install is reproducible from the committed lockfile on supported OS/runtime using the approved version set.
- For Gate B, API/web/worker shells build and local configuration validates; local service health checks apply only to services approved and included in scope. No production credentials are present.
- Gate D evidence (schema/migrations, replay from empty, constraints) is required only if schema work was approved; otherwise database schema remains a later gate.
- Reviewed API contract evidence is required only for approved endpoint semantics. No contract may imply unresolved authorization or business behavior.
- Cross-property authorization, session revocation, PII handling, audit rollback and queue retry evidence is required before the corresponding Gate C/D/E/F capability is released, not to close a repository-only Gate A.
- Backup/restore, incident escalation and production rollback runbooks need named owners before production readiness; local reset guidance is needed only where local services are in scope.
- No microservices/Kubernetes or unrelated runtime dependencies were added without an approved reason.
- Every open business rule affecting the next phase has an owner and a target resolution point; no feature silently encodes a temporary ASM.

## 10. Commands to run after implementation is approved

The commands below are a future verification checklist. They were **not run** as part of preparing this plan. Adjust package filters and paths when the workspace is actually created.

The current Gate A/B prototype versions are listed in §4. These future commands do not imply that candidate Node, NestJS, TypeScript or pnpm versions have been installed or approved.

```powershell
# Validate workspace / Compose syntax
pnpm install --frozen-lockfile
docker compose -f infra/docker/compose.dev.yml config --quiet

# Start disposable local dependencies after the repo exists
docker compose -f infra/docker/compose.dev.yml up -d postgres redis
docker compose -f infra/docker/compose.dev.yml ps

# Static/build checks
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter @hms/api build
pnpm --filter @hms/web build
pnpm --filter @hms/worker build

# Database contract checks (against a disposable local DB only)
pnpm exec prisma validate --schema packages/database/prisma/schema.prisma
pnpm exec prisma migrate status --schema packages/database/prisma/schema.prisma
pnpm test:integration

# Browser and API contract verification after endpoints/collection are approved
pnpm exec playwright test
postman collection lint ./postman/collections
postman collection run ./postman/collections/hms-api
```

Never run `prisma migrate deploy` against a shared/production database from an unreviewed local shell. Production migrations require an approved release job, backup/restore readiness, and migration owner.

## 11. Decisions still awaiting direct Owner approval

The version candidates in this section and elsewhere in the plan are distinct from the actual Gate A/B prototype versions recorded in §4. Neither the prototype nor this plan constitutes Owner approval of the product toolchain.

1. Approve technical choices individually or as a bounded bundle: NestJS + TypeScript, Next.js + React + TypeScript, PostgreSQL, Redis + BullMQ, Prisma, Modular Monolith, pnpm monorepo, REST/OpenAPI, Docker Compose and API/worker topology. None is confirmed merely by discussion.
2. Approve exact compatible versions after reviewing the Unverified items and compatibility matrix; candidate set is not a lockfile or approved baseline.
3. Set the funded budget/team/window and Phase 0 scope (OQ-031/OQ-033); separately decide whether Channel Manager work is in scope (OQ-020).
4. Approve privacy/legal constraints before personal-data processing or storage is implemented (OQ-019).
5. Resolve OQ-036 before selecting database technology; approve provider/region/operations owner and storage/security details at their applicable gates.

OQ-032's single-owner/multi-property-from-first-release direction is owner-confirmed. The Owner-provided sizing baseline is 2–5 properties in the first 12 months and 6–10 in months 12–24; initial room count remains unknown. OQ-031 stays open for pilot, budget, staffing, timeline and operational ownership. OQ-036 remains open; PostgreSQL is proposed. OQ-034/OQ-041 remain open. Version, provider, capacity and detailed implementation choices remain open.

## 12. Readiness summary (review only; not an approval)

| Area | Status | Evidence | Remaining work |
|---|---|---|---|
| Business direction | Ready for Owner Approval | Owner confirmed single-owner, multiple properties from release one, no unrelated-owner SaaS, and supplied 2–5 / 6–10 property planning ranges; recorded in `DECISIONS.md`. | Initial room count, pilot, budget, staffing, timeline and operational ownership remain open; sizing is not architecture approval. |
| Requirements baseline | Needs Owner Decision | BA source labels are preserved; later BA parts include `[A]`/`[Q]`, and several parts are drafts rather than an owner-approved scope baseline. | Confirm MVP in/out scope (OQ-033), resolve dependent business OQs, and baseline requirements. |
| Multi-property architecture | Needs Owner Decision | Proposed property boundary, user-to-property associations, scoped commands, owner aggregation and context propagation are described in `ARCHITECTURE.md`. | Decide guest/blacklist sharing (OQ-034) and cross-property role policy (OQ-041); validate against approved module rules. |
| Authorization model | Needs Owner Decision | Proposed matrix covers owner, manager, employee, missing context, background jobs and system admin; negative cross-property tests are required. | Approve role grants, property switching, guest visibility and privileged access policy; OQ-041 and related OQs remain open. |
| Technology stack | Needs Technical Validation | Comparison and candidate compatibility review are in `TECHNOLOGY_DECISION_PROPOSAL.md`; every item is Proposed / Pending Approval. | Owner approval of choices; exact peer resolution/build and adapter validation for unverified combinations. |
| Database strategy | Needs Owner Decision | PostgreSQL is a candidate only; OQ-036 remains open. | Owner selects database; Dev Lead validates provider/ORM/driver, migrations and recovery approach. |
| Security/privacy | Needs Owner Decision | Synthetic-data review can proceed; personal data and file handling depend on OQ-019 and jurisdiction/provider decisions. | Owner and legal counsel decide privacy, retention, access, residency and processor constraints before real PII work. |
| MVP scope | Needs Owner Decision | The proposals describe possible phases, but do not establish an approved release scope; OQ-020 and OQ-033 remain open. | Owner confirms modules, integrations, in/out list and channel-management boundary. |
| Phase 0 | Needs Owner Decision | Gates A–F separate repository/toolchain, shells, auth, schema, PII/storage and modules. Generic A/B work is not technically blocked by every business OQ. | Owner approves bounded scope/resources (OQ-031) and exact toolchain; Dev Lead validates versions. No initialization is authorized by this plan. |

**Readiness conclusion:** the proposal is suitable for Owner review, but the architecture is not approved. A narrowly scoped Gate A repository/toolchain task and Gate B empty shells could be authorized independently after the Owner approves the bounded work and the Dev Lead approves the exact compatible toolchain. This review itself performs neither activity.

## 13. Owner decision package

This package is an agenda for an Owner decision session. It uses existing OQ/FR/BR/NFR identifiers and does not create new decision or OQ IDs. Where a technology choice has no existing OQ, the register says so explicitly. A recommendation is still Proposed until the named approval owner confirms it and the result is recorded in `DECISIONS.md`.

### A. Business direction and operating scale

| Decision ID / OQ ID | Issue and realistic options | Recommendation | Advantages, disadvantages and later-change impact | Dependencies | Priority | Approval owner | Current status |
|---|---|---|---|---|---|---|---|
| OQ-032 | Single-owner versus unrelated-owner SaaS; one versus multiple properties at launch | No decision request: retain the confirmed single-owner, multi-property-from-first-release, no-unrelated-SaaS direction | Avoids an unnecessary tenant billing/control plane while requiring property isolation from the start; changing to unrelated-owner SaaS later would materially change identity, isolation, billing and operations | OQ-034, OQ-041 remain separate | Critical | Project Owner | **Approved** for this business direction only |
| OQ-031 | Initial room count, pilot property, funded team/window, budget and operating owner; property ranges are already supplied | Keep 2–5 properties for first 12 months and 6–10 for months 12–24 as planning context; Owner supplies the remaining inputs. Do not infer room or workload quantities | Supports property-aware rollout planning without fabricating capacity. Missing room/workload/resources prevent infrastructure sizing and delivery commitments | OQ-033; deployment/provider choices; NFR-PERF-001 and NFR-AVL-001 are still `[A]` | Critical | Project Owner | Open (partially answered) |

### B. Multi-property authorization and guest scope

| Decision ID / OQ ID | Issue and realistic options | Recommendation | Advantages, disadvantages and later-change impact | Dependencies | Priority | Approval owner | Current status |
|---|---|---|---|---|---|---|---|
| BR-060, BR-064–066; FR-RBAC-001–012 (no dedicated OQ) | Owner/Manager authority: job-title-wide access, or explicit action permissions and property grants | Explicit server-side permissions. Owner may receive an authorized consolidated-read grant; operational writes still require one property. Manager receives only assigned properties/actions. System Admin has no business authority by default | Strong isolation and auditable least privilege; more grant administration. Moving from broad roles to explicit grants later requires authorization and data migration | OQ-040–045; OQ-041; approved API contract | Critical | Project Owner + Security/BA owner | Proposed |
| OQ-041 | One employee account with the same role everywhere, different roles per property, or separate accounts | One identity with explicit user × property × role/permission grants; permit different roles if Owner confirms it | Supports real staffing and immediate revocation; increases assignment UI, authorization and test complexity. Separate accounts fragment audit/history; a global role risks excessive access | EMP/RBAC schema; property switching; OQ-044 | Critical | Project Owner | Open |
| OQ-041; FR-PROP-008, FR-EMP-009 | Property switching: implicit default, explicit active property, or simultaneous multi-property operational context | Explicit active property for operational screens/commands; switching never changes grants; reject missing property context except genuinely global endpoints | Predictable isolation and audit; adds one selection step. Retrofitting explicit context later touches URLs, caches, jobs and APIs | Role grants; API architecture; negative authorization tests | Critical | Project Owner + Security/BA owner | Proposed |
| BR-060/069; RPT scope (no dedicated OQ) | Cross-property reports: Owner-only consolidated reads, configurable grants, or no consolidation in MVP | Authorized Owner consolidated reads over an explicit property set; every result remains property-traceable; no cross-property writes | Meets confirmed multi-property direction; requires scoped aggregation and leakage tests. Deferring all consolidation weakens the stated Owner goal BG-06 | OQ-041; RPT detailed FR are missing; report metric rules remain `[A]` | High | Project Owner | Proposed |
| OQ-034 | Guest profile per property, one shared profile, or shared identity with property-owned booking/stay/folio links | Prefer the hybrid shared-identity option only if privacy review permits it; property-owned operational history remains scoped | Reduces duplicate identity while limiting operational disclosure; is the most complex model. Changing profile ownership after data accumulation requires matching, merge and privacy migration | OQ-019, OQ-045, OQ-036 | Critical | Project Owner + legal counsel for privacy effects | Open |
| OQ-034, OQ-047 | Blacklist Owner-wide or property-scoped; hard block or warning; add/remove authority | Decide blacklist scope independently from guest-profile scope. Recommended safe default for discussion: property-scoped warning with Manager reason/approval until Owner explicitly authorizes wider sharing or a hard block | Smaller disclosure and false-positive impact; less chain-wide protection. Later widening requires purpose/access review and record provenance | OQ-019, OQ-045, GST policy | High | Project Owner + legal counsel | Open |
| OQ-040, OQ-042–045 | Self-approval exception, approval expiry, 2FA channel, counter/personal device rules and full guest-document viewers | Approve the policy bundle before operational authentication/approval implementation; retain individual accounts, immediate revocation, separate unmask permission and audit as proposal baseline | Strong control and traceability; adds operational friction and recovery/support work. Changing authentication or document-view policy later invalidates sessions, training and audit assumptions | OQ-019; RBAC/EMP/GST; chosen session storage | High | Project Owner + Security owner; legal counsel for document access | Open |

### C. Technology selection

Every option below remains a technical proposal. Exact versions require Dev Lead validation after the Owner accepts the technology family; candidate versions are documented in `TECHNOLOGY_DECISION_PROPOSAL.md`.

| Decision ID / OQ ID | Issue and realistic options | Recommendation | Advantages, disadvantages and later-change impact | Dependencies and compatibility risks | Priority | Approval owner | Current status |
|---|---|---|---|---|---|---|---|
| No existing OQ — backend/architecture proposal | NestJS + TypeScript Modular Monolith; a lighter Node framework; or early microservices | NestJS + TypeScript Modular Monolith with API and worker entry points sharing backend modules | Conventions, DI and one transaction boundary support HMS complexity; framework/adapter learning and coupling. Splitting later is manageable if module boundaries hold; replacing the framework later is expensive | Candidate Node 24/Nest 12/TS 6; Nest HTTP adapter, ESM, Pino and upload peers need validation | Critical | Project Owner selects direction; Dev Lead validates | Proposed |
| No existing OQ — frontend proposal | Next.js + React + TypeScript; client-only React/Vite; or another web framework | Next.js + React + TypeScript, subject to verifying that server rendering/App Router adds value for a staff portal | Integrated routing/build and shared TS; App Router/server-client boundaries add complexity. Framework replacement later rewrites routing/rendering and much UI integration | Candidate Next 16.4.5 declares React 19 peer compatibility; actual build, browser support and Tailwind integration remain unverified | High | Project Owner/UI owner; Dev Lead validates | Proposed |
| OQ-036 | PostgreSQL or another primary relational database | PostgreSQL, contingent on explicit Owner approval and provider/restore validation | Strong transactions/constraints suit booking, money and audit; requires database operations and careful pooled RLS use. Changing database after schema/business data exist is very expensive | Candidate PostgreSQL 18/Prisma 7 support is documented; provider, extensions, pooler, migrations and recovery must be proven | Critical | Project Owner; Dev Lead validates | Open |
| No existing OQ — ORM proposal | Prisma 7, TypeORM, SQL/query builder, or no ORM | Prisma 7 for routine access plus reviewed SQL migrations/raw SQL for locking and specialized constraints | Generated types and common workflow; adapter/ESM migration changes and incomplete expression of advanced DB controls. Replacing ORM later affects repositories, migrations and tests | Depends on OQ-036; Node 24 listed by Prisma 7, Node 26 is not; driver adapter mandatory for direct connections | High | Project Owner accepts approach; Dev Lead approves | Proposed |
| No existing OQ — cache/queue proposal | No Redis initially; Redis for cache only; Redis + BullMQ workers; or PostgreSQL-backed durable jobs | Approve Redis + BullMQ only for demonstrated asynchronous/retry needs; keep business state in the primary DB and permit a no-cache initial slice | BullMQ gives retries/scheduling and separate workers; Redis adds operations, eviction/reconnect and at-least-once complexity. Introducing later is moderate if jobs use ports/outbox; removing after broad cache use is harder | BullMQ 6 server floor Redis 6.2; Redis 7.4/8.2 candidates, client adapter/managed service and idempotency need validation | High | Project Owner for cost/topology; Dev Lead validates | Proposed |
| No existing OQ — repository proposal | pnpm monorepo, separate repositories, or monorepo orchestrator such as Nx/Turborepo | pnpm monorepo without an additional orchestrator at first | Atomic API/web/worker changes and one lockfile; requires boundary discipline. Repository split later is moderate; adding an orchestrator later is low impact | Candidate pnpm 12/Node 24/Windows/Linux/CI behavior and package boundaries need validation | High | Project Owner for team workflow; Dev Lead approves | Proposed |
| No existing OQ — API proposal | REST/OpenAPI; GraphQL; or mixed styles | REST/JSON with explicit business commands and one reviewed contract direction; OpenAPI for clients/docs | Familiar tooling and clear auditable transitions; contract governance is required and generic CRUD would weaken invariants. A later API-style change impacts web clients/integrations | Source-of-truth direction, auth/property scope, error/idempotency rules and OpenAPI tooling need approval; no endpoint contract exists yet | Critical | Project Owner accepts external boundary; Dev Lead/API owner approves | Proposed |
| No existing OQ — local environment proposal | Native local services, Docker Compose, or remote shared development services | Docker Compose for disposable local dependencies; local app processes may remain native | Reproducible and isolated; Docker Desktop/resource overhead. Changing local tooling later is low-to-moderate impact if commands/config remain portable | Compose CLI/host support, selected DB/Redis images and Windows/Linux developer environments need validation | Medium | Dev Lead; Owner approves any licensing/cost | Proposed |

### D. MVP scope and module disposition

The project brief identifies 19 modules `[C]` at module level, while Parts 2–4 and most detailed FR/BR remain draft, `[A]` or `[Q]`. The classification below is a recommendation for OQ-033, not an approved deletion, retirement or change to any FR/BR ID.

| Decision ID / OQ ID | Issue and realistic options | Recommendation | Advantages, disadvantages and later-change impact | Dependencies | Priority | Approval owner | Current status |
|---|---|---|---|---|---|---|---|
| OQ-033 | Approve all 19 modules for MVP, approve a bounded operational MVP, or approve infrastructure only | Approve a bounded end-to-end operational MVP and an explicit out-list; retain every requirement ID for later phases | Gives a releasable property-to-booking-to-stay-to-settlement path without silently promising all draft scope; deferred capabilities require later roadmap decisions | OQ-001–023 and OQ-034–055 by module; OQ-031 resources | Critical | Project Owner with Manager and Accounting sign-off | Open |
| OQ-020 | Manual OTA entry/reconciliation, direct OTA integrations, or one Channel Manager | Manual OTA handling in the first bounded release; defer CHN automation until provider/channels/funding are selected | Reduces integration risk; increases manual work and sync delay. Adding CHN later is manageable if booking/inventory commands are idempotent and integration ports are preserved | OQ-005, OQ-021/022/038; CHN lacks detailed FR | High | Project Owner | Open |

#### Classification semantics

The tags are independent and may be combined:

- **A — Candidate MVP core:** candidate end-to-end business capability; still pending OQ-033.
- **B — Minimum supporting slice:** only the smallest cross-cutting slice needed by approved core flows; it does not approve the full module.
- **C — Candidate post-MVP:** proposed for a later implementation phase; the module and all IDs remain retained.
- **D — Needs further BA specification:** detailed FR/acceptance behavior is absent or materially incomplete; implementation waits for specification even if a minimum slice is business-important.
- **E — Pending Owner decision:** Owner has not approved the module's MVP disposition. All 19 modules currently carry E.

FO-NA remains a submodule of FO, so the matrix has 19 official module rows rather than treating FO-NA as a twentieth module.

#### Business necessity and minimum scope by module

| Module | Tags | Business necessity for the candidate MVP | Minimum functionality required if included | Current approval status |
|---|---|---|---|---|
| CFG | B, E | Core flows need effective property configuration; the full configuration catalog is not necessary at once | Effective chain/property values only for approved flows, effective dating for money-affecting values, protected change and audit; no unapproved tax/invoice/default values | Pending Owner decision; minimum slice Proposed |
| PROP | A, E | Establishes the confirmed multi-property boundary, timezone and business date | Property identity, timezone, lifecycle and explicit property selection; legal/invoice fields wait for OQ-037 | Pending Owner decision under OQ-033 |
| ROOM | A, E | Provides room type/physical-room capacity for availability and stay operations | Basic room types, rooms, dated saleability and capacity validation; parent/child/bed sale behavior waits for OQ-001 | Pending Owner decision under OQ-033 |
| RBAC | A, E | Required to enforce property isolation and privileged actions | Individual authenticated actor, action permission, property grant, deny-by-default and immediate revocation; approval variants wait for applicable OQs | Pending Owner decision under OQ-033/OQ-041 |
| EMP | A, E | Supplies individual staff identities and property assignments | Account lifecycle, assignment, authentication/session and stop/revoke; cross-property role, MFA and device details remain open | Pending Owner decision under OQ-033/OQ-041 |
| AUD | B, E | Sensitive booking, finance, authorization and personal-data actions require traceability | Atomic append-only sensitive-action events, masking and basic integrity verification; retention/anonymization waits for OQ-019 | Pending Owner decision for module slice; BR-061/NFR-AUD-001 remain source constraints, not technology approval |
| RATE | A, E | Booking cannot quote or confirm without an approved price/policy source | Basic nightly rate plan, availability quote and confirmation snapshot; supplements, discounts, cancellation/deposit and tax behavior wait for their OQs | Pending Owner decision under OQ-033 |
| BOOK | A, E | Central direct/walk-in/manual-OTA booking lifecycle and atomic inventory hold | Search, create, hold/confirm, basic modification/cancellation under approved rules, property scope and manual OTA source | Pending Owner decision under OQ-033 |
| CAL | A, E | Operational view for property availability, allocation and conflict handling | Property-scoped room/date view, availability status, assignment and conflict visibility; advanced drag/drop behavior may follow approved rules | Pending Owner decision under OQ-033 |
| GST | A, E | A stay needs a minimally identifiable guest, but sharing/documents are separate decisions | Minimum identity/contact fields, masking and property-authorized use; blacklist, document retention, sharing and erasure wait for OQ-019/034/045/047 | Pending Owner decision under OQ-033/OQ-034 |
| PAY | A, E | Deposit/settlement cannot be controlled without traceable payment records | Approved payment methods, Pending/Matched distinction, allocation and immutable correction trail; refund/shift/bank automation only where approved | Pending Owner decision under OQ-033 |
| INV | A, E | Folio and zero-balance settlement are part of the proposed end-to-end stay path | Folio open, immutable lines, payment allocation, settlement preview/zero balance and internal receipt where lawful; AR/e-invoice/GuestCredit wait for decisions | Pending Owner decision under OQ-033 |
| FO | A, E | Provides arrival, in-house and departure workflow; FO-NA carries the proposed property business-date close | Basic eligibility, check-in, room move/extension where approved, checkout and minimum idempotent Night Audit/business-date handling | Pending Owner decision under OQ-033; FO-NA trigger/revenue policies remain open |
| HK | A, E | Checkout-to-saleable-room cycle needs a cleanliness state and task handoff | Dirty/Clean state, checkout/stayover task and privacy-restricted board; Inspected and offline behavior wait for OQ-017/OQ-035 | Pending Owner decision under OQ-033 |
| MNT | A, E | Minimum out-of-order blocking protects availability from unusable rooms | Ticket lifecycle, OOO block/release, conflict check and audit; compensation/OOS refinements can follow later | Pending Owner decision under OQ-033 |
| AST | C, D, E | Asset/procurement detail is not required for the proposed booking-to-stay-to-settlement path | No AST business implementation until detailed FR exist; preserve only approved references from HK/MNT/PendingCharge boundaries | Pending Owner decision; candidate post-MVP; further BA specification required |
| NTF | B, C, D, E | Some approved flows may need an operational alert, but a full messaging module is not required to establish the core transaction | If Owner includes it, specify only essential in-app/operational alerts per approved flow; channels, templates, retries and guest communication need detailed FR/AC | Pending Owner decision; minimum slice Proposed; broader module post-MVP candidate; further BA specification required |
| RPT | B, C, D, E | Minimum property/Owner visibility supports multi-property oversight, while a full analytics suite is not required for core writes | If Owner includes it, specify a small approved property summary and authorized consolidated read; metric formulas/targets/exports need detailed FR/AC | Pending Owner decision; minimum slice Proposed; broader module post-MVP candidate; further BA specification required |
| CHN | C, D, E | Automated OTA/channel sync is not necessary if manual OTA entry/stop-sell is explicitly approved | No CHN automation in the candidate MVP; retain manual OTA source in BOOK and define integration ports without provider behavior | Pending OQ-020/OQ-033; candidate post-MVP; further BA specification required |

#### Requirements readiness, dependencies and earliest implementation point

“Later implementation phase” below means after the base Phase 0 foundation and after the named business/technical gates. It is not an approved delivery phase or schedule.

| Module | Requirements completeness | Main dependencies and open questions | Earliest permitted point under this proposal |
|---|---|---|---|
| CFG | Detailed FR-CFG-001–012 exist; affected slices remain `[A]/[Q]` | OQ-014/015/037/046; AUD/RBAC; OQ-036 before durable schema | Later implementation phase, after OQ-033 and only for configuration used by approved flows |
| PROP | Detailed FR-PROP-001–008 exist; legal/invoice fields incomplete | OQ-037; OQ-031 sizing; OQ-036 schema; OQ-041 selection/access | Later implementation phase after OQ-033/OQ-036; property-context design review may occur earlier |
| ROOM | Detailed FR-ROOM-001–009 exist; parent/child/bed policy unresolved | OQ-001; PROP, MNT, BOOK/CAL; OQ-036 | Later implementation phase after the sale-unit decision for the implemented slice |
| RBAC | Detailed FR-RBAC-001–012 exist; policy variants unresolved | OQ-040/042/043/044; OQ-041; EMP/AUD; session/database choices | Design/threat review may occur at Gate C; operational implementation only in a later approved module phase |
| EMP | Detailed FR-EMP-001–009 exist; role/MFA/device behavior unresolved | OQ-041/043/044; RBAC/AUD; session persistence | Design may occur at Gate C; persistent operational implementation after decisions and Gate D |
| AUD | Detailed FR-AUD-001–009 exist; retention/anonymization incomplete | OQ-019; every sensitive module; OQ-036 transaction/storage | Technical design may occur at Gates D/E; business audit implementation accompanies approved modules later |
| RATE | Detailed FR-RATE-001–015 exist; multiple price/policy rules unresolved | OQ-007/008/009/010/014; CFG/ROOM/BOOK/INV | Later implementation phase after the rules used by the selected rate slice are approved |
| BOOK | Detailed FR-BOOK-001–018 exist; key lifecycle policies unresolved | OQ-001/004/005/008/009/047; RATE/ROOM/GST/PAY/INV/AUD | Later implementation phase after OQ-033/OQ-036 and the selected booking-policy OQs |
| CAL | Detailed FR-CAL-001–011 exist; some behavior depends on unresolved inventory rules | OQ-001/005; ROOM/BOOK/MNT; NFR-PERF-001 `[A]` | Later implementation phase after its inventory/booking slice is approved |
| GST | Detailed FR-GST-001–011 exist; privacy/sharing/blacklist policy blocks full design | OQ-019/034/045/047; RBAC/AUD/object storage; OQ-036 | Only synthetic privacy/authorization design at Gates C/E; real guest data implementation later after decisions |
| PAY | Detailed FR-PAY-001–010 and 101–113 exist; several policies/traceability links remain open | OQ-012/040/048/049; INV/BOOK/AUD; RC-18/19; FR-PAY-107 BR-link correction | Later implementation phase after approved payment/refund/shift slice and database gate |
| INV | Detailed FR-INV-001–010 and 101–113 exist; legal/AR/GuestCredit and source references remain incomplete | OQ-003/014/015/021/037/053/055; PAY/FO/FO-NA; RC-21; correct FR-INV-015/018/106 references | Later implementation phase after selected folio/settlement rules; affected slices wait for BA corrections |
| FO | Detailed FR-FO-001–017 and FR-NA-001–011 exist; check-in/out/NA rules remain open | OQ-006/008/016/018/047/051/052; BOOK/GST/PAY/INV/HK/AUD | Later implementation phase after chosen front-office and Night Audit rules are approved |
| HK | Detailed FR-HK-001–010 exist; offline requirement conflicts with later proposals | OQ-017/035; FO/MNT/NTF; RC-16 | Online minimum slice may be implemented later only if Owner explicitly excludes/defers offline; otherwise wait for OQ-035 |
| MNT | Detailed FR-MNT-001–008 exist; compensation/OOS detail is incomplete | OQ-054; ROOM/CAL/HK/FO; RC-20 | Later implementation phase for minimum OOO slice after scope approval; compensation waits for OQ-054 |
| AST | No detailed FR in BA Parts 2–4; BA Part 5 is absent | HK/MNT/PendingCharge; inventory/procurement scope | Only after further BA specification and a later Owner scope decision |
| NTF | No detailed FR in BA Parts 2–4; known events/channels are only scope/dependency notes | OQ-039; every emitting flow; provider/privacy/retry choices | Only after minimum alert FR/AC are specified; no NTF business implementation in base Phase 0 |
| RPT | No detailed FR in BA Parts 2–4; measures/targets are `[A]` | OQ-030; OQ-016 revenue basis; authorization/OQ-041; source modules | Only after minimum report FR/AC/formulas are specified; no RPT business implementation in base Phase 0 |
| CHN | No detailed FR in BA Parts 2–4; integration behavior remains `[A]/[Q]` | OQ-005/020/021/022/038; BOOK/RATE/CAL/PAY/INV; provider contract | Only after further BA/provider specification and post-MVP Owner approval |

### E. Privacy and production readiness

| Decision ID / OQ ID | Issue and realistic options | Recommendation | Advantages, disadvantages and later-change impact | Dependencies | Priority | Approval owner | Current status |
|---|---|---|---|---|---|---|---|
| OQ-019; NFR-PRIV-001 | Legal basis/purpose, retention, deletion/anonymization, legal hold, incident/data-subject handling and backup expiry | Obtain written Owner + legal counsel rules per data class before real PII, retention jobs or production exports | Prevents irreversible over-collection and inconsistent deletion; legal review adds lead time. Retrofitting privacy after data accumulation is high risk and costly | OQ-034, OQ-045; provider/region; audit and backup design | Critical | Project Owner + legal counsel | Open |
| OQ-019, OQ-045; BR-063/066 | Store guest documents in DB, private object storage, or avoid image retention where lawful | Minimize retained documents; if required, use private encrypted object storage with short-lived authorized access, separate full-view permission and audit | Better lifecycle/large-object handling and reduced DB exposure; adds provider/KMS/lifecycle operations. Provider migration later requires secure bulk transfer and key/lifecycle reconciliation | Legal purpose/retention, region, KMS, incident response | Critical | Project Owner + legal/Security owner | Open |
| NFR-AVL-001 `[A]`; OQ-031 | Backup/recovery targets and ownership: managed PITR, scheduled backups, or self-managed recovery | Owner approves RPO/RTO and names recovery owner; prefer managed encrypted backups/PITR with routine restore evidence if PostgreSQL/provider are selected | Faster, more reliable recovery; ongoing cost and provider coupling. Changing after production affects runbooks and recovery guarantees | OQ-036, provider/region, data deletion in expired backups | High | Project Owner + Operations owner | Proposed |
| OQ-031; deployment proposal (no dedicated OQ) | Managed containers/services, VM/self-hosting, or another approved platform | Managed container/database/object services for initial production, with API and worker deployable separately; no Kubernetes requirement currently evidenced | Lower operations burden; provider cost/coupling. Self-hosting offers control but needs stronger on-call, patching and recovery capability | Budget, region, skills, supported runtime/images and security controls | High | Project Owner + Operations/Dev Lead | Proposed |
| OQ-031; NFR/operations proposal (no dedicated OQ) | Monitoring depth and named ownership: logs only, managed observability, or self-hosted stack | Structured redacted logs, health/metrics, queue/Night-Audit alerts and named incident owner before production; keep operational logs separate from AUD | Actionable operations and security evidence; adds cost/noise and PII-redaction work. Retrofitting correlation/metrics later weakens early incident evidence | OQ-019 logging/retention; chosen deployment and queue | High | Project Owner names Operations owner; Security/Dev Lead validate | Proposed |

### Decision order for the Owner session

1. Complete the remaining OQ-031 room/pilot/resources decisions and OQ-033 bounded MVP scope; do not re-ask the confirmed property ranges.
2. Approve the multi-property permission baseline, then answer OQ-041 and OQ-034; keep blacklist as a separate choice.
3. Select the architecture/technology family, including OQ-036. Delegate exact compatible version and adapter approval to the Dev Lead.
4. Authorize only Gate A and Gate B work if Phase 0 should start before the remaining business workshops.
5. Resolve OQ-019 with legal counsel before Gate E or any real personal data/file storage; complete production/provider/operations decisions before deployment.

Details such as child/extra-bed pricing, cancellation tiers, payment methods, tax/invoice rules, approval expiry, bank formats, Night Audit trigger, GuestCredit expiry, compensation thresholds and KPI targets may be decided in their relevant module workshops. They must be resolved before the affected behavior ships, but they need not delay an explicitly approved repository/toolchain or empty-shell task.
