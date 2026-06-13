import type { GeneratedOutput, NormalizedComponentModel } from "@clean-ui/compiler";
import { createReactCssOutput } from "./output.js";

const getVariants = (model: NormalizedComponentModel): readonly string[] =>
  model.schema.variants.find((variant) => variant.name === "variant")?.values ?? [];

const getDefaultVariant = (model: NormalizedComponentModel): string =>
  model.schema.variants.find((variant) => variant.name === "variant")?.default ?? "default";

const toTypeUnion = (values: readonly string[]): string =>
  values.length > 5
    ? `\n  | ${values.map((value) => JSON.stringify(value)).join("\n  | ")}`
    : values.map((value) => JSON.stringify(value)).join(" | ");

const getComponentFile = (model: NormalizedComponentModel): string => {
  const classBase = model.fileBaseName;
  const variantUnion = toTypeUnion(getVariants(model));
  const variantSeparator = variantUnion.startsWith("\n") ? "" : " ";

  return `import type { HTMLAttributes } from "react";
import "./${classBase}.css";

export type ${model.componentName}Variant =${variantSeparator}${variantUnion};

export type ${model.componentName}Props = HTMLAttributes<HTMLSpanElement> & {
  variant?: ${model.componentName}Variant;
};

export const ${model.componentName} = ({
  variant = "${getDefaultVariant(model)}",
  className,
  children,
  ...props
}: ${model.componentName}Props) => {
  const classes = ["${classBase}", \`${classBase}--\${variant}\`, className].filter(Boolean).join(" ");

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
`;
};

const getCssFile = (model: NormalizedComponentModel): string => {
  const classBase = model.fileBaseName;

  return `.${classBase} {
  align-items: center;
  background: var(--badge-background);
  border: 1px solid var(--badge-border, transparent);
  border-radius: var(--badge-radius, 999px);
  color: var(--badge-foreground);
  display: inline-flex;
  font: inherit;
  font-size: 0.875em;
  font-weight: 600;
  min-height: 1.5rem;
  padding: 0 0.625rem;
}

.${classBase}--secondary {
  --badge-background: var(--badge-secondary-background);
  --badge-foreground: var(--badge-secondary-foreground);
}

.${classBase}--outline {
  --badge-background: transparent;
  --badge-border: var(--badge-outline-border);
}

.${classBase}--destructive {
  --badge-background: var(--destructive);
  --badge-foreground: var(--destructive-foreground);
}

.${classBase}--success {
  --badge-background: var(--success);
  --badge-foreground: var(--success-foreground);
}

.${classBase}--warning {
  --badge-background: var(--warning);
  --badge-foreground: var(--warning-foreground);
}
`;
};

export const generateBadge = (model: NormalizedComponentModel): GeneratedOutput =>
  createReactCssOutput(model, {
    componentContent: getComponentFile(model),
    cssContent: getCssFile(model),
  });
