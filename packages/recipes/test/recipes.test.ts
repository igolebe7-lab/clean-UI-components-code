import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseComponentSchema, type ComponentSchema } from "@clean-ui/schema";
import { describe, expect, it } from "vitest";
import { getRecipe, validateAgainstRecipe } from "../src/index.js";

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

describe("component recipes", () => {
  it("exposes the button recipe contract", () => {
    const recipe = getRecipe("button");

    expect(recipe.root).toBe("button");
    expect(recipe.allowedSlots).toContain("children");
    expect(recipe.requiredStates).toContain("focusVisible");
    expect(recipe.maxDomNodes.loading).toBe(3);
  });

  it("passes a valid schema fixture", () => {
    const schema = readFixtureSchema("button", "glass-basic");
    const report = validateAgainstRecipe(schema);

    expect(report.status).toBe("passed");
    expect(report.summary.errors).toBe(0);
  });

  it("fails when a required state is missing", () => {
    const schema = {
      ...readFixtureSchema("button", "glass-basic"),
      states: [{ name: "default" as const }],
    };

    const report = validateAgainstRecipe(schema);

    expect(report.status).toBe("failed");
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: "recipe.required_state_missing",
        status: "failed",
        path: "states.focusVisible",
      }),
    );
  });

  it("fails when a schema declares an unsupported slot", () => {
    const schema = {
      ...readFixtureSchema("button", "glass-basic"),
      slots: [{ name: "children" }, { name: "media" }],
    };

    const report = validateAgainstRecipe(schema);

    expect(report.status).toBe("failed");
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: "recipe.slot_unsupported",
        status: "failed",
        path: "slots.media",
      }),
    );
  });

  it("fails when semantic root is invalid for the component", () => {
    const schema = {
      ...readFixtureSchema("input", "error"),
      accessibility: {
        semanticRoot: "div",
      },
    };

    const report = validateAgainstRecipe(schema);

    expect(report.status).toBe("failed");
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: "recipe.semantic_root_invalid",
        status: "failed",
        path: "accessibility.semanticRoot",
      }),
    );
  });
});
