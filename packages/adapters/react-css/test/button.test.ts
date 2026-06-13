import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeComponentSchema } from "@clean-ui/compiler";
import { parseComponentSchema } from "@clean-ui/schema";
import { describe, expect, it } from "vitest";
import { reactCssAdapter } from "../src/index.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");

const readFixture = (path: string): string => readFileSync(resolve(projectRoot, path), "utf8");

const cases = [
  {
    componentType: "button",
    fixtureName: "glass-basic",
    componentName: "GlassButton",
    fileBaseName: "glass-button",
  },
  {
    componentType: "card",
    fixtureName: "basic",
    componentName: "BasicCard",
    fileBaseName: "basic-card",
  },
  {
    componentType: "badge",
    fixtureName: "status",
    componentName: "StatusBadge",
    fileBaseName: "status-badge",
  },
  {
    componentType: "input",
    fixtureName: "error",
    componentName: "ErrorInput",
    fileBaseName: "error-input",
  },
  {
    componentType: "switch",
    fixtureName: "basic",
    componentName: "BasicSwitch",
    fileBaseName: "basic-switch",
  },
] as const;

describe("react-css adapter", () => {
  it.each(cases)("supports $componentType schemas", ({ componentType, fixtureName }) => {
    const schema = parseComponentSchema(
      JSON.parse(readFixture(`fixtures/${componentType}/${fixtureName}/input.schema.json`)),
    );

    expect(reactCssAdapter.id).toBe("react-css");
    expect(reactCssAdapter.supports(schema)).toBe(true);
  });

  it.each(cases)(
    "generates deterministic $componentType files matching golden fixtures",
    ({ componentType, fixtureName, componentName, fileBaseName }) => {
      const schema = parseComponentSchema(
        JSON.parse(readFixture(`fixtures/${componentType}/${fixtureName}/input.schema.json`)),
      );
      const model = normalizeComponentSchema(schema, { target: "react-css" });

      const first = reactCssAdapter.generate(model);
      const second = reactCssAdapter.generate(model);

      expect(first).toEqual(second);
      expect(first.files.map((file) => file.path)).toEqual([
        `${componentName}.tsx`,
        `${fileBaseName}.css`,
        `${fileBaseName}.schema.json`,
        `${fileBaseName}.manifest.json`,
      ]);
      expect(first.files.find((file) => file.path === `${componentName}.tsx`)?.content).toBe(
        readFixture(`fixtures/${componentType}/${fixtureName}/expected.react-css.tsx`),
      );
      expect(first.files.find((file) => file.path === `${fileBaseName}.css`)?.content).toBe(
        readFixture(`fixtures/${componentType}/${fixtureName}/expected.react-css.css`),
      );
      expect(
        first.files.find((file) => file.path === `${fileBaseName}.manifest.json`)?.content,
      ).toBe(
        readFixture(`fixtures/${componentType}/${fixtureName}/expected.react-css.manifest.json`),
      );
    },
  );
});
