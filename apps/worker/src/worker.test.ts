import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { test } from "node:test";

test(
  "worker exits with code zero after SIGTERM",
  { skip: process.platform === "win32" },
  async () => {
    const tsxCli = resolve("node_modules/tsx/dist/cli.mjs");
    const child = spawn(process.execPath, [tsxCli, "src/main.ts"], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    let signalSent = false;

    await new Promise<void>((resolveStop, reject) => {
      const timeout = setTimeout(() => {
        child.kill("SIGKILL");
        reject(new Error(`Worker failed to stop after SIGTERM: ${output}`));
      }, 5_000);
      const collect = (chunk: string) => {
        output += chunk;
        if (!signalSent && output.includes("HMS Worker started")) {
          signalSent = true;
          child.kill("SIGTERM");
        }
      };
      child.stdout?.setEncoding("utf8").on("data", collect);
      child.stderr?.setEncoding("utf8").on("data", collect);
      child.once("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });
      child.once("exit", (code, signal) => {
        clearTimeout(timeout);
        if (
          code === 0 &&
          signal === null &&
          output.includes("HMS Worker stopping (SIGTERM)")
        ) {
          resolveStop();
        } else {
          reject(
            new Error(
              `Worker exited unexpectedly (${code}, ${signal}): ${output}`,
            ),
          );
        }
      });
    });
  },
);

test("worker exits cleanly after receiving a shutdown message", async () => {
  const tsxCli = resolve("node_modules/tsx/dist/cli.mjs");
  const child = spawn(process.execPath, [tsxCli, "src/main.ts"], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe", "ipc"],
  });
  if (!child.stdout || !child.stderr) {
    throw new Error("Worker output streams are unavailable");
  }
  const stdout = child.stdout;
  const stderr = child.stderr;

  let output = "";
  stdout.setEncoding("utf8").on("data", (chunk: string) => {
    output += chunk;
  });
  stderr.setEncoding("utf8").on("data", (chunk: string) => {
    output += chunk;
  });

  await new Promise<void>((resolveStop, reject) => {
    let shutdownSent = false;
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      reject(
        new Error(`Worker failed to shut down within 5 seconds: ${output}`),
      );
    }, 5_000);
    child.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once("exit", (code, signal) => {
      clearTimeout(timeout);
      if (
        code === 0 &&
        signal === null &&
        output.includes("HMS Worker stopping")
      ) {
        resolveStop();
      } else {
        reject(
          new Error(
            `Worker exited unexpectedly (${code}, ${signal}): ${output}`,
          ),
        );
      }
    });
    stdout.on("data", () => {
      if (!shutdownSent && output.includes("HMS Worker started")) {
        shutdownSent = true;
        child.send("shutdown");
      }
    });
  });
});
