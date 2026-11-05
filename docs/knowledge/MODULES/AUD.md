# AUD — Audit Log

Purpose: trace who did what, where/when/on which device and under which approval; append-only and hash-chained, committed in the same transaction as the business action. No role may edit/delete it. (BA Part 2, pp.26–30.)

FR-AUD-001–009 cover event write, before/after masking, hash chain, lookup/export, integrity verification, retention/anonymization and security events. (BA Part 2, p.27.)

Key rules: BR-061–063, BR-066–069; NFR-AUD-001. Personal-data retention/anonymization is `[Q]` under OQ-019. The proposed technical design uses `prev_hash` SHA-256; detailed storage/verification needs Dev/Security review. (BA Part 1, pp.9, 22–23; Part 2, pp.27–30.)

