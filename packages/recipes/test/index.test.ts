import { describe, expect, it } from "vitest";
import { recipesPackageName } from "../src/index.js";

describe("@clean-ui/recipes", () => {
  it("exports the package marker", () => {
    expect(recipesPackageName).toBe("@clean-ui/recipes");
  });
});
