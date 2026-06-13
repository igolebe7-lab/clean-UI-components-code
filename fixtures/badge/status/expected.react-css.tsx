import type { HTMLAttributes } from "react";
import "./status-badge.css";

export type StatusBadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "destructive"
  | "success"
  | "warning";

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: StatusBadgeVariant;
};

export const StatusBadge = ({
  variant = "success",
  className,
  children,
  ...props
}: StatusBadgeProps) => {
  const classes = ["status-badge", `status-badge--${variant}`, className].filter(Boolean).join(" ");

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
