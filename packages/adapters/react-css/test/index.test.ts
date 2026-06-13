import { describe, expect, it } from "vitest";
import { reactCssAdapterPackageName } from "../src/index.js";

describe("@clean-ui/adapter-react-css", () => {
  it("exports the package marker", () => {
    expect(reactCssAdapterPackageName).toBe("@clean-ui/adapter-react-css");
  });
});
