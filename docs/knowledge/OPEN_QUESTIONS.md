# Open questions, assumptions and conflicts

Unresolved entries here are not approved. `ASM-*` values let analysis continue; they must not be silently implemented as decisions. Owner-confirmed directions are retained below for traceability and do not turn other ASM values into decisions.

## Blocking questions `[Q]`

| OQ | Question | Temporary position | Decision owner | Source |
|---|---|---|---|---|
| OQ-001 | sale units: room/villa/dorm and parent-child exclusivity | ASM-001 room + whole unit; schema anticipates beds | Owner | BA Part 1, pp.32, 35 |
| OQ-002 | hourly/monthly stays | ASM-002 nightly stays only in MVP | Owner | BA Part 1, p.32 |
| OQ-005 | controlled overbooking | ASM-005 disallow by default; Manager may create Conflict | Owner | BA Part 1, p.33 |
| OQ-008 | cancellation/no-show/early-departure policy | ASM-008 configurable by Rate Plan; first-night no-show | Owner | BA Part 1, p.33 |
| OQ-014 | tax mode/rates and tax on cancellation fees | support tax-inclusive and exclusive; rate/treatment unconfirmed | Accounting | BA Part 1, p.34 |
| OQ-015 | e-invoice obligation/provider/timing | risky ASM: internal receipt + export in MVP | Accounting | BA Part 1, p.34 |
| OQ-016 | accrual vs cash revenue | ASM-016 both views; default by stay night | Owner + Accounting | BA Part 1, p.34 |
| OQ-019 | legal basis, retention, deletion and incident handling for personal data | ASM-019 minimize, retain 5 years, anonymize valid requests | Owner + legal counsel | BA Part 1, p.34 |
| OQ-020 | OTA targets and direct vs Channel Manager | ASM-020 one third-party Channel Manager | Owner | BA Part 1, p.34 |
| OQ-031 | operational sizing, pilot, budget, deadline, team size and operational ownership | **Partially answered:** 2–5 properties expected in first 12 months; target 6–10 in months 12–24. Initial room count unknown. Pilot property, budget, deadline, staffing and operational ownership remain open. | Owner | BA Part 1, p.34; Project Owner input, 2026-11-05 |
| OQ-036 | Confirm the primary database technology (PostgreSQL or another option) | PostgreSQL remains proposed; no selection is approved | Owner | technology proposal, pp.1–3; explicit Owner approval not evidenced |
| OQ-037 | each property's legal form/revenue and e-invoice obligation | no validated assumption | Owner + Accounting | BA Part 1, p.35 |

## Other open questions

| OQ | Question | Temporary position (not approved) | Source |
|---|---|---|---|
| OQ-003 | Group price, master folio, allotment and charge routing? | ASM-003 multi-room + master folio + BR-042 routing | BA Part 1, p.33 |
| OQ-004 | Hold/deposit deadlines by channel? | ASM-004 deposit 24h after create and ≥24h before arrival; hold = deposit deadline | BA Part 1, p.33 |
| OQ-006 | Standard check-in/out and early/late tiers? | ASM-006 14:00/12:00; late to 18:00 50%, later one night | BA Part 1, p.33 |
| OQ-007 | Child/extra-bed/over-standard policy? | ASM-007 under 6 free, 6–11 child supplement | BA Part 1, p.33 |
| OQ-009 | Reprice date/room changes? | ASM-009 hotel-caused keeps price; guest-caused reprices | BA Part 1, p.33 |
| OQ-010 | Discount thresholds/promo codes? | ASM-010 FD ≤10% cumulative; above needs Manager; promo Phase 2 | BA Part 1, p.33 |
| OQ-011 | Standard deposit rate? | ASM-011 30% or first night | BA Part 1, p.33 |
| OQ-012 | Payment/refund methods, overpayment and bank notification? | ASM-012 cash/transfer/offline POS; manual reconciliation in MVP | BA Part 1, p.33 |
| OQ-013 | Foreign currency/rate source? | ASM-013 VND only in MVP | BA Part 1, p.33 |
| OQ-017 | Is Inspected mandatory before handover? | ASM-017 configurable per property | BA Part 1, p.34 |
| OQ-018 | Automatic lodging declaration or data export? | ASM-018 permissioned/audited manual export | BA Part 1, p.34 |
| OQ-021 | OTA-prepaid reconciliation and payout? | ASM-021 OTA AR, monthly manual reconciliation, refund through OTA | BA Part 1, p.34 |
| OQ-022 | Acceptable inventory/rate sync latency? | ASM-022 ≤1 minute | BA Part 1, p.34 |
| OQ-023 | Ancillary services? | ASM-023 fixed-price service catalog | BA Part 1, p.34 |
| OQ-030 | KPI target values and baseline owner? | measure two weeks at pilot | BA Part 1, p.34 |
| OQ-033 | Approve proposed out-of-scope list? | use BA Part 1 §3.2 temporarily | BA Part 1, pp.8, 35 |
| OQ-034 | Guest/blacklist chain-wide or property; who adds/removes? | ASM-034 chain-wide; Manager with reason | BA Part 1, p.35 |
| OQ-035 | Must HK work offline? | ASM-035 says no offline in MVP; conflicts with later proposals | BA Part 1, p.35 |
| OQ-038 | OTA commission and gross/net payout? | ASM-038 store both gross and commission | BA Part 1, p.35 |
| OQ-039 | Staff/guest-message languages? | ASM-039 Vietnamese UI; VI/EN templates | BA Part 1, p.35 |
| OQ-040 | Approval with one person on duty? | ASM-040 remote 2FA; Owner self-approval with reason | BA Part 1, p.35 |
| OQ-041 | Can employee have different roles at multiple properties? | yes; one account with active property selection | BA Part 2, p.41 |
| OQ-042 | Approval expiry? | 30 minutes | BA Part 2, p.42 |
| OQ-043 | TOTP or SMS/Zalo OTP; who pays? | TOTP + recovery codes | BA Part 2, p.42 |
| OQ-044 | Fixed counter device and personal-phone use? | ≥1 registered counter; six-digit PIN | BA Part 2, p.42 |
| OQ-045 | Who may see full guest identity document? | OWN, MGR, FD, NA | BA Part 2, p.42 |
| OQ-046 | Are receipt-number gaps acceptable after failed transaction? | no; sequential allocation inside transaction | BA Part 2, p.42 |
| OQ-047 | Blacklist hard block or warning? | warning; continuing needs Manager approval | BA Part 3, p.40 |
| OQ-048 | When reject unseen transfer; deadline for Unallocated? | 3 days; 7 days | BA Part 3, p.40 |
| OQ-049 | Bank statement format/API/notification? | CSV/Excel manual import; API Phase 2 | BA Part 3, p.40 |
| OQ-050 | Owner approval to edit cancellation policy? | yes | BA Part 3, p.40 |
| OQ-051 | Collect full remainder or first night at check-in; incidental deposit? | ASM-051 full room remainder, no incidental deposit in MVP | BA Part 4, p.36 |
| OQ-052 | Manual or scheduled Night Audit? | ASM-052 manual 00:00–06:00; alert at 06:00 | BA Part 4, p.37 |
| OQ-053 | GuestCredit expiry/treatment? | 12 months; Accounting handles expiry manually | BA Part 4, p.37 |
| OQ-054 | Standard compensation price list and Owner threshold? | configurable list; over VND 2,000,000 needs Owner | BA Part 4, p.37 |
| OQ-055 | Invoice type/timing and long-stay periods? | at checkout; periodic long-stay in Phase 2 | BA Part 4, p.37 |

For full wording and current temporary values, use the cited source pages. The open-question numbers 024 through 029 are not present in the documents.

## Owner-confirmed business direction and OQ status

| OQ | Confirmed answer | Remaining boundary | Evidence |
|---|---|---|---|
| OQ-032 | **Confirmed:** single-owner; no SaaS for independent owners; multi-property operation is required from the first release. | Business-model question answered. This does not settle property-specific business rules or access details: OQ-034 (guest/blacklist sharing), OQ-041 (different roles across properties), OQ-019 (personal data), and the remaining OQ-031 resource/room/pilot questions stay separate. No `tenant_id`, tenant billing or onboarding is implied. | Project Owner direction, conversation 2026-11-05 |
| OQ-031 | **Confirmed sizing inputs:** 2–5 properties expected in the first 12 months; target 6–10 properties in months 12–24. | OQ remains open. Initial room count is unknown; pilot property, budget, staffing, implementation timeline and operational ownership are not confirmed. The ranges are planning inputs, not delivery commitments or infrastructure sizing approval. | Project Owner input, 2026-11-05 |

OQ-032's business-model question is answered by explicit Owner direction. OQ-031 is partially answered and remains open for the boundaries above. OQ-036 is not resolved: PostgreSQL was discussed and retained as a proposal, but the Owner did not explicitly approve it. Keep the IDs for traceability; do not reuse them. The BA's former `ASM-032`/`ASM-036` values are source history, not approvals for extra details.

## Phase 0 triage

This triage is a delivery classification, not a change to the BA source priority labels. `[Q]` items remain unresolved until an authorized decision owner records the answer. A business/module question may block only dependent implementation; repository and toolchain setup can proceed within an approved, non-production scope.

Module necessity and implementation readiness are separate. The 19-module matrix in [PHASE_0_IMPLEMENTATION_PLAN.md §13.D](PHASE_0_IMPLEMENTATION_PLAN.md#d-mvp-scope-and-module-disposition) keeps OQ-033 open for every module, and marks AST/NTF/RPT/CHN as needing further BA specification. Base Phase 0 repository/toolchain, empty shells, CI and generic health checks do not implement any business module.

| Category | OQs | Why / gate |
|---|---|---|
| **A. Repository/toolchain initialization** | OQ-031 for funded execution; architecture/version approvals are separate | Property ranges are now sizing context, but do not authorize Gate A/B. OQ-031 must still set who is funded/available and when work may be scheduled. A bounded repository/toolchain setup can proceed only if Owner separately authorizes that effort and a proposed toolchain; it must not imply framework, topology or capacity approval. Room count remains unknown. |
| **B. Blocks database/schema or workflow design for a specific module** | OQ-001, OQ-002, OQ-003, OQ-004, OQ-005, OQ-006, OQ-007, OQ-008, OQ-009, OQ-010, OQ-011, OQ-012, OQ-013, OQ-014, OQ-015, OQ-016, OQ-018, OQ-021, OQ-034, OQ-035, OQ-036, OQ-037, OQ-038, OQ-040, OQ-041, OQ-043, OQ-044, OQ-045, OQ-046, OQ-047, OQ-051, OQ-055 | OQ-036 blocks choosing the primary database technology and therefore HMS schema/migrations. Other questions affect only their dependent booking/inventory, pricing, tax/invoice, guest, offline, payment/folio, approval/access or legal-property schema/workflows. Do not hard-code an ASM. |
| **C. Can be settled during the relevant module implementation** | OQ-017, OQ-023, OQ-030, OQ-039, OQ-042, OQ-048, OQ-049, OQ-050, OQ-052, OQ-053, OQ-054 | These can be configured or specified when the related HK/INV/RPT/NTF/PAY/FO-NA/MNT workflow is designed, provided that the agreed module does not ship with an assumed value. OQ-049's future API choice can remain deferred if CSV/Excel import is explicitly in approved scope. |
| **D. Not needed in initial implementation; revisit only if its phase/scope is approved** | OQ-022 | Inventory/rate sync latency matters when CHN is implemented. Keep the integration boundary able to accept a later target; do not build a channel sync subsystem before OQ-020/scope approval. |

### OQ-019/OQ-020/OQ-031/OQ-033 Phase 0 impact and approval

| OQ | Exact decision needed | Gate/activity affected | Limited scope that can proceed | Must not be implemented while open | Approver |
|---|---|---|---|---|---|
| OQ-019 | Legal basis per personal-data category; retention/deletion/export/legal-hold rules; incident response; processor/region and backup lifecycle | Gate E personal-data handling/file storage; also constrains production-like test data, logging and exports | Synthetic-only repository setup, shells, non-PII contracts and security design discussion | Real personal-data ingestion, retention/deletion automation, identity-document storage, production exports or incident policy claimed as final | Owner + legal counsel |
| OQ-020 | Which OTA targets are in scope and whether integration is direct or through a Channel Manager; phase and funding | Gate F channel/OTA business-module implementation; provider/integration contracts | Repository/toolchain and generic app shells; unrelated manual workflows if separately scoped | Channel Manager adapter, credentials/webhooks/sync or assumptions about supported OTA behavior | Owner |
| OQ-031 | Confirm room count, pilot property, budget, delivery window, team/availability, support/on-call and operational ownership; property ranges are already recorded | Gate A funded/scheduled execution and production/operational commitments | Planning, documentation review, architecture analysis using the property ranges as context, and a specifically authorized bounded setup | Commitments to deadline, team capacity, workload/infrastructure sizing, vendor spend or production support | Owner |
| OQ-033 | Approve the product/module scope and explicit in/out list for the release | Gate F business-module implementation and any contract/schema specifically tied to scope | Repository/toolchain and empty API/web/worker shells; generic health/readiness only | Business workflows, integrations, module schemas or treating BA §3.2 as approved scope | Owner |

OQ-024 through OQ-029 do not exist in the reviewed BA sources and are not assigned or invented here.

### Owner decisions required for Phase 0 gates

| OQ | Exact decision required | Approver |
|---|---|---|
| OQ-019 | Legal basis and purposes; retention/deletion; data-subject handling; incident response; residency and processor constraints | Owner + legal counsel |
| OQ-020 | OTA/channel targets and direct integration versus Channel Manager; which integrations are in scope | Owner |
| OQ-031 | Initial room count, pilot property, funded budget, delivery window, team size and operational ownership/resources; do not re-ask the confirmed property ranges | Owner |
| OQ-033 | Release/module scope and explicit in/out list, including acceptance or revision of BA Part 1 §3.2 | Owner |
| OQ-034 | Guest identity/history sharing and blacklist scope across properties; who may add, remove, see and act on records | Owner |
| OQ-036 | PostgreSQL or another primary database; then version, provider, backup/recovery owner and applicable controls | Owner selects technology; Dev Lead validates technical fit |
| OQ-041 | Whether staff may hold different roles per property; assignment, property switching and grant semantics | Owner |

### Current gate impact for Owner-readiness review

`No` means no technical dependency on resolving that OQ; it does not authorize work by itself. Any implementation still requires the bounded work and toolchain approvals in [PHASE_0_IMPLEMENTATION_PLAN.md](PHASE_0_IMPLEMENTATION_PLAN.md). `Conditional` means only the named slice is blocked.

| OQ | Repository/toolchain | API/web/worker shell | Authentication/authorization | Database/schema | Business module | Production deployment |
|---|---|---|---|---|---|---|
| OQ-019 | No | No | Blocks personal-data roles/field access and PII features; synthetic staff authentication/design can proceed after its own gate | Blocks guest/document/retention/deletion/audit PII schema and lifecycle, not a neutral technical spike; OQ-036 separately blocks HMS DB choice | Blocks real guest identity, documents, exports, erasure and other PII workflows | Blocks real PII processing, region/processor/file lifecycle, incident and backup-expiry claims |
| OQ-020 | No | No | No for generic staff auth | Blocks CHN/OTA-specific persistence/contract only | Blocks Channel Manager/OTA integration behavior; manual/unrelated module scope may proceed only if approved | Blocks external channel credentials, endpoint/webhook setup and integration launch |
| OQ-031 | Conditional: blocks funded schedule/vendor commitments, not an explicitly authorized bounded task | Conditional on approved effort only; no technical dependency | No policy dependency; staffing/security ownership still needed for release | Conditional if provider, spend or operations staffing is required | Blocks reliable team/timeline/budget commitment, not module semantics | Blocks production support/on-call, vendor budget and delivery commitment |
| OQ-033 | No | No for empty shells | Product/release authentication scope must be in the approved product scope | Blocks module/business schema whose inclusion is unapproved | Blocks implementing the release scope or treating BA §3.2 as approved | Blocks release/cutover with an unapproved in/out list |
| OQ-034 | No | No | Blocks guest/blacklist visibility and cross-property guest authorization only | Blocks guest identity linkage/sharing/blacklist scope schema | Blocks GST shared-profile/history/blacklist behavior; other modules can proceed if independently approved | Blocks release of guest-sharing/blacklist behavior |
| OQ-036 | No | No for shells | Auth design can proceed; persistent session implementation depends on approved DB/storage choices | Blocks selecting the primary DB and all HMS schema/migrations; only a separately approved non-HMS compatibility spike may proceed | Blocks durable business modules until DB choice and module OQs are resolved | Blocks production DB/provider, migrations, backup and restore topology |
| OQ-041 | No | No | Blocks final cross-property role matrix, role switching semantics and property grants; single-property auth spike is still proposal-only | Blocks final user-property-role association schema/cardinality, not unrelated property tables | Blocks multi-property employee access and any feature relying on different roles per property | Blocks granting staff the undecided cross-property role behavior |

These OQs do not all block Gate A or B. OQ-031 may constrain whether any resourced work starts; the Owner can authorize a narrowly bounded repository/toolchain task without resolving OQ-019/OQ-020/OQ-033/OQ-034/OQ-041. OQ-036 must be resolved before choosing or migrating an HMS database schema.

## Material inconsistencies or ambiguities

| Issue | Sources | Required resolution |
|---|---|---|
| HK offline in MVP | `ASM-035` says no offline in MVP; later technical/deployment proposals prescribe Local Storage/version sync | Owner/HK/Dev must decide scope and conflict behavior. BA Part 1, p.35; technology proposal, p.2; deployment proposal, p.5 |
| React baseline | technology proposal names React 18; UI proposal names React 19 and Tailwind v4 | Dev Lead/UI owner must approve one supported baseline. Technology proposal, p.3; UI proposal, pp.1, 3 |
| UI starter approval | UI report says “chính thức lựa chọn” TailAdmin but is titled a proposal and contains no stakeholder approval record | Confirm or reject TailAdmin explicitly. UI proposal, p.1 |
| Personal-data retention/security wording | five-year retention is only ASM; proposal passages say “Argon2id/KMS encryption,” while a later table correctly separates Argon2id hashing from AES encryption | Legal counsel must confirm retention; Security/Dev Lead must approve crypto design. BA Part 1, p.34; technology proposal, pp.1, 3 |
| Scope confirmation | module list is `[C]` from the brief, but BA says no stakeholder has confirmed scope | Run scope workshop and record sign-off level. BA Part 1, pp.2, 4, 6–8 |
| Multi-property launch capability vs single-property pilot | Owner confirms the product must support multiple properties from its first release; sizing expects 2–5 properties in year one and 6–10 in months 12–24; the deployment proposal recommends a four-week pilot at one property | These can coexist if the pilot is a staged rollout of a multi-property-capable release. Confirm pilot property and rollout sequence under OQ-031; do not reduce the data model or authorization design to single-property. Owner direction/input, 2026-11-05; deployment proposal, p.5; BA Part 1, pp.5–6, 34 |
| Invoice rule BR-048 | Part 4 proposes/update labels BR-048 `[Q]`; Part 1 catalog does not contain BR-048 and Part 4 says it must be synchronized after OQ-055 | Accounting/legal confirmation, then update the canonical BR catalog. BA Part 4, pp.27, 36–37 |
| Room-state model | Part 4 says the Part 1 ERD must separate Housekeeping state from occupancy state | Update canonical data model only after design approval. BA Part 4, p.37 |
| Technology report claims temporary answers “đã được thống nhất” | BA rules still classify the related 12 OQs as blocking and require written approval | Do not promote ASM to decision without signed workshop evidence. Technology proposal, pp.1–2; deployment proposal, pp.4–5 |
| Orphan FR references | Part 4 assumption table references `FR-INV-018` for ASM-015 and `FR-INV-015` for ASM-021, but no definitions exist for INV requirement numbers 011 through 018; Part 4 deliberately defines its INV slice as FR-INV-101–113 | PO/BA must identify the intended FRs or deprecate/correct the references. BA Part 4, §§0.2, 6.2, pp.2–3, 25–27, 37 |
| Wrong OQ reference on OTA statement matching | `FR-INV-106` cites `OQ-034`, while OQ-034 is guest/blacklist scope, not OTA reconciliation | PO/BA must provide the intended OQ/BR reference; do not reinterpret it. BA Part 1, §9, p.35; Part 4, §6.2, p.26 |
| BR-130 meaning conflict | Part 3 defines BR-130 as deposit shortfall after Confirmed; Part 4 §11.4 says BR-130 is “hoàn theo snapshot chính sách” | PO/BA must correct the Part 4 cross-check. Until then, use the actual BR-130 definition from Part 3 and flag the Part 4 sentence as inconsistent. BA Part 3, §11.2, p.40; Part 4, §11.4, p.37 |
| Payment-reversal traceability | `FR-PAY-107` cites BR-043/BR-045 although Part 4 §5.3 also says BR-040 applies to payment correction/reversal | PO/BA should confirm the canonical BR links for FR-PAY-107; do not drop any source references. BA Part 4, §§5.2–5.3, pp.22–23 |

## Confirmation package recommended

Use the meeting-ready register in [PHASE_0_IMPLEMENTATION_PLAN.md §13](PHASE_0_IMPLEMENTATION_PLAN.md#13-owner-decision-package). Run the proposed scope workshop with Owner, Manager and Accounting; include legal counsel for OQ-019 and invoice/tax questions. Obtain outcomes for the remaining source-Blocking OQs, then the applicable OQ-033 and OQ-034/OQ-041–OQ-055 items, proposed architecture/UI choices and MVP/out-of-scope scope. Treat single-owner, multi-property from first release and the two property sizing ranges as confirmed inputs. Keep OQ-031 open for room count, pilot, team, budget, timeline and operational ownership. (BA Part 1, pp.34–35; deployment proposal, p.5; Owner confirmation/input, 2026-11-05.)

