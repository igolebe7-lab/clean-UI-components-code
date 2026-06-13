import { describe, expect, it } from "vitest";
import { testUtilsPackageName } from "../src/index.js";

describe("@clean-ui/test-utils", () => {
  it("exports the package marker", () => {
    expect(testUtilsPackageName).toBe("@clean-ui/test-utils");
  });
});
