#!/usr/bin/env node

import { pathToFileURL } from "node:url";

export const cliPackageName = "@clean-ui/cli";
export { runCli, type CliIo } from "./run-cli.js";

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const exitCode = await import("./run-cli.js").then(({ runCli }) => runCli(process.argv.slice(2)));
  process.exitCode = exitCode;
}
