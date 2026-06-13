# ТЗ для Codex: Clean UI Components Code

**Репозиторий:** `https://github.com/igolebe7-lab/clean-UI-components-code.git`  
**Рабочее имя продукта:** `Clean UI Components Code` / `Component Forge`  
**Тип проекта:** open-source developer tool для AI coding agents  
**Основной фокус MVP:** генерация проверяемого, чистого UI-кода через строгую schema-first архитектуру  
**Основной пользователь:** AI coding agent, который работает в существующем frontend-репозитории  
**Вторичный пользователь:** frontend-разработчик, который хочет контролируемо получать production-ready UI-компоненты

---

## 1. Краткое описание продукта

Clean UI Components Code — это open-source schema-first compiler для AI coding agents, который помогает генерировать чистые, типизированные, токенизированные UI-компоненты.

Продукт **не просит LLM писать финальные `.tsx`/`.css` файлы напрямую**. Вместо этого агент описывает компонент через строгую JSON/TypeScript schema. Затем compiler:

1. валидирует schema;
2. нормализует компонентную модель;
3. применяет recipe конкретного компонента;
4. передаёт модель в target adapter;
5. генерирует файлы через детерминированный codegen;
6. форматирует результат;
7. запускает quality checks;
8. возвращает manifest, validation report и diff;
9. пишет файлы только отдельной явной командой.

Главная продуктовая формула:

```txt
Agent intent → Component schema → Compiler → Quality gate → Diff → Write
```

---

## 2. Почему продукт существует

AI coding agents хорошо понимают намерение пользователя, но при прямой генерации UI-кода часто создают нестабильный результат:

- лишние wrapper-элементы;
- слабая типизация props;
- hardcoded colors и magic numbers;
- смешивание Tailwind, inline styles и CSS без системы;
- отсутствие `focus-visible`, `disabled`, `loading`, `reduced-motion` states;
- неявные dependencies;
- отсутствие Storybook stories;
- отсутствие reusable schema;
- код, который выглядит хорошо один раз, но плохо поддерживается.

Наш продукт решает это не “лучшим промптом”, а инженерным pipeline:

```txt
Strict schema
→ deterministic compiler
→ open adapters
→ clean-code validator
→ generated file manifest
→ human-readable diff
```

---

## 3. Позиционирование

### 3.1. Основное позиционирование

```txt
Open-source component compiler for AI coding agents.
Generate validated React/Tailwind/shadcn UI components without letting the LLM write final UI files directly.
```

По-русски:

```txt
Опенсорсный компилятор UI-компонентов для ИИ-агентов: агент описывает компонент через schema, compiler генерирует и проверяет код.
```

### 3.2. Что продукт НЕ делает

Продукт не является:

- Figma replacement;
- Webflow/Framer replacement;
- generic prompt-to-code generator;
- full app builder;
- универсальным адаптером для всех UI-библиотек;
- no-code платформой;
- визуальным canvas-first редактором;
- инструментом, который разрешает LLM свободно писать arbitrary component files.

### 3.3. Главная дифференциация

Не “AI генерирует чистый код”, а:

```txt
AI agent describes. Compiler generates. Validator proves. User reviews diff.
```

---

## 4. MVP scope

### 4.1. Поддерживаемые компоненты MVP

MVP поддерживает только маленькие reusable UI-компоненты:

1. `Button`
2. `Card`
3. `Badge`
4. `Input`
5. `Switch`

Позже можно добавить:

- `Alert`
- `Toast skin`
- `Avatar`
- `Tabs skin`
- `Loader`
- `Skeleton`
- `ButtonGroup`
- `Command/Search input`

### 4.2. Target adapters MVP

MVP target adapters:

1. `react-css`
   - React + TypeScript + plain CSS file.
2. `react-css-modules`
   - React + TypeScript + CSS Modules.
3. `react-tailwind`
   - React + TypeScript + Tailwind classes where appropriate.
4. `shadcn-registry`
   - shadcn-compatible component files + `registry-item.json`.
5. `html-css`
   - static HTML + CSS for quick preview/export.

### 4.3. Интерфейсы MVP

MVP включает:

1. Core schema package.
2. Recipe package.
3. Compiler package.
4. Adapter packages.
5. Validator package.
6. CLI package.
7. MCP server package.
8. Fixtures/golden tests.
9. Examples.
10. Минимальный docs/README.

Визуальный редактор НЕ входит в обязательный MVP. Допускается простой preview/render package без полноценного drag-and-drop.

---

## 5. Clean Code Contract

“Чистый код” в этом проекте — не маркетинговое обещание, а проверяемый контракт.

Сгенерированный компонент считается clean только если он проходит quality gate.

### 5.1. Обязательные проверки MVP

Quality gate MVP:

| Проверка | Описание | Статус MVP |
|---|---|---|
| Schema validation | входная schema соответствует JSON Schema/Zod schema | required |
| Deterministic output | одинаковый input даёт одинаковый output | required |
| TypeScript strict | generated TS/TSX проходит strict typecheck | required |
| Formatting | generated files проходят formatter check | required |
| Linting | generated files проходят lint rules | required |
| Semantic HTML | root element соответствует семантике компонента | required |
| DOM budget | компонент не превышает лимит DOM nodes | required |
| Token usage | стили используют tokens/CSS variables, где нужно | required |
| State coverage | обязательные states описаны и экспортированы | required |
| Dependency manifest | зависимости явно указаны | required |
| File manifest | все generated files перечислены | required |
| Diff before write | запись файлов только после просмотра diff | required |

### 5.2. Optional checks после MVP

- Playwright visual screenshot comparison.
- Storybook visual tests.
- axe-core accessibility checks.
- Bundle/runtime size budget.
- CSS unused rules check.
- Cross-theme visual checks.
- Dark mode state matrix.
- Reduced motion checks.

### 5.3. Формулировка гарантии

Нельзя обещать “идеальный код”. В README и CLI писать так:

```txt
Component Forge does not promise perfect code.
It promises deterministic, inspectable, validated code.
```

---

## 6. Главная архитектура

### 6.1. Источник правды

Источник правды — **component schema**, а не canvas, prompt или generated files.

```txt
component.schema.json
        ↓
normalized component model
        ↓
recipe validation
        ↓
target adapter
        ↓
generated files
        ↓
quality gate
```

### 6.2. Нельзя делать

- Нельзя генерировать финальный UI-код напрямую из prompt.
- Нельзя хранить главный state только в canvas.
- Нельзя делать codegen через хаотичные строковые склейки.
- Нельзя писать файлы в проект без dry-run/diff режима.
- Нельзя добавлять dependencies без manifest.
- Нельзя поддерживать новый target без validator/golden tests.

### 6.3. Можно делать

- Agent может создать или изменить schema.
- CLI/MCP может сгенерировать files в dry-run.
- Validator может вернуть machine-readable errors.
- Agent может исправить schema по validation report.
- Только отдельная команда `write` пишет файлы.

---

## 7. Monorepo и git-структура

### 7.1. Репозиторий

```bash
git clone https://github.com/igolebe7-lab/clean-UI-components-code.git
cd clean-UI-components-code
```

Репозиторий на момент подготовки ТЗ пустой. Нужно создать структуру с нуля.

### 7.2. Package manager и workspace

Использовать:

- `pnpm`
- `TypeScript`
- `Vitest`
- `ESLint` или `Biome` для lint/format; предпочтение для MVP: `Biome` как быстрый единый formatter/linter, если не конфликтует с требуемыми rules.
- `tsup` или `rollup` для package builds; предпочтение MVP: `tsup`.
- `turbo` опционально; подключать только если workspace scripts становятся неудобными.

### 7.3. Начальная структура репозитория

```txt
clean-UI-components-code/
  AGENTS.md
  README.md
  LICENSE
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
  tsconfig.json
  biome.json
  .gitignore
  .npmrc
  .changeset/
  .github/
    workflows/
      ci.yml
      release.yml
    ISSUE_TEMPLATE/
      bug_report.yml
      feature_request.yml
    pull_request_template.md
  apps/
    docs/
      package.json
      src/
    web/
      package.json
      src/
  packages/
    schema/
      package.json
      src/
        index.ts
        component-schema.ts
        token-schema.ts
        validation.ts
      test/
    recipes/
      package.json
      src/
        index.ts
        button.recipe.ts
        card.recipe.ts
        badge.recipe.ts
        input.recipe.ts
        switch.recipe.ts
      test/
    compiler/
      package.json
      src/
        index.ts
        compile.ts
        normalize.ts
        generated-file.ts
        manifest.ts
      test/
    adapters/
      react-css/
        package.json
        src/
        test/
      react-css-modules/
        package.json
        src/
        test/
      react-tailwind/
        package.json
        src/
        test/
      shadcn-registry/
        package.json
        src/
        test/
      html-css/
        package.json
        src/
        test/
    validators/
      package.json
      src/
        index.ts
        clean-code-contract.ts
        dom-budget.ts
        state-coverage.ts
        semantic-html.ts
        dependency-manifest.ts
        token-usage.ts
      test/
    cli/
      package.json
      src/
        index.ts
        commands/
          init.ts
          create.ts
          validate.ts
          generate.ts
          diff.ts
          write.ts
      test/
    mcp-server/
      package.json
      src/
        index.ts
        tools/
          list-component-types.ts
          get-component-schema.ts
          create-component.ts
          update-component.ts
          validate-component.ts
          generate-files.ts
          get-diff.ts
          write-files.ts
      test/
    renderer/
      package.json
      src/
        index.ts
        render-preview.ts
      test/
    tokens/
      package.json
      src/
        index.ts
        default-tokens.ts
        token-resolver.ts
      test/
    shared/
      package.json
      src/
        index.ts
        result.ts
        errors.ts
        fs.ts
        path.ts
    test-utils/
      package.json
      src/
        golden.ts
        fixtures.ts
        temp-project.ts
  fixtures/
    button/
      glass-basic/
        input.schema.json
        expected.react-css.tsx
        expected.react-css.css
        expected.react-tailwind.tsx
        expected.shadcn.registry-item.json
        expected.report.json
    card/
      basic/
    badge/
      status/
    input/
      error/
    switch/
      basic/
  examples/
    react-css/
    react-css-modules/
    react-tailwind/
    shadcn-registry/
    agent-workflow/
  docs/
    architecture.md
    clean-code-contract.md
    agent-interface.md
    adapters.md
    recipes.md
    security.md
    decisions/
      0001-schema-first-architecture.md
      0002-clean-code-contract.md
      0003-agent-first-mvp.md
```

### 7.4. Package naming

Использовать namespace:

```txt
@clean-ui/schema
@clean-ui/recipes
@clean-ui/compiler
@clean-ui/adapter-react-css
@clean-ui/adapter-react-css-modules
@clean-ui/adapter-react-tailwind
@clean-ui/adapter-shadcn-registry
@clean-ui/adapter-html-css
@clean-ui/validators
@clean-ui/cli
@clean-ui/mcp-server
@clean-ui/renderer
@clean-ui/tokens
@clean-ui/shared
@clean-ui/test-utils
```

---

## 8. Component schema

### 8.1. Формат

Schema должна быть доступна в трёх формах:

1. TypeScript types.
2. Runtime validator.
3. JSON Schema для агентов и внешних инструментов.

MVP recommendation:

- использовать `zod` для runtime validation;
- генерировать JSON Schema из Zod или вручную поддерживать JSON Schema, если генерация окажется нестабильной;
- все public schema types экспортировать из `@clean-ui/schema`.

### 8.2. Базовая структура schema

```ts
export type ComponentSchema = {
  schemaVersion: '0.1.0';
  id: string;
  name: string;
  type: 'button' | 'card' | 'badge' | 'input' | 'switch';
  description?: string;
  targetHints?: TargetId[];
  tokens: TokenMap;
  props: PropDefinition[];
  variants: VariantDefinition[];
  slots: SlotDefinition[];
  states: StateDefinition[];
  accessibility?: AccessibilityDefinition;
  output?: OutputDefinition;
};
```

### 8.3. Token model

Минимум:

```ts
export type TokenValue =
  | { kind: 'css-var'; value: string }
  | { kind: 'color'; value: string }
  | { kind: 'dimension'; value: string }
  | { kind: 'shadow'; value: string }
  | { kind: 'duration'; value: string }
  | { kind: 'easing'; value: string }
  | { kind: 'raw'; value: string };
```

Правила:

- Hardcoded values допускаются только внутри schema/tokens.
- Generated component должен использовать CSS variables или token references.
- Validator должен уметь предупреждать о hardcoded colors в component styles.

### 8.4. Props model

```ts
export type PropDefinition = {
  name: string;
  type: 'boolean' | 'string' | 'enum' | 'slot' | 'css-length';
  required?: boolean;
  default?: unknown;
  values?: string[];
  description?: string;
};
```

### 8.5. Variants model

```ts
export type VariantDefinition = {
  name: string;
  values: string[];
  default: string;
};
```

MVP variants:

- `variant`: `solid`, `outline`, `ghost`, `glass`, `destructive`.
- `size`: `sm`, `md`, `lg`.

### 8.6. States model

MVP states:

```txt
default
hover
active
focusVisible
disabled
loading
selected
invalid
```

Required state coverage by component:

| Component | Required states |
|---|---|
| Button | default, hover, active, focusVisible, disabled; loading if prop exists |
| Card | default; hover if interactive |
| Badge | default |
| Input | default, focusVisible, disabled, invalid |
| Switch | default, focusVisible, disabled, checked |

---

## 9. Recipes

Recipe — это ограничитель и контракт компонента.

Recipe определяет:

- допустимые root elements;
- обязательные states;
- допустимые slots;
- DOM budget;
- accessibility requirements;
- default props;
- supported variants;
- supported targets;
- forbidden patterns.

### 9.1. Button recipe MVP

```ts
export const buttonRecipe = {
  type: 'button',
  root: 'button',
  allowedSlots: ['leftIcon', 'children', 'rightIcon', 'loader'],
  requiredStates: ['default', 'hover', 'active', 'focusVisible', 'disabled'],
  optionalStates: ['loading'],
  requiredProps: ['variant', 'size', 'loading'],
  maxDomNodes: {
    default: 1,
    withIcon: 3,
    loading: 3,
  },
  accessibility: {
    requiresSemanticRoot: true,
    requiresDisabledHandling: true,
    requiresFocusVisible: true,
  },
};
```

### 9.2. Card recipe MVP

- Root: `div` or `article` depending on semantic hint.
- Slots: `header`, `title`, `description`, `content`, `footer`, `media`.
- Required state: `default`.
- Optional: `hover`, `selected`, `interactive`.
- DOM budget depends on enabled slots.

### 9.3. Badge recipe MVP

- Root: `span` by default.
- Optional root: `a` if clickable link.
- Variants: `default`, `secondary`, `outline`, `destructive`, `success`, `warning`.
- Required state: `default`.

### 9.4. Input recipe MVP

- Root render: wrapper + `input` only when label/description/error slots are enabled.
- Must support `id`, `name`, `disabled`, `aria-invalid`, `aria-describedby`.
- Required states: `default`, `focusVisible`, `disabled`, `invalid`.

### 9.5. Switch recipe MVP

- Prefer accessible primitive or semantic button with `role="switch"` and `aria-checked` if no external dependency.
- If using Radix target, dependency must be explicit.
- Required states: `default`, `checked`, `focusVisible`, `disabled`.

---

## 10. Codegen

### 10.1. Общие правила codegen

1. Codegen должен быть deterministic.
2. Один и тот же schema input должен давать byte-stable output после format.
3. Generated files не должны содержать timestamps, random IDs или machine-specific paths.
4. Imports должны быть отсортированы.
5. Неиспользуемые imports запрещены.
6. Component names должны быть human-readable.
7. Нельзя использовать `Frame123`, `Rectangle42`, `GeneratedComponent1`.
8. Generated code должен быть small and boring.

### 10.2. AST-first подход

Не строить production code через хаотичные template strings.

Допустимо:

- TypeScript AST / Babel AST / ts-morph для TS/TSX.
- PostCSS AST для CSS.
- JSON serialization для manifest/registry/schema.
- Маленькие typed templates для стабильных boilerplate-фрагментов, если они покрыты golden tests.

### 10.3. Generated file model

```ts
export type GeneratedFile = {
  path: string;
  kind: 'component' | 'style' | 'schema' | 'story' | 'registry' | 'readme' | 'manifest' | 'test';
  language: 'ts' | 'tsx' | 'css' | 'json' | 'md' | 'html';
  content: string;
  overwritePolicy: 'never' | 'if-generated' | 'always-with-approval';
};
```

### 10.4. Manifest model

```ts
export type GeneratedManifest = {
  componentId: string;
  target: TargetId;
  files: GeneratedFile[];
  dependencies: string[];
  devDependencies: string[];
  registryDependencies: string[];
  checks: ValidationCheck[];
};
```

---

## 11. Target adapters

### 11.1. Adapter interface

```ts
export type TargetAdapter = {
  id: TargetId;
  displayName: string;
  supports(component: ComponentSchema): boolean;
  generate(model: NormalizedComponentModel): Promise<GeneratedOutput> | GeneratedOutput;
  validate?(output: GeneratedOutput): Promise<ValidationReport> | ValidationReport;
};
```

### 11.2. `react-css`

Output:

```txt
ComponentName.tsx
component-name.css
component-name.schema.json
component-name.manifest.json
```

Rules:

- `React` + TypeScript.
- Styles in external CSS.
- CSS variables for tokens.
- No Tailwind.
- No shadcn-specific imports.

### 11.3. `react-css-modules`

Output:

```txt
ComponentName.tsx
ComponentName.module.css
component-name.schema.json
component-name.manifest.json
```

Rules:

- CSS Modules.
- Typed class naming convention.
- No global classes except allowed reset variables.

### 11.4. `react-tailwind`

Output:

```txt
ComponentName.tsx
component-name.schema.json
component-name.manifest.json
```

Rules:

- Tailwind classes allowed.
- CSS variables allowed inside arbitrary values if stable.
- Avoid unreadable class soup; for complex effects generate CSS file or split constants.
- Generated code must remain maintainable.

### 11.5. `shadcn-registry`

Output:

```txt
components/ui/component-name.tsx
components/ui/component-name.css OR styles in existing app CSS if requested
component-name.schema.json
component-name.stories.tsx optional
registry-item.json
component-name.manifest.json
```

Rules:

- Must generate valid `registry-item.json`.
- Must declare `dependencies`, `devDependencies`, `registryDependencies`.
- Must respect shadcn conventions where possible: `cn`, CSS variables, registry item metadata.
- Must not assume project aliases without config. If alias unknown, use configurable alias in schema/output config.

### 11.6. `html-css`

Output:

```txt
component-name.html
component-name.css
component-name.schema.json
```

Use cases:

- quick preview;
- docs examples;
- non-React environments.

---

## 12. Validators

### 12.1. Validation report

```ts
export type ValidationReport = {
  status: 'passed' | 'failed' | 'warning';
  target?: TargetId;
  checks: ValidationCheck[];
  summary: {
    errors: number;
    warnings: number;
    passed: number;
  };
};

export type ValidationCheck = {
  code: string;
  status: 'passed' | 'failed' | 'warning';
  severity: 'info' | 'warning' | 'error';
  message: string;
  path?: string;
  details?: unknown;
  suggestedFix?: unknown;
};
```

### 12.2. Required validator checks

MVP validators:

1. `schema-valid`
2. `component-name-valid`
3. `semantic-root`
4. `dom-budget`
5. `required-states`
6. `focus-visible`
7. `disabled-state`
8. `token-usage`
9. `dependency-manifest`
10. `generated-file-manifest`
11. `no-random-output`
12. `no-unapproved-overwrite`

### 12.3. Example machine-readable error

```json
{
  "severity": "error",
  "code": "missing-focus-visible",
  "status": "failed",
  "message": "Interactive component must define a visible focus state.",
  "path": "states.focusVisible",
  "suggestedFix": {
    "outline": "2px solid var(--ring)",
    "outlineOffset": "2px"
  }
}
```

---

## 13. CLI

### 13.1. CLI package

Package: `@clean-ui/cli`  
Binary: `clean-ui`  
Optional alias later: `ui-forge`

### 13.2. Commands MVP

```bash
clean-ui init
clean-ui create button --name PremiumButton --target shadcn-registry --preset glass --dry-run
clean-ui validate ./components/PremiumButton.schema.json
clean-ui generate ./components/PremiumButton.schema.json --target react-css --dry-run
clean-ui diff ./components/PremiumButton.schema.json --target shadcn-registry --out ./src/components/ui
clean-ui write ./components/PremiumButton.schema.json --target shadcn-registry --out ./src/components/ui
```

### 13.3. CLI behavior

- `create` returns schema and optional generated files in dry-run.
- `generate` never writes by default.
- `write` is the only command that writes generated files.
- `write` must refuse to overwrite non-generated files unless explicit flag is set.
- All commands support `--json` for agents.
- Errors must be machine-readable with stable error codes.

### 13.4. CLI JSON output example

```json
{
  "status": "failed",
  "command": "generate",
  "files": [],
  "report": {
    "summary": {
      "errors": 1,
      "warnings": 0,
      "passed": 8
    },
    "checks": [
      {
        "code": "missing-focus-visible",
        "status": "failed",
        "severity": "error",
        "message": "Interactive component must define a visible focus state.",
        "path": "states.focusVisible"
      }
    ]
  }
}
```

---

## 14. MCP server

### 14.1. Назначение

MCP server нужен, чтобы AI agents могли использовать compiler как инструмент, а не писать файлы напрямую.

Package: `@clean-ui/mcp-server`

### 14.2. MCP tools MVP

Tool names должны быть короткими, стабильными и понятными:

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

### 14.3. Tool descriptions

Descriptions должны быть компактными, чтобы не раздувать контекст. Каждый tool description должен включать:

- purpose;
- when to use;
- when not to use;
- key inputs;
- output shape.

### 14.4. MCP safety rules

- `generate_files` не пишет файлы.
- `get_diff` не пишет файлы.
- `write_files` — отдельный инструмент.
- `write_files` требует explicit output path.
- `write_files` возвращает manifest.
- Overwrite должен быть запрещён по умолчанию.
- No network by default.

---

## 15. Examples and fixtures

### 15.1. Fixtures обязательны

Каждый component/adapter должен иметь golden fixtures.

Пример:

```txt
fixtures/button/glass-basic/
  input.schema.json
  expected.react-css.tsx
  expected.react-css.css
  expected.react-tailwind.tsx
  expected.shadcn.registry-item.json
  expected.report.json
```

### 15.2. Golden tests

Golden tests должны проверять:

- generated files match expected output;
- output стабильный;
- output проходит validation;
- invalid schema возвращает ожидаемые errors.

### 15.3. Examples

Examples должны быть runnable:

```txt
examples/react-css
examples/react-tailwind
examples/shadcn-registry
examples/agent-workflow
```

`examples/agent-workflow` должен показывать сценарий:

```txt
agent creates schema → compiler dry-run → validation report → diff → write
```

---

## 16. README требования

README должен быть скептичным и developer-first.

### 16.1. README opening

```md
# Clean UI Components Code

Open-source component compiler for AI coding agents.

Agents describe UI components through a strict schema.
The compiler generates React, Tailwind and shadcn-compatible code,
validates it, shows a diff, and only then writes files.
```

### 16.2. README должен включать

1. Why this exists.
2. What this is not.
3. Clean Code Contract.
4. CLI example.
5. MCP/agent flow.
6. Generated code example.
7. Validation report example.
8. Supported components/targets.
9. Roadmap.
10. Contributing.

### 16.3. README не должен обещать

- “perfect code”;
- “support for all UI libraries”;
- “Figma/Webflow replacement”;
- “AI-generated apps”.

---

## 17. Agent workflow design

### 17.1. Recommended flow for AI agents

```txt
1. Read AGENTS.md.
2. Inspect project tokens/config.
3. Create/update component schema.
4. Run compiler in dry-run mode.
5. Read validation report.
6. Fix schema errors.
7. Generate diff.
8. Ask for approval if needed.
9. Write files.
10. Run typecheck/lint/tests.
```

### 17.2. Agent must not

- Write final component files manually if compiler can generate them.
- Bypass validation.
- Add dependencies without manifest.
- Use unverified external API knowledge when Context7 is available.
- Read whole monorepo into context.
- Rewrite package architecture without ADR.

---

## 18. Использование Serena, Context7 и Superpowers

### 18.1. Serena

Serena использовать для:

- symbol-aware navigation;
- поиска implementations/references;
- безопасного refactor/rename;
- замены symbol body;
- уменьшения чтения больших файлов;
- работы в monorepo, когда grep/full-file reads слишком дороги.

Правило для агентов:

```txt
Use Serena before broad file reads for code navigation and cross-file edits.
```

### 18.2. Context7

Context7 использовать только когда нужны актуальные docs по внешним API:

- TypeScript compiler/AST tools;
- Zod/JSON Schema;
- Biome/ESLint/Prettier;
- shadcn registry;
- Tailwind;
- Storybook;
- Playwright;
- MCP SDK;
- Commander/CLI framework;
- tsup/Vite.

Правило:

```txt
Use Context7 for library/API documentation and version-sensitive implementation details. Do not use it for internal project code.
```

### 18.3. Superpowers

Superpowers использовать для:

- уточнения design/spec;
- планирования крупной фичи;
- TDD workflow;
- subagent task decomposition;
- code review после реализации.

Правило:

```txt
Use Superpowers for non-trivial implementation plans and review loops. Keep outputs short and task-scoped.
```

---

## 19. Development workflow

### 19.1. Branch strategy

Основная ветка:

```txt
main
```

Рабочие ветки:

```txt
chore/bootstrap-monorepo
feat/schema-core
feat/button-recipe
feat/react-css-adapter
feat/cli-generate
feat/mcp-server
fix/validator-dom-budget
```

### 19.2. Commit style

Использовать Conventional Commits:

```txt
feat(schema): add component schema primitives
feat(adapter-react-css): generate button component
fix(validators): detect missing focus-visible state
chore(repo): bootstrap pnpm workspace
```

### 19.3. PR requirements

Каждый PR должен:

- быть маленьким и reviewable;
- содержать tests;
- обновлять fixtures, если output изменился;
- обновлять docs, если меняется public behavior;
- проходить CI;
- не добавлять dependencies без объяснения.

---

## 20. CI requirements

GitHub Actions workflow `ci.yml` должен запускать:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:golden
pnpm build
```

Позже добавить:

```bash
pnpm test:generated
pnpm test:cli
pnpm test:mcp
pnpm test:visual
```

---

## 21. Security and safety

### 21.1. File writes

- По умолчанию все операции dry-run.
- Только `write`/`write_files` пишет файлы.
- Overwrite non-generated files запрещён по умолчанию.
- Generated files должны иметь marker в manifest, но не обязательно комментарий в каждом файле.
- Diff обязателен перед write.

### 21.2. Network

- No network by default.
- Context7 используется агентом как внешний docs tool, но compiler не должен требовать сеть для генерации.
- NPM install выполняется только по явному действию разработчика/CI.

### 21.3. Dependency safety

- Все dependencies должны быть в manifest.
- Adapter не может скрыто добавить runtime dependency.
- New dependency требует justification в PR.

---

## 22. Реализационные этапы для Codex

### Этап 0 — Bootstrap repository

Задачи:

1. Создать pnpm workspace.
2. Добавить TypeScript strict config.
3. Добавить Biome/ESLint config.
4. Добавить Vitest.
5. Добавить базовый CI.
6. Добавить README skeleton.
7. Добавить `AGENTS.md`.
8. Добавить package skeletons.

Acceptance criteria:

```txt
pnpm install
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### Этап 1 — Schema core

Задачи:

1. Создать `@clean-ui/schema`.
2. Описать component schema.
3. Описать token schema.
4. Описать props/variants/states schema.
5. Добавить runtime validation.
6. Добавить JSON examples.

Acceptance criteria:

- Valid schemas pass.
- Invalid schemas return stable errors.
- Tests cover Button/Card/Badge/Input/Switch schema examples.

### Этап 2 — Recipes

Задачи:

1. Создать `@clean-ui/recipes`.
2. Реализовать recipes for Button/Card/Badge/Input/Switch.
3. Добавить recipe-level validation.
4. Добавить DOM/state/accessibility constraints.

Acceptance criteria:

- Missing required state fails.
- Invalid slot fails.
- DOM budget constraints exported.

### Этап 3 — Compiler core

Задачи:

1. Создать `@clean-ui/compiler`.
2. Реализовать normalize schema → model.
3. Реализовать generated files model.
4. Реализовать manifest.
5. Реализовать adapter registration.

Acceptance criteria:

- Compiler can load schema.
- Compiler can select adapter.
- Compiler returns deterministic manifest.

### Этап 4 — React CSS adapter

Задачи:

1. Реализовать `@clean-ui/adapter-react-css`.
2. Сначала поддержать Button.
3. Потом Card/Badge/Input/Switch.
4. Генерировать `.tsx`, `.css`, `.schema.json`, `.manifest.json`.
5. Добавить golden tests.

Acceptance criteria:

- Button fixture passes golden test.
- Generated output typechecks.
- Generated output passes validator.

### Этап 5 — Validators

Задачи:

1. Реализовать `@clean-ui/validators`.
2. Добавить Clean Code Contract checks.
3. Добавить machine-readable reports.
4. Интегрировать validators в compiler.

Acceptance criteria:

- Missing focus-visible returns error.
- DOM budget exceeded returns warning/error.
- Missing dependency manifest returns error.

### Этап 6 — CLI

Задачи:

1. Реализовать `@clean-ui/cli`.
2. Commands: `init`, `create`, `validate`, `generate`, `diff`, `write`.
3. Поддержать `--json`.
4. Поддержать `--dry-run`.
5. Безопасный write.

Acceptance criteria:

- CLI can generate Button in dry-run.
- CLI can validate fixture schema.
- CLI refuses unsafe overwrite.

### Этап 7 — React Tailwind adapter

Задачи:

1. Реализовать `@clean-ui/adapter-react-tailwind`.
2. Поддержать Button/Badge first.
3. Добавить Card/Input/Switch.
4. Добавить golden tests.

Acceptance criteria:

- Output readable and deterministic.
- Complex styles не превращаются в unreadable class soup.

### Этап 8 — shadcn registry adapter

Задачи:

1. Реализовать `@clean-ui/adapter-shadcn-registry`.
2. Генерировать `registry-item.json`.
3. Поддержать dependencies/devDependencies/registryDependencies.
4. Поддержать configurable import alias.
5. Добавить example custom registry item.

Acceptance criteria:

- Generated registry item validates against expected shape.
- Dependencies are explicit.
- Golden fixtures pass.

### Этап 9 — MCP server

Задачи:

1. Реализовать `@clean-ui/mcp-server`.
2. Tools: list/get/create/update/validate/generate/diff/write.
3. Compact tool descriptions.
4. JSON-safe output.
5. No write except `write_files`.

Acceptance criteria:

- MCP tools can be invoked in tests.
- `generate_files` does not write.
- `write_files` requires output path and returns manifest.

### Этап 10 — Docs and examples

Задачи:

1. Написать README.
2. Написать docs/architecture.md.
3. Написать docs/clean-code-contract.md.
4. Написать docs/agent-interface.md.
5. Создать runnable examples.
6. Создать CONTRIBUTING.md.

Acceptance criteria:

- New contributor can run examples.
- README shows generated code and validation report.
- Agent workflow documented.

---

## 23. Definition of Done

Фича считается готовой, если:

1. Есть tests.
2. Есть fixture/golden coverage, если фича влияет на output.
3. Generated output deterministic.
4. Typecheck passes.
5. Lint/format passes.
6. Public behavior documented.
7. Validation errors are machine-readable.
8. No unsafe writes.
9. No unapproved dependencies.
10. PR description explains why change exists.

---

## 24. Первые GitHub issues

Создать issues:

1. `chore: bootstrap pnpm monorepo`
2. `feat(schema): define component schema v0.1`
3. `feat(recipes): add button recipe`
4. `feat(compiler): compile schema into normalized model`
5. `feat(adapter-react-css): generate button component`
6. `feat(validators): implement clean code contract MVP`
7. `feat(cli): add validate and generate commands`
8. `feat(adapter-shadcn): generate registry-item.json`
9. `feat(mcp): expose generate/validate/diff tools`
10. `docs: write README with clean code contract`

---

## 25. Sources and external references

These references were used to align the project with current agent/tooling conventions:

- Codex `AGENTS.md`: https://developers.openai.com/codex/guides/agents-md
- Codex Agent Skills: https://developers.openai.com/codex/skills
- AGENTS.md format: https://agents.md/
- Serena: https://github.com/oraios/serena and https://oraios.github.io/serena/01-about/000_intro.html
- Context7: https://github.com/upstash/context7 and https://context7.com/
- Superpowers: https://github.com/obra/superpowers
- shadcn registry item docs: https://ui.shadcn.com/docs/registry/registry-item-json
- Storybook visual testing: https://storybook.js.org/docs/writing-tests/visual-testing

