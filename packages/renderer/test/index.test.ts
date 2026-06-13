import { describe, expect, it } from "vitest";
import { rendererPackageName } from "../src/index.js";

describe("@clean-ui/renderer", () => {
  it("exports the package marker", () => {
    expect(rendererPackageName).toBe("@clean-ui/renderer");
  });
});
