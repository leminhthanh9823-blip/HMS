# Requirements index

Ranges below are inclusive and contain every sequential ID unless explicitly noted. Detailed wording is summarized in the linked module file; consult the cited BA pages for acceptance criteria, error cases and test cases.

## Functional requirements (206 total)

| Module | FR IDs | Count | Primary source | Module note |
|---|---|---:|---|---|
| CFG | FR-CFG-001–FR-CFG-012 | 12 | BA Part 2, pp.3–4 | [CFG](MODULES/CFG.md) |
| PROP | FR-PROP-001–FR-PROP-008 | 8 | BA Part 2, p.8 | [PROP](MODULES/PROP.md) |
| ROOM | FR-ROOM-001–FR-ROOM-009 | 9 | BA Part 2, p.12 | [ROOM](MODULES/ROOM.md) |
| RBAC | FR-RBAC-001–FR-RBAC-012 | 12 | BA Part 2, pp.16–17 | [RBAC](MODULES/RBAC.md) |
| EMP | FR-EMP-001–FR-EMP-009 | 9 | BA Part 2, pp.22–23 | [EMP](MODULES/EMP.md) |
| AUD | FR-AUD-001–FR-AUD-009 | 9 | BA Part 2, p.27 | [AUD](MODULES/AUD.md) |
| RATE | FR-RATE-001–FR-RATE-015 | 15 | BA Part 3, pp.3–5 | [RATE](MODULES/RATE.md) |
| BOOK | FR-BOOK-001–FR-BOOK-018 | 18 | BA Part 3, pp.8–10 | [BOOK](MODULES/BOOK.md) |
| CAL | FR-CAL-001–FR-CAL-011 | 11 | BA Part 3, pp.15–16 | [CAL](MODULES/CAL.md) |
| GST | FR-GST-001–FR-GST-011 | 11 | BA Part 3, pp.19–20 | [GST](MODULES/GST.md) |
| PAY (deposit/reconciliation) | FR-PAY-001–FR-PAY-010 | 10 | BA Part 3, pp.23–24 | [PAY](MODULES/PAY.md) |
| INV (folio) | FR-INV-001–FR-INV-010 | 10 | BA Part 3, pp.28–29 | [INV](MODULES/INV.md) |
| FO | FR-FO-001–FR-FO-017 | 17 | BA Part 4, pp.4–5 | [FO](MODULES/FO.md) |
| FO-NA | FR-NA-001–FR-NA-011 | 11 | BA Part 4, pp.10–11 | [FO-NA](MODULES/FO-NA.md) |
| HK | FR-HK-001–FR-HK-010 | 10 | BA Part 4, pp.14–15 | [HK](MODULES/HK.md) |
| MNT | FR-MNT-001–FR-MNT-008 | 8 | BA Part 4, p.18 | [MNT](MODULES/MNT.md) |
| PAY (refund/shift) | FR-PAY-101–FR-PAY-113 | 13 | BA Part 4, p.22 | [PAY](MODULES/PAY.md) |
| INV (settlement/AR) | FR-INV-101–FR-INV-113 | 13 | BA Part 4, pp.26–27 | [INV](MODULES/INV.md) |

Part 2 reports 59 FR, Part 3 reports 75 FR, and Part 4 reports 72 defined FR, totaling 206. (BA Part 2, §10, p.40; Part 3, §11, p.39; Part 4, §11, pp.35–36.) AST, NTF, RPT and CHN have scope descriptions but no detailed FR yet; they are planned for a later BA part. (BA Part 4, §11.6, p.37.) Part 4 also contains two orphan references, `FR-INV-015` and `FR-INV-018`, with no corresponding definitions; they are not included in the 206 total and require BA correction. (BA Part 4, §0.2, pp.2–3.)

+## Searchable ID manifest

Ranges in the summary table are compact for reading; this manifest makes every defined ID directly searchable.

- **CFG:** FR-CFG-001, FR-CFG-002, FR-CFG-003, FR-CFG-004, FR-CFG-005, FR-CFG-006, FR-CFG-007, FR-CFG-008, FR-CFG-009, FR-CFG-010, FR-CFG-011, FR-CFG-012
- **PROP:** FR-PROP-001, FR-PROP-002, FR-PROP-003, FR-PROP-004, FR-PROP-005, FR-PROP-006, FR-PROP-007, FR-PROP-008
- **ROOM:** FR-ROOM-001, FR-ROOM-002, FR-ROOM-003, FR-ROOM-004, FR-ROOM-005, FR-ROOM-006, FR-ROOM-007, FR-ROOM-008, FR-ROOM-009
- **RBAC:** FR-RBAC-001, FR-RBAC-002, FR-RBAC-003, FR-RBAC-004, FR-RBAC-005, FR-RBAC-006, FR-RBAC-007, FR-RBAC-008, FR-RBAC-009, FR-RBAC-010, FR-RBAC-011, FR-RBAC-012
- **EMP:** FR-EMP-001, FR-EMP-002, FR-EMP-003, FR-EMP-004, FR-EMP-005, FR-EMP-006, FR-EMP-007, FR-EMP-008, FR-EMP-009
- **AUD:** FR-AUD-001, FR-AUD-002, FR-AUD-003, FR-AUD-004, FR-AUD-005, FR-AUD-006, FR-AUD-007, FR-AUD-008, FR-AUD-009
- **RATE:** FR-RATE-001, FR-RATE-002, FR-RATE-003, FR-RATE-004, FR-RATE-005, FR-RATE-006, FR-RATE-007, FR-RATE-008, FR-RATE-009, FR-RATE-010, FR-RATE-011, FR-RATE-012, FR-RATE-013, FR-RATE-014, FR-RATE-015
- **BOOK:** FR-BOOK-001, FR-BOOK-002, FR-BOOK-003, FR-BOOK-004, FR-BOOK-005, FR-BOOK-006, FR-BOOK-007, FR-BOOK-008, FR-BOOK-009, FR-BOOK-010, FR-BOOK-011, FR-BOOK-012, FR-BOOK-013, FR-BOOK-014, FR-BOOK-015, FR-BOOK-016, FR-BOOK-017, FR-BOOK-018
- **CAL:** FR-CAL-001, FR-CAL-002, FR-CAL-003, FR-CAL-004, FR-CAL-005, FR-CAL-006, FR-CAL-007, FR-CAL-008, FR-CAL-009, FR-CAL-010, FR-CAL-011
- **GST:** FR-GST-001, FR-GST-002, FR-GST-003, FR-GST-004, FR-GST-005, FR-GST-006, FR-GST-007, FR-GST-008, FR-GST-009, FR-GST-010, FR-GST-011
- **PAY:** FR-PAY-001, FR-PAY-002, FR-PAY-003, FR-PAY-004, FR-PAY-005, FR-PAY-006, FR-PAY-007, FR-PAY-008, FR-PAY-009, FR-PAY-010
- **INV:** FR-INV-001, FR-INV-002, FR-INV-003, FR-INV-004, FR-INV-005, FR-INV-006, FR-INV-007, FR-INV-008, FR-INV-009, FR-INV-010
- **FO:** FR-FO-001, FR-FO-002, FR-FO-003, FR-FO-004, FR-FO-005, FR-FO-006, FR-FO-007, FR-FO-008, FR-FO-009, FR-FO-010, FR-FO-011, FR-FO-012, FR-FO-013, FR-FO-014, FR-FO-015, FR-FO-016, FR-FO-017
- **NA:** FR-NA-001, FR-NA-002, FR-NA-003, FR-NA-004, FR-NA-005, FR-NA-006, FR-NA-007, FR-NA-008, FR-NA-009, FR-NA-010, FR-NA-011
- **HK:** FR-HK-001, FR-HK-002, FR-HK-003, FR-HK-004, FR-HK-005, FR-HK-006, FR-HK-007, FR-HK-008, FR-HK-009, FR-HK-010
- **MNT:** FR-MNT-001, FR-MNT-002, FR-MNT-003, FR-MNT-004, FR-MNT-005, FR-MNT-006, FR-MNT-007, FR-MNT-008
- **PAY (slice 2):** FR-PAY-101, FR-PAY-102, FR-PAY-103, FR-PAY-104, FR-PAY-105, FR-PAY-106, FR-PAY-107, FR-PAY-108, FR-PAY-109, FR-PAY-110, FR-PAY-111, FR-PAY-112, FR-PAY-113
- **INV (slice 2):** FR-INV-101, FR-INV-102, FR-INV-103, FR-INV-104, FR-INV-105, FR-INV-106, FR-INV-107, FR-INV-108, FR-INV-109, FR-INV-110, FR-INV-111, FR-INV-112, FR-INV-113

- **NFR:** NFR-AUD-001, NFR-AVL-001, NFR-DATA-001, NFR-I18N-001, NFR-PERF-001, NFR-PRIV-001, NFR-SEC-001, NFR-SEC-002, NFR-SEC-003, NFR-SEC-004, NFR-SEC-005, NFR-SEC-101, NFR-SEC-102, NFR-SEC-103, NFR-SEC-104, NFR-SEC-105, NFR-SEC-106, NFR-SEC-107, NFR-SEC-108, NFR-SEC-109, NFR-SEC-110, NFR-SEC-111, NFR-SEC-112, NFR-SEC-113, NFR-SEC-114
- **Concurrency:** RC-01, RC-02, RC-03, RC-04, RC-05, RC-06, RC-07, RC-08, RC-09, RC-10, RC-11, RC-12, RC-13, RC-14, RC-15, RC-16, RC-17, RC-18, RC-19, RC-20, RC-21. Definitions: BA Part 3, §7, pp.32–33 (RC-01–RC-12) and BA Part 4, §7, pp.29–30 (RC-13–RC-21).
- **Assumptions referenced by code:** ASM-001, ASM-002, ASM-003, ASM-004, ASM-005, ASM-006, ASM-007, ASM-008, ASM-009, ASM-010, ASM-011, ASM-012, ASM-013, ASM-014, ASM-015, ASM-016, ASM-017, ASM-018, ASM-019, ASM-020, ASM-021, ASM-022, ASM-023, ASM-032, ASM-034, ASM-035, ASM-036, ASM-037, ASM-038, ASM-039, ASM-040, ASM-051, ASM-052. Their values and labels remain unapproved; see [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) and the cited BA assumption tables.


## Non-functional requirements

| IDs | Topic | Source |
|---|---|---|
| NFR-SEC-001–NFR-SEC-005 | authentication, data authorization, encryption, no card data, input/integration security | BA Part 1, p.9 |
| NFR-AUD-001 | append-only hash-chained audit log | BA Part 1, p.9 |
| NFR-AVL-001 | availability/backup/RPO/RTO `[A]` | BA Part 1, p.9 |
| NFR-PERF-001 | calendar/booking/concurrency targets `[A]` | BA Part 1, p.9 |
| NFR-DATA-001 | conditional unique, CHECK, row locking, RLS; PostgreSQL proposed | BA Part 1, p.9 |
| NFR-PRIV-001 | retention/anonymization including logs/backups `[Q]` | BA Part 1, p.9 |
| NFR-I18N-001 | Vietnamese UI; VI/EN guest templates `[A]` | BA Part 1, p.9 |
| NFR-SEC-101–NFR-SEC-114 | password/session/2FA/device controls, logging, dependencies, pentest and backup refinements | BA Part 2, pp.22, 35, 38–40 |

## Other requirement catalogs

- Business rules: [BUSINESS_RULES.md](BUSINESS_RULES.md).
- Open questions and assumptions: [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).
- Detailed BA also defines `US-*`, `AC-*`, `TC-*`, `ERR-*` and concurrency scenarios `RC-01–RC-21`. These remain in the source pages linked from each module; the Knowledge Base does not duplicate every test step.

## ID integrity notes

- Functional IDs are unique across parts; PAY and INV start their second slices at 101 to avoid collision. (BA Part 4, pp.25–26, 37.)
- Shared BR numbering intentionally leaves 028, 029 and 049 undefined. Extended ranges use BR-110, BR-120 and BR-130–136. (BA Part 3, p.39; Part 4, p.36.)
- Open-question numbering intentionally skips numbers 024 through 029; no such IDs appear in the seven PDFs.

