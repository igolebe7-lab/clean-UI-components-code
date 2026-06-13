import { describe, expect, it } from "vitest";
import { reactTailwindAdapterPackageName } from "../src/index.js";

describe("@clean-ui/adapter-react-tailwind", () => {
  it("exports the package marker", () => {
    expect(reactTailwindAdapterPackageName).toBe("@clean-ui/adapter-react-tailwind");
  });
});
