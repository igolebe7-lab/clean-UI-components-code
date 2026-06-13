import type { ComponentType, StateName, TargetId } from "@clean-ui/schema";

export type ComponentRecipe = {
  readonly type: ComponentType;
  readonly root: string;
  readonly allowedRoots: readonly string[];
  readonly allowedSlots: readonly string[];
  readonly requiredStates: readonly StateName[];
  readonly optionalStates: readonly StateName[];
  readonly requiredProps: readonly string[];
  readonly maxDomNodes: Readonly<Record<string, number>>;
  readonly accessibility: {
    readonly requiresSemanticRoot: boolean;
    readonly requiresDisabledHandling?: boolean;
    readonly requiresFocusVisible?: boolean;
  };
  readonly supportedVariants: Readonly<Record<string, readonly string[]>>;
  readonly supportedTargets: readonly TargetId[];
};

export type RecipeValidationStatus = "passed" | "failed" | "warning";

export type RecipeValidationCheck = {
  readonly code: string;
  readonly status: RecipeValidationStatus;
  readonly severity: "info" | "warning" | "error";
  readonly message: string;
  readonly path?: string;
};

export type RecipeValidationReport = {
  readonly status: RecipeValidationStatus;
  readonly checks: readonly RecipeValidationCheck[];
  readonly summary: {
    readonly errors: number;
    readonly warnings: number;
    readonly passed: number;
  };
};
