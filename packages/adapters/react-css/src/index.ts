import type { TargetAdapter } from "@clean-ui/compiler";
import { generateBadge } from "./badge.js";
import { generateButton } from "./button.js";
import { generateCard } from "./card.js";
import { generateInput } from "./input.js";
import { generateSwitch } from "./switch.js";

export const reactCssAdapter = {
  id: "react-css",
  displayName: "React CSS",
  supports: (schema) => ["button", "card", "badge", "input", "switch"].includes(schema.type),
  generate: (model) => {
    switch (model.schema.type) {
      case "button":
        return generateButton(model);
      case "card":
        return generateCard(model);
      case "badge":
        return generateBadge(model);
      case "input":
        return generateInput(model);
      case "switch":
        return generateSwitch(model);
    }
  },
} as const satisfies TargetAdapter;
