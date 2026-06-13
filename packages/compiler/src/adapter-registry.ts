import type { TargetId } from "@clean-ui/schema";
import type { GeneratedOutput } from "./generated-file.js";
import type { NormalizedComponentModel } from "./normalize.js";

export type CompilerError = {
  readonly code: string;
  readonly message: string;
  readonly target?: TargetId;
};

export type CompilerResult<TValue> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly error: CompilerError };

export type TargetAdapter = {
  readonly id: TargetId;
  readonly displayName: string;
  readonly supports: (schema: NormalizedComponentModel["schema"]) => boolean;
  readonly generate: (model: NormalizedComponentModel) => GeneratedOutput;
};

export type AdapterRegistry = {
  readonly list: () => readonly TargetAdapter[];
  readonly get: (target: TargetId) => TargetAdapter;
  readonly safeGet: (target: TargetId) => CompilerResult<TargetAdapter>;
};

const createUnknownTargetError = (target: TargetId): CompilerError => ({
  code: "compiler.unknown_target",
  message: `No adapter is registered for target "${target}".`,
  target,
});

export const createAdapterRegistry = (adapters: readonly TargetAdapter[]): AdapterRegistry => {
  const adaptersById = new Map<TargetId, TargetAdapter>();

  for (const adapter of adapters) {
    adaptersById.set(adapter.id, adapter);
  }

  return {
    list: () => [...adapters],
    get: (target) => {
      const adapter = adaptersById.get(target);
      if (!adapter) {
        throw new Error(createUnknownTargetError(target).message);
      }

      return adapter;
    },
    safeGet: (target) => {
      const adapter = adaptersById.get(target);

      if (!adapter) {
        return {
          ok: false,
          error: createUnknownTargetError(target),
        };
      }

      return {
        ok: true,
        value: adapter,
      };
    },
  };
};
