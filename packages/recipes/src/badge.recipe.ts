import type { ComponentRecipe } from "./component-recipe.js";

export const badgeRecipe = {
  type: "badge",
  root: "span",
  allowedRoots: ["span", "a"],
  allowedSlots: ["children"],
  requiredStates: ["default"],
  optionalStates: [],
  requiredProps: ["variant"],
  maxDomNodes: {
    default: 1,
    withIcon: 2,
  },
  accessibility: {
    requiresSemanticRoot: true,
  },
  supportedVariants: {
    variant: ["default", "secondary", "outline", "destructive", "success", "warning"],
  },
  supportedTargets: [
    "react-css",
    "react-css-modules",
    "react-tailwind",
    "shadcn-registry",
    "html-css",
  ],
} as const satisfies ComponentRecipe;
