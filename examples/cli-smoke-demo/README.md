# CLI Smoke Demo

This example exercises the first inspectable user path:

```txt
schema fixture -> validate -> diff -> write -> static preview
```

The generated output is intentionally ignored by Git. Run the commands from this directory.

## Local repo command

```bash
pnpm --dir ../.. build
node ../../packages/cli/dist/index.js validate button.schema.json --json
node ../../packages/cli/dist/index.js diff button.schema.json --target react-css --out generated --json
node ../../packages/cli/dist/index.js write button.schema.json --target react-css --out generated --json
```

Then open `preview.html` in a browser. It loads `generated/demo-button.css` and renders semantic
button markup that matches the generated class contract.

`write` refuses to overwrite existing files. To rerun the write step, clear the generated component
files first or choose a fresh output directory.

## Installed CLI shape

```bash
clean-ui validate button.schema.json --json
clean-ui diff button.schema.json --target react-css --out generated --json
clean-ui write button.schema.json --target react-css --out generated --json
```

Expected generated files:

```txt
generated/DemoButton.tsx
generated/demo-button.css
generated/demo-button.schema.json
generated/demo-button.manifest.json
```

This is not a production component gallery. It is a smoke demo that proves the compiler can turn a
strict schema into deterministic, inspectable, validated code, show a diff, and write files only
through an explicit command.
