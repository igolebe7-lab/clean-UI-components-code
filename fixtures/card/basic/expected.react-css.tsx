import type { HTMLAttributes, ReactNode } from "react";
import "./basic-card.css";

export type BasicCardProps = HTMLAttributes<HTMLElement> & {
  title?: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  media?: ReactNode;
};

export const BasicCard = ({
  title,
  description,
  header,
  footer,
  media,
  children,
  className,
  ...props
}: BasicCardProps) => {
  const classes = ["basic-card", className].filter(Boolean).join(" ");

  return (
    <article className={classes} {...props}>
      {media ? <div className="basic-card__media">{media}</div> : null}
      {header || title || description ? (
        <header className="basic-card__header">
          {header}
          {title ? <h3 className="basic-card__title">{title}</h3> : null}
          {description ? <p className="basic-card__description">{description}</p> : null}
        </header>
      ) : null}
      <div className="basic-card__content">{children}</div>
      {footer ? <footer className="basic-card__footer">{footer}</footer> : null}
    </article>
  );
};
