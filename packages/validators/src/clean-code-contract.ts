import type { GeneratedManifest, GeneratedOutput } from "@clean-ui/compiler";
import { getRecipe, validateAgainstRecipe } from "@clean-ui/recipes";
import type { ComponentSchema } from "@clean-ui/schema";
import {
  createFailedCheck,
  createPassedCheck,
  createValidationReport,
  type ValidationCheck,
  type ValidationReport,
} from "./validation-report.js";

export type CleanCodeContractInput = {
  readonly schema: ComponentSchema;
  readonly output: GeneratedOutput;
  readonly manifest: GeneratedManifest;
};

const sourceLanguages = new Set(["ts", "tsx", "html"]);
const styleLanguages = new Set(["css"]);

const joinGeneratedContent = (output: GeneratedOutput): string =>
  output.files.map((file) => file.content).join("\n");

const countDomNodes = (output: GeneratedOutput): number => {
  const sourceContent = output.files
    .filter((file) => sourceLanguages.has(file.language))
    .map((file) => file.content)
    .join("\n");
  const matches = sourceContent.match(/<[a-z][a-z0-9-]*(\s|>|\/)/g);

  return matches?.length ?? 0;
};

const validateDomBudget = (schema: ComponentSchema, output: GeneratedOutput): ValidationCheck => {
  const recipe = getRecipe(schema.type);
  const nodeCount = countDomNodes(output);
  const maxDomNodes = Math.max(...Object.values(recipe.maxDomNodes));

  if (nodeCount > maxDomNodes) {
    return createFailedCheck(
      "dom-budget-exceeded",
      `Generated output uses ${nodeCount} DOM nodes; recipe budget is ${maxDomNodes}.`,
      "output.files",
      { nodeCount, maxDomNodes },
    );
  }

  return createPassedCheck("dom-budget", "Generated output stays within DOM budget.");
};

const validateFocusVisible = (
  schema: ComponentSchema,
  output: GeneratedOutput,
): ValidationCheck => {
  const recipe = getRecipe(schema.type);
  if (!recipe.accessibility.requiresFocusVisible) {
    return createPassedCheck("focus-visible", "Component does not require focus-visible styling.");
  }

  if (!joinGeneratedContent(output).includes("focus-visible")) {
    return createFailedCheck(
      "missing-focus-visible",
      "Interactive component must define a visible focus state.",
      "output.files",
    );
  }

  return createPassedCheck("focus-visible", "Generated output defines focus-visible styling.");
};

const validateDisabledState = (
  schema: ComponentSchema,
  output: GeneratedOutput,
): ValidationCheck => {
  const recipe = getRecipe(schema.type);
  if (!recipe.accessibility.requiresDisabledHandling) {
    return createPassedCheck("disabled-state", "Component does not require disabled handling.");
  }

  if (!joinGeneratedContent(output).includes("disabled")) {
    return createFailedCheck(
      "missing-disabled-state",
      "Component must define disabled behavior.",
      "output.files",
    );
  }

  return createPassedCheck("disabled-state", "Generated output defines disabled behavior.");
};

const validateTokenUsage = (output: GeneratedOutput): ValidationCheck => {
  const styleContent = output.files
    .filter((file) => styleLanguages.has(file.language))
    .map((file) => file.content)
    .join("\n");

  if (/(#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\()/.test(styleContent)) {
    return createFailedCheck(
      "hardcoded-token-value",
      "Generated styles must use tokens or CSS variables instead of hardcoded colors.",
      "output.files",
    );
  }

  return createPassedCheck("token-usage", "Generated styles use token references.");
};

const validateDependencyManifest = (
  output: GeneratedOutput,
  manifest: GeneratedManifest,
): ValidationCheck => {
  const missingDependencies = output.dependencies.filter(
    (dependency) => !manifest.dependencies.includes(dependency),
  );

  if (missingDependencies.length > 0) {
    return createFailedCheck(
      "dependency-manifest-missing",
      "Generated dependency manifest is missing runtime dependencies.",
      "manifest.dependencies",
      { missingDependencies },
    );
  }

  return createPassedCheck("dependency-manifest", "Runtime dependencies are explicit.");
};

const validateGeneratedFileManifest = (
  output: GeneratedOutput,
  manifest: GeneratedManifest,
): ValidationCheck => {
  const manifestPaths = new Set(manifest.files.map((file) => file.path));
  const missingFiles = output.files
    .map((file) => file.path)
    .filter((path) => !manifestPaths.has(path));

  if (missingFiles.length > 0) {
    return createFailedCheck(
      "generated-file-manifest-missing",
      "Generated file manifest is missing output files.",
      "manifest.files",
      { missingFiles },
    );
  }

  return createPassedCheck("generated-file-manifest", "All generated files are in the manifest.");
};

const validateNoRandomOutput = (output: GeneratedOutput): ValidationCheck => {
  if (/(Date\.now|Math\.random|crypto\.randomUUID|new Date\()/.test(joinGeneratedContent(output))) {
    return createFailedCheck(
      "random-output-detected",
      "Generated output must not include random or time-dependent values.",
      "output.files",
    );
  }

  return createPassedCheck("no-random-output", "Generated output is free of random sources.");
};

export const validateCleanCodeContract = ({
  schema,
  output,
  manifest,
}: CleanCodeContractInput): ValidationReport => {
  const recipeReport = validateAgainstRecipe(schema);
  const recipeChecks = recipeReport.checks.map((check): ValidationCheck => {
    if (check.status === "failed") {
      return createFailedCheck(check.code, check.message, check.path);
    }

    return createPassedCheck(check.code, check.message, check.path);
  });

  return createValidationReport([
    ...recipeChecks,
    validateDomBudget(schema, output),
    validateFocusVisible(schema, output),
    validateDisabledState(schema, output),
    validateTokenUsage(output),
    validateDependencyManifest(output, manifest),
    validateGeneratedFileManifest(output, manifest),
    validateNoRandomOutput(output),
  ]);
};
