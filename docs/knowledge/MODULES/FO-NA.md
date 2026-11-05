# FO-NA — Night Audit submodule

Purpose: close one property business date sequentially, post room charges once, process no-shows, generate stayover tasks/reports and advance the date. (BA Part 4, pp.10–13.)

FR-NA-001–011 cover preflight, exclusive run, revenue posting, no-show processing, tasks/reports, checkpoint/retry, manual adjustment/reopen controls and overdue alerts. (BA Part 4, pp.10–11.)

Runs must be idempotent and checkpointed; open departing guests and cashier shifts block it. Closed dates are immutable except Owner-controlled reopen/adjustment. Key rules: BR-004, BR-008, BR-032, BR-045, BR-055, BR-110, BR-133–134; concurrency RC-13/RC-14. (BA Part 4, pp.10–13, 29–31.)

Manual vs automatic trigger and alert window remain OQ-052/ASM-052. Revenue recognition/no-show details remain linked to OQ-008 and OQ-016. (BA Part 4, pp.3, 13, 37.)

