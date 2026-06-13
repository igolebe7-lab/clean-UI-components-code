import { describe, expect, it } from "vitest";
import { compilerPackageName } from "../src/index.js";

describe("@clean-ui/compiler", () => {
  it("exports the package marker", () => {
    expect(compilerPackageName).toBe("@clean-ui/compiler");
  });
});
