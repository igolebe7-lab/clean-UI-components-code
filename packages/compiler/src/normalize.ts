import type { ComponentRecipe } from "@clean-ui/recipes";
import { getRecipe } from "@clean-ui/recipes";
import type { ComponentSchema, TargetId } from "@clean-ui/schema";

export type NormalizedComponentModel = {
  readonly schema: ComponentSchema;
  readonly recipe: ComponentRecipe;
  readonly componentName: string;
  readonly componentId: string;
  readonly fileBaseName: string;
  readonly target: TargetId;
};

export type NormalizeOptions = {
  readonly target: TargetId;
};

export const normalizeComponentSchema = (
  schema: ComponentSchema,
  options: NormalizeOptions,
): NormalizedComponentModel => {
  return {
    schema,
    recipe: getRecipe(schema.type),
    componentName: schema.output?.componentName ?? schema.name,
    componentId: schema.id,
    fileBaseName: schema.output?.fileName ?? schema.id,
    target: options.target,
  };
};
