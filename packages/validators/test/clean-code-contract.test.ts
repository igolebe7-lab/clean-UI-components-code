import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { GeneratedManifest, GeneratedOutput } from "@clean-ui/compiler";
import { parseComponentSchema, type ComponentSchema } from "@clean-ui/schema";
import { describe, expect, it } from "vitest";
import { validateCleanCodeContract, validateComponentSchemaInput } from "../src/index.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

const readFixtureSchema = (componentType: string, fixtureName: string): ComponentSchema => {
  const fixturePath = resolve(
    projectRoot,
    "fixtures",
    componentType,
    fixtureName,
    "input.schema.json",
  );

  return parseComponentSchema(JSON.parse(readFileSync(fixturePath, "utf8")));
};

const createValidOutput = (): GeneratedOutput => ({
  files: [
    {
      path: "glass-button.tsx",
      kind: "component",
      language: "tsx",
      content:
        'import React from "react";\nexport const GlassButton = () => <button className="glassButton" disabled={false}>Save</button>;\n',
      overwritePolicy: "never",
    },
    {
      path: "glass-button.css",
      kind: "style",
      language: "css",
      content:
        ".glassButton { color: var(--button-foreground); background: var(--button-background); }\n.glassButton:focus-visible { outline: 2px solid var(--ring); }\n.glassButton:disabled { opacity: 0.5; }\n",
      overwritePolicy: "never",
    },
  ],
  dependencies: ["react"],
  devDependencies: [],
  registryDependencies: [],
});

const createManifest = (output: GeneratedOutput): GeneratedManifest => ({
  componentId: "glass-button",
  target: "react-css",
  files: output.files,
  dependencies: output.dependencies,
  devDependencies: output.devDependencies,
  registryDependencies: output.registryDependencies,
  checks: [],
});

describe("clean code contract validators", () => {
  it("passes valid schema input", () => {
    const report = validateComponentSchemaInput(readFixtureSchema("button", "glass-basic"));

    expect(report.status).toBe("passed");
    expect(report.summary.errors).toBe(0);
  });

  it("returns schema validation details for invalid schema input", () => {
    const report = validateComponentSchemaInput({
      ...readFixtureSchema("button", "glass-basic"),
      type: "toast",
    });

    expect(report.status).toBe("failed");
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: "schema-valid",
        status: "failed",
        path: "type",
      }),
    );
  });

  it("passes a valid generated output and manifest", () => {
    const schema = readFixtureSchema("button", "glass-basic");
    const output = createValidOutput();
    const manifest = createManifest(output);

    const report = validateCleanCodeContract({ schema, output, manifest });

    expect(report.status).toBe("passed");
    expect(report.summary.errors).toBe(0);
  });

  it("fails when focus-visible styling is missing", () => {
    const schema = readFixtureSchema("button", "glass-basic");
    const output = {
      ...createValidOutput(),
      files: createValidOutput().files.map((file) =>
        file.path.endsWith(".css")
          ? { ...file, content: ".glassButton { color: var(--button-foreground); }" }
          : file,
      ),
    };

    const report = validateCleanCodeContract({
      schema,
      output,
      manifest: createManifest(output),
    });

    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: "missing-focus-visible",
        status: "failed",
      }),
    );
  });

  it("fails when generated DOM exceeds the recipe budget", () => {
    const schema = readFixtureSchema("button", "glass-basic");
    const output = {
      ...createValidOutput(),
      files: [
        {
          ...createValidOutput().files[0],
          content:
            "export const GlassButton = () => <button><span><span><span>Save</span></span></span></button>;\n",
        },
        createValidOutput().files[1],
      ],
    };

    const report = validateCleanCodeContract({
      schema,
      output,
      manifest: createManifest(output),
    });

    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: "dom-budget-exceeded",
        status: "failed",
      }),
    );
  });

  it("fails when generated styles use hardcoded colors", () => {
    const schema = readFixtureSchema("button", "glass-basic");
    const output = {
      ...createValidOutput(),
      files: createValidOutput().files.map((file) =>
        file.path.endsWith(".css")
          ? { ...file, content: ".glassButton { color: #ffffff; }" }
          : file,
      ),
    };

    const report = validateCleanCodeContract({
      schema,
      output,
      manifest: createManifest(output),
    });

    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: "hardcoded-token-value",
        status: "failed",
      }),
    );
  });

  it("fails when runtime dependencies are missing from the manifest", () => {
    const schema = readFixtureSchema("button", "glass-basic");
    const output = createValidOutput();

    const report = validateCleanCodeContract({
      schema,
      output,
      manifest: {
        ...createManifest(output),
        dependencies: [],
      },
    });

    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: "dependency-manifest-missing",
        status: "failed",
      }),
    );
  });

  it("fails when generated files are missing from the manifest", () => {
    const schema = readFixtureSchema("button", "glass-basic");
    const output = createValidOutput();

    const report = validateCleanCodeContract({
      schema,
      output,
      manifest: {
        ...createManifest(output),
        files: [output.files[0]],
      },
    });

    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: "generated-file-manifest-missing",
        status: "failed",
      }),
    );
  });

  it("fails when generated files contain random output sources", () => {
    const schema = readFixtureSchema("button", "glass-basic");
    const output = {
      ...createValidOutput(),
      files: [
        {
          ...createValidOutput().files[0],
          content: "export const generatedAt = Date.now();\n",
        },
      ],
    };

    const report = validateCleanCodeContract({
      schema,
      output,
      manifest: createManifest(output),
    });

    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: "random-output-detected",
        status: "failed",
      }),
    );
  });
});
