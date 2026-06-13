import type { GeneratedOutput, NormalizedComponentModel } from "@clean-ui/compiler";

export type ReactCssGeneratedParts = {
  readonly componentContent: string;
  readonly cssContent: string;
};

export const createReactCssOutput = (
  model: NormalizedComponentModel,
  parts: ReactCssGeneratedParts,
): GeneratedOutput => {
  const schemaFile = `${JSON.stringify(model.schema, null, 2)}\n`;
  const manifestFile = `{
  "componentId": "${model.componentId}",
  "target": "${model.target}",
  "files": [
    {
      "path": "${model.componentName}.tsx",
      "kind": "component",
      "language": "tsx",
      "overwritePolicy": "never"
    },
    {
      "path": "${model.fileBaseName}.css",
      "kind": "style",
      "language": "css",
      "overwritePolicy": "never"
    },
    {
      "path": "${model.fileBaseName}.schema.json",
      "kind": "schema",
      "language": "json",
      "overwritePolicy": "never"
    }
  ],
  "dependencies": ["react"],
  "devDependencies": [],
  "registryDependencies": []
}
`;

  return {
    files: [
      {
        path: `${model.componentName}.tsx`,
        kind: "component",
        language: "tsx",
        content: parts.componentContent,
        overwritePolicy: "never",
      },
      {
        path: `${model.fileBaseName}.css`,
        kind: "style",
        language: "css",
        content: parts.cssContent,
        overwritePolicy: "never",
      },
      {
        path: `${model.fileBaseName}.schema.json`,
        kind: "schema",
        language: "json",
        content: schemaFile,
        overwritePolicy: "never",
      },
      {
        path: `${model.fileBaseName}.manifest.json`,
        kind: "manifest",
        language: "json",
        content: manifestFile,
        overwritePolicy: "never",
      },
    ],
    dependencies: ["react"],
    devDependencies: [],
    registryDependencies: [],
  };
};
