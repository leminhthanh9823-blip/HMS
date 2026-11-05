export async function runWorker(): Promise<void> {
  let stopping = false;
  const idleHandle = setInterval(() => undefined, 60_000);
  let finishShutdown: (() => void) | undefined;

  const shutdown = (reason: string): void => {
    if (stopping) return;
    stopping = true;
    console.info(`HMS Worker stopping (${reason})`);
    clearInterval(idleHandle);
    finishShutdown?.();
    if (process.connected) process.disconnect();
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
  if (process.send) {
    process.on("message", (message: unknown) => {
      if (message === "shutdown") shutdown("parent request");
    });
  }

  console.info("HMS Worker started; no queue or business jobs are configured.");
  await new Promise<void>((resolve) => {
    finishShutdown = resolve;
  });
}

if (require.main === module) {
  void runWorker().catch((error: unknown) => {
    console.error("HMS Worker failed", error);
    process.exitCode = 1;
  });
}
