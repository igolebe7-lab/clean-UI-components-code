# Clean UI Components Code

Open-source component compiler for AI coding agents.

Agents describe UI components through a strict schema. The compiler generates React,
Tailwind, shadcn-compatible, and HTML/CSS code, validates it, shows a diff, and only then
writes files.

Clean UI Components Code does not promise perfect code. It promises deterministic,
inspectable, validated code.

## MVP Scope

- Components: Button, Card, Badge, Input, Switch.
- Targets: react-css, react-css-modules, react-tailwind, shadcn-registry, html-css.
- Interfaces: TypeScript packages, CLI, MCP server, examples, fixtures, docs.

## Current Status

This repository is being bootstrapped from the schema-first technical specification.

## Try the CLI smoke demo

The first demo path is available in `examples/cli-smoke-demo`:

```bash
cd examples/cli-smoke-demo
pnpm --dir ../.. build
node ../../packages/cli/dist/index.js validate button.schema.json --json
node ../../packages/cli/dist/index.js diff button.schema.json --target react-css --out generated --json
node ../../packages/cli/dist/index.js write button.schema.json --target react-css --out generated --json
```

Open `preview.html` after `write` to inspect the generated `react-css` button output.
