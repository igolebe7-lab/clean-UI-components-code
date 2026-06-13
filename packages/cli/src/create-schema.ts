import type { ComponentSchema, ComponentType, TargetId } from "@clean-ui/schema";

const toKebabCase = (value: string): string => {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
};

export const createButtonSchema = ({
  name,
  target,
  preset,
}: {
  readonly name: string;
  readonly target: TargetId;
  readonly preset?: string;
}): ComponentSchema => {
  const defaultVariant = preset === "glass" ? "glass" : "solid";

  return {
    schemaVersion: "0.1.0",
    id: toKebabCase(name),
    name,
    type: "button",
    description: `Generated ${name} schema.`,
    targetHints: [target],
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
      },
    ],
    variants: [
      {
        name: "variant",
        values: ["solid", "outline", "ghost", "glass", "destructive"],
        default: defaultVariant,
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
      componentName: name,
    },
  };
};

export const createComponentSchema = ({
  type,
  name,
  target,
  preset,
}: {
  readonly type: ComponentType;
  readonly name: string;
  readonly target: TargetId;
  readonly preset?: string;
}): ComponentSchema => {
  switch (type) {
    case "button":
      return createButtonSchema({ name, target, ...(preset ? { preset } : {}) });
    case "badge":
    case "card":
    case "input":
    case "switch":
      throw new Error(`CLI create is not implemented for "${type}" yet.`);
  }
};
