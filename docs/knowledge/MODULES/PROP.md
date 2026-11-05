# PROP — Property Management

Purpose: create and operate the property boundary used for data partitioning, legal identity and business date. Lifecycle has Draft, Active, Suspended and Closed; only Active receives new bookings, and closure requires no future booking/open folio. (BA Part 2, pp.7–11.)

FR-PROP-001–008 cover legal/contact/timezone data, lifecycle, activation prerequisites, suspension/closure and property selection/controls. (BA Part 2, p.8.)

Key rules: BR-004, BR-007–008, BR-016, BR-060–061. `FR-PROP-001` remains `[Q]` for invoice/legal fields under OQ-037. Channel stop-sell on suspension belongs to the later CHN design. (BA Part 2, pp.8, 11.)

## Test slice implementation (not baseline)

The D8 synthetic test slice implements property creation, lookup by explicit property ID and status change. It stores the supplied IANA timezone and required `business_date`; it never substitutes the UTC calendar date. New properties start as Draft. Invalid timezones and malformed input return a safe 400. Tests use synthetic property names/codes only.

No ASM is needed for PROP. OQ-037, OQ-041, OQ-019 and other business questions remain open; no OQ is closed by this slice. The implementation has no authentication/RBAC, legal identity or invoice fields, guest data, rate engine, payment/folio behavior, or production readiness. This is an experiment, not a product baseline.

