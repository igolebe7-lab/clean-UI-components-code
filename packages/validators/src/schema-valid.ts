import { safeParseComponentSchema } from "@clean-ui/schema";
import {
  createFailedCheck,
  createPassedCheck,
  createValidationReport,
  type ValidationReport,
} from "./validation-report.js";

const toPathString = (path: ReadonlyArray<string | number>): string | undefined => {
  return path.length > 0 ? path.join(".") : undefined;
};

export const validateComponentSchemaInput = (input: unknown): ValidationReport => {
  const result = safeParseComponentSchema(input);

  if (result.ok) {
    return createValidationReport([
      createPassedCheck("schema-valid", "Component schema is valid."),
    ]);
  }

  return createValidationReport(
    result.issues.map((issue) =>
      createFailedCheck("schema-valid", issue.message, toPathString(issue.path), {
        code: issue.code,
      }),
    ),
  );
};
