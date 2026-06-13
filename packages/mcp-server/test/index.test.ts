import { describe, expect, it } from "vitest";
import { mcpServerPackageName } from "../src/index.js";

describe("@clean-ui/mcp-server", () => {
  it("exports the package marker", () => {
    expect(mcpServerPackageName).toBe("@clean-ui/mcp-server");
  });
});
