import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseComponentSchema, type ComponentSchema } from "@clean-ui/schema";
import { describe, expect, it } from "vitest";
import {
  compileComponent,
  createAdapterRegistry,
  normalizeComponentSchema,
  type GeneratedOutput,
  type TargetAdapter,
} from "../src/index.js";

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

const createFakeAdapter = (): TargetAdapter => ({
  id: "react-css",
  displayName: "React CSS",
  supports: (schema) => schema.type === "button",
  generate: (model): GeneratedOutput => ({
    files: [
      {
        path: `${model.fileBaseName}.tsx`,
        kind: "component",
        language: "tsx",
        content: `export const ${model.componentName} = () => null;\n`,
        overwritePolicy: "never",
      },
    ],
    dependencies: ["react"],
    devDependencies: [],
    registryDependencies: [],
  }),
});

describe("compiler core", () => {
  it("normalizes a schema into a target model", () => {
    const schema = readFixtureSchema("button", "glass-basic");

    const model = normalizeComponentSchema(schema, { target: "react-css" });

    expect(model.componentName).toBe("GlassButton");
    expect(model.fileBaseName).toBe("glass-button");
    expect(model.target).toBe("react-css");
    expect(model.recipe.type).toBe("button");
  });

  it("registers and resolves adapters by target", () => {
    const registry = createAdapterRegistry([createFakeAdapter()]);

    expect(registry.get("react-css").displayName).toBe("React CSS");
    expect(registry.list().map((adapter) => adapter.id)).toEqual(["react-css"]);
  });

  it("returns a stable error for unknown targets", () => {
    const registry = createAdapterRegistry([]);
    const result = registry.safeGet("react-css");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("compiler.unknown_target");
    }
  });

  it("compiles through a selected adapter without writing files", () => {
    const schema = readFixtureSchema("button", "glass-basic");
    const registry = createAdapterRegistry([createFakeAdapter()]);

    const result = compileComponent(schema, {
      target: "react-css",
      registry,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.manifest).toEqual({
        componentId: "glass-button",
        target: "react-css",
        files: result.value.output.files,
        dependencies: ["react"],
        devDependencies: [],
        registryDependencies: [],
        checks: result.value.report.checks,
      });
      expect(result.value.output.files[0]?.path).toBe("glass-button.tsx");
    }
  });

  it("compiles deterministically for the same input", () => {
    const schema = readFixtureSchema("button", "glass-basic");
    const registry = createAdapterRegistry([createFakeAdapter()]);

    const first = compileComponent(schema, { target: "react-css", registry });
    const second = compileComponent(schema, { target: "react-css", registry });

    expect(first).toEqual(second);
  });
});
