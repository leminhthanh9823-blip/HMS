import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { after, test } from "node:test";
import { createApiApp } from "./main";

const apps: Array<Awaited<ReturnType<typeof createApiApp>>> = [];

after(async () => {
  await Promise.all(apps.map((app) => app.close()));
});

async function startApi(options: Parameters<typeof createApiApp>[0]) {
  const app = await createApiApp(options);
  apps.push(app);
  await app.listen(0, "127.0.0.1");
  const address = app.getHttpServer().address() as AddressInfo;
  return `http://127.0.0.1:${address.port}`;
}

test("CORS returns allow-origin only for an explicitly allowed origin", async () => {
  const baseUrl = await startApi({
    corsOrigins: ["https://staff.example.test"],
  });
  const allowed = await fetch(`${baseUrl}/health/live`, {
    headers: { origin: "https://staff.example.test" },
  });
  const denied = await fetch(`${baseUrl}/health/live`, {
    headers: { origin: "https://other.example.test" },
  });

  assert.equal(
    allowed.headers.get("access-control-allow-origin"),
    "https://staff.example.test",
  );
  assert.equal(denied.headers.get("access-control-allow-origin"), null);
});

test("API responses include security headers", async () => {
  const baseUrl = await startApi({ corsOrigins: [] });
  const response = await fetch(`${baseUrl}/health/live`);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "SAMEORIGIN");
  assert.ok(response.headers.has("content-security-policy"));
  assert.equal(response.headers.get("x-powered-by"), null);
});

test("rate limit returns 429 and uses an isolated app counter", async () => {
  const baseUrl = await startApi({
    corsOrigins: [],
    rateLimit: { limit: 2, ttl: 60_000 },
  });
  const statuses: number[] = [];
  for (let index = 0; index < 3; index += 1) {
    statuses.push((await fetch(`${baseUrl}/health/live`)).status);
  }

  assert.deepEqual(statuses, [200, 200, 429]);
});
