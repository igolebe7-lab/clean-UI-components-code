export type ValidationStatus = "passed" | "failed" | "warning";

export type ValidationCheck = {
  readonly code: string;
  readonly status: ValidationStatus;
  readonly severity: "info" | "warning" | "error";
  readonly message: string;
  readonly path?: string;
  readonly details?: unknown;
  readonly suggestedFix?: unknown;
};

export type ValidationReport = {
  readonly status: ValidationStatus;
  readonly checks: readonly ValidationCheck[];
  readonly summary: {
    readonly errors: number;
    readonly warnings: number;
    readonly passed: number;
  };
};

export const createPassedCheck = (
  code: string,
  message: string,
  path?: string,
): ValidationCheck => {
  const check: ValidationCheck = {
    code,
    status: "passed",
    severity: "info",
    message,
  };

  return path ? { ...check, path } : check;
};

export const createFailedCheck = (
  code: string,
  message: string,
  path?: string,
  details?: unknown,
): ValidationCheck => {
  const check: ValidationCheck = {
    code,
    status: "failed",
    severity: "error",
    message,
  };

  return {
    ...check,
    ...(path ? { path } : {}),
    ...(details === undefined ? {} : { details }),
  };
};

export const createValidationReport = (checks: readonly ValidationCheck[]): ValidationReport => {
  const errors = checks.filter((check) => check.severity === "error").length;
  const warnings = checks.filter((check) => check.severity === "warning").length;
  const passed = checks.filter((check) => check.status === "passed").length;

  return {
    status: errors > 0 ? "failed" : warnings > 0 ? "warning" : "passed",
    checks,
    summary: {
      errors,
      warnings,
      passed,
    },
  };
};
