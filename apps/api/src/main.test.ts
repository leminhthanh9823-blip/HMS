import assert from "node:assert/strict";
import { test } from "node:test";
import { parseApiPort } from "./main";

test("API_PORT accepts decimal ports in range", () => {
  assert.equal(parseApiPort(undefined), 3001);
  assert.equal(parseApiPort("1"), 1);
  assert.equal(parseApiPort("65535"), 65535);
});

test("API_PORT rejects malformed and out-of-range values", () => {
  for (const value of ["3001abc", "", "0", "70000", "1e3"]) {
    assert.throws(() => parseApiPort(value), {
      message: "API_PORT must contain only digits and be between 1 and 65535",
    });
  }
});
