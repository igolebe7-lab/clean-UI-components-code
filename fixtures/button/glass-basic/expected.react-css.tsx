import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./glass-button.css";

export type GlassButtonVariant = "solid" | "outline" | "ghost" | "glass" | "destructive";
export type GlassButtonSize = "sm" | "md" | "lg";

export type GlassButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export const GlassButton = ({
  variant = "glass",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: GlassButtonProps) => {
  const classes = [
    "glass-button",
    `glass-button--${variant}`,
    `glass-button--${size}`,
    loading ? "glass-button--loading" : undefined,
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
      {loading ? <span className="glass-button__loader" aria-hidden="true" /> : leftIcon}
      <span className="glass-button__content">{children}</span>
      {rightIcon}
    </button>
  );
};
