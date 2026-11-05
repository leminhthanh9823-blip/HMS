import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const composeFile = "infra/docker/compose.test.yml";
const project = `hms-dbtest-${process.pid}`;

function dockerCompose(args) {
  return spawnSync(
    "docker",
    ["compose", "--project-name", project, "--file", composeFile, ...args],
    {
      cwd: root,
      encoding: "utf8",
      stdio: "inherit",
    },
  );
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: "inherit",
    ...options,
  });
  return result.status ?? 1;
}

let exitCode = 1;
try {
  const started = dockerCompose(["up", "--detach", "--wait"]);
  if (started.status !== 0)
    throw new Error("Could not start ephemeral PostgreSQL");

  const published = spawnSync(
    "docker",
    [
      "compose",
      "--project-name",
      project,
      "--file",
      composeFile,
      "port",
      "postgres",
      "5432",
    ],
    { cwd: root, encoding: "utf8" },
  );
  if (published.status !== 0 || !published.stdout.trim()) {
    throw new Error(
      published.stderr || "Could not determine ephemeral PostgreSQL port",
    );
  }
  const port = Number(published.stdout.trim().split(":").at(-1));
  if (!Number.isInteger(port) || port < 1)
    throw new Error("Docker returned an invalid PostgreSQL port");

  const pnpmExecPath = process.env.npm_execpath;
  const command = pnpmExecPath
    ? process.execPath
    : process.platform === "win32"
      ? "pnpm.cmd"
      : "pnpm";
  const args = pnpmExecPath
    ? [pnpmExecPath, "--filter", "@hms/api", "test:db"]
    : ["--filter", "@hms/api", "test:db"];
  exitCode = run(command, args, {
    shell: !pnpmExecPath && process.platform === "win32",
    env: {
      ...process.env,
      DATABASE_URL: `postgresql://hms_test:hms_test_only@127.0.0.1:${port}/hms_test`,
      HMS_TEST_HOLD_TTL_SECONDS: process.env.HMS_TEST_HOLD_TTL_SECONDS ?? "2",
    },
  });
} catch (error) {
  console.error(
    error instanceof Error ? error.message : "Ephemeral PostgreSQL test failed",
  );
} finally {
  const stopped = dockerCompose(["down", "--volumes", "--remove-orphans"]);
  if (stopped.status !== 0) exitCode = 1;
}

process.exitCode = exitCode;
