import { describe, expect, it } from "vitest";

describe("golden test bootstrap", () => {
  it("keeps the golden test project active", () => {
    expect("deterministic").toBe("deterministic");
  });
});
