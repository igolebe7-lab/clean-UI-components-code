import { validateAgainstRecipe } from "@clean-ui/recipes";
import type { ComponentSchema, TargetId } from "@clean-ui/schema";
import type { AdapterRegistry, CompilerError, CompilerResult } from "./adapter-registry.js";
import type { GeneratedOutput } from "./generated-file.js";
import type { GeneratedManifest } from "./manifest.js";
import { normalizeComponentSchema, type NormalizedComponentModel } from "./normalize.js";

export type CompileOptions = {
  readonly target: TargetId;
  readonly registry: AdapterRegistry;
};

export type CompiledComponent = {
  readonly model: NormalizedComponentModel;
  readonly output: GeneratedOutput;
  readonly manifest: GeneratedManifest;
  readonly report: ReturnType<typeof validateAgainstRecipe>;
};

const unsupportedComponentError = (schema: ComponentSchema, target: TargetId): CompilerError => ({
  code: "compiler.unsupported_component",
  message: `Adapter "${target}" does not support component type "${schema.type}".`,
  target,
});

export const compileComponent = (
  schema: ComponentSchema,
  options: CompileOptions,
): CompilerResult<CompiledComponent> => {
  const adapterResult = options.registry.safeGet(options.target);
  if (!adapterResult.ok) {
    return adapterResult;
  }

  if (!adapterResult.value.supports(schema)) {
    return {
      ok: false,
      error: unsupportedComponentError(schema, options.target),
    };
  }

  const model = normalizeComponentSchema(schema, { target: options.target });
  const report = validateAgainstRecipe(schema);
  const output = adapterResult.value.generate(model);
  const manifest: GeneratedManifest = {
    componentId: schema.id,
    target: options.target,
    files: output.files,
    dependencies: output.dependencies,
    devDependencies: output.devDependencies,
    registryDependencies: output.registryDependencies,
    checks: report.checks,
  };

  return {
    ok: true,
    value: {
      model,
      output,
      manifest,
      report,
    },
  };
};
