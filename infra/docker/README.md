# PostgreSQL for local development and integration tests

The pinned image digest is PostgreSQL 18.6, verified from the local image on 2026-11-05. This is a test-project image choice; it does not select the production version or provider (D12 remains open). The credentials below are synthetic development credentials and must never be reused in production.

## Local development database

Start the localhost-only database from the repository root:

```powershell
docker compose -f infra/docker/compose.dev.yml up -d --wait
```

The API's local example URL is `postgresql://hms_dev:hms_dev_only@127.0.0.1:5433/hms`. The host uses port 5433 to avoid conflicts with a local PostgreSQL listener on 5432.

Stop the container but retain its data:

```powershell
docker compose -f infra/docker/compose.dev.yml down
```

Reset all local development data:

```powershell
docker compose -f infra/docker/compose.dev.yml down -v
docker compose -f infra/docker/compose.dev.yml up -d --wait
```

Reset is destructive to the local synthetic database volume. No production data belongs here.

## Ephemeral integration test database

Run `pnpm --filter @hms/api test:db:ephemeral` from the repository root. The helper starts the test-only Compose project on a random localhost port, waits for its health check, runs the `SELECT 1` integration test, then removes the container and its volumes even when the test fails.

The Linux CI job uses an ephemeral PostgreSQL service with the same pinned image digest; the service is discarded with the job.
