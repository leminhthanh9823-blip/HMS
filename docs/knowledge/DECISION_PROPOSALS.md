# HMS Decision Proposals

**Status:** Owner confirmed the bounded directions for D1–D11 and D13 on 2026-11-05; see [DECISIONS.md](DECISIONS.md) for evidence and boundaries. D12 remains **Proposed – chờ Owner**. D3 approves an ESM spike only. D6/D7 are documentation boundaries only and do not close OQ-041/OQ-034. D8 is a synthetic test slice only; its accepted ASM values are not business decisions or a product baseline and close no OQs. Product scope and BA source labels remain unchanged.

**Known Owner direction:** HMS is single-owner, multi-property from its first release, and not SaaS for unrelated owners. Planning range is 2–5 properties in the first 12 months and 6–10 in months 12–24. Initial room count is unknown. These facts do not establish workload, budget, hosting, or staffing.

## D1 — Primary database engine

**Owner status:** Approved 2026-11-05 (Owner confirmation in conversation): PostgreSQL. Provider, production version, region and backup remain open under D12.

**Question:** Which primary relational database should own HMS operational and financial state?
**Related OQ:** OQ-036; OQ-031 for operational sizing/provider budget; OQ-019 for personal data and region.

| Option | Advantages | Disadvantages / risks |
|---|---|---|
| PostgreSQL | Proposed in the existing technology comparison; strong relational and transactional fit; supports advanced indexes and database-enforced policies that may help property-scoped integrity. | SQL-specific design and operations become costly to reverse after schema/migrations; provider, region, expertise and budget are not selected. Do not assume RLS is required or a substitute for API authorization. |
| MySQL or MariaDB | Familiar relational model and broad hosting choices; can support transactional HMS workloads. | Partial/conditional uniqueness and row-level protection differ from PostgreSQL and may need alternate schema/application enforcement; migration portability is not automatic. Exact engine and hosted-service capabilities need a focused validation. |
| SQL Server | Appropriate if existing Owner/operations expertise, licensing, reporting or Microsoft hosting materially favors it. | No such organizational constraint is recorded; licensing/provider and cross-platform development implications need validation. It should not be selected merely because the application uses TypeScript. |
| Defer engine selection | Avoids committing before Owner confirms scope, budget, provider and operating ownership. | Blocks production schema, ORM-specific migrations and any durable HMS business entity; only non-database preparation can proceed. |

**Recommendation — Proposed – chờ Owner:** PostgreSQL, conditional on a small compatibility spike and an operating-cost/provider review. The repository’s technology proposal already treats PostgreSQL as its candidate; this is supporting context, not approval. Validate constraints/indexes, isolation/concurrency behavior and backup/restore with representative synthetic flows. Select major version separately after checking support lifecycle and provider offerings. Provider, region, data residency, RLS policy and recovery targets remain separate decisions.

**Reversibility:** High cost to reverse after schema and production data; low before schema. **Unlocks:** engine-specific schema, migration and database integration-test work. **Risk if wrong:** migration/hosting cost, weakened integrity controls, or unsupported operating model. **Early spike:** implement a disposable synthetic transaction showing unique/foreign-key enforcement, competing writes and a reporting query on candidate engines; measure no production capacity from property counts. **Confirm:** Owner selects engine; Dev Lead validates technical/provider fit; Operations and legal counsel advise operating/residency constraints.

### Gói triển khai nếu được duyệt

- **Files:** create an engine ADR under `docs/knowledge/architecture/`; after D2, create the approved database directory/schema and migration config only in a separately authorized foundation package. Do not put business entities in this D1 engine-selection package.
- **Packages:** no package is inherent in choosing an engine. If Prisma is separately selected, candidate adapter/driver packages are listed under D2. Current registry observation: `pg@8.23.1` (2026-11-05); compatibility and security must be rechecked at implementation. Do not add it solely because D1 is approved.
- **Tests:** disposable connection smoke test, transaction/rollback, foreign-key/unique enforcement, concurrent conflict behavior, and backup/restore proof for the selected service.
- **Verification:** `pnpm view <package> version peerDependencies engines`; approved provider CLI/docs review; `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`; run engine-specific integration tests against the actual selected engine.
- **Done when:** engine/version policy/provider region are separately recorded with Owner evidence; local/CI connection, migrations and restore test work; no provider or capacity claim is inferred from property count.
- **Rollback:** before durable data, revert config/package and remove disposable DB service. After durable data, do not down-migrate destructively; restore from backup or use an approved forward migration/data export plan.

## D2 — ORM or data access

**Owner status:** Approved 2026-11-05 (Owner confirmation in conversation): Prisma 7 stable, not Prisma 8 RC; reviewed SQL migrations; raw SQL permitted for constraints and locking.

**Question:** Which abstraction should own mapping, query composition and migration workflow, conditional on D1?
**Related OQ:** OQ-036; OQ-041/OQ-034 for later schema semantics; D3 for module/runtime compatibility.

| Option | Advantages | Disadvantages / risks |
|---|---|---|
| Prisma | Strong generated client/DX and structured relational access; existing technology proposal already evaluates Prisma 7; migration history is explicit and raw SQL can be reviewed for exceptional queries. | Generated-client and migration conventions create coupling; special indexes, row locks, complex reports and database-specific constraints may require handwritten SQL. Version 7 changes runtime/adapter expectations; validate ESM and Nest lifecycle before adoption. |
| TypeORM | Nest ecosystem familiarity and entity/repository patterns; query builder/raw SQL can bridge custom reads. | Decorator/entity metadata and implicit persistence behavior need careful control; ensure tests exercise actual database constraints and transactions rather than mocked repositories. Long-term upgrade/migration path must be validated. |
| Drizzle | SQL-oriented, TypeScript schema/query construction and explicit SQL shape can suit reporting and database-specific work. | Smaller abstraction means more responsibility for query composition, relation conventions and migration discipline; verify Nest integration and transaction ergonomics with the actual version. |
| Kysely or another query builder | Keeps SQL visible while providing typed query construction; limits ORM model coupling and can suit reporting-heavy work. | Does not supply the same entity lifecycle/relationship abstraction; migrations, runtime validation and application conventions must be assembled and owned. |
| Defer / direct reviewed SQL | Avoids premature ORM coupling while D1 and domain data shape are unresolved. | Repeated hand-written mapping and no standard migration workflow slow the first persistent slice; still requires a chosen driver and review process. |

**Recommendation — Proposed – chờ Owner:** Prisma 7 as the default candidate because it is already the technology proposal’s primary option and offers a clear generated-client/migration workflow. Require explicit escape hatches for reviewed SQL, constraints and reports; keep business logic out of ORM hooks. This choice is not coupled to approving PostgreSQL: D1 and D2 need independent answers. Current registry queries (2026-11-05) returned Prisma CLI/client/PG adapter `7.10.1` and `pg@8.23.1`; Prisma 8 showed an RC as the unqualified latest, so the plan uses the latest observed stable 7.x candidate, not the RC. Compatibility with this repository’s exact Nest/ESM setup remains a spike, not established by `pnpm view` alone.

**Reversibility:** Medium before schema growth, high after migrations and repository conventions spread. **Unlocks:** standard repositories, migration review and database tests. **Risk if wrong:** pervasive generated-model coupling or slow/opaque reporting. **Early spike:** one synthetic table, one multi-step transaction with rollback, one concurrent update, one composite integrity rule, one report using raw SQL, one migration review and a test seam without mocking away PostgreSQL. **Confirm:** Dev Lead recommends; Owner approves the project technology bundle if required by governance.

### Gói triển khai nếu được duyệt

- **Files:** `apps/api/package.json`, root `pnpm-lock.yaml`, `apps/api/tsconfig.json`/build config only if generation requires it; new `database/prisma/schema.prisma`, `database/prisma.config.ts` if required by the verified CLI, and migration folder; API database provider/module and lifecycle tests. Exact paths are conditional on D1 and repository layout approval; no entities in the foundation spike unless separately scoped.
- **Packages:** candidates verified via registry 2026-11-05: `prisma@7.10.1`, `@prisma/client@7.10.1`, `@prisma/adapter-pg@7.10.1`, `pg@8.23.1`. Recheck `engines`, peers, stable status, security audit and Nest 11/12 compatibility immediately before install. Versions are not approvals.
- **Tests:** generated client, connect/disconnect, migration from empty database, rollback transaction, concurrent write/unique collision, foreign-key behavior, raw SQL report, repository integration test against the chosen real engine.
- **Verification:** `pnpm view` metadata recheck; `pnpm install --frozen-lockfile` after the authorized install; Prisma validate/generate/migrate commands from the verified CLI docs; all five workspace checks plus DB integration tests on PostgreSQL if D1 selects it.
- **Done when:** one repeatable migration path, reviewed generated SQL, app lifecycle closes DB connections, tested transaction/error behavior, clean tests on local and CI engine, and no ORM-specific business logic hooks.
- **Rollback:** remove the disposable spike package/schema before real data; after migrations/data exist, use expand/contract forward changes and retain SQL exports/backups. Do not assume ORM down-migrations safely restore production data.

## D3 — Module system and framework/toolchain line

**Owner status:** Approved for ESM measurement spike only, 2026-11-05 (Owner confirmation in conversation). No official module-system switch.

**Question:** Keep the prototype’s CommonJS/Node resolution and Nest 11/TypeScript 5.9, or move product implementation to ESM, TypeScript 6 and Nest 12?
**Related OQ:** OQ-036 and technology/version approval; D2 (Prisma 7’s proposed ESM setup); material inconsistency in `OPEN_QUESTIONS.md`.

| Option | Advantages | Disadvantages / risks |
|---|---|---|
| Keep CommonJS + Nest 11 + TypeScript 5.9 for first foundation | Smallest departure from the current build/tests and Gate A/B prototype; reduces simultaneous changes. | May not fit the chosen ORM/runtime direction; postpones ESM compatibility work and can require a later migration. Existing tool versions remain subject to written authorization/confirmation. |
| Move all API/worker packages to ESM + TypeScript 6 + Nest 12 together | One coherent modern module baseline if validated across API, worker, ORM, scripts and CI; avoids mixed module semantics. | Major framework/toolchain migration and highest change surface; package/API support and all Windows/Linux scripts require proof. Not authorized by existing prototype versions. |
| Stage it: approve versions first, spike ESM + chosen ORM on an isolated test branch, then migrate apps together | Isolates incompatibilities before changing the app shells; makes rollback and measured comparison easier. | Temporary spike upkeep; may require two implementation passes and explicit branch/review time. |
| Defer | No version/module churn before D1/D2 decisions. | Blocks production implementation if the approved ORM/framework needs another runtime model. |

**Recommendation — Proposed – chờ Owner:** do not change module mode or framework during technical foundation authorization. First approve D1/D2 and the exact toolchain independently, then run a small ESM/ORM spike; prefer a single consistent module format across API and worker if that spike passes. The technology proposal’s Nest 12/TS 6/ESM values are candidates, not current installed state or approval. Current repo uses CommonJS/Node resolution, TypeScript 5.9.3, Nest 11.1.29 and Node 24.11.1; the Nest patch is still awaiting written Owner confirmation in the checklist.

**Reversibility:** Medium before domain code, high after app/runtime packages and tools depend on the module format. **Unlocks:** reliable module/build scripts and ORM integration. **Risk if wrong:** loader/DI/test/build failures, production startup mismatch, duplicate dependency formats. **Early spike:** compile/start API + worker with one explicitly injected service, generate/connect ORM client, run Windows/Linux tests and shutdown. **Confirm:** Owner for toolchain/version authorization; Dev Lead for migration plan and compatibility.

## D4 — Request validation

**Owner status:** Approved 2026-11-05 (Owner confirmation in conversation): Zod with explicit Nest pipes.

**Question:** Which schema model and Nest integration should validate all business request input?
**Related OQ:** OQ-033 for included endpoints; OQ-019 for personal-data minimization; D3 and Nest version.

| Option | Advantages | Disadvantages / risks |
|---|---|---|
| Zod schemas + explicit Nest pipe | One schema can describe parse/validation and infer static input types; does not require relying on emitted decorator metadata. | Adds a dependency and custom pipe/error mapping; sharing schemas across boundaries can couple UI and API if done carelessly. |
| `class-validator` + `class-transformer` DTOs | Conventional Nest pipe/DTO approach and familiar class-based validation. | Adds two dependencies and reflection/transform conventions; ensure runtime metadata behavior works with the selected tsx/build setup and avoid trusting TypeScript types as validation. |
| Another standards-based schema validator | Could align with framework-native schema interfaces or existing team expertise. | Exact adapter, error shape, ecosystem and version support are not selected; risk of duplicate schema systems. |
| Defer | No dependency or API contract chosen before business scope. | Must block business endpoints; hand-written ad hoc validation leads to inconsistent boundaries. |

**Recommendation — Proposed – chờ Owner:** Zod schema-first validation in an explicit Nest pipe, with one stable error envelope and no automatic exposure of rejected values. Avoid coupling Web and API packages until ownership and version boundaries are agreed. Registry observation 2026-11-05: `zod@4.6.7`; no Nest adapter package is required by this proposal because the pipe calls the schema’s parse/safe-parse API directly. Verify behavior and supported TypeScript/Nest versions in a spike.

**Reversibility:** Low before endpoint schemas, medium after public contracts spread. **Unlocks:** safe business DTOs and contract-level validation tests. **Risk if wrong:** inconsistent coercion, unsafe error disclosure, duplicated schemas or breaking input changes. **Early spike:** representative string/number/date/object, unknown-key policy, malformed body, query and path parameter; assert HTTP error shape and no sensitive input in logs. **Confirm:** Owner approves validation policy; Dev Lead approves implementation and package versions.

### Gói triển khai nếu được duyệt

- **Files:** `apps/api/package.json`, root lockfile; new `apps/api/src/common/validation/` pipe and error mapper; global pipe wiring in `apps/api/src/main.ts`; API test-only DTO/schema and tests; README/API contract notes if client-visible errors change.
- **Packages:** `zod@4.6.7` was returned by `pnpm view` on 2026-11-05. Recheck current stable patch, engines, advisory state and license before adding. No separate adapter is proposed; if the chosen Nest release provides an approved standard-schema path, compare it before creating a local pipe.
- **Tests:** valid/invalid body, query/path, coercion policy, unknown fields, nested errors, redacted error response, and no business handler invocation for invalid input.
- **Verification:** all workspace checks; live Nest HTTP integration tests for status/envelope; package audit; verify generated OpenAPI/input schema parity if OpenAPI is later approved.
- **Done when:** every business controller uses the same explicit boundary; invalid payloads never enter service logic; errors are stable and do not echo sensitive values.
- **Rollback:** remove global pipe and package only before endpoints depend on schemas; otherwise migrate schemas endpoint-by-endpoint with contract tests and keep old response mapping during a versioned transition.

## D5 — HTTP security baseline: CORS, headers and rate limits

**Owner status:** Approved 2026-11-05 (Owner confirmation in conversation): narrow CORS allowlist, security headers and rate limiting.

**Question:** What baseline and configuration must be in place before any business endpoint is exposed?
**Related OQ:** OQ-019 (PII/security response); OQ-031 (operator); D4; D8/OQ-033.

| Option | Advantages | Disadvantages / risks |
|---|---|---|
| Explicit same-origin/no-CORS where possible, narrow allowlist otherwise; Helmet-equivalent headers; global rate limits with endpoint-specific overrides | Small, reviewable exposure before endpoints; central default is easier to audit. | Owner must name browser origins/cookie policy; proxies and health/long-poll endpoints need deliberate exceptions; limits require traffic and abuse expectations. |
| Configure only CORS and selected headers; defer rate limits until measured | Lower operational complexity and fewer false positives for a private staff prototype. | Does not protect public or credentialed business endpoints from request floods; needs an explicit gate before exposure. |
| Add a full edge/WAF/security service as primary control | Central policy and possible managed protections. | Provider, cost, ownership and proxy trust are unselected; does not replace application-level authorization or safe headers. |
| Defer all controls | No policy assumed before Owner input. | Business endpoints must remain unexposed; unsafe defaults can become entrenched. |

**Recommendation — Proposed – chờ Owner:** sequence before business endpoints: (1) Owner identifies allowed origins, credential/cookie expectations and deployment proxy; (2) enable narrow CORS; (3) adopt Helmet or reviewed explicit equivalent with exceptions documented; (4) set global rate limit plus stricter sensitive-operation classes only after threat/traffic review; (5) test behind the actual trusted proxy. Never treat CORS as authorization. Current Web has basic security headers; API production hardening beyond current errors/request ID is not implied.

**Reversibility:** Low-to-medium if implemented centrally before endpoint proliferation. **Unlocks:** safe exposure of browser-facing endpoints, not authorization. **Risk if wrong:** blocked legitimate staff, credentialed cross-origin access, spoofed proxy IPs or ineffective limits. **Early spike:** preflight, allowed/disallowed origins, credentials, representative rate-limit burst, forwarded IP trust and health endpoint behavior. **Confirm:** Owner policy/origins; Dev Lead implements; Security reviewer checks proxy and exceptions.

### Gói triển khai nếu được duyệt

- **Files:** `apps/api/src/main.ts` for CORS/Helmet/global throttler setup; API config/env example using safe placeholders; new security configuration module if approved architecture requires it; HTTP integration tests; workflow/config documentation; Web config only if same-origin/proxy design requires it.
- **Packages:** candidate registry values (2026-11-05): `helmet@8.3.0` (Node engine reported `>=18`), `@nestjs/throttler@6.7.1` (peer range returned by registry includes Nest `^11` and `^12`). Recheck exact compatibility with selected Nest patch and audit before adding. Nest’s built-in CORS config needs no new dependency. No package install is part of this proposal task.
- **Tests:** CORS allow/deny/preflight and credentials; security headers on success/error/health; rate-limit window and response; client-IP spoofing rejected unless proxy is trusted; no accidental trust-all origins.
- **Verification:** workspace checks, API HTTP integration suite, test behind local reverse proxy only if deployment uses one; inspect actual response headers and ensure no secrets in config.
- **Done when:** Owner policy is encoded, unauthorized origins are rejected, proxy behavior is documented, rate-limit policy is testable and health endpoints retain intended availability.
- **Rollback:** revert central configuration/packages before public exposure. For live policy changes, first use a reviewed temporary allowlist/limit adjustment with expiry; do not turn off controls globally as an incident shortcut.

## D6 — Multi-property authorization (OQ-041)

**Owner status:** Documentation boundary approved 2026-11-05 (Owner confirmation in conversation): user × property × role with explicit Owner scope. OQ-041 remains open; no authentication/RBAC implementation in D8.

**Question:** How are Owner and employee access grants scoped across properties?
**Related OQ:** OQ-041; OQ-045 for identity document access; OQ-019 for personal data.

**Conceptual proposal — Proposed – chờ Owner:** global `user` identity; `property`; `property_membership(user_id, property_id, status)`; role grants tied to a membership, e.g. `membership_role(membership_id, role_id)`; permission catalog shared as controlled reference data; separate explicit system-level grants only for genuinely system-wide administration. Owner access is an explicit Owner/system grant, not a magic missing `property_id`. An employee can hold different roles through separate property memberships only if Owner confirms that cardinality. Do not add `property_id` to every global identity/reference table.

| Option | Advantages | Disadvantages / risks |
|---|---|---|
| One property per employee | Simple assignment and UI. | Conflicts with the BA’s active property selection and different-role question; transfers/dual-site cover are awkward. |
| Membership per property with role per membership | Supports cross-property staff and different scoped grants; clean revocation/context checks. | More joins/policy tests; Owner must decide who assigns roles and whether limits apply. |
| Global employee roles only | Simple central role list. | Risks unintended privilege sharing across properties and does not encode per-property differences. |
| Defer | Keeps schema and auth unimplemented. | Blocks identity/membership schema and protected multi-property workflows. |

**Recommendation — Proposed – chờ Owner:** property membership with per-membership roles; owner-wide access is explicit and audited. Require server-side context verification on every API request; a selector only requests a context change and cannot grant it. Jobs, exports, notifications and cache keys carry a validated property scope or explicit owner-wide scope. Cross-property reports use an explicit authorized property set. These are security design recommendations, not a closed OQ.

**Owner must answer explicitly:** (1) Can one employee belong to multiple properties? Yes/No. (2) Can the same employee have different roles per property? Yes/No. (3) Does Owner always see/read/write all properties, or can Owner restrict own/employee access? Choose. (4) Who may grant/revoke property membership and roles? (5) May any employee switch among all assigned properties, or must switching be approved? (6) Is consolidated reporting Owner-only, and which actions may cross properties? (7) What should happen to active sessions/jobs after membership revocation? **Unlocks:** identity/membership schema and authorization; **risk if wrong:** IDOR, cross-property disclosure or Owner lockout. **Reversibility:** high after authorization logic and records exist. **Spike:** synthetic two-property tests for object-ID substitution, role difference, context switch, owner report and stale job revocation. **Confirm:** Owner; Dev Lead/Security review.

## D7 — Guest records, blacklist and sensitive identity data

**Owner status:** Default documentation boundary approved 2026-11-05 (Owner confirmation in conversation): no cross-property guest or blacklist sharing. OQ-034 remains open.

**Question:** What guest data is local to a property, shared across the chain, and visible to which roles?
**Related OQ:** OQ-034, OQ-047 and OQ-045; OQ-019 privacy/retention.

| Option | Advantages | Disadvantages / risks |
|---|---|---|
| Property-local profiles/history/documents/blacklist | Least cross-property disclosure by default; simple access boundary. | Conflicts with BA chain-level guest scenarios/FRs and loses chain-level duplicate/history behavior unless BA is changed. Requires explicit change control. |
| Global shared guest records | Supports chain-wide identity/history and matching. | Broad PII blast radius, false merges and unclear access/retention; identity linkage must not imply unrestricted profile/document access. |
| Hybrid: identity/match token separated from property profile/history/documents | Can support controlled chain identity matching while keeping operational records local and field-scoped. | Most complex consent/access/audit and merge/unmerge behavior; requires Owner/legal/privacy rules before schema. |
| Defer all cross-property lookup | Safest technical posture while rules are unresolved. | Cannot implement chain-wide BA acceptance behavior or cross-property blacklist use; guest slice remains blocked. |

**Recommendation — Proposed – chờ Owner:** while unresolved, do not make guest profile, contact details, booking history, documents or blacklist globally searchable. Treat property-local access as the safe interim authorization boundary, but do not ship it as a final replacement for BA chain-level behavior. Pause guest/blacklist business implementation until Owner resolves OQ-034/OQ-047/OQ-045 and legal advice resolves OQ-019. Decide identity matching separately from sharing contact fields, documents, history or blacklist. Define false-positive correction, merge reversal, reason/evidence, visibility, expiry, deletion and audit before implementation.

**Choices required:** fields shared (identity key/contact/document/history separately); cross-property match authority; blacklist scope and viewers; warning vs hard block vs configurable; override roles/reason; expiry/retention; correction/false-positive path. **Unlocks:** guest and blacklist schema/workflows only. **Risk if wrong:** privacy breach, discriminatory/mistaken block, duplicate guest or violation of chain-level BA. **Reversibility:** high with real data. **Spike:** synthetic-only identity matching with no PII; test link/unlink, property scopes and audit. **Confirm:** Owner with legal/privacy advisor and BA/product owner; managers define operational process.

## D8 — First MVP vertical slice (OQ-033)

**Owner status:** Approved as a synthetic-data test slice only, 2026-11-05 (Owner confirmation in conversation): PROP → ROOM → BOOK (hold). No authentication, real PII, or product baseline. ASM-001/002/004/005 are test assumptions only; their OQs remain open.

**Question:** What is the smallest demonstrable product slice to approve after the database/security foundations?
**Related OQ:** OQ-033 (scope), OQ-036 (engine); OQ-001/003/004/005 for unit/group/hold rules; OQ-019/034/041/045 for real guest/auth data; OQ-031 for funded pilot and operator.

**Recommendation — Proposed – chờ Owner:** a private synthetic-data demonstration of `PROP → ROOM → BOOK (hold)` with one property, a configured room inventory and a hold transition. Keep multi-property keys and property scope from the start. Do not infer sale-unit/parent-child behavior, deposit deadline, overbooking or group booking.

| Option | Advantages | Disadvantages / risks |
|---|---|---|
| PROP → ROOM → BOOK hold | Demonstrates a meaningful end-to-end foundation and tests property/room/hold boundaries. | Depends on the largest set of OQ answers below; guest/privacy and staff access cannot be hand-waved. |
| PROP-only first slice | Smaller schema and acceptance surface; can validate property configuration. | Does not demonstrate availability/booking value; room definition OQ-001 still applies. |
| Defer business slice | Avoids implementing any unresolved ASM or scope. | No product demo; only technical foundation can progress if separately approved. |

| Stage | Minimum decisions before business schema/behavior | Explicitly defer |
|---|---|---|
| PROP | OQ-033 approval that property setup is in scope; D1/D2; OQ-036 engine; property timezone/business-date source rules from BA; OQ-031 only if scheduling/provider spend is committed. | Legal/property fields affected by OQ-037. |
| ROOM | Above plus OQ-001 sale unit, parent/child exclusivity and capacity; BA room lifecycle/state rules and acceptance criteria. | Group allotment/master folio unless included (OQ-003). |
| BOOK hold | Above plus OQ-004 hold/deposit deadlines, OQ-005 overbooking behavior, OQ-033 slice acceptance; D6/OQ-041 for protected staff access; OQ-019/OQ-034/OQ-045 before real guest PII/profile/documents. | Payment collection, channels, tax/invoice, notifications and full booking lifecycle unless separately scoped. |

Use synthetic guest data for demo until privacy/guest decisions are resolved. This does not authorize an unauthenticated reachable business endpoint; local/private-only demo boundaries and access controls must be separately approved. **Alternatives:** defer all product slices; choose PROP-only; choose another Owner-prioritized vertical slice. **Unlocks:** one end-to-end acceptance demonstration. **Risk if wrong:** a demo hardens an unresolved ASM into production behavior. **Reversibility:** medium before data, high after bookings exist. **Early check:** BA/Owner walkthrough of clickable state transition and acceptance examples using synthetic data. **Confirm:** Owner selects scope; BA validates acceptance; Dev Lead validates prerequisites.

## D9 — Repository visibility and seven tracked PDFs

**Owner status:** Not applicable (test project), approved 2026-11-05 (Owner confirmation in conversation). Do not change repository visibility or remove PDFs; close D9 for this reason.

**Question:** Should repository access be public or private, and what is the authorized distribution route for the seven source PDFs?
**Related OQ:** Owner confirmation checklist; legal/IP and privacy responsibilities under OQ-019.

| Option | Advantages | Disadvantages / risks |
|---|---|---|
| Keep repository private until rights are confirmed | Limits new public exposure while Owner checks distribution rights. | Does not remove access already granted to collaborators or erase prior clones/cache. Requires Owner/admin to verify visibility. |
| Public repository with PDFs retained | Simple reproducibility and public source history. | Makes BA/proposal material public; requires rights and privacy review. Once public, history can be cloned/cached. |
| Remove PDFs from future tree and store in an approved restricted source repository | Keeps future working tree leaner and access-controlled. | Deleting from current tree does not remove PDFs from Git history; a history rewrite is disruptive and cannot recall existing clones/forks. Need alternate durable source links/access process. |
| Git LFS | May improve handling of large binary files and checkout behavior. | Does not grant distribution rights or make content private; LFS pointers still reference downloadable objects and old Git history remains. Adds service/quota/dependency considerations. |
| Defer visibility decision | No visibility change or history rewrite by the agent. | Current visibility/rights remain unverified; if public, PDFs may already be exposed. |

**Recommendation — Proposed – chờ Owner:** do not change visibility or remove tracked PDFs in this task. Owner/admin should verify actual visibility immediately and prefer private access while rights are reviewed. Decide whether to retain in Git, move to a restricted document system, or use LFS only after rights and history implications are understood. A new-file deletion does not purge old commits; history rewriting requires a separate migration plan and explicit authorization.

**Reversibility:** Low if public exposure/history clones; medium for changing future storage with coordination. **Unlocks:** baseline distribution decision. **Risk if wrong:** unauthorized redistribution or falsely assuming deletion/LFS retracts data. **Early check:** inspect remote host visibility/access list and rights for each source file; no file content is sent by this proposal. **Confirm:** Owner with document/IP rights holder and repository administrator; legal counsel as needed.

## D10 — CI dependency audit threshold and Dependabot

**Owner status:** Approved 2026-11-05 (Owner confirmation in conversation): block high/critical; exceptions require reason and expiry.

**Question:** Which findings block CI, and how should automated update PRs be managed?
**Related OQ:** Owner security/operations policy; D5.

| Option | Advantages | Disadvantages / risks |
|---|---|---|
| Fail production CI on high/critical; review moderate/low with time-bounded exception records; full audit informational | Focuses release gate on severe runtime exposure while preserving visibility of dev-tool risk. | Requires exception owner, expiry and emergency patch path; severity alone misses exploitability/context. |
| Fail on moderate/high/critical for all dependencies | Stronger gate; reduces unresolved ecosystem exposure. | Can block work on dev-only findings and transitive advisories without a safe immediate fix; needs triage capacity. |
| Keep all audit informational | Never blocks delivery due to registry advisory churn. | Vulnerabilities can persist unnoticed or be accepted implicitly. |
| Dependabot weekly PRs, grouped only after review, limited concurrency | Regular update cadence and visibility; maintainers review lockfile impact. | PR noise and CI load; automated merges can break compatibility/security assumptions. |

**Recommendation — Proposed – chờ Owner:** production audit blocks on high/critical with a documented, expiring exception process; moderate/low remain visible and triaged; full audit remains informational until Owner sets dev-dependency handling. Keep Dependabot weekly; do not enable auto-merge; set PR limits/groups after observing volume. Current CI and new scheduled audit are fail-soft; no threshold has been enacted.

**Verification snapshot (2026-11-05):** `pnpm audit --prod` returned `No known vulnerabilities found` (exit 0). `pnpm audit` exited 1 with 2 dev-tree advisories: moderate `GHSA-g3hv-75wg-m249`, minimatch installed `10.2.6` through `eslint`, vulnerable `>=7.0.0 <11.0.1`, patched `>=11.0.1`; low `GHSA-g7r4-m6w7-qqqr`, esbuild installed `0.27.7` through `tsx` in API/Web/Worker, vulnerable `>=0.27.3 <0.28.1`, patched `>=0.28.1`. No versions were changed. Re-run audit at release time; this is a dated registry observation, not a guarantee.

**Reversibility:** Low for CI gate policy changes; moderate for Dependabot PR volume. **Unlocks:** meaningful automated release gate. **Risk if wrong:** either shipping exploitable code or blocking all work on non-runtime noise. **Early check:** run audit on a branch with sample advisory/exception policy and inspect CI behavior. **Confirm:** Owner chooses threshold/exception authority; Dev Lead implements triage/reporting.

### Gói triển khai nếu được duyệt

- **Files:** `.github/workflows/ci.yml`; `.github/workflows/dependency-audit.yml`; `.github/dependabot.yml`; add a security exception register only if Owner approves its format/location; README policy note.
- **Packages:** none.
- **Tests:** validate workflow syntax; demonstrate prod high/critical fails, moderate/low reporting, exception expiry and full-audit informational behavior using a controlled branch/fixture, not by injecting vulnerable packages into main.
- **Verification:** `pnpm audit --prod`, `pnpm audit`; inspect action permissions/concurrency and workflow result on both PR and scheduled dispatch; CI lint/format/build checks.
- **Done when:** policy states severity scope, exception approver, evidence, expiry and recheck; production audit gate is demonstrably enforced; Dependabot does not auto-merge.
- **Rollback:** revert workflow policy commit; record the reason and restore informational behavior temporarily with an expiry, not silently.

## D11 — Redis and BullMQ

**Owner status:** Approved 2026-11-05 (Owner confirmation in conversation): defer Redis/BullMQ.

**Question:** Is a separate queue/cache service needed for the first authorized product slice?
**Related OQ:** OQ-033, OQ-031, D1/D2 and named operations owner.

| Option | Advantages | Disadvantages / risks |
|---|---|---|
| Defer Redis/BullMQ; start with synchronous work and durable DB intent where asynchronous work is approved | Lowest operational footprint; avoids treating cache/queue as business truth. | Long-running/retried scheduled jobs need another durable mechanism or wait for a later decision. |
| Add Redis/BullMQ for clearly identified delayed/retryable jobs | Dedicated queue semantics and worker scaling. | Adds service operation, failure/retry/duplicate delivery handling and monitoring. Current worker is a plain Node process, not an approved queue worker architecture. |
| Redis cache only | Can improve measured hot reads. | Invalidations/staleness can affect property and booking data; no measured bottleneck exists. |
| Defer pending evidence | No dependency before a demonstrated requirement. | Async workflows remain unimplemented until decision. |

**Recommendation — Proposed – chờ Owner:** defer Redis/BullMQ until an approved slice requires delayed/retryable work or measured read-load evidence warrants cache. Keep business intent durable outside Redis. Activation criteria: named job classes, duplicate/idempotency semantics, required delay/retry behavior, outage/replay runbook, capacity/cost evidence and accountable operator. **Reversibility:** low before job contracts, medium after queue semantics spread. **Unlocks:** job workers only. **Risk if wrong:** lost/double jobs or avoidable operational burden. **Spike:** synthetic outbox event and retry/duplicate recovery on disposable infrastructure. **Confirm:** Owner funds/accepts service; Dev Lead/Operations validates.

## D12 — Hosting, backup, RPO/RTO and operations

**Owner status:** Proposed; explicitly not approved on 2026-11-05.

**Question:** What production operating model, recovery objectives and accountable humans are acceptable?
**Related OQ:** OQ-031, OQ-036, OQ-019 and NFR-AVL-001 `[A]`.

| Option | Advantages | Disadvantages / risks |
|---|---|---|
| Managed relational DB, private network, automated recoverable backups, tested restore, separate staging/prod | Reduces self-managed database maintenance; supports a clear control baseline. | Cost/provider/region and service capabilities remain unknown; managed service does not remove restore responsibility. |
| Self-hosted database | Direct control and potentially lower apparent service cost. | Requires patching, backup, monitoring, on-call, storage and restore expertise; no operator is named. |
| Defer provider and production targets; prepare local/test only | Avoids spend/SLA assumptions while decisions are open. | No production or realistic operational acceptance. |

**Recommendation — Proposed – chờ Owner:** before production, choose a managed or self-hosted model from budget, data residency and named operator evidence; require encrypted backups, restore rehearsal, monitoring and an incident runbook. BA NFR-AVL-001 proposes `[A]` availability 99.5%, RPO ≤15 minutes, RTO ≤4 hours and quarterly restore test. These are not approved SLA or sizing. Do not invent backup frequency/retention. Owner must accept/revise each target and name primary/backup operators.

**Reversibility:** Medium before production data, high after provider-specific storage/backups. **Unlocks:** production readiness only after legal/security decisions. **Risk if wrong:** unaffordable design or unrecoverable data. **Early check:** provider-independent tabletop restore using synthetic disposable DB; cost quotations based on measured workload after OQ-031. **Confirm:** Owner, Operations owner, legal/privacy counsel for region/data obligations; Dev Lead for technical feasibility.

## D13 — Database integration testing in CI

**Owner status:** Approved 2026-11-05 (Owner confirmation in conversation): ephemeral PostgreSQL for Linux CI.

**Question:** How should CI run engine-realistic tests after D1 is approved?
**Related OQ:** OQ-036/D1, D2, OQ-041/OQ-034 for later isolation tests.

| Option | Advantages | Disadvantages / risks |
|---|---|---|
| Linux CI service container, ephemeral DB per job | Fast, isolated and close to actual PostgreSQL semantics; clean disposal. | Service lifecycle/health wait and image version need maintenance; database matrix may slow CI. |
| Disposable external CI database per run | Can match managed-service behavior. | Secret management, network, cost, cleanup and cross-run isolation risks. |
| Run only unit tests/mocks/SQLite | Fast and easy for local feedback. | Does not prove engine-specific migrations, partial indexes, locking, constraints or isolation; cannot be the only database integration gate. |
| Defer DB CI until engine is approved | Avoids selecting an image/provider now. | Database implementation cannot be accepted until the real engine is exercised. |

**Recommendation — Proposed – chờ Owner:** if PostgreSQL is selected, put engine-specific integration/migration tests in a Linux job with an ephemeral PostgreSQL service container and per-job database; keep Windows matrix for platform/unit/build checks unless Windows service-container support is separately demonstrated. Use synthetic data, no production credentials or customer data. This is conditional; current workflow has no database service.

**Reversibility:** Low before CI suite exists; medium after many tests depend on environment setup. **Unlocks:** confidence in migrations, transactions and isolation against selected engine. **Risk if wrong:** mocks pass while production engine behavior differs, or state leaks between jobs. **Early check:** one disposable migration/constraint/rollback job and prove cleanup after failure. **Confirm:** Dev Lead proposes runner architecture; Owner approves CI resource/cost and data boundary.

### Gói triển khai nếu được duyệt

- **Files:** `.github/workflows/ci.yml` or a dedicated `database-integration.yml`; API test scripts; DB test fixture/cleanup utilities; approved test config with placeholders only. Do not add a provider secret unless external database option is selected.
- **Packages:** no new JavaScript package if using GitHub Actions service containers and existing selected ORM/driver. PostgreSQL service image exact tag is **Unverified until D1 and image support are approved**; do not use floating `latest`.
- **Tests:** migration from empty DB, migration repeat/version check, FK/unique/partial unique as chosen, transaction rollback, concurrent conflicting writes, cross-property negative scope, reset/cleanup after test failure, restore drill in a separate controlled environment.
- **Verification:** workflow syntax; run locally against the same pinned engine image; run CI Linux service job; assert per-job isolated database and no credentials/data in logs. Run unit suite separately so test categories remain clear.
- **Done when:** CI uses the selected engine/version, migration and integrity cases run deterministically, all temporary data/services are disposed, and failures retain useful redacted logs.
- **Rollback:** revert the dedicated integration job without changing unit CI; preserve test files and rerun locally. Never switch to SQLite/mocks as an unnoticed replacement for failing engine-realistic checks.

## Recommended approval order and dependency map

| Order | Decision | Opens / depends on |
|---:|---|---|
| 1 | D9 repository visibility/PDF rights | Closed as not applicable for the test project; no repository/PDF action. |
| 2 | D1 database engine | Prerequisite for D2 concrete adapter, schema and D13 engine-specific tests. |
| 3 | D3 module/framework/toolchain line | Jointly spike with D2; approve exact versions separately from engine. |
| 4 | D2 ORM/data access | Depends on D1 and D3; opens migration/repository foundation. |
| 5 | D4 validation and D5 HTTP security baseline | Must be resolved before business endpoints; independent of final guest schema. |
| 6 | D6 authorization and D7 guest/privacy behavior | Resolve OQ-041/OQ-034/OQ-047/OQ-045/OQ-019 before identity/guest/blacklist schemas. |
| 7 | D10 audit policy and D13 DB CI | D10 can proceed independently; D13 depends on D1/D2 and CI resource decision. |
| 8 | D11 Redis/BullMQ and D12 production operations | Defer until a scoped job requirement, OQ-031 resources and named operator exist. |
| 9 | D8 first vertical slice | Requires OQ-033 and each stage’s listed OQs plus its technical foundations. |

## KHÔNG THỂ QUYẾT ĐỊNH BỞI AI

| Topic | Why AI cannot decide | Information Owner must provide |
|---|---|---|
| OQ-019 privacy/legal basis | Requires actual purposes, data subjects, jurisdictions and legal interpretation. | Legal counsel’s advice by data category; approved purposes, retention/deletion, legal hold, access requests, breach/escalation roles, processors and residency constraints. |
| OQ-031 execution envelope | These are business/funding facts, not derivable from repository or property count. | Initial room count, pilot property/sequence, budget, target timeline, staffing/availability, support coverage and named operational owner. |
| RPO/RTO and availability | Targets are business impact and cost decisions; BA values are `[A]`, not SLA. | Accept/revise NFR-AVL-001’s 99.5%, RPO ≤15 min, RTO ≤4 h, quarterly restore drill; identify primary/backup operator and approver. |
| Tax/invoice: OQ-014/015/037/055 | Legal/accounting obligations depend on property/entity and current regulatory advice. | Accounting/legal determination of entity/tax mode, e-invoice obligation/provider/timing, invoice type and long-stay rules; owner-approved product scope. |
| Production operations | An architecture cannot name a human accountable for incidents and recovery. | Named service owner, primary/backup on-call, vendor escalation, patch/backup/restore responsibility, incident commander and budget authority. |

## Verification observations for this proposal

- Registry audit run 2026-11-05: `pnpm audit --prod` → **No known vulnerabilities found** (exit 0); `pnpm audit` → exit 1, two dev-tree advisories listed under D10. No package version was changed.
- Registry metadata queried with `pnpm view` on 2026-11-05 for candidate package versions/peers. These observations are time-sensitive and not Owner approval. The unqualified latest Prisma query returned `8.0.0-rc.30`; the proposal deliberately records stable 7.x candidate `7.10.1`, after querying the 7.x line. Recheck before any implementation.
- Current workflows use tags `actions/checkout@v4`, `pnpm/action-setup@v4`, `actions/setup-node@v4` in CI and scheduled audit. No exact action commit SHA was verified from installed local files; SHA values are **Unverified** and listed in `OWNER_CONFIRMATION_CHECKLIST.md`. No guessing/pinning was done.
- Current Git snapshot before this proposal: commit `24cc06b` / 2026-11-05, 9 commits, 85 tracked paths. Recreate with `git rev-list --count HEAD`, `git ls-files | Measure-Object -Line` (PowerShell) or `git ls-files | wc -l` (POSIX); snapshot changes after later commits.
