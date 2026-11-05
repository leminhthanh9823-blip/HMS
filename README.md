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

The CI production dependency audit is fail-soft while the Owner has not set an advisory severity threshold or exception policy. A successful CI run therefore does not mean the audit reported zero advisories.

For TypeScript project references, running `tsc -b` from the repository root uses each app's regular `tsconfig.json` and can emit test files into `dist`. The official build is `pnpm build`, which uses each app's `tsconfig.build.json` and excludes tests.

The API test and development runner uses `tsx`/esbuild, which does not emit decorator metadata for Nest constructor injection. Nest dependencies must use explicit `@Inject()` decorators; `apps/api/src/di.test.ts` exercises this behavior.

## Dependency overrides

The root pnpm configuration temporarily pins `multer` to `2.5.0` to address advisories `GHSA-wc9g-mqfw-jrwm`, `GHSA-qfvm-cv95-jqjf`, `GHSA-535w-7cp7-47q4`, `GHSA-q7qp-rjg7-q26m`, `GHSA-3pph-fpjx-jg34` and `GHSA-qvfw-j98x-7q72` reported through `@nestjs/platform-express` (added 2026-11-05). Remove this override when `@nestjs/platform-express` resolves `multer` to `>=2.5.0`, then reinstall and rerun `pnpm audit --prod` before committing the removal.

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
