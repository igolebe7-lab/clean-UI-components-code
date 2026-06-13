# Clean UI Components Code MVP Development Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the repository and deliver the MVP schema-first component compiler for Button, Card, Badge, Input, and Switch across the required targets.

**Architecture:** The component schema is the source of truth. Packages are built bottom-up: shared utilities and schema first, then recipes, compiler, adapters, validators, CLI, MCP server, fixtures, examples, and docs. Generation stays dry-run by default; only explicit write commands/tools may write generated files.

**Tech Stack:** pnpm workspace, TypeScript strict mode, Vitest, Biome, tsup, Zod, MCP SDK, Commander or equivalent CLI framework, deterministic golden fixtures.

---

## Current Repository State

- The working folder is not currently a git repository.
- Present files: `AGENTS.md`, `TECHNICAL_SPEC_CODEX.md`, `.serena/`.
- No `package.json`, `pnpm-workspace.yaml`, source packages, fixtures, examples, CI, README, or tests exist yet.
- The technical spec says the GitHub repository is expected to start empty and should be bootstrapped from scratch.

## Development Constraints

- MVP scope only: `Button`, `Card`, `Badge`, `Input`, `Switch`.
- MVP targets only: `react-css`, `react-css-modules`, `react-tailwind`, `shadcn-registry`, `html-css`.
- Do not build a visual editor or canvas-first workflow.
- Do not allow agents to write final component files directly when the compiler can generate them.
- Do not add dependencies without documenting why they are needed.
- Every behavior change needs tests; generation changes need golden fixtures.

## Planned File Structure

- Create root tooling files: `README.md`, `LICENSE`, `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `tsconfig.json`, `biome.json`, `.gitignore`, `.npmrc`, `.github/workflows/ci.yml`.
- Create packages: `packages/schema`, `packages/recipes`, `packages/compiler`, `packages/adapters/react-css`, `packages/adapters/react-css-modules`, `packages/adapters/react-tailwind`, `packages/adapters/shadcn-registry`, `packages/adapters/html-css`, `packages/validators`, `packages/cli`, `packages/mcp-server`, `packages/renderer`, `packages/tokens`, `packages/shared`, `packages/test-utils`.
- Create product assets: `fixtures/`, `examples/`, `docs/`, `docs/decisions/`.
- Defer `apps/docs` and `apps/web` implementation until CLI/compiler behavior exists; create skeletons only if needed by workspace scripts.

---

## Task 0: Repository Bootstrap

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `tsconfig.json`
- Create: `biome.json`
- Create: `.gitignore`
- Create: `.npmrc`
- Create: `README.md`
- Create: `LICENSE`
- Create: `.github/workflows/ci.yml`
- Create: package skeleton `package.json`, `src/index.ts`, `test/*.test.ts` files as needed

- [ ] **Step 1: Initialize git if the folder is still not a repository**

Run:

```bash
git status --short
```

Expected if not initialized:

```txt
fatal: not a git repository (or any of the parent directories): .git
```

Then run:

```bash
git init
```

- [ ] **Step 2: Create root workspace config**

Add `pnpm-workspace.yaml` with:

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "packages/adapters/*"
```

Add root scripts in `package.json`:

```json
{
  "name": "clean-ui-components-code",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.12.1",
  "scripts": {
    "format:check": "biome format --write=false .",
    "lint": "biome lint .",
    "typecheck": "tsc -b",
    "test": "vitest run",
    "test:golden": "vitest run --project golden",
    "build": "pnpm -r build"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "tsup": "^8.5.0",
    "typescript": "^5.8.0",
    "vitest": "^3.2.0"
  }
}
```

- [ ] **Step 3: Create TypeScript and Biome config**

Use strict TypeScript, ESM output, declaration output, and workspace project references. Biome should cover TS/TSX/JSON/MD formatting and linting without introducing Prettier/ESLint unless a specific rule requires it.

- [ ] **Step 4: Create package skeletons**

Each package should have a focused `package.json`, `src/index.ts`, and a minimal smoke test. Package names must follow the spec namespace, for example `@clean-ui/schema` and `@clean-ui/adapter-react-css`.

- [ ] **Step 5: Add CI**

`.github/workflows/ci.yml` must run:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:golden
pnpm build
```

- [ ] **Step 6: Verify bootstrap**

Run:

```bash
pnpm install
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Expected: all commands pass with skeleton packages.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "chore(repo): bootstrap pnpm workspace"
```

---

## Task 1: Schema Core

**Files:**
- Create: `packages/schema/src/component-schema.ts`
- Create: `packages/schema/src/token-schema.ts`
- Create: `packages/schema/src/validation.ts`
- Modify: `packages/schema/src/index.ts`
- Create: `packages/schema/test/component-schema.test.ts`
- Create: `fixtures/*/*/input.schema.json` starter schemas

- [ ] **Step 1: Add Zod-based schema types**

Implement `ComponentSchema`, `TokenValue`, props, variants, slots, states, accessibility, output, and `TargetId` for only MVP components and targets.

- [ ] **Step 2: Add runtime validation**

Expose:

```ts
export function parseComponentSchema(input: unknown): ComponentSchema;
export function safeParseComponentSchema(input: unknown): SchemaValidationResult;
```

Validation errors must expose stable codes suitable for CLI/MCP JSON output.

- [ ] **Step 3: Add schema tests**

Cover valid and invalid examples for `button`, `card`, `badge`, `input`, and `switch`. Include tests for invalid component type, invalid token shape, missing required state, and invalid variant default.

- [ ] **Step 4: Verify**

Run:

```bash
pnpm --filter @clean-ui/schema test
pnpm typecheck
```

- [ ] **Step 5: Commit**

```bash
git add packages/schema fixtures
git commit -m "feat(schema): add component schema primitives"
```

---

## Task 2: Recipes

**Files:**
- Create: `packages/recipes/src/button.recipe.ts`
- Create: `packages/recipes/src/card.recipe.ts`
- Create: `packages/recipes/src/badge.recipe.ts`
- Create: `packages/recipes/src/input.recipe.ts`
- Create: `packages/recipes/src/switch.recipe.ts`
- Create: `packages/recipes/src/validate-recipe.ts`
- Modify: `packages/recipes/src/index.ts`
- Create: `packages/recipes/test/*.test.ts`

- [ ] **Step 1: Define recipe contracts**

Each recipe must define root element rules, allowed slots, required states, optional states, required props, DOM budget, accessibility requirements, supported variants, supported targets, and forbidden patterns.

- [ ] **Step 2: Implement recipe validation**

Expose:

```ts
export function getRecipe(componentType: ComponentType): ComponentRecipe;
export function validateAgainstRecipe(schema: ComponentSchema): ValidationReport;
```

- [ ] **Step 3: Add focused tests**

Test missing `focusVisible` for Button/Input/Switch, invalid slot, invalid semantic root, and DOM budget definitions.

- [ ] **Step 4: Verify**

Run:

```bash
pnpm --filter @clean-ui/recipes test
pnpm typecheck
```

- [ ] **Step 5: Commit**

```bash
git add packages/recipes
git commit -m "feat(recipes): add MVP component recipes"
```

---

## Task 3: Compiler Core

**Files:**
- Create: `packages/compiler/src/compile.ts`
- Create: `packages/compiler/src/normalize.ts`
- Create: `packages/compiler/src/generated-file.ts`
- Create: `packages/compiler/src/manifest.ts`
- Create: `packages/compiler/src/adapter-registry.ts`
- Modify: `packages/compiler/src/index.ts`
- Create: `packages/compiler/test/*.test.ts`

- [ ] **Step 1: Add generated output models**

Implement `GeneratedFile`, `GeneratedManifest`, `GeneratedOutput`, `TargetAdapter`, and `CompileOptions` exactly around the schema/recipe contracts.

- [ ] **Step 2: Normalize schema**

`normalizeComponentSchema` should apply defaults deterministically, sort stable collections where appropriate, and reject unsupported target/component combinations.

- [ ] **Step 3: Add adapter registry**

Expose explicit registration and lookup. Unknown targets must fail with a stable error code.

- [ ] **Step 4: Compile without writing**

`compileComponent` must return generated output, manifest, and validation report. It must not write files.

- [ ] **Step 5: Verify deterministic output**

Add a test that compiles the same schema twice and compares byte-identical generated file content and manifest JSON.

- [ ] **Step 6: Commit**

```bash
git add packages/compiler
git commit -m "feat(compiler): compile schema into normalized output"
```

---

## Task 4: Validators

**Files:**
- Create: `packages/validators/src/clean-code-contract.ts`
- Create: `packages/validators/src/dom-budget.ts`
- Create: `packages/validators/src/state-coverage.ts`
- Create: `packages/validators/src/semantic-html.ts`
- Create: `packages/validators/src/dependency-manifest.ts`
- Create: `packages/validators/src/token-usage.ts`
- Modify: `packages/validators/src/index.ts`
- Create: `packages/validators/test/*.test.ts`

- [ ] **Step 1: Define report helpers**

Use stable `ValidationReport` and `ValidationCheck` helpers shared with schema/compiler.

- [ ] **Step 2: Implement required checks**

MVP checks: `schema-valid`, `component-name-valid`, `semantic-root`, `dom-budget`, `required-states`, `focus-visible`, `disabled-state`, `token-usage`, `dependency-manifest`, `generated-file-manifest`, `no-random-output`, `no-unapproved-overwrite`.

- [ ] **Step 3: Integrate with compiler**

Compiler output should include the validator report before CLI/MCP layers exist.

- [ ] **Step 4: Verify**

Run:

```bash
pnpm --filter @clean-ui/validators test
pnpm --filter @clean-ui/compiler test
```

- [ ] **Step 5: Commit**

```bash
git add packages/validators packages/compiler
git commit -m "feat(validators): implement clean code contract checks"
```

---

## Task 5: React CSS Adapter First Vertical Slice

**Files:**
- Create: `packages/adapters/react-css/src/index.ts`
- Create: `packages/adapters/react-css/src/button.ts`
- Create: `packages/adapters/react-css/src/css.ts`
- Create: `packages/adapters/react-css/test/button.test.ts`
- Create: `fixtures/button/glass-basic/expected.react-css.tsx`
- Create: `fixtures/button/glass-basic/expected.react-css.css`
- Create: `fixtures/button/glass-basic/expected.report.json`

- [ ] **Step 1: Implement Button only**

Generate `ComponentName.tsx`, `component-name.css`, `component-name.schema.json`, and `component-name.manifest.json`. Use semantic `button`, typed props, CSS variables, focus-visible, disabled, and loading behavior.

- [ ] **Step 2: Add golden tests**

Compare generated file content exactly against fixture output. Include a second run to prove deterministic output.

- [ ] **Step 3: Expand to Card, Badge, Input, Switch**

Add one component at a time with fixture updates and tests before moving to the next component.

- [ ] **Step 4: Verify**

Run:

```bash
pnpm --filter @clean-ui/adapter-react-css test
pnpm test:golden
pnpm typecheck
```

- [ ] **Step 5: Commit**

```bash
git add packages/adapters/react-css fixtures
git commit -m "feat(adapter-react-css): generate MVP components"
```

---

## Task 6: CLI Validate and Generate

**Files:**
- Create: `packages/cli/src/index.ts`
- Create: `packages/cli/src/commands/validate.ts`
- Create: `packages/cli/src/commands/generate.ts`
- Create: `packages/cli/src/commands/create.ts`
- Create: `packages/cli/src/commands/diff.ts`
- Create: `packages/cli/src/commands/write.ts`
- Create: `packages/cli/test/*.test.ts`

- [ ] **Step 1: Implement `validate` and `generate` first**

Both commands must support `--json`. `generate` must default to dry-run and never write files.

- [ ] **Step 2: Add `create`, `diff`, and `write`**

`write` is the only writing command. It must require `--out` and refuse to overwrite non-generated files by default.

- [ ] **Step 3: Add CLI tests**

Cover JSON output, invalid schema error, dry-run behavior, diff output, and unsafe overwrite refusal.

- [ ] **Step 4: Verify**

Run:

```bash
pnpm --filter @clean-ui/cli test
pnpm typecheck
```

- [ ] **Step 5: Commit**

```bash
git add packages/cli
git commit -m "feat(cli): add validate and generate workflow"
```

---

## Task 7: Remaining Adapters

**Files:**
- Create/modify: `packages/adapters/react-css-modules/src/*`
- Create/modify: `packages/adapters/react-tailwind/src/*`
- Create/modify: `packages/adapters/shadcn-registry/src/*`
- Create/modify: `packages/adapters/html-css/src/*`
- Create/modify: `fixtures/**/expected.*`

- [ ] **Step 1: Implement `html-css`**

Use this as the simplest non-React target and quick preview/export format.

- [ ] **Step 2: Implement `react-css-modules`**

Keep class naming deterministic and avoid globals except allowed variables.

- [ ] **Step 3: Implement `react-tailwind`**

Keep generated class strings readable. Use CSS variables for tokenized arbitrary values.

- [ ] **Step 4: Implement `shadcn-registry`**

Generate valid `registry-item.json`, explicit dependencies, registry dependencies, and configurable aliases.

- [ ] **Step 5: Verify each adapter before moving on**

Run package tests and golden tests after each adapter:

```bash
pnpm --filter @clean-ui/adapter-html-css test
pnpm --filter @clean-ui/adapter-react-css-modules test
pnpm --filter @clean-ui/adapter-react-tailwind test
pnpm --filter @clean-ui/adapter-shadcn-registry test
pnpm test:golden
```

- [ ] **Step 6: Commit per adapter**

Use one commit per adapter, for example:

```bash
git commit -m "feat(adapter-tailwind): generate MVP components"
```

---

## Task 8: MCP Server

**Files:**
- Create: `packages/mcp-server/src/index.ts`
- Create: `packages/mcp-server/src/tools/list-component-types.ts`
- Create: `packages/mcp-server/src/tools/get-component-schema.ts`
- Create: `packages/mcp-server/src/tools/create-component.ts`
- Create: `packages/mcp-server/src/tools/update-component.ts`
- Create: `packages/mcp-server/src/tools/validate-component.ts`
- Create: `packages/mcp-server/src/tools/generate-files.ts`
- Create: `packages/mcp-server/src/tools/get-diff.ts`
- Create: `packages/mcp-server/src/tools/write-files.ts`
- Create: `packages/mcp-server/test/*.test.ts`

- [ ] **Step 1: Expose required tools**

Tool names: `clean_ui_list_component_types`, `clean_ui_get_component_schema`, `clean_ui_create_component`, `clean_ui_update_component`, `clean_ui_validate_component`, `clean_ui_generate_files`, `clean_ui_get_diff`, `clean_ui_write_files`.

- [ ] **Step 2: Enforce MCP safety rules**

`generate_files` and `get_diff` must not write. `write_files` must require explicit output path and return manifest.

- [ ] **Step 3: Add JSON-safe tests**

Assert outputs are stable, serializable, compact, and use stable validation error codes.

- [ ] **Step 4: Verify**

Run:

```bash
pnpm --filter @clean-ui/mcp-server test
pnpm typecheck
```

- [ ] **Step 5: Commit**

```bash
git add packages/mcp-server
git commit -m "feat(mcp): expose safe component compiler tools"
```

---

## Task 9: Docs and Examples

**Files:**
- Modify: `README.md`
- Create: `docs/architecture.md`
- Create: `docs/clean-code-contract.md`
- Create: `docs/agent-interface.md`
- Create: `docs/adapters.md`
- Create: `docs/recipes.md`
- Create: `docs/security.md`
- Create: `docs/decisions/0001-schema-first-architecture.md`
- Create: `docs/decisions/0002-clean-code-contract.md`
- Create: `docs/decisions/0003-agent-first-mvp.md`
- Create: `examples/react-css`
- Create: `examples/react-tailwind`
- Create: `examples/shadcn-registry`
- Create: `examples/agent-workflow`

- [ ] **Step 1: Write README**

README must be developer-first and use the approved wording: deterministic, inspectable, validated code. It must not promise perfect code.

- [ ] **Step 2: Write architecture and contract docs**

Keep `AGENTS.md` compact. Put detailed design material in `docs/`.

- [ ] **Step 3: Add runnable examples**

Each example must run through schema -> dry-run generation -> validation report -> diff -> write where applicable.

- [ ] **Step 4: Verify docs/examples**

Run:

```bash
pnpm format:check
pnpm test
pnpm build
```

- [ ] **Step 5: Commit**

```bash
git add README.md docs examples
git commit -m "docs: document schema-first MVP workflow"
```

---

## Task 10: MVP Hardening

**Files:**
- Modify: packages as failures reveal
- Modify: fixtures as generated output changes intentionally
- Modify: docs when public behavior changes

- [ ] **Step 1: Run full gate**

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:golden
pnpm build
```

- [ ] **Step 2: Audit generated output**

Manually review representative Button/Input/Switch outputs for semantic roots, wrappers, focus-visible, disabled/loading states, tokens/CSS variables, dependency manifest, and no random output.

- [ ] **Step 3: Create first GitHub issues**

Create the ten issues listed in `TECHNICAL_SPEC_CODEX.md` section 24, unless they are already represented by project milestones.

- [ ] **Step 4: Prepare release-readiness summary**

Document:

```txt
Changed files:
Checks run:
Known gaps:
Next recommended step:
Dependency justifications:
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore(repo): harden MVP quality gate"
```

---

## Risks and Mitigations

- **Risk:** The project becomes too broad before a vertical slice exists.
  **Mitigation:** Finish `schema -> recipe -> compiler -> validator -> react-css Button -> CLI generate` before implementing all adapters.

- **Risk:** Codegen turns into fragile string concatenation.
  **Mitigation:** Use typed builders and small deterministic templates covered by golden tests; use AST tools where string templates become hard to validate.

- **Risk:** Validators are delayed until after adapters.
  **Mitigation:** Implement validator report shape early and integrate checks before broad adapter work.

- **Risk:** MCP or CLI writes unsafe files.
  **Mitigation:** Make dry-run the default and centralize write safety in shared utilities used by both CLI and MCP.

- **Risk:** Dependencies accumulate without clear value.
  **Mitigation:** Keep dependency justifications in task summaries and manifests.

## Recommended Execution Order

1. Task 0 bootstrap.
2. Task 1 schema core.
3. Task 2 recipes.
4. Task 3 compiler core.
5. Task 4 validators.
6. Task 5 react-css adapter as the first vertical slice.
7. Task 6 CLI validate/generate/diff/write.
8. Task 7 remaining adapters.
9. Task 8 MCP server.
10. Task 9 docs/examples.
11. Task 10 hardening.

## First Milestone

The first useful milestone is not the full MVP. It is:

```txt
Button schema fixture
→ recipe validation
→ compiler normalization
→ react-css generated files
→ validation report
→ CLI generate --dry-run --json
→ golden tests passing
```

This proves the architecture before multiplying component and adapter work.
