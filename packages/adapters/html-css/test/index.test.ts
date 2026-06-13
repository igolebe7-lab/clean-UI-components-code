import { describe, expect, it } from "vitest";
import { htmlCssAdapterPackageName } from "../src/index.js";

describe("@clean-ui/adapter-html-css", () => {
  it("exports the package marker", () => {
    expect(htmlCssAdapterPackageName).toBe("@clean-ui/adapter-html-css");
  });
});
