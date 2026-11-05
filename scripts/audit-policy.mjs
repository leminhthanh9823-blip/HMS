import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const exceptionsPath = new URL(
  "../security/audit-exceptions.json",
  import.meta.url,
);
const exceptionFile = JSON.parse(readFileSync(exceptionsPath, "utf8"));
const dateArg = process.argv.find((argument) => argument.startsWith("--date="));
const today = dateArg
  ? dateArg.slice("--date=".length)
  : new Date().toISOString().slice(0, 10);

function checkExceptions(exceptions, currentDate) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(currentDate) ||
    Number.isNaN(Date.parse(`${currentDate}T00:00:00Z`))
  ) {
    throw new Error("Audit policy date must use YYYY-MM-DD");
  }
  for (const exception of exceptions) {
    if (
      !exception.advisory ||
      !exception.package ||
      !exception.reason?.trim()
    ) {
      throw new Error(
        "Every audit exception requires advisory, package and reason",
      );
    }
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(exception.expiresOn) ||
      Number.isNaN(Date.parse(`${exception.expiresOn}T00:00:00Z`))
    ) {
      throw new Error(`Invalid expiry date for ${exception.advisory}`);
    }
    if (exception.expiresOn <= currentDate) {
      throw new Error(
        `Audit exception expired: ${exception.advisory} (${exception.expiresOn})`,
      );
    }
  }
}

try {
  checkExceptions(exceptionFile.exceptions, today);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

if (process.argv.includes("--check-expiry")) {
  console.log(`Audit exceptions valid on ${today}`);
  process.exit(0);
}

const pnpmExecPath = process.env.npm_execpath;
const command = pnpmExecPath
  ? process.execPath
  : process.platform === "win32"
    ? "pnpm.cmd"
    : "pnpm";
const commandArgs = pnpmExecPath
  ? [pnpmExecPath, "audit", "--json"]
  : ["audit", "--json"];
const audit = spawnSync(command, commandArgs, {
  cwd: fileURLToPath(root),
  encoding: "utf8",
  shell: !pnpmExecPath && process.platform === "win32",
  maxBuffer: 20 * 1024 * 1024,
});
if (!audit.stdout) {
  console.error(audit.stderr || "pnpm audit did not return a JSON report");
  process.exit(2);
}

let report;
try {
  report = JSON.parse(audit.stdout);
} catch {
  console.error("Could not parse pnpm audit JSON report");
  process.exit(2);
}

const exceptions = new Map(
  exceptionFile.exceptions.map((exception) => [
    `${exception.advisory}:${exception.package}`,
    exception,
  ]),
);
const blocked = [];
for (const advisory of Object.values(report.advisories ?? {})) {
  if (!["high", "critical"].includes(advisory.severity)) continue;
  const key = `${advisory.github_advisory_id}:${advisory.module_name}`;
  const exception = exceptions.get(key);
  if (exception) {
    console.warn(
      `Allowed by expiring exception until ${exception.expiresOn}: ${key} — ${exception.reason}`,
    );
  } else {
    blocked.push(`${advisory.severity}: ${key} — ${advisory.title}`);
  }
}

const counts = report.metadata?.vulnerabilities ?? {};
console.log(
  `Dependency audit: ${counts.critical ?? 0} critical, ${counts.high ?? 0} high, ${counts.moderate ?? 0} moderate, ${counts.low ?? 0} low`,
);
if (blocked.length) {
  console.error(
    `High/critical advisories without an active exception:\n${blocked.join("\n")}`,
  );
  process.exit(1);
}
