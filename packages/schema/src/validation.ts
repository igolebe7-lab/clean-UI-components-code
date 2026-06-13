import type { ZodError, ZodIssue } from "zod";
import { type ComponentSchema, componentSchema } from "./component-schema.js";

export type SchemaValidationIssue = {
  readonly code: string;
  readonly message: string;
  readonly path: ReadonlyArray<string | number>;
};

export type SchemaValidationResult =
  | { readonly ok: true; readonly schema: ComponentSchema }
  | { readonly ok: false; readonly issues: readonly SchemaValidationIssue[] };

export class ComponentSchemaValidationError extends Error {
  readonly issues: readonly SchemaValidationIssue[];

  constructor(issues: readonly SchemaValidationIssue[]) {
    super("Component schema validation failed.");
    this.name = "ComponentSchemaValidationError";
    this.issues = issues;
  }
}

const pathMatchesSuffix = (
  path: ReadonlyArray<string | number>,
  suffix: ReadonlyArray<string | number>,
): boolean => {
  if (path.length < suffix.length) {
    return false;
  }

  return suffix.every((part, index) => path[path.length - suffix.length + index] === part);
};

const toIssuePath = (path: ReadonlyArray<PropertyKey>): ReadonlyArray<string | number> =>
  path.filter((part): part is string | number => {
    return typeof part === "string" || typeof part === "number";
  });

const getCustomIssueCode = (issue: ZodIssue): string | undefined => {
  if (issue.code !== "custom") {
    return undefined;
  }

  const params = issue.params as { cleanUiCode?: unknown } | undefined;
  return typeof params?.cleanUiCode === "string" ? params.cleanUiCode : undefined;
};

const mapIssueCode = (issue: ZodIssue): string => {
  const customCode = getCustomIssueCode(issue);
  if (customCode) {
    return customCode;
  }

  const path = toIssuePath(issue.path);

  if (pathMatchesSuffix(path, ["type"])) {
    return "schema.invalid_type";
  }

  if (pathMatchesSuffix(path, ["tokens"]) || path.includes("tokens")) {
    return "schema.invalid_token_value";
  }

  return "schema.invalid";
};

const normalizeIssuePath = (issue: ZodIssue): ReadonlyArray<string | number> => {
  const path = toIssuePath(issue.path);

  if (path.includes("tokens") && !path.includes("value")) {
    return [...path, "value"];
  }

  return path;
};

export const formatSchemaValidationIssues = (error: ZodError): readonly SchemaValidationIssue[] =>
  error.issues.map((issue) => ({
    code: mapIssueCode(issue),
    message: issue.message,
    path: normalizeIssuePath(issue),
  }));

export const safeParseComponentSchema = (input: unknown): SchemaValidationResult => {
  const result = componentSchema.safeParse(input);

  if (result.success) {
    return { ok: true, schema: result.data };
  }

  return {
    ok: false,
    issues: formatSchemaValidationIssues(result.error),
  };
};

export const parseComponentSchema = (input: unknown): ComponentSchema => {
  const result = safeParseComponentSchema(input);

  if (result.ok) {
    return result.schema;
  }

  throw new ComponentSchemaValidationError(result.issues);
};
