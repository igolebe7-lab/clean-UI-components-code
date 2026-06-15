import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { runCli } from "../../packages/cli/src/index.js";

const demoDir = fileURLToPath(new URL(".", import.meta.url));
const schemaPath = join(demoDir, "button.schema.json");

const createIo = () => {
  const stdout: string[] = [];
  const stderr: string[] = [];

  return {
    io: {
      cwd: demoDir,
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

describe("cli smoke demo", () => {
  it("documents and verifies fixture -> diff -> write -> preview", async () => {
    const readme = readFileSync(join(demoDir, "README.md"), "utf8");
    const preview = readFileSync(join(demoDir, "preview.html"), "utf8");
    const outDir = mkdtempSync(join(tmpdir(), "clean-ui-cli-smoke-demo-"));

    expect(readme).toContain(
      "clean-ui diff button.schema.json --target react-css --out generated --json",
    );
    expect(readme).toContain(
      "clean-ui write button.schema.json --target react-css --out generated --json",
    );
    expect(preview).toContain('rel="icon"');
    expect(preview).toContain("./generated/demo-button.css");
    expect(preview).toContain("demo-button demo-button--glass demo-button--md");

    const validate = createIo();
    const validateExitCode = await runCli(["validate", schemaPath, "--json"], validate.io);
    expect(validateExitCode).toBe(0);

    const diff = createIo();
    const diffExitCode = await runCli(
      ["diff", schemaPath, "--target", "react-css", "--out", outDir, "--json"],
      diff.io,
    );
    const diffResult = parseLastJson(diff.stdout);

    expect(diffExitCode).toBe(0);
    expect(JSON.stringify(diffResult)).toContain("DemoButton.tsx");
    expect(existsSync(join(outDir, "DemoButton.tsx"))).toBe(false);

    const write = createIo();
    const writeExitCode = await runCli(
      ["write", schemaPath, "--target", "react-css", "--out", outDir, "--json"],
      write.io,
    );

    expect(writeExitCode).toBe(0);
    expect(readFileSync(join(outDir, "DemoButton.tsx"), "utf8")).toContain(
      "export const DemoButton",
    );
    expect(readFileSync(join(outDir, "demo-button.css"), "utf8")).toContain(".demo-button--glass");
    expect(readFileSync(join(outDir, "demo-button.manifest.json"), "utf8")).toContain(
      '"dependencies": ["react"]',
    );
  });
});
