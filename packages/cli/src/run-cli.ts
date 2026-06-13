import { reactCssAdapter } from "@clean-ui/adapter-react-css";
import {
  compileComponent,
  createAdapterRegistry,
  type GeneratedFile,
  type GeneratedManifest,
} from "@clean-ui/compiler";
import {
  ComponentSchemaValidationError,
  componentTypes,
  parseComponentSchema,
  targetIds,
  type ComponentSchema,
  type ComponentType,
  type TargetId,
} from "@clean-ui/schema";
import {
  validateCleanCodeContract,
  validateComponentSchemaInput,
  type ValidationReport,
} from "@clean-ui/validators";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, resolve, sep } from "node:path";
import { getStringOption, hasFlag, parseArgs, type ParsedArgs } from "./args.js";
import { createComponentSchema } from "./create-schema.js";

export type CliIo = {
  readonly cwd: string;
  readonly stdout: (value: string) => void;
  readonly stderr: (value: string) => void;
};

type CliError = {
  readonly code: string;
  readonly message: string;
  readonly details?: unknown;
};

class HandledCliError extends Error {
  readonly code: string;
  readonly details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = "HandledCliError";
    this.code = code;
    if (details !== undefined) {
      this.details = details;
    }
  }
}

const registry = createAdapterRegistry([reactCssAdapter]);

const isTargetId = (value: string): value is TargetId =>
  (targetIds as readonly string[]).includes(value);

const isComponentType = (value: string): value is ComponentType =>
  (componentTypes as readonly string[]).includes(value);

const fail = (code: string, message: string, details?: unknown): never => {
  throw new HandledCliError(code, message, details);
};

const readJsonFile = (path: string, cwd: string): unknown => {
  const absolutePath = isAbsolute(path) ? path : resolve(cwd, path);
  try {
    return JSON.parse(readFileSync(absolutePath, "utf8"));
  } catch (error) {
    return fail("cli.read_json_failed", `Could not read JSON file: ${absolutePath}`, {
      cause: error instanceof Error ? error.message : String(error),
    });
  }
};

const requireSchemaPath = (args: ParsedArgs): string => {
  const schemaPath = args.positionals[0];
  if (!schemaPath) {
    return fail("cli.missing_schema_path", "A component schema path is required.");
  }

  return schemaPath;
};

const getTarget = (args: ParsedArgs): TargetId => {
  const target = getStringOption(args, "target") ?? "react-css";
  if (!isTargetId(target)) {
    return fail("cli.unsupported_target", `Unsupported target "${target}".`, {
      supportedTargets: targetIds,
    });
  }

  const available = registry.safeGet(target);
  if (!available.ok) {
    return fail("cli.unsupported_target", available.error.message, {
      target,
      supportedTargets: registry.list().map((adapter) => adapter.id),
    });
  }

  return target;
};

const compileSchema = (
  input: unknown,
  target: TargetId,
): {
  readonly files: readonly GeneratedFile[];
  readonly manifest: GeneratedManifest;
  readonly report: ValidationReport;
} => {
  let schema: ComponentSchema;

  try {
    schema = parseComponentSchema(input);
  } catch (error) {
    if (error instanceof ComponentSchemaValidationError) {
      return fail("schema.validation_failed", "Component schema validation failed.", error.issues);
    }

    throw error;
  }

  const compiled = compileComponent(schema, { target, registry });
  if (!compiled.ok) {
    return fail(compiled.error.code, compiled.error.message, compiled.error);
  }

  const report = validateCleanCodeContract({
    schema,
    output: compiled.value.output,
    manifest: compiled.value.manifest,
  });

  return {
    files: compiled.value.output.files,
    manifest: compiled.value.manifest,
    report,
  };
};

const toErrorObject = (error: HandledCliError): CliError => ({
  code: error.code,
  message: error.message,
  ...(error.details === undefined ? {} : { details: error.details }),
});

const emitJson = (io: CliIo, value: unknown): void => {
  io.stdout(`${JSON.stringify(value, null, 2)}\n`);
};

const emitText = (
  io: CliIo,
  value: { readonly status: string; readonly command: string },
): void => {
  io.stdout(`${value.command}: ${value.status}\n`);
};

const emit = (
  args: ParsedArgs,
  io: CliIo,
  value: { readonly status: string; readonly command: string },
): void => {
  if (hasFlag(args, "json")) {
    emitJson(io, value);
    return;
  }

  emitText(io, value);
};

const createDiff = (displayPath: string, previous: string | undefined, next: string): string => {
  if (previous === next) {
    return `--- ${displayPath}\n+++ ${displayPath}\n@@\n`;
  }

  const previousLines = previous?.split("\n") ?? [];
  const nextLines = next.split("\n");

  if (previous === undefined) {
    return [
      "--- /dev/null",
      `+++ ${displayPath}`,
      "@@",
      ...nextLines.map((line) => `+${line}`),
    ].join("\n");
  }

  return [
    `--- ${displayPath}`,
    `+++ ${displayPath}`,
    "@@",
    ...previousLines.map((line) => `-${line}`),
    ...nextLines.map((line) => `+${line}`),
  ].join("\n");
};

const resolveGeneratedPath = (outDir: string, file: GeneratedFile): string => {
  const absoluteOutDir = resolve(outDir);
  const absolutePath = resolve(absoluteOutDir, file.path);
  const safePrefix = `${absoluteOutDir}${sep}`;

  if (absolutePath !== absoluteOutDir && !absolutePath.startsWith(safePrefix)) {
    return fail(
      "cli.invalid_generated_path",
      `Generated path escapes output directory: ${file.path}`,
    );
  }

  return absolutePath;
};

const handleValidate = (args: ParsedArgs, io: CliIo): number => {
  const schemaPath = requireSchemaPath(args);
  const input = readJsonFile(schemaPath, io.cwd);
  const report = validateComponentSchemaInput(input);
  const response = {
    status: report.status,
    command: "validate",
    report,
  };

  emit(args, io, response);
  return report.status === "failed" ? 1 : 0;
};

const handleGenerate = (args: ParsedArgs, io: CliIo): number => {
  const schemaPath = requireSchemaPath(args);
  const target = getTarget(args);
  const input = readJsonFile(schemaPath, io.cwd);
  const compiled = compileSchema(input, target);
  const response = {
    status: compiled.report.status,
    command: "generate",
    files: compiled.files,
    manifest: compiled.manifest,
    report: compiled.report,
  };

  emit(args, io, response);
  return compiled.report.status === "failed" ? 1 : 0;
};

const handleDiff = (args: ParsedArgs, io: CliIo): number => {
  const schemaPath = requireSchemaPath(args);
  const out = getStringOption(args, "out");
  if (!out) {
    return fail("cli.missing_out", "An explicit --out path is required.");
  }

  const target = getTarget(args);
  const input = readJsonFile(schemaPath, io.cwd);
  const compiled = compileSchema(input, target);
  const outDir = isAbsolute(out) ? out : resolve(io.cwd, out);
  const diffs = compiled.files.map((file) => {
    const absolutePath = resolveGeneratedPath(outDir, file);
    const previous = existsSync(absolutePath) ? readFileSync(absolutePath, "utf8") : undefined;

    return {
      path: absolutePath,
      status:
        previous === undefined ? "added" : previous === file.content ? "unchanged" : "changed",
      diff: createDiff(absolutePath, previous, file.content),
    };
  });
  const response = {
    status: compiled.report.status,
    command: "diff",
    diffs,
    manifest: compiled.manifest,
    report: compiled.report,
  };

  emit(args, io, response);
  return compiled.report.status === "failed" ? 1 : 0;
};

const handleWrite = (args: ParsedArgs, io: CliIo): number => {
  const schemaPath = requireSchemaPath(args);
  const out = getStringOption(args, "out");
  if (!out) {
    return fail("cli.missing_out", "An explicit --out path is required.");
  }

  const target = getTarget(args);
  const input = readJsonFile(schemaPath, io.cwd);
  const compiled = compileSchema(input, target);
  if (compiled.report.status === "failed") {
    const response = {
      status: "failed",
      command: "write",
      report: compiled.report,
    };
    emit(args, io, response);
    return 1;
  }

  const outDir = isAbsolute(out) ? out : resolve(io.cwd, out);
  const plannedFiles = compiled.files.map((file) => ({
    file,
    absolutePath: resolveGeneratedPath(outDir, file),
  }));
  const existingFile = plannedFiles.find(({ absolutePath }) => existsSync(absolutePath));
  if (existingFile) {
    return fail(
      "cli.overwrite_forbidden",
      `Refusing to overwrite existing file: ${existingFile.absolutePath}`,
      { path: existingFile.absolutePath },
    );
  }

  for (const { absolutePath, file } of plannedFiles) {
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, file.content, "utf8");
  }

  const response = {
    status: "passed",
    command: "write",
    files: plannedFiles.map(({ absolutePath, file }) => ({
      path: absolutePath,
      kind: file.kind,
      language: file.language,
    })),
    manifest: compiled.manifest,
    report: compiled.report,
  };

  emit(args, io, response);
  return 0;
};

const handleCreate = (args: ParsedArgs, io: CliIo): number => {
  const typeValue = args.positionals[0];
  if (!typeValue || !isComponentType(typeValue)) {
    return fail("cli.unsupported_component", "A supported component type is required.", {
      supportedComponents: componentTypes,
    });
  }

  if (typeValue !== "button") {
    return fail("cli.unsupported_component", `Create is not implemented for "${typeValue}" yet.`);
  }

  const name = getStringOption(args, "name");
  if (!name) {
    return fail("cli.missing_name", "A component --name is required.");
  }

  const target = getTarget(args);
  const preset = getStringOption(args, "preset");
  const schema = createComponentSchema({
    type: typeValue,
    name,
    target,
    ...(preset ? { preset } : {}),
  });
  const report = validateComponentSchemaInput(schema);
  const response = {
    status: report.status,
    command: "create",
    schema,
    report,
  };

  emit(args, io, response);
  return report.status === "failed" ? 1 : 0;
};

const handleInit = (args: ParsedArgs, io: CliIo): number => {
  const response = {
    status: "passed",
    command: "init",
    packageName: "@clean-ui/cli",
    supportedComponents: componentTypes,
    supportedTargets: registry.list().map((adapter) => adapter.id),
  };

  emit(args, io, response);
  return 0;
};

export const runCli = async (
  argv: readonly string[],
  io: CliIo = {
    cwd: process.cwd(),
    stdout: (value) => process.stdout.write(value),
    stderr: (value) => process.stderr.write(value),
  },
): Promise<number> => {
  const args = parseArgs(argv);

  try {
    switch (args.command) {
      case "init":
        return handleInit(args, io);
      case "validate":
        return handleValidate(args, io);
      case "generate":
        return handleGenerate(args, io);
      case "diff":
        return handleDiff(args, io);
      case "write":
        return handleWrite(args, io);
      case "create":
        return handleCreate(args, io);
      default:
        return fail("cli.unknown_command", "A supported command is required.", {
          supportedCommands: ["init", "create", "validate", "generate", "diff", "write"],
        });
    }
  } catch (error) {
    const handledError =
      error instanceof HandledCliError
        ? error
        : new HandledCliError(
            "cli.unexpected_error",
            error instanceof Error ? error.message : String(error),
          );
    const command = args.command ?? "unknown";
    const response = {
      status: "failed",
      command,
      error: toErrorObject(handledError),
    };

    if (hasFlag(args, "json")) {
      emitJson(io, response);
    } else {
      io.stderr(`${response.command}: ${response.error.code}: ${response.error.message}\n`);
    }

    return 1;
  }
};
