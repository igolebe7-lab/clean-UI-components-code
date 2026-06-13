import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["apps/**/*.test.ts", "packages/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "golden",
          include: ["fixtures/**/*.test.ts"],
        },
      },
    ],
  },
});
