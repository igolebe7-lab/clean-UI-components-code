import type { ComponentSchema, ComponentType } from "@clean-ui/schema";
import { badgeRecipe } from "./badge.recipe.js";
import { buttonRecipe } from "./button.recipe.js";
import { cardRecipe } from "./card.recipe.js";
import type {
  ComponentRecipe,
  RecipeValidationCheck,
  RecipeValidationReport,
} from "./component-recipe.js";
import { inputRecipe } from "./input.recipe.js";
import { switchRecipe } from "./switch.recipe.js";

const recipes = {
  button: buttonRecipe,
  card: cardRecipe,
  badge: badgeRecipe,
  input: inputRecipe,
  switch: switchRecipe,
} as const satisfies Record<ComponentType, ComponentRecipe>;

const createPassedCheck = (message: string): RecipeValidationCheck => ({
  code: "recipe.passed",
  status: "passed",
  severity: "info",
  message,
});

const createFailedCheck = (code: string, message: string, path: string): RecipeValidationCheck => ({
  code,
  status: "failed",
  severity: "error",
  message,
  path,
});

const createReport = (checks: readonly RecipeValidationCheck[]): RecipeValidationReport => {
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

export const getRecipe = (componentType: ComponentType): ComponentRecipe => recipes[componentType];

export const validateAgainstRecipe = (schema: ComponentSchema): RecipeValidationReport => {
  const recipe = getRecipe(schema.type);
  const checks: RecipeValidationCheck[] = [];
  const stateNames = new Set(schema.states.map((state) => state.name));

  for (const requiredState of recipe.requiredStates) {
    if (!stateNames.has(requiredState)) {
      checks.push(
        createFailedCheck(
          "recipe.required_state_missing",
          `Component "${schema.type}" must define state "${requiredState}".`,
          `states.${requiredState}`,
        ),
      );
    }
  }

  const allowedSlots = new Set(recipe.allowedSlots);
  for (const slot of schema.slots) {
    if (!allowedSlots.has(slot.name)) {
      checks.push(
        createFailedCheck(
          "recipe.slot_unsupported",
          `Slot "${slot.name}" is not supported by the "${schema.type}" recipe.`,
          `slots.${slot.name}`,
        ),
      );
    }
  }

  const semanticRoot = schema.accessibility?.semanticRoot;
  if (semanticRoot && !recipe.allowedRoots.includes(semanticRoot)) {
    checks.push(
      createFailedCheck(
        "recipe.semantic_root_invalid",
        `Semantic root "${semanticRoot}" is not supported by the "${schema.type}" recipe.`,
        "accessibility.semanticRoot",
      ),
    );
  }

  if (checks.length === 0) {
    checks.push(createPassedCheck(`Schema "${schema.id}" satisfies the "${schema.type}" recipe.`));
  }

  return createReport(checks);
};
