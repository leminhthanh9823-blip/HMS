# CHN — Channel Management

Scope `[C]`: OTA/Channel Manager inventory/rate sync and booking receipt; detailed behavior remains `[A]/[Q]`. Proposed MVP uses manual OTA entry and manual extranet stop-sell, with API integration later. (BA Part 1, pp.7–8, 34; deployment proposal, p.3.)

No detailed CHN FR exists in BA Parts 2–4. Part 4 schedules it for a later BA part. (BA Part 4, p.37.)

Key rules: BR-014, BR-025, BR-035, BR-039, BR-070–073. Open: chosen OTAs/Channel Manager OQ-020, OTA prepaid settlement OQ-021, latency OQ-022, commissions OQ-038 and overbooking OQ-005. Webhooks must be signed/idempotent; Conflict behavior must not invent inventory. (BA Part 1, pp.17, 19–20, 23, 33–35.)

