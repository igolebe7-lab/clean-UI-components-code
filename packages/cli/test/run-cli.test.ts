import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { runCli } from "../src/index.js";

const fixturePath = fileURLToPath(
  new URL("../../../fixtures/button/glass-basic/input.schema.json", import.meta.url),
);

const createIo = (cwd = process.cwd()) => {
  const stdout: string[] = [];
  const stderr: string[] = [];

  return {
    io: {
      cwd,
      stdout: (value: string) => stdout.push(value),
      stderr: (value: string) => stderr.push(value),
    },
    stdout,
    stderr,
  };
};

const parseLastJson = (chunks: readonly string[]): unknown => {
  const last = chunks.at(-1);
  expect(last).toBeDefined();
  return JSON.parse(last ?? "{}");
};

describe("runCli", () => {
  it("validates a schema and emits JSON", async () => {
    const { io, stdout } = createIo();

    const exitCode = await runCli(["validate", fixturePath, "--json"], io);
    const result = parseLastJson(stdout);

    expect(exitCode).toBe(0);
    expect(result).toMatchObject({
      status: "passed",
      command: "validate",
    });
  });

  it("generates files in dry-run mode without writing to disk", async () => {
    const outDir = mkdtempSync(join(tmpdir(), "clean-ui-cli-generate-"));
    const { io, stdout } = createIo(outDir);

    const exitCode = await runCli(
      ["generate", fixturePath, "--target", "react-css", "--dry-run", "--json"],
      io,
    );
    const result = parseLastJson(stdout);

    expect(exitCode).toBe(0);
    expect(result).toMatchObject({
      status: "passed",
      command: "generate",
      manifest: {
        componentId: "glass-button",
        target: "react-css",
      },
    });
    expect(readFileSync(fixturePath, "utf8")).toContain("GlassButton");
  });

  it("returns a diff without writing generated files", async () => {
    const outDir = mkdtempSync(join(tmpdir(), "clean-ui-cli-diff-"));
    const { io, stdout } = createIo();

    const exitCode = await runCli(
      ["diff", fixturePath, "--target", "react-css", "--out", outDir, "--json"],
      io,
    );
    const result = parseLastJson(stdout);

    expect(exitCode).toBe(0);
    expect(result).toMatchObject({
      status: "passed",
      command: "diff",
    });
    expect(JSON.stringify(result)).toContain("+++");
  });

  it("writes generated files and refuses overwrite by default", async () => {
    const outDir = mkdtempSync(join(tmpdir(), "clean-ui-cli-write-"));
    const first = createIo();

    const firstExitCode = await runCli(
      ["write", fixturePath, "--target", "react-css", "--out", outDir, "--json"],
      first.io,
    );

    expect(firstExitCode).toBe(0);
    expect(readFileSync(join(outDir, "GlassButton.tsx"), "utf8")).toContain(
      "export const GlassButton",
    );

    const second = createIo();
    const secondExitCode = await runCli(
      ["write", fixturePath, "--target", "react-css", "--out", outDir, "--json"],
      second.io,
    );
    const result = parseLastJson(second.stdout);

    expect(secondExitCode).toBe(1);
    expect(result).toMatchObject({
      status: "failed",
      command: "write",
      error: {
        code: "cli.overwrite_forbidden",
      },
    });
  });

  it("creates a button schema in dry-run mode", async () => {
    const { io, stdout } = createIo();

    const exitCode = await runCli(
      [
        "create",
        "button",
        "--name",
        "PremiumButton",
        "--target",
        "react-css",
        "--preset",
        "glass",
        "--dry-run",
        "--json",
      ],
      io,
    );
    const result = parseLastJson(stdout);

    expect(exitCode).toBe(0);
    expect(result).toMatchObject({
      status: "passed",
      command: "create",
      schema: {
        id: "premium-button",
        name: "PremiumButton",
        type: "button",
        targetHints: ["react-css"],
      },
    });
  });
});
