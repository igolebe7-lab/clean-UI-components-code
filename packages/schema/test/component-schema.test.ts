import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseComponentSchema, safeParseComponentSchema } from "../src/index.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

const validButtonSchema = {
  schemaVersion: "0.1.0",
  id: "premium-button",
  name: "PremiumButton",
  type: "button",
  description: "A tokenized glass button.",
  targetHints: ["react-css", "shadcn-registry"],
  tokens: {
    background: { kind: "css-var", value: "--button-background" },
    foreground: { kind: "css-var", value: "--button-foreground" },
    radius: { kind: "dimension", value: "0.5rem" },
  },
  props: [
    {
      name: "loading",
      type: "boolean",
      required: false,
      default: false,
      description: "Shows a loading state.",
    },
  ],
  variants: [
    {
      name: "variant",
      values: ["solid", "outline", "ghost", "glass", "destructive"],
      default: "glass",
    },
    {
      name: "size",
      values: ["sm", "md", "lg"],
      default: "md",
    },
  ],
  slots: [{ name: "leftIcon" }, { name: "children", required: true }, { name: "rightIcon" }],
  states: [
    { name: "default" },
    { name: "hover" },
    { name: "active" },
    { name: "focusVisible" },
    { name: "disabled" },
  ],
  accessibility: {
    semanticRoot: "button",
    focusVisible: true,
    disabledHandling: true,
  },
  output: {
    componentName: "PremiumButton",
  },
} as const;

describe("component schema validation", () => {
  it("parses a valid button schema", () => {
    const schema = parseComponentSchema(validButtonSchema);

    expect(schema.type).toBe("button");
    expect(schema.targetHints).toEqual(["react-css", "shadcn-registry"]);
    expect(schema.variants[0]?.default).toBe("glass");
  });

  it("returns stable errors for unsupported component types", () => {
    const result = safeParseComponentSchema({
      ...validButtonSchema,
      type: "toast",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          code: "schema.invalid_type",
          path: ["type"],
        }),
      );
    }
  });

  it("returns stable errors for malformed token values", () => {
    const result = safeParseComponentSchema({
      ...validButtonSchema,
      tokens: {
        background: { kind: "color", value: "blue" },
      },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          code: "schema.invalid_token_value",
          path: ["tokens", "background", "value"],
        }),
      );
    }
  });

  it("returns stable errors when a variant default is not one of its values", () => {
    const result = safeParseComponentSchema({
      ...validButtonSchema,
      variants: [
        {
          name: "variant",
          values: ["solid", "outline"],
          default: "glass",
        },
      ],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          code: "schema.variant_default_invalid",
          path: ["variants", 0, "default"],
        }),
      );
    }
  });

  it("returns stable errors when required component states are missing", () => {
    const result = safeParseComponentSchema({
      ...validButtonSchema,
      states: [{ name: "default" }],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          code: "schema.required_state_missing",
          path: ["states"],
          message: expect.stringContaining("focusVisible"),
        }),
      );
    }
  });

  it.each([
    ["button", "glass-basic"],
    ["card", "basic"],
    ["badge", "status"],
    ["input", "error"],
    ["switch", "basic"],
  ])("parses the %s/%s fixture schema", (componentType, fixtureName) => {
    const fixturePath = resolve(
      projectRoot,
      "fixtures",
      componentType,
      fixtureName,
      "input.schema.json",
    );
    const schema = parseComponentSchema(JSON.parse(readFileSync(fixturePath, "utf8")));

    expect(schema.type).toBe(componentType);
  });
});
