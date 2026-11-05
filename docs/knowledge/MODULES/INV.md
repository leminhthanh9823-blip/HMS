# INV — Folio, Settlement, Receivables and Documents

Purpose: immutable booking folios from initial estimate through zero-balance settlement, company/OTA AR, receipts/invoices and GuestCredit. (BA Part 3, pp.28–32; Part 4, pp.25–29.)

FR-INV-001–010 cover folio opening/routing, immutable lines/payment allocation, estimated vs posted totals, tax/discount allocation, cancellation fee and integrity checks. FR-INV-101–113 cover Night Audit room posting, settlement preview, zeroing folio, company/OTA AR, statement matching, receipts/invoices and GuestCredit. (BA Part 3, pp.28–29; Part 4, pp.26–27.)

Key rules: BR-003, BR-009, BR-024, BR-026, BR-031, BR-036, BR-039–045, BR-047–048, BR-057, BR-131, BR-134. AR limit and duplicate room-charge posting require concurrency controls (RC-21 and BR-134). (BA Part 4, pp.27–30.)

Open: taxes OQ-014; e-invoice OQ-015/OQ-037/OQ-055; group routing OQ-003; OTA settlement OQ-021; GuestCredit expiry OQ-053. `FR-INV-106` cites OQ-034 in the source, but OQ-034 concerns guest/blacklist scope and appears to be a broken cross-reference; do not infer the intended OQ. (BA Part 1, §§9, pp.33–35; Part 4, §§6.2, 6.11, pp.26, 29, 37.)

