import type { InputHTMLAttributes, ReactNode } from "react";
import "./error-input.css";

export type ErrorInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
};

export const ErrorInput = ({
  label,
  description,
  error,
  invalid = false,
  className,
  id,
  disabled,
  ...props
}: ErrorInputProps) => {
  const inputId = id ?? props.name;
  const descriptionId = description && inputId ? `${inputId}-description` : undefined;
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const classes = ["error-input", invalid ? "error-input--invalid" : undefined, className]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classes}>
      {label ? <span className="error-input__label">{label}</span> : null}
      <input
        id={inputId}
        className="error-input__control"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {description ? (
        <span id={descriptionId} className="error-input__description">
          {description}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className="error-input__error">
          {error}
        </span>
      ) : null}
    </label>
  );
};
