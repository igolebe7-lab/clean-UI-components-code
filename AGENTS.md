# AGENTS.md

Repository: `https://github.com/igolebe7-lab/clean-UI-components-code.git`

This file is the working contract for Codex and other AI coding agents. Keep it compact. Add detailed explanations to `docs/`, not here.

---

## Product in one paragraph

Clean UI Components Code is an open-source schema-first compiler for AI coding agents. Agents do **not** write final UI component files directly. Agents create or update a strict component schema; the compiler generates React/Tailwind/shadcn-compatible files, validates them, returns a manifest and diff, and writes files only through an explicit write command.

Core pipeline:

```txt
Intent → Component schema → Recipe → Target adapter → Generated files → Quality gate → Diff → Write
```

---

## Current MVP scope

Build only this scope unless the user explicitly changes it:

- Components: `Button`, `Card`, `Badge`, `Input`, `Switch`.
- Targets: `react-css`, `react-css-modules`, `react-tailwind`, `shadcn-registry`, `html-css`.
- Interfaces: TypeScript packages, CLI, MCP server, examples, fixtures, docs.
- Visual editor is not core MVP. Do not build a Figma/Webflow-style canvas yet.

---

## Non-goals

Do not turn this project into:

- a Figma replacement;
- a Webflow/Framer replacement;
- a generic prompt-to-code generator;
- a full app builder;
- a universal adapter for every UI library;
- a no-code product;
- a canvas-first editor;
- a system where the LLM freely writes arbitrary final component files.

---

## Architecture rules

The source of truth is the component schema, not prompt text, canvas state, or generated files.

Preferred architecture:

```txt
packages/schema      → public schema/types/runtime validation
packages/recipes     → component constraints and defaults
packages/compiler    → normalize, compile, manifest, adapter registry
packages/adapters/*  → target-specific codegen
packages/validators  → Clean Code Contract checks
packages/cli         → local agent/developer interface
packages/mcp-server  → agent tool interface
packages/renderer    → optional preview/render utilities
packages/tokens      → token model and resolution
packages/shared      → shared errors/results/path utilities
packages/test-utils  → fixture/golden/temp-project helpers
```

Do not introduce cross-package cycles. Lower-level packages must not import higher-level packages.

Dependency direction:

```txt
schema → recipes → compiler → adapters/validators → cli/mcp-server
```

---

## Clean Code Contract

Generated code is acceptable only if it passes the quality gate.

Required checks:

- schema validation;
- deterministic output;
- TypeScript strict check;
- format check;
- lint check;
- semantic HTML;
- DOM budget;
- token/CSS variable usage;
- required state coverage;
- explicit dependency manifest;
- generated file manifest;
- diff before write.

Never claim “perfect code”. Use this wording:

```txt
Deterministic, inspectable, validated code.
```

---

## Generated code rules

Generated components must be small, boring, and maintainable.

Rules:

- Use semantic roots: `button` for buttons, `input` for inputs, `span` for simple badges.
- Avoid useless wrapper elements.
- Do not use random names like `Frame123` or `GeneratedComponent1`.
- Use typed props and explicit variants.
- Use tokens/CSS variables for visual parameters.
- Do not hide runtime dependencies.
- Do not mix styling systems without target-specific reason.
- Do not write inline styles except for explicitly parameterized CSS variables.
- Include `focus-visible` for interactive components.
- Include disabled/loading behavior when supported by schema.
- Keep generated output deterministic: no timestamps, random IDs, absolute local paths.

---

## Repository structure to create

Use this initial structure:

```txt
AGENTS.md
README.md
LICENSE
package.json
pnpm-workspace.yaml
tsconfig.base.json
biome.json
.github/workflows/ci.yml
apps/docs
apps/web
packages/schema
packages/recipes
packages/compiler
packages/adapters/react-css
packages/adapters/react-css-modules
packages/adapters/react-tailwind
packages/adapters/shadcn-registry
packages/adapters/html-css
packages/validators
packages/cli
packages/mcp-server
packages/renderer
packages/tokens
packages/shared
packages/test-utils
fixtures/
examples/
docs/
```

If a package grows complex, add a nested `AGENTS.md` with package-specific instructions. Keep nested files shorter than this one.

---

## Commands

Prefer `pnpm`.

Expected root commands after bootstrap:

```bash
pnpm install
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:golden
pnpm build
```

CLI commands to implement:

```bash
clean-ui init
clean-ui create button --name PremiumButton --target shadcn-registry --preset glass --dry-run
clean-ui validate ./PremiumButton.schema.json
clean-ui generate ./PremiumButton.schema.json --target react-css --dry-run
clean-ui diff ./PremiumButton.schema.json --target shadcn-registry --out ./src/components/ui
clean-ui write ./PremiumButton.schema.json --target shadcn-registry --out ./src/components/ui
```

All CLI commands that agents use must support `--json`.

---

## Git workflow

Main branch: `main`.

Use small branches:

```txt
chore/bootstrap-monorepo
feat/schema-core
feat/button-recipe
feat/react-css-adapter
feat/cli-generate
feat/mcp-server
fix/validator-dom-budget
```

Use Conventional Commits:

```txt
feat(schema): add component schema primitives
feat(adapter-react-css): generate button component
fix(validators): detect missing focus-visible state
chore(repo): bootstrap pnpm workspace
```

Before finishing any coding task, report:

```txt
Changed files:
Checks run:
Known gaps:
Next recommended step:
```

---

## Token and context discipline

Optimize for low token usage.

Do:

- Read this file once at the start.
- Use `git status --short` before edits.
- Use targeted search before opening files.
- Prefer symbol-level inspection over full-file reads.
- Read only the necessary file ranges.
- Summarize large outputs instead of pasting them.
- Keep task plans short: objective, files, tests, risks.
- Keep implementation steps small and reviewable.
- Update docs only where behavior changed.

Do not:

- Read the entire repository into context.
- Paste full generated files into chat unless asked.
- Run broad commands that produce huge output without filtering.
- Re-open files you already summarized unless they changed.
- Add long architectural essays to this file.
- Add dependencies without a short justification.

---

## Serena usage

Use Serena when available for semantic code navigation and editing.

Use Serena for:

- finding symbols/classes/functions/types;
- finding references;
- understanding cross-file relationships;
- safe rename/refactor;
- replacing symbol bodies;
- avoiding expensive full-file reads;
- monorepo navigation.

Prefer Serena before broad `grep`/full-file reads for code tasks. Use normal shell tools for simple file listings, exact filename searches, tests, and small text edits.

---

## Context7 usage

Use Context7 only for external library/API documentation or version-sensitive implementation details.

Good Context7 use cases:

- TypeScript compiler/AST APIs;
- Zod/JSON Schema integration;
- Biome/ESLint/Prettier configuration;
- shadcn registry item format;
- Tailwind syntax;
- Storybook stories/testing;
- Playwright screenshots;
- MCP SDK/tool definitions;
- Commander or CLI framework APIs;
- tsup/Vite configuration.

Do not use Context7 for internal project code. Use repository files and Serena for that.

When using Context7, ask for the exact library/topic/version and keep retrieved docs minimal.

---

## Superpowers usage

Use Superpowers for non-trivial work, not for tiny edits.

Use it for:

- refining unclear requirements;
- creating implementation plans;
- TDD workflow;
- splitting a large task into small subtasks;
- code review after implementation.

Keep Superpowers outputs short and task-scoped. Do not let methodology documents crowd out the actual repository context.

---

## MCP server rules

MCP tools must be safe for agents.

Required MVP tools:

```txt
clean_ui_list_component_types
clean_ui_get_component_schema
clean_ui_create_component
clean_ui_update_component
clean_ui_validate_component
clean_ui_generate_files
clean_ui_get_diff
clean_ui_write_files
```

Rules:

- `generate_files` must not write files.
- `get_diff` must not write files.
- `write_files` is the only writing tool.
- `write_files` requires explicit output path.
- Overwrite is forbidden by default.
- Tool outputs must be JSON-safe and stable.
- Validation errors must have stable `code` values.
- Tool descriptions must be compact and clear.

---

## Testing rules

Add or update tests with every behavior change.

Required test types:

- unit tests for schema/recipes/compiler/validators;
- golden tests for generated output;
- CLI tests for command behavior;
- MCP tool tests for safe tool outputs;
- generated-code typecheck tests.

Golden fixtures live under `fixtures/` and must include:

```txt
input.schema.json
expected.*
expected.report.json
```

If generated output changes intentionally, update fixtures in the same commit and explain why.

---

## Documentation rules

README is for humans. `AGENTS.md` is for agents. Detailed design docs go in `docs/`.

Update docs when public behavior changes:

```txt
docs/architecture.md
docs/clean-code-contract.md
docs/agent-interface.md
docs/adapters.md
docs/recipes.md
docs/security.md
docs/decisions/*.md
```

Use ADRs for major decisions:

```txt
docs/decisions/0001-schema-first-architecture.md
```

---

## Security and write safety

Default behavior must be safe.

- Dry-run by default for generation.
- Write only via explicit `write` command/tool.
- Never overwrite non-generated files by default.
- Return diff before write.
- Return generated file manifest.
- No network required for compiler operation.
- Dependencies must be explicit in manifest.
- Do not store secrets in examples or fixtures.

---

## Dependency policy

Before adding a dependency, answer in the PR/task summary:

```txt
Why needed:
Alternatives considered:
Runtime or dev dependency:
Impact on generated output:
```

Prefer small, stable libraries. Avoid dependencies in generated components unless required by the selected adapter.

---

## First implementation order

Recommended order:

1. Bootstrap pnpm monorepo.
2. Add schema package.
3. Add recipes package.
4. Add compiler core.
5. Add validators.
6. Add `react-css` adapter for Button.
7. Add golden tests.
8. Add CLI `validate` and `generate`.
9. Add `react-tailwind` adapter.
10. Add `shadcn-registry` adapter.
11. Add MCP server.
12. Add docs/examples.

Do not start with the visual editor.

---

## Final response format for agents

When finishing a task, respond with:

```txt
Summary:
- ...

Files changed:
- ...

Checks run:
- ...

Known gaps:
- ...

Next step:
- ...
```

Keep it concise.
