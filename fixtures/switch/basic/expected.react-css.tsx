import type { ButtonHTMLAttributes } from "react";
import "./basic-switch.css";

export type BasicSwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "role"> & {
  checked?: boolean;
};

export const BasicSwitch = ({
  checked = false,
  className,
  disabled,
  ...props
}: BasicSwitchProps) => {
  const classes = ["basic-switch", checked ? "basic-switch--checked" : undefined, className]
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
      <span className="basic-switch__thumb" aria-hidden="true" />
    </button>
  );
};
