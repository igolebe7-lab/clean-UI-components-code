import type { GeneratedOutput, NormalizedComponentModel } from "@clean-ui/compiler";
import { createReactCssOutput } from "./output.js";

const getComponentFile = (model: NormalizedComponentModel): string => {
  const classBase = model.fileBaseName;

  return `import type { HTMLAttributes, ReactNode } from "react";
import "./${classBase}.css";

export type ${model.componentName}Props = HTMLAttributes<HTMLElement> & {
  title?: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  media?: ReactNode;
};

export const ${model.componentName} = ({
  title,
  description,
  header,
  footer,
  media,
  children,
  className,
  ...props
}: ${model.componentName}Props) => {
  const classes = ["${classBase}", className].filter(Boolean).join(" ");

  return (
    <article className={classes} {...props}>
      {media ? <div className="${classBase}__media">{media}</div> : null}
      {header || title || description ? (
        <header className="${classBase}__header">
          {header}
          {title ? <h3 className="${classBase}__title">{title}</h3> : null}
          {description ? <p className="${classBase}__description">{description}</p> : null}
        </header>
      ) : null}
      <div className="${classBase}__content">{children}</div>
      {footer ? <footer className="${classBase}__footer">{footer}</footer> : null}
    </article>
  );
};
`;
};

const getCssFile = (model: NormalizedComponentModel): string => {
  const classBase = model.fileBaseName;

  return `.${classBase} {
  background: var(--card-background);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius, 0.75rem);
  color: var(--card-foreground);
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.${classBase}__media {
  overflow: hidden;
}

.${classBase}__header {
  display: grid;
  gap: 0.25rem;
}

.${classBase}__title {
  color: var(--card-title-foreground, var(--card-foreground));
  font: inherit;
  font-weight: 600;
  margin: 0;
}

.${classBase}__description {
  color: var(--card-muted-foreground);
  margin: 0;
}

.${classBase}__content {
  display: grid;
  gap: 0.75rem;
}

.${classBase}__footer {
  align-items: center;
  display: flex;
  gap: 0.75rem;
}
`;
};

export const generateCard = (model: NormalizedComponentModel): GeneratedOutput =>
  createReactCssOutput(model, {
    componentContent: getComponentFile(model),
    cssContent: getCssFile(model),
  });
