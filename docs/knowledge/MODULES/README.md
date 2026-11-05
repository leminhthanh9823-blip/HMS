# Module knowledge map

The project brief defines 19 modules `[C]`; FO-NA is a named FO submodule and has its own file for easier retrieval. Detailed capabilities are generally `[A]` or `[Q]`, not confirmed merely by being listed here. (BA Part 1, pp.2, 7–8.)

The module list is not an approved MVP or implementation sequence. The current review uses independent tags in [PHASE_0_IMPLEMENTATION_PLAN.md §13.D](../PHASE_0_IMPLEMENTATION_PLAN.md#d-mvp-scope-and-module-disposition):

- **A — Candidate MVP core:** PROP, ROOM, RBAC, EMP, RATE, BOOK, CAL, GST, PAY, INV, FO (including FO-NA), HK and MNT.
- **B — Minimum supporting slice:** CFG, AUD, NTF and RPT. For NTF/RPT this means a business need has been identified, not that implementation is ready.
- **C — Candidate post-MVP:** AST and CHN, plus the broader NTF/RPT capabilities beyond any separately specified minimum slice.
- **D — Needs further BA specification:** AST, NTF, RPT and CHN have no detailed FR in BA Parts 2–4.
- **E — Pending Owner decision:** all 19 modules remain pending OQ-033; no tag is an approval.

A module may carry several tags. In particular, NTF/RPT are both B and D: their minimum purpose may support an approved MVP, while their implementation must wait for detailed FR/acceptance criteria. Candidate MVP necessity does not place a module inside the base Phase 0 repository/shell/CI/health-check foundation.

| Area | Modules |
|---|---|
| Property/inventory | [PROP](PROP.md), [ROOM](ROOM.md), [CAL](CAL.md) |
| Guest journey | [BOOK](BOOK.md), [GST](GST.md), [FO](FO.md), [FO-NA](FO-NA.md) |
| Pricing/finance | [RATE](RATE.md), [PAY](PAY.md), [INV](INV.md) |
| Operations | [HK](HK.md), [MNT](MNT.md), [AST](AST.md) |
| People/governance | [EMP](EMP.md), [RBAC](RBAC.md), [AUD](AUD.md) |
| Platform/integration | [CFG](CFG.md), [NTF](NTF.md), [RPT](RPT.md), [CHN](CHN.md) |

Cross-cutting references: [business rules](../BUSINESS_RULES.md), [requirements](../REQUIREMENTS_INDEX.md), [open questions](../OPEN_QUESTIONS.md).

