import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./audit-policy.mjs", import.meta.url));

test("expired audit exception makes the policy command fail for a supplied date", () => {
  const result = spawnSync(
    process.execPath,
    [script, "--check-expiry", "--date=2027-02-03"],
    {
      encoding: "utf8",
    },
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Audit exception expired: GHSA-g3hv-75wg-m249/);
});

test("active audit exception passes expiry validation for a supplied date", () => {
  const result = spawnSync(
    process.execPath,
    [script, "--check-expiry", "--date=2027-02-02"],
    {
      encoding: "utf8",
    },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Audit exceptions valid on 2027-02-02/);
});
