import { describe, expect, it } from "vitest";
import { tokensPackageName } from "../src/index.js";

describe("@clean-ui/tokens", () => {
  it("exports the package marker", () => {
    expect(tokensPackageName).toBe("@clean-ui/tokens");
  });
});
