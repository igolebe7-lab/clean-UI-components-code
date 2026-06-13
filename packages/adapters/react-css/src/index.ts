import type { TargetAdapter } from "@clean-ui/compiler";
import { generateButton } from "./button.js";

export const reactCssAdapter = {
  id: "react-css",
  displayName: "React CSS",
  supports: (schema) => schema.type === "button",
  generate: (model) => {
    if (model.schema.type !== "button") {
      throw new Error(`react-css adapter does not support "${model.schema.type}".`);
    }

    return generateButton(model);
  },
} as const satisfies TargetAdapter;
