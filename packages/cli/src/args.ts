export type ParsedArgs = {
  readonly command?: string;
  readonly positionals: readonly string[];
  readonly options: Readonly<Record<string, string | boolean>>;
};

export const parseArgs = (argv: readonly string[]): ParsedArgs => {
  const [command, ...rest] = argv;
  const positionals: string[] = [];
  const options: Record<string, string | boolean> = {};

  for (let index = 0; index < rest.length; index += 1) {
    const value = rest[index];
    if (!value) {
      continue;
    }

    if (!value.startsWith("--")) {
      positionals.push(value);
      continue;
    }

    const key = value.slice(2);
    const next = rest[index + 1];

    if (next && !next.startsWith("--")) {
      options[key] = next;
      index += 1;
      continue;
    }

    options[key] = true;
  }

  return {
    ...(command ? { command } : {}),
    positionals,
    options,
  };
};

export const getStringOption = (args: ParsedArgs, name: string): string | undefined => {
  const value = args.options[name];
  return typeof value === "string" ? value : undefined;
};

export const hasFlag = (args: ParsedArgs, name: string): boolean => {
  return args.options[name] === true;
};
