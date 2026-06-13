import type { TargetId } from "@clean-ui/schema";
import type { RecipeValidationCheck } from "@clean-ui/recipes";
import type { GeneratedFile } from "./generated-file.js";

export type GeneratedManifest = {
  readonly componentId: string;
  readonly target: TargetId;
  readonly files: readonly GeneratedFile[];
  readonly dependencies: readonly string[];
  readonly devDependencies: readonly string[];
  readonly registryDependencies: readonly string[];
  readonly checks: readonly RecipeValidationCheck[];
};
