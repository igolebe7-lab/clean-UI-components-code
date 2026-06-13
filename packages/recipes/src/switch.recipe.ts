import type { ComponentRecipe } from "./component-recipe.js";

export const switchRecipe = {
  type: "switch",
  root: "button",
  allowedRoots: ["button"],
  allowedSlots: ["thumb", "label"],
  requiredStates: ["default", "checked", "focusVisible", "disabled"],
  optionalStates: [],
  requiredProps: ["checked", "disabled"],
  maxDomNodes: {
    default: 2,
    withLabel: 3,
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
