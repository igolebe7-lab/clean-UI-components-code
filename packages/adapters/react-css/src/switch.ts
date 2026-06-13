import type { GeneratedOutput, NormalizedComponentModel } from "@clean-ui/compiler";
import { createReactCssOutput } from "./output.js";

const getComponentFile = (model: NormalizedComponentModel): string => {
  const classBase = model.fileBaseName;

  return `import type { ButtonHTMLAttributes } from "react";
import "./${classBase}.css";

export type ${model.componentName}Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "role"> & {
  checked?: boolean;
};

export const ${model.componentName} = ({
  checked = false,
  className,
  disabled,
  ...props
}: ${model.componentName}Props) => {
  const classes = ["${classBase}", checked ? "${classBase}--checked" : undefined, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={classes}
      disabled={disabled}
      {...props}
    >
      <span className="${classBase}__thumb" aria-hidden="true" />
    </button>
  );
};
`;
};

const getCssFile = (model: NormalizedComponentModel): string => {
  const classBase = model.fileBaseName;

  return `.${classBase} {
  align-items: center;
  background: var(--switch-track);
  border: 1px solid var(--switch-border, transparent);
  border-radius: var(--switch-radius, 999px);
  cursor: pointer;
  display: inline-flex;
  inline-size: 2.75rem;
  min-block-size: 1.5rem;
  padding: 0.125rem;
}

.${classBase}:focus-visible {
  outline: 2px solid var(--switch-ring);
  outline-offset: 2px;
}

.${classBase}:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.${classBase}--checked {
  background: var(--switch-track-checked);
}

.${classBase}__thumb {
  background: var(--switch-thumb);
  block-size: 1.25rem;
  border-radius: 999px;
  box-shadow: var(--switch-thumb-shadow);
  inline-size: 1.25rem;
  transform: translateX(0);
  transition: transform var(--switch-duration, 150ms) ease;
}

.${classBase}--checked .${classBase}__thumb {
  transform: translateX(1.25rem);
}
`;
};

export const generateSwitch = (model: NormalizedComponentModel): GeneratedOutput =>
  createReactCssOutput(model, {
    componentContent: getComponentFile(model),
    cssContent: getCssFile(model),
  });
