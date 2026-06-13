import type { GeneratedOutput, NormalizedComponentModel } from "@clean-ui/compiler";

const getVariant = (model: NormalizedComponentModel, name: string): readonly string[] => {
  return model.schema.variants.find((variant) => variant.name === name)?.values ?? [];
};

const getVariantDefault = (model: NormalizedComponentModel, name: string): string => {
  return model.schema.variants.find((variant) => variant.name === name)?.default ?? "";
};

const toTypeUnion = (values: readonly string[]): string =>
  values.map((value) => JSON.stringify(value)).join(" | ");

const getComponentFile = (model: NormalizedComponentModel): string => {
  const variants = getVariant(model, "variant");
  const sizes = getVariant(model, "size");
  const defaultVariant = getVariantDefault(model, "variant");
  const defaultSize = getVariantDefault(model, "size");
  const classBase = model.fileBaseName;

  return `import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./${classBase}.css";

export type ${model.componentName}Variant = ${toTypeUnion(variants)};
export type ${model.componentName}Size = ${toTypeUnion(sizes)};

export type ${model.componentName}Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ${model.componentName}Variant;
  size?: ${model.componentName}Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export const ${model.componentName} = ({
  variant = "${defaultVariant}",
  size = "${defaultSize}",
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ${model.componentName}Props) => {
  const classes = [
    "${classBase}",
    \`${classBase}--\${variant}\`,
    \`${classBase}--\${size}\`,
    loading ? "${classBase}--loading" : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="${classBase}__loader" aria-hidden="true" /> : leftIcon}
      <span className="${classBase}__content">{children}</span>
      {rightIcon}
    </button>
  );
};
`;
};

const getCssFile = (model: NormalizedComponentModel): string => {
  const classBase = model.fileBaseName;

  return `.${classBase} {
  align-items: center;
  background: var(--button-background);
  border: 1px solid var(--button-border);
  border-radius: var(--button-radius, 0.5rem);
  color: var(--button-foreground);
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-weight: 600;
  gap: 0.5rem;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0 1rem;
  transition: background-color 150ms ease;
}

.${classBase}:hover:not(:disabled) {
  background: var(--button-background-hover, var(--button-background));
}

.${classBase}:active:not(:disabled) {
  transform: translateY(1px);
}

.${classBase}:focus-visible {
  outline: 2px solid var(--button-ring);
  outline-offset: 2px;
}

.${classBase}:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.${classBase}--sm {
  min-height: 2rem;
  padding: 0 0.75rem;
}

.${classBase}--lg {
  min-height: 3rem;
  padding: 0 1.25rem;
}

.${classBase}--outline {
  background: transparent;
}

.${classBase}--ghost {
  background: transparent;
  border-color: transparent;
}

.${classBase}--glass {
  --button-background: color-mix(in srgb, var(--button-foreground) 8%, transparent);
  backdrop-filter: blur(12px);
}

.${classBase}--destructive {
  --button-background: var(--destructive);
  --button-foreground: var(--destructive-foreground);
}

.${classBase}__content {
  display: inline-flex;
}

.${classBase}__loader {
  block-size: 1em;
  border: 2px solid currentColor;
  border-radius: 999px;
  border-right-color: transparent;
  inline-size: 1em;
}
`;
};

export const generateButton = (model: NormalizedComponentModel): GeneratedOutput => {
  const componentFile = getComponentFile(model);
  const cssFile = getCssFile(model);
  const schemaFile = `${JSON.stringify(model.schema, null, 2)}\n`;
  const manifestFile = `{
  "componentId": "${model.componentId}",
  "target": "${model.target}",
  "files": [
    {
      "path": "${model.componentName}.tsx",
      "kind": "component",
      "language": "tsx",
      "overwritePolicy": "never"
    },
    {
      "path": "${model.fileBaseName}.css",
      "kind": "style",
      "language": "css",
      "overwritePolicy": "never"
    },
    {
      "path": "${model.fileBaseName}.schema.json",
      "kind": "schema",
      "language": "json",
      "overwritePolicy": "never"
    }
  ],
  "dependencies": ["react"],
  "devDependencies": [],
  "registryDependencies": []
}
`;

  return {
    files: [
      {
        path: `${model.componentName}.tsx`,
        kind: "component",
        language: "tsx",
        content: componentFile,
        overwritePolicy: "never",
      },
      {
        path: `${model.fileBaseName}.css`,
        kind: "style",
        language: "css",
        content: cssFile,
        overwritePolicy: "never",
      },
      {
        path: `${model.fileBaseName}.schema.json`,
        kind: "schema",
        language: "json",
        content: schemaFile,
        overwritePolicy: "never",
      },
      {
        path: `${model.fileBaseName}.manifest.json`,
        kind: "manifest",
        language: "json",
        content: manifestFile,
        overwritePolicy: "never",
      },
    ],
    dependencies: ["react"],
    devDependencies: [],
    registryDependencies: [],
  };
};
