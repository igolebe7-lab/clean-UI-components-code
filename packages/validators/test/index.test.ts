import { describe, expect, it } from "vitest";
import { validatorsPackageName } from "../src/index.js";

describe("@clean-ui/validators", () => {
  it("exports the package marker", () => {
    expect(validatorsPackageName).toBe("@clean-ui/validators");
  });
});
