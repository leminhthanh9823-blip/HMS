# HMS

Homestay Management System repository foundation. This prototype contains three independent application entry points: API, Web and Worker. It has no business modules, database, Redis, authentication or external service dependency.

The Owner authorized this bounded Gate A/B implementation. Package and framework choices used to create it are implementation choices for this prototype; architecture and technology proposals remain Proposed / Pending Approval in the Knowledge Base.

## Requirements

- Node.js `24.11.1` or compatible newer 24.x runtime
- pnpm `10.34.9`

## Install

```powershell
pnpm install --frozen-lockfile
```

## Development

```powershell
pnpm dev
```

This starts API (`http://127.0.0.1:3001`), Web (`http://127.0.0.1:3000`) and Worker processes concurrently. The API health endpoints are `GET /health/live` and `GET /health/ready`; both run without database or Redis.

For an individual application, use `pnpm --filter @hms/api dev`, `pnpm --filter @hms/web dev` or `pnpm --filter @hms/worker dev`.

The API reads `API_HOST` and `API_PORT` from the environment. See [apps/api/.env.example](apps/api/.env.example). No secrets or service credentials are needed.

`GET /health/ready` is currently a placeholder and does not verify database, Redis, or any other dependency. It must not be treated as a production dependency-readiness signal.

## Checks

```powershell
pnpm lint
pnpm typecheck
pnpm build
pnpm format
pnpm format:check
```

## Scope boundary

See `docs/knowledge/PHASE_0_IMPLEMENTATION_PLAN.md`. This shell does not approve an architecture or resolve OQ-031, OQ-033, OQ-034, OQ-036, OQ-041 or other open questions. Production deployment and business behavior require separate decisions and authorization.
