import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const result = spawnSync(
  "docker",
  [
    "compose",
    "--project-name",
    "hms-dev",
    "--file",
    "infra/docker/compose.dev.yml",
    "down",
    "--volumes",
    "--remove-orphans",
  ],
  { cwd: root, stdio: "inherit" },
);
process.exitCode = result.status ?? 1;
