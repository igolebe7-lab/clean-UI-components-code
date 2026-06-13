import { describe, expect, it } from "vitest";
import { cliPackageName } from "../src/index.js";

describe("@clean-ui/cli", () => {
  it("exports the package marker", () => {
    expect(cliPackageName).toBe("@clean-ui/cli");
  });
});
