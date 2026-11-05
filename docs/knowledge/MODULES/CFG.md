# CFG — System Configuration

Purpose: the single source of operational parameters; other modules read configuration. Supports chain defaults with property overrides and exposes the effective source. Money-affecting values are effective-dated and non-retroactive. (BA Part 2, pp.3–7.)

FR-CFG-001–012 cover inheritance/override, check-in/out and deadline values, tax modes/rules, rounding, document numbering, reason/service catalogs, print/message templates, cleanliness threshold and sensitive-configuration controls. (BA Part 2, §1.2, pp.3–4.)

Key rules: BR-005–009, BR-012, BR-024, BR-026, BR-051, BR-061, BR-074. Key NFR: secrets/access controls and audit. Open: OQ-014–015, OQ-046 and legal/property fields inherited from OQ-037. Invoice numbering/provider rules are not settled. (BA Part 2, pp.4, 7, 41–42.)

Do not hard-code ASM values such as 14:00/12:00 or tax behavior until approved.

