# D3 ESM measurement spike

**Scope:** temporary execution spike only, approved by Owner confirmation in conversation on 2026-11-05. It does not change the API's official module system or the product baseline.

## Measurement

On 2026-11-05, a temporary `.mts` entry point was executed with `tsx` from the existing API package. It loaded NestJS 11, generated Prisma 7 client and the PostgreSQL adapter as ESM, started a Nest application context, connected to the disposable PostgreSQL service and ran `SELECT 1`.

| Component | Observed version/evidence |
|---|---|
| Node.js | `v24.11.1` from the successful runtime output |
| NestJS | `11.1.29` from the API package manifest |
| Prisma CLI/client/adapter | `7.10.1`; CLI-generated client reported this version |
| tsx | `4.23.15` from the API package manifest |
| PostgreSQL | `18.6`, local Docker image `postgres@sha256:edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6` |
| Result | `pass`, `SELECT 1` returned `1`, process completed in `178 ms` including context startup and database probe |

The exact command entry was `pnpm --filter @hms/api exec tsx esm-spike.mts`; the temporary file was removed after the run. The database container and network were removed in the same PowerShell `finally` block.

## What this establishes

The current Windows/Node environment can use tsx to execute an isolated ESM TypeScript entry point that imports the installed Nest 11 and Prisma 7 modules and performs a real PostgreSQL query. It does not establish a production ESM build, worker startup, packaging, deployment, source maps, or cross-platform Linux behavior.

## Risks and recommendation

The repository's official TypeScript/build/test module settings remain unchanged. ESM can still expose differences in emitted import paths, package exports, decorators/metadata, test runners, Prisma generation, worker entry points and Linux CI. Keep the current module system for the test slice. Revisit a coordinated migration only if a later approved implementation requires it and after build/start tests cover API, worker and CI.
