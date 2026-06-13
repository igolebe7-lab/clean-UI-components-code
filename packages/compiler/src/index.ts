export {
  type AdapterRegistry,
  type CompilerError,
  type CompilerResult,
  type TargetAdapter,
  createAdapterRegistry,
} from "./adapter-registry.js";
export { compileComponent, type CompiledComponent, type CompileOptions } from "./compile.js";
export type {
  GeneratedFile,
  GeneratedFileKind,
  GeneratedFileLanguage,
  GeneratedOutput,
} from "./generated-file.js";
export type { GeneratedManifest } from "./manifest.js";
export {
  type NormalizedComponentModel,
  type NormalizeOptions,
  normalizeComponentSchema,
} from "./normalize.js";
