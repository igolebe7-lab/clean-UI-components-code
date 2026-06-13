import { describe, expect, it } from "vitest";
import { schemaPackageName } from "../src/index.js";

describe("@clean-ui/schema", () => {
  it("exports the package marker", () => {
    expect(schemaPackageName).toBe("@clean-ui/schema");
  });
});
