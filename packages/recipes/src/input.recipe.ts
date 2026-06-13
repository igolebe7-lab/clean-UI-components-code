import type { ComponentRecipe } from "./component-recipe.js";

export const inputRecipe = {
  type: "input",
  root: "input",
  allowedRoots: ["input"],
  allowedSlots: ["label", "description", "error", "prefix", "suffix"],
  requiredStates: ["default", "focusVisible", "disabled", "invalid"],
  optionalStates: [],
  requiredProps: ["disabled", "invalid"],
  maxDomNodes: {
    default: 1,
    withLabelDescriptionError: 4,
  },
  accessibility: {
    requiresSemanticRoot: true,
    requiresDisabledHandling: true,
    requiresFocusVisible: true,
  },
  supportedVariants: {
    size: ["sm", "md", "lg"],
  },
  supportedTargets: [
    "react-css",
    "react-css-modules",
    "react-tailwind",
    "shadcn-registry",
    "html-css",
  ],
} as const satisfies ComponentRecipe;
