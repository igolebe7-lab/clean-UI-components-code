import type { GeneratedOutput, NormalizedComponentModel } from "@clean-ui/compiler";
import { createReactCssOutput } from "./output.js";

const getComponentFile = (model: NormalizedComponentModel): string => {
  const classBase = model.fileBaseName;

  return `import type { InputHTMLAttributes, ReactNode } from "react";
import "./${classBase}.css";

export type ${model.componentName}Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
};

export const ${model.componentName} = ({
  label,
  description,
  error,
  invalid = false,
  className,
  id,
  disabled,
  ...props
}: ${model.componentName}Props) => {
  const inputId = id ?? props.name;
  const descriptionId = description && inputId ? \`\${inputId}-description\` : undefined;
  const errorId = error && inputId ? \`\${inputId}-error\` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const classes = ["${classBase}", invalid ? "${classBase}--invalid" : undefined, className]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classes}>
      {label ? <span className="${classBase}__label">{label}</span> : null}
      <input
        id={inputId}
        className="${classBase}__control"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {description ? (
        <span id={descriptionId} className="${classBase}__description">
          {description}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className="${classBase}__error">
          {error}
        </span>
      ) : null}
    </label>
  );
};
`;
};

const getCssFile = (model: NormalizedComponentModel): string => {
  const classBase = model.fileBaseName;

  return `.${classBase} {
  color: var(--input-foreground);
  display: grid;
  gap: 0.375rem;
}

.${classBase}__label {
  font: inherit;
  font-weight: 500;
}

.${classBase}__control {
  background: var(--input-background);
  border: 1px solid var(--input-border);
  border-radius: var(--input-radius, 0.5rem);
  color: var(--input-foreground);
  font: inherit;
  min-height: 2.5rem;
  padding: 0 0.75rem;
}

.${classBase}__control:focus-visible {
  outline: 2px solid var(--input-ring);
  outline-offset: 2px;
}

.${classBase}__control:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.${classBase}--invalid .${classBase}__control {
  border-color: var(--input-invalid-border);
}

.${classBase}__description {
  color: var(--input-muted-foreground);
}

.${classBase}__error {
  color: var(--input-error-foreground);
}
`;
};

export const generateInput = (model: NormalizedComponentModel): GeneratedOutput =>
  createReactCssOutput(model, {
    componentContent: getComponentFile(model),
    cssContent: getCssFile(model),
  });
