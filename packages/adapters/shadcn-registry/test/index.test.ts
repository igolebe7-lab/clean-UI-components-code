import { describe, expect, it } from "vitest";
import { shadcnRegistryAdapterPackageName } from "../src/index.js";

describe("@clean-ui/adapter-shadcn-registry", () => {
  it("exports the package marker", () => {
    expect(shadcnRegistryAdapterPackageName).toBe("@clean-ui/adapter-shadcn-registry");
  });
});
