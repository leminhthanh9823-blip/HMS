# Architecture and technology proposals

Gate C.1 owner-facing decisions D-01–D-08, including database/ORM options and approval dependencies, are assembled in [OWNER_DECISION_PACKAGE.md](OWNER_DECISION_PACKAGE.md). That package is Proposed / Pending Approval and does not change any architecture choice below.

Approved directions and their limits are recorded in [DECISIONS.md](DECISIONS.md). PostgreSQL and Prisma 7 stable are approved for this synthetic test project; D12 production provider/version/region/backup remains Proposed. ESM is a measurement spike only. The BA contains source-marked constraints; proposals remain proposals outside the confirmed boundaries.

## Bounded Gate A/B implementation record (2026-11-05)

The Owner authorized a prototype repository foundation and empty API/Web/Worker shells. The Owner has since approved the D8 synthetic test slice PROP → ROOM → BOOK (hold), and D1 PostgreSQL/D2 Prisma 7 stable foundation. These approvals do not establish a production baseline. D8 excludes authentication/RBAC, real PII, guest, payment/folio/rate engine, Night Audit, CHN/NTF/RPT/AST. OQ-036 is answered only for the engine; OQ-031, OQ-033, OQ-034 and OQ-041 remain open outside the bounded test slice.

## Owner-provided business direction (2026-11-05)

The project owner confirmed single-owner operation with multiple properties from the first release and no SaaS for unrelated owners on 2026-11-05. The Owner also supplied planning ranges of **2–5 properties in the first 12 months** and **6–10 properties in months 12–24**. Initial room count is unknown. These are recorded in [DECISIONS.md](DECISIONS.md); OQ-032's business direction is answered and OQ-031 is partially answered. Pilot property, budget, staffing, timeline and operational ownership remain open. OQ-034 (guest/blacklist sharing), OQ-041 (roles across properties), privacy OQ-019 and other module policies remain open. Framework versions, ORM, module architecture and deployment choices remain proposals in [TECHNOLOGY_DECISION_PROPOSAL.md](TECHNOLOGY_DECISION_PROPOSAL.md).

### Operational sizing context and limits

- Design for property isolation from the first release; never assume the system has only one property because a pilot may start at one location.
- Use the 2–5 and 6–10 property ranges to review scope propagation, administration and consolidated reads. They do not establish room, booking, user, revenue, storage, request-rate or concurrency quantities.
- Do not derive database size, queue capacity, cache topology, service count, autoscaling thresholds or production instance sizes until room count and measured workload are available.
- The sizing input does not approve an architecture or authorize implementation. Modular Monolith, database, cache/queue and deployment topology remain proposals.

## Approved documentation boundaries and test-slice limits

- D6 documents user × property × role with explicit Owner scope as the default boundary. This does not settle role cardinality, authentication or OQ-041; no authentication/RBAC is implemented in D8.
- D7 uses no cross-property guest or blacklist sharing as the default boundary. This does not close OQ-034.
- D8 is a synthetic-data PROP → ROOM → BOOK hold experiment only. Its ASM assumptions are listed in [DECISIONS.md](DECISIONS.md), are configurable when used in code, and are not product baseline decisions.
- Do not use real personal data or include PII in seed, tests or logs. No payment/folio/rate engine, Night Audit, CHN, NTF, RPT or AST is in this slice.

## Proposed system shape (remaining technology approval pending)

Use a Modular Monolith as the initial application architecture: Next.js staff web application calls a NestJS REST API; PostgreSQL is the primary source of truth; Redis + BullMQ carry asynchronous/retryable jobs. API and worker may run as separate processes while sharing the same backend application modules and database transaction rules. A pnpm TypeScript monorepo and Docker Compose for local development are proposed. Do not start with microservices, Kubernetes or native mobile unless a documented requirement justifies them. These are architecture proposals pending explicit technology approval.

## Multi-property boundaries from first release

- A Property is a first-class business entity and the operational data/authorization boundary. Treat multi-property support as a launch requirement, not future-proofing.
- Every property-owned operational aggregate has an explicit relationship to a property. Do not add `property_id` mechanically to genuinely global entities: employee login identity, global role/permission definitions and owner-wide configuration can be global, while role grants are scoped by property. Shared guest/blacklist scope remains unresolved under OQ-034.
- A user may have assignments in multiple properties. The active property selector is context only; server-side authorization validates the authenticated user's assignment and action permission on every request. Do not assume one user maps to one property or rely on hidden UI controls.
- Owner-level users may access permitted consolidated dashboards/reports. Operational commands must resolve one explicit authorized property. Consolidated reads do not grant cross-property writes.
- Keep property timezone and business date independent, consistent with BR-004/BR-007; Night Audit lock and advancement are per `(property_id, business_date)`.
- Carry property scope through background-job payloads, retry/idempotency keys, cache keys, export records, notification delivery and audit events. Cross-property operations must carry an explicit authorized property set; missing scope never bypasses authorization.
- Where relationships cross aggregates, enforce same-property references through composite foreign keys or equivalent validated repository/application checks. PostgreSQL RLS may add defense in depth only after pooled-connection context is designed; it does not replace application authorization.
- Verify isolation with negative tests for IDs from another property, including reads, mutations, reports, files, jobs and cached responses. Record sensitive and cross-property access in AUD with actor, scope and reason where required by the approved rule.

### Proposed authorization matrix (policy decisions remain open)

This is a server-side design proposal, not a role/permission approval. BR-060/065 and RBAC/EMP define source constraints, while multiple detailed behaviors remain `[A]`/`[Q]`. In particular, OQ-041 (whether one employee may hold different roles at multiple properties), OQ-034 (guest/blacklist sharing), OQ-040 (single-person approval) and OQ-045 (full identity-document view) must not be inferred from this matrix.

| Actor / request | Proposed scope check | Allowed boundary in this proposal | Open decision / test |
|---|---|---|---|
| Owner operational command | Authenticate; check action permission; require explicit `property_id`; verify the Owner grant covers it | One property per command; no implicit “all properties” write | Owner permissions and exceptional workflows remain subject to approved RBAC; deny missing/unauthorized property context |
| Owner consolidated report | Authenticate; check report permission and explicit property set or explicit authorized owner-wide scope | Read-only aggregation across authorized properties; each row remains traceable to its property | RPT details/measures are `[A]`; test that a narrower requested property set cannot be widened by the client |
| Manager command/report | Authenticate; check action and property-specific grant on each request | Only properties and actions actually granted; no owner-wide scope by job title alone | OQ-041 role assignment policy; negative test for unassigned property ID |
| Employee command/report | Authenticate; check action and property-specific grant on each request | Only the selected, authorized property and granted actions | OQ-041 decides cross-property assignments/different roles; test switching selection never adds a grant |
| Any request with no property context | Classify endpoint as genuinely global or property-scoped before handling | Global endpoints may omit property context; property-scoped operational commands must reject missing context rather than guess a default | Define endpoint classification in the approved API contract; test missing context and forged property IDs |
| Background job | Persist originating actor/system identity, explicit property ID or an approved owner-wide property set, job purpose and correlation/idempotency key | Revalidate scope at execution; expired/revoked authorization must not widen scope | Test duplicate/retry, missing context, wrong-property payload and authorization changes between enqueue and run |
| System Admin | Separate platform administration from business-operation grants | No business authority by default, consistent with RBAC source | Any emergency access policy requires explicit approval and audit |

### Proposed data ownership classification

| Data class | Candidate examples | Scope proposal and unresolved points |
|---|---|---|
| Owner/system-wide identity and definitions | Owner account, employee login identity, global permission/role definitions, system configuration | Global only when the business meaning is truly shared. Access is through explicit property grants; do not add `property_id` mechanically. |
| Property-owned records | Property, rooms/room types, rate plans, bookings/booking rooms, inventory, cashier shifts, payments/folio operations, property business date, property exports/settings | Explicit property ownership on aggregate roots or scoped rows; enforce same-property references in service/constraint design. Exact schema waits for OQ-036 and dependent module OQs. |
| Many-to-many membership/association | Employee-to-property grants; possible guest-to-property links | A user can be associated with several properties; exact role cardinality is OQ-041. Guest/property relationship depends on OQ-034. Model association as an explicit relationship, not a duplicate property field on the global identity. |
| Derived cross-property views | Owner-level consolidated reports | Build from authorized property-scoped records with explicit scope and per-property traceability. No cross-property write authority follows from aggregation. RPT metric definitions remain `[A]`. |
| Potentially shared guest identity and blacklist | GST identity/contact matching, stay history, blacklist | Scope options remain open under OQ-034. Do not expose chain-wide search/history/blacklist by assumption; OQ-019 and OQ-045 also constrain personal-data use and full-view permission. |

### Guest/customer scope options awaiting Owner decision

| Option | Benefits | Costs/risks | Required decision |
|---|---|---|---|
| One guest profile per property | Strong operational separation; smaller disclosure surface and simpler property authorization | Duplicate people/profiles, fragmented stay history, cross-property matching and updates become harder | Owner decides OQ-034; define duplicate resolution and consent/purpose behavior under OQ-019 |
| One shared guest profile for the Owner's properties | Deduplicated identity and consolidated guest history; consistent corrections | A booking at one property can reveal identity/history to another; wider breach and retention/deletion blast radius | Owner explicitly decides OQ-034, with legal counsel for OQ-019 and role/field access for OQ-045 |
| Shared identity with property-owned booking/history links | Separates reusable identity from each property's operational booking, folio and stay history; permits restricted linkage | Most complex model: global identity matching plus authorized per-property links; search, reports, exports and erasure must preserve scope | Owner decides OQ-034; define permitted lookup, linking, history visibility and retention under OQ-019; validate schema after OQ-036 |

Blacklist must be decided separately as either Owner-wide or property-scoped, including who can add/remove, visibility and action on a match (OQ-034/OQ-047). A shared profile does not automatically imply a shared blacklist. No option above is selected.

### Property timezone and business-date handling proposal

Each Property should store an IANA timezone and its own business date if the corresponding proposed model is approved. Store event instants in UTC; calculate operational local dates/deadlines using that property's timezone. BR-004/BR-007 are BA `[A]` source rules, not Owner-approved policy. Do not use the server's timezone or UTC calendar date as a substitute for property business date.

- A booking spanning nights maps each stay night to the property's local `stay_date`; check-in/check-out local times are interpreted in the property's timezone. Persist an unambiguous instant for completed events and preserve the local business-date context used for the decision.
- Night Audit run identity/locking is per `(property_id, business_date)`, checkpointed and idempotent per FO-NA draft. A delayed/retried job must re-read the property timezone/current business date and must not advance another property's date.
- Schedules must name the property's timezone, handle daylight-saving gaps/repeated local times where applicable, and use a unique run key so clock changes or worker retries cannot run a close twice. The initial deployment jurisdiction/timezone list still needs confirmation.
- Reports must distinguish event instant, property-local calendar date and `business_date`; revenue recognition (cash/accrual) remains OQ-016, Night Audit trigger remains OQ-052, and tax/legal reporting remains subject to OQ-014/015/037.
- Test midnight boundaries, a multi-night booking, a job delayed across local midnight, a timezone change, and any DST transition relevant to selected property regions. These are proposed validation cases, not approved business outcomes.

Risks of server-default time include assigning a booking/charge to the wrong stay date, missed or duplicate Night Audit, incorrect check-in/out deadlines, inconsistent reports, and jobs/cache entries crossing property boundaries.

## BA-derived constraints and candidate qualities

Source labels remain authoritative: `[C]` is the BA's confirmed/baselined classification, not automatic Project Owner approval; `[A]` and `[Q]` remain assumptions or unresolved rules. The items below are technical implications to review against cited module sources, not approvals of technology or policy choices.

- Atomic inventory: conditional uniqueness for active `(room_id, stay_date)`, capacity checks, row locking and optimistic versioning. (BR-010–BR-013; BA Part 1, pp.16–17.)
- Property-scoped access enforced at the data-access layer; do not trust client `property_id`. (BR-060, BA Part 1, p.22.)
- Immutable/idempotent financial records and maker-checker approval. (BR-011, BR-040, BR-064; BA Part 1, pp.16, 20, 23.)
- Append-only tamper-evident audit chain; business action fails if its audit record cannot be committed. (NFR-AUD-001; BA Part 1, p.9; Part 2, pp.26–29.)
- Encrypt identity documents, use a protected blind index for matching, mask personal data, and audit unmask/export. (BR-063, BR-066; BA Part 1, pp.22–23.)
- Proposed service targets `[A]`: 99.5% monthly availability, RPO ≤15 minutes, RTO ≤4 hours; calendar 30 rooms ×31 days under 2 seconds, booking save under 1 second, 20 concurrent users/property. (BA Part 1, p.9.)

## Recommended stack (unapproved)

| Layer | Proposal | Evidence/status |
|---|---|---|
| Database | PostgreSQL with partial unique indexes, CHECK and JSONB | Engine approved for the test project; provider/version/region/backup remain open under D12. RLS is not approved or required by this decision. |
| Backend | NestJS + TypeScript | Proposed / pending approval; versions, Modular Monolith and Prisma remain proposals. |
| Cache/queue | Redis + BullMQ | Deferred by Owner under D11. |
| Web | Next.js + React + TypeScript | Proposed / pending approval; versions, App Router, Tailwind, TanStack Query and Zustand remain proposals (technology proposal, p.3; UI proposal, pp.1, 3). |
| Mobile operations | No native mobile application in the initial implementation unless an approved requirement justifies it | Flutter/React Native are deferred alternatives, not selected; the BA deployment proposal specifies browser access for the initial rollout (technology proposal, p.3; deployment proposal, p.3). |
| Crypto | Argon2id for password/PIN hashing; AES-256-GCM/KMS for field/object encryption; HMAC-SHA256 blind indexes | proposal; some report passages incorrectly conflate Argon2id with encryption, so crypto design requires review (technology proposal, pp.1, 3) |
| Deployment | Docker/Compose development; managed container production proposed; Kubernetes or AWS ECS alternatives | Owner has not approved deployment topology/provider; no Kubernetes requirement identified (technology proposal, p.3). |
| UI starter | `TailAdmin/free-nextjs-admin-dashboard` (MIT), collapsible sidebar | UI report preference, not stakeholder-approved (UI proposal, p.1) |

## Logical design constraints

- `RoomNight` covers assigned bookings, OOO blocks and day-use; active uniqueness prevents double allocation.
- `RoomTypeInventory` controls unassigned inventory with `sold <= capacity`; holds are updated atomically.
- Conflict bookings do not consume inventory until resolved.
- Parent/child room holding is unresolved under `OQ-001`; BR-018/BR-019 remain `[Q]`.
- Financial and audit records are append-only; correction is by reversal/adjustment and reference to the original.
- `business_date` advances only via sequential Night Audit; room state separates Occupancy and Housekeeping.

Sources: BA Part 1, pp.16–23; Part 2, pp.27–29; Part 4, pp.10–17.

## Integration boundary and phases

- Proposed MVP: manual OTA entry and manual stop-sell/extranet operations.
- Proposed Phase 2: one third-party Channel Manager with signed/idempotent webhooks and retry/stop-sell controls.
- Bank reconciliation is proposed via unique reference/VietQR plus CSV/Excel import; API is proposed for Phase 2.
- E-invoice and lodging-declaration integrations remain legally and commercially unresolved.

Sources: deployment proposal, pp.3–5; BA Part 1, pp.34–35; Part 3, p.40; Part 4, p.37.

## Proposed delivery approach

Workshop the blocking questions; inventory/master-data preparation; import future bookings through business validation rather than direct DB writes; reconcile and sign off; train by role; pilot four weeks at one property; cut over on a low-demand day. This is a proposal, not an approved plan. (technology proposal, p.4; deployment proposal, p.5.)

## Proposed UI principles

Seven navigation groups are suggested: Dashboard, Room Calendar, Booking & Guest, Front Desk & NA, Finance & Folio, Operations, and System & RBAC. State colors, data-masking interactions and the four-step frontend roadmap are design proposals only. (UI proposal, pp.1–3.)

