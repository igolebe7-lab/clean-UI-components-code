import type { ComponentRecipe } from "./component-recipe.js";

export const buttonRecipe = {
  type: "button",
  root: "button",
  allowedRoots: ["button"],
  allowedSlots: ["leftIcon", "children", "rightIcon", "loader"],
  requiredStates: ["default", "hover", "active", "focusVisible", "disabled"],
  optionalStates: ["loading"],
  requiredProps: ["variant", "size", "loading"],
  maxDomNodes: {
    default: 1,
    withIcon: 3,
    loading: 3,
  },
  accessibility: {
    requiresSemanticRoot: true,
    requiresDisabledHandling: true,
    requiresFocusVisible: true,
  },
  supportedVariants: {
    variant: ["solid", "outline", "ghost", "glass", "destructive"],
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
