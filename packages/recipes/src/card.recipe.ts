import type { ComponentRecipe } from "./component-recipe.js";

export const cardRecipe = {
  type: "card",
  root: "div",
  allowedRoots: ["div", "article"],
  allowedSlots: ["header", "title", "description", "content", "footer", "media"],
  requiredStates: ["default"],
  optionalStates: ["hover", "selected"],
  requiredProps: [],
  maxDomNodes: {
    default: 1,
    withHeaderContentFooter: 5,
    withMedia: 6,
  },
  accessibility: {
    requiresSemanticRoot: true,
  },
  supportedVariants: {
    variant: ["default", "outline"],
  },
  supportedTargets: [
    "react-css",
    "react-css-modules",
    "react-tailwind",
    "shadcn-registry",
    "html-css",
  ],
} as const satisfies ComponentRecipe;
