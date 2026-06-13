import { describe, expect, it } from "vitest";
import { reactCssModulesAdapterPackageName } from "../src/index.js";

describe("@clean-ui/adapter-react-css-modules", () => {
  it("exports the package marker", () => {
    expect(reactCssModulesAdapterPackageName).toBe("@clean-ui/adapter-react-css-modules");
  });
});
