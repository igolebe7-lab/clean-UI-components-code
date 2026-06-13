import { z } from "zod";

export const componentTypes = ["button", "card", "badge", "input", "switch"] as const;

export const targetIds = [
  "react-css",
  "react-css-modules",
  "react-tailwind",
  "shadcn-registry",
  "html-css",
] as const;

export const stateNames = [
  "default",
  "hover",
  "active",
  "focusVisible",
  "disabled",
  "loading",
  "selected",
  "invalid",
  "checked",
] as const;

export type ComponentType = (typeof componentTypes)[number];
export type TargetId = (typeof targetIds)[number];
export type StateName = (typeof stateNames)[number];

const cssVariableNameSchema = z.string().regex(/^--[a-zA-Z0-9-_]+$/);
const cssDimensionSchema = z.string().regex(/^-?\d*\.?\d+(px|rem|em|%|vh|vw|ch|ex|lh|rlh)$/);
const cssDurationSchema = z.string().regex(/^\d*\.?\d+(ms|s)$/);
const cssColorSchema = z.string().regex(/^(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|var\()/);

export const tokenValueSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("css-var"),
    value: cssVariableNameSchema,
  }),
  z.object({
    kind: z.literal("color"),
    value: cssColorSchema,
  }),
  z.object({
    kind: z.literal("dimension"),
    value: cssDimensionSchema,
  }),
  z.object({
    kind: z.literal("shadow"),
    value: z.string().min(1),
  }),
  z.object({
    kind: z.literal("duration"),
    value: cssDurationSchema,
  }),
  z.object({
    kind: z.literal("easing"),
    value: z.string().min(1),
  }),
  z.object({
    kind: z.literal("raw"),
    value: z.string().min(1),
  }),
]);

export const propDefinitionSchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z][a-zA-Z0-9]*$/),
  type: z.enum(["boolean", "string", "enum", "slot", "css-length"]),
  required: z.boolean().optional(),
  default: z.unknown().optional(),
  values: z.array(z.string().min(1)).optional(),
  description: z.string().optional(),
});

export const variantDefinitionSchema = z
  .object({
    name: z
      .string()
      .min(1)
      .regex(/^[a-zA-Z][a-zA-Z0-9]*$/),
    values: z.array(z.string().min(1)).min(1),
    default: z.string().min(1),
  })
  .superRefine((variant, context) => {
    if (!variant.values.includes(variant.default)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Variant "${variant.name}" default must be one of its values.`,
        path: ["default"],
        params: { cleanUiCode: "schema.variant_default_invalid" },
      });
    }
  });

export const slotDefinitionSchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z][a-zA-Z0-9]*$/),
  required: z.boolean().optional(),
  description: z.string().optional(),
});

export const stateDefinitionSchema = z.object({
  name: z.enum(stateNames),
  description: z.string().optional(),
});

export const accessibilityDefinitionSchema = z.object({
  semanticRoot: z.string().min(1).optional(),
  focusVisible: z.boolean().optional(),
  disabledHandling: z.boolean().optional(),
  ariaLabel: z.string().optional(),
});

export const outputDefinitionSchema = z.object({
  componentName: z
    .string()
    .min(1)
    .regex(/^[A-Z][a-zA-Z0-9]*$/)
    .optional(),
  fileName: z.string().min(1).optional(),
});

const requiredStatesByComponent = {
  button: ["default", "hover", "active", "focusVisible", "disabled"],
  card: ["default"],
  badge: ["default"],
  input: ["default", "focusVisible", "disabled", "invalid"],
  switch: ["default", "focusVisible", "disabled", "checked"],
} as const satisfies Record<ComponentType, readonly StateName[]>;

export const componentSchema = z
  .object({
    schemaVersion: z.literal("0.1.0"),
    id: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z
      .string()
      .min(1)
      .regex(/^[A-Z][a-zA-Z0-9]*$/),
    type: z.enum(componentTypes),
    description: z.string().optional(),
    targetHints: z.array(z.enum(targetIds)).optional(),
    tokens: z.record(z.string().min(1), tokenValueSchema),
    props: z.array(propDefinitionSchema),
    variants: z.array(variantDefinitionSchema),
    slots: z.array(slotDefinitionSchema),
    states: z.array(stateDefinitionSchema),
    accessibility: accessibilityDefinitionSchema.optional(),
    output: outputDefinitionSchema.optional(),
  })
  .superRefine((schema, context) => {
    const availableStates = new Set(schema.states.map((state) => state.name));
    const missingStates = requiredStatesByComponent[schema.type].filter(
      (state) => !availableStates.has(state),
    );

    for (const state of missingStates) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Component "${schema.type}" must define required state "${state}".`,
        path: ["states"],
        params: { cleanUiCode: "schema.required_state_missing" },
      });
    }
  });

export type TokenValue = z.infer<typeof tokenValueSchema>;
export type TokenMap = Record<string, TokenValue>;
export type PropDefinition = z.infer<typeof propDefinitionSchema>;
export type VariantDefinition = z.infer<typeof variantDefinitionSchema>;
export type SlotDefinition = z.infer<typeof slotDefinitionSchema>;
export type StateDefinition = z.infer<typeof stateDefinitionSchema>;
export type AccessibilityDefinition = z.infer<typeof accessibilityDefinitionSchema>;
export type OutputDefinition = z.infer<typeof outputDefinitionSchema>;
export type ComponentSchema = z.infer<typeof componentSchema>;

export const getRequiredStatesForComponent = (componentType: ComponentType): readonly StateName[] =>
  requiredStatesByComponent[componentType];
