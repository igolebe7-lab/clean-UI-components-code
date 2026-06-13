import { describe, expect, it } from "vitest";
import { createFailure, createSuccess } from "../src/index.js";

describe("@clean-ui/shared", () => {
  it("creates stable result objects", () => {
    expect(createSuccess("ok")).toEqual({ ok: true, value: "ok" });
    expect(createFailure("error")).toEqual({ ok: false, error: "error" });
  });
});
