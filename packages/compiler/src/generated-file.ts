export type GeneratedFileKind =
  | "component"
  | "style"
  | "schema"
  | "story"
  | "registry"
  | "readme"
  | "manifest"
  | "test";

export type GeneratedFileLanguage = "ts" | "tsx" | "css" | "json" | "md" | "html";

export type GeneratedFile = {
  readonly path: string;
  readonly kind: GeneratedFileKind;
  readonly language: GeneratedFileLanguage;
  readonly content: string;
  readonly overwritePolicy: "never" | "if-generated" | "always-with-approval";
};

export type GeneratedOutput = {
  readonly files: readonly GeneratedFile[];
  readonly dependencies: readonly string[];
  readonly devDependencies: readonly string[];
  readonly registryDependencies: readonly string[];
};
