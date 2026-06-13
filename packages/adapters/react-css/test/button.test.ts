import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeComponentSchema } from "@clean-ui/compiler";
import { parseComponentSchema } from "@clean-ui/schema";
import { describe, expect, it } from "vitest";
import { reactCssAdapter } from "../src/index.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");

const readFixture = (path: string): string => readFileSync(resolve(projectRoot, path), "utf8");

const schema = parseComponentSchema(
  JSON.parse(readFixture("fixtures/button/glass-basic/input.schema.json")),
);

describe("react-css button adapter", () => {
  it("supports button schemas", () => {
    expect(reactCssAdapter.id).toBe("react-css");
    expect(reactCssAdapter.supports(schema)).toBe(true);
  });

  it("generates deterministic button files matching golden fixtures", () => {
    const model = normalizeComponentSchema(schema, { target: "react-css" });

    const first = reactCssAdapter.generate(model);
    const second = reactCssAdapter.generate(model);

    expect(first).toEqual(second);
    expect(first.files.map((file) => file.path)).toEqual([
      "GlassButton.tsx",
      "glass-button.css",
      "glass-button.schema.json",
      "glass-button.manifest.json",
    ]);
    expect(first.files.find((file) => file.path === "GlassButton.tsx")?.content).toBe(
      readFixture("fixtures/button/glass-basic/expected.react-css.tsx"),
    );
    expect(first.files.find((file) => file.path === "glass-button.css")?.content).toBe(
      readFixture("fixtures/button/glass-basic/expected.react-css.css"),
    );
    expect(first.files.find((file) => file.path === "glass-button.manifest.json")?.content).toBe(
      readFixture("fixtures/button/glass-basic/expected.react-css.manifest.json"),
    );
  });
});
