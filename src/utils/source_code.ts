import type * as types from "../types.ts";

/**
 * Split line breaks
 *
 * @param text
 * @returns
 */
export const splitLines = (text: string): string[] => text.split("\n");

/**
 * Format a block description line
 *
 * @param line
 * @param indent
 * @returns
 */
export const formatBlockCommentLine = (line: string, indent = 0) =>
  `${" ".repeat(indent > 0 ? indent : 0)}* ${line}`;

/**
 * Make a block description
 *
 * @param text
 * @param indent
 * @returns
 */
export const makeBlockComment = (text: string, indent = 0): string => {
  return `${"".repeat(indent > 1 ? indent - 1 : 0)}/**\n${
    splitLines(text).map((line) => formatBlockCommentLine(line, indent + 1))
      .join("\n")
  }\n${" ".repeat(indent + 1)}*/`;
};

export const formatKeywordComment = (
  keyword: types.KeywordSchema,
): string | undefined => {
  const comment: string[] = [];
  const tags: string[] = [];

  if (keyword.description !== undefined) {
    comment.push(keyword.description);
  }

  // `default` is the only one out of alphabetical order since editors like
  // VS Code display it differently.
  if ("default" in keyword && keyword.default !== undefined) {
    const { default: def } = keyword;
    tags.push(
      `@default ${typeof def === "string" ? `"${def}"` : def.toString()}`,
    );
  }

  if ("const" in keyword && keyword.const !== undefined) {
    const { const: value } = keyword;

    tags.push(
      `@const ${typeof value === "string" ? `"${value}"` : value.toString()}`,
    );
  }

  if ("deprecated" in keyword && keyword.deprecated !== undefined) {
    tags.push(
      `@deprecated ${keyword.deprecated.toString()}`,
    );
  }

  // `enum` is not needed -- the values will display as a TypeScript union

  if ("exclusiveMinimum" in keyword && keyword.exclusiveMinimum !== undefined) {
    tags.push(
      `@exclusiveMinimum ${keyword.exclusiveMinimum.toString()}`,
    );
  }

  if ("format" in keyword && keyword.format !== undefined) {
    tags.push(
      `@format "${keyword.format.toString()}"`,
    );
  }

  if ("minimum" in keyword && keyword.minimum !== undefined) {
    tags.push(
      `@minimum ${keyword.minimum.toString()}`,
    );
  }

  if (tags.length > 0) {
    comment.push("\n\n", ...tags);
  }

  if (comment.length === 0) {
    return;
  }

  return comment.join("\n");
};

export const stringifyKeyword = (keyword: types.KeywordSchema): string => {
  if ("type" in keyword) {
    switch (keyword.type) {
      case "string": {
        if (keyword.enum !== undefined) {
          return stringifyArrayToUnion(keyword.enum);
        }
        return "string";
      }

      case "JSONSchema":
        return "Sub";

      case "Value":
        return "Value";

      case "array":
        return `MaybeReadonlyArray<${
          Array.isArray(keyword.items)
            ? keyword.items.map((item) => stringifyKeyword(item)).join(" | ")
            : stringifyKeyword(keyword.items)
        }>`;

      case "object": {
        if (keyword.additionalProperties !== undefined) {
          return `Record<string, ${
            stringifyKeyword(keyword.additionalProperties)
          }>`;
        }
        throw new TypeError("Unexpected object without `additionalProperties`");
      }

      case "boolean":
      case "null":
        return keyword.type;

      case "integer":
      case "number":
        return "number";

      default:
        console.log(keyword);
        throw new TypeError("Unexpected keyword schema");
    }
  }

  if ("oneOf" in keyword) {
    return keyword.oneOf.map(stringifyKeyword).join(" | ");
  }

  if ("anyOf" in keyword) {
    return keyword.anyOf.map(stringifyKeyword).join(" | ");
  }

  throw new TypeError("Unexpected keyword schema");
};

export const stringifyArray = (
  values: readonly string[],
): string => {
  return `\n${values.map((value) => `"${value}",`).join("\n")}`;
};

export const stringifyArrayToUnion = (
  values: readonly string[],
  indent = 0,
): string => {
  return `\n${
    values.map((value) => `${" ".repeat(indent)}| "${value}"`).join("\n")
  }`;
};

export const assertCodeDoesNotHavePlaceholder = (
  filename: string,
  sourceCode: string,
): void => {
  const placeholderIndex = sourceCode.indexOf("PLACEHOLDER");
  if (placeholderIndex === -1) {
    return;
  }

  const start = Math.max(placeholderIndex - 250, 0);
  throw new Error(
    [
      `Placeholder is still present when generating "${filename}":`,
      "",
      sourceCode.slice(start, start + 500),
    ].join("\n"),
  );
};

export const expandSourcePlaceholders = (
  filename: string,
  rawSourceCode: string,
  draftSpec: types.ValidationSpecDefinition,
) => {
  const sourceCode = rawSourceCode.includes("// __BEGIN__")
    ? rawSourceCode.split("// __BEGIN__")[1]
    : rawSourceCode;
  const newCode = splitLines(sourceCode.trim())
    .filter((line) => {
      const trimmedLine = line.trim();
      return trimmedLine.includes("// @ts-expect-error") === false;
    })
    .join("\n")
    .replace("// __PLACEHOLDER:LICENSE__", () => makeBlockComment(draftSpec.$license).replace("/**", "/*"))
    .replaceAll("__PLACEHOLDER:DRAFT__", () => draftSpec.$draft)
    .replaceAll("__PLACEHOLDER:TITLE__", () => draftSpec.$title)
    .replaceAll("__PLACEHOLDER:SCHEMA_URL__", () => draftSpec.$schemaUrl)
    .replaceAll("__PLACEHOLDER:DOCS_URL__", () => draftSpec.$docsUrl)
    .replace(
      `__PLACEHOLDER__: [Value, SchemaType, Sub]; // KEYWORDS_INTERFACE`,
      () => Object.entries(draftSpec.keywords).map(([keyword, keywordSchema]) => {
        const entry: string[] = [];
        const comment = formatKeywordComment(keywordSchema);

        if (comment !== undefined) {
          entry.push(makeBlockComment(comment));
        }

        entry.push(
          `  ${keyword}?: ${
            keyword === "type"
              ? "SchemaType"
              : stringifyKeyword(keywordSchema as types.KeywordSchema)
          };`,
        );

        return entry.join("\n");
      }).join("\n\n"),
    )
    .replace(`// __PLACEHOLDER:KEYWORD_TYPES__`, () => {
      const code: string[] = [];

      for (
        const entry of Object.values(
          draftSpec.keywordsByType,
        ) as types.KeywordKind<string, string>[]
      ) {
        code.push(
          `  export type ${entry.title} = ${
            stringifyArrayToUnion(entry.values)
          }`,
        );
      }
      return code.join("\n\n");
    })
    .replace(`// __PLACEHOLDER:ENUMS__`, () => {
      const code: string[] = [];

      for (
        const enumSchema of Object.values(
          draftSpec.enums,
        ) as types.EnumSchema[]
      ) {
        if (enumSchema.description !== undefined) {
          code.push(
            makeBlockComment(enumSchema.description, 0),
          );
        }

        code.push(
          `export enum ${enumSchema.title} {${
            Object.entries(enumSchema.values).map(
              ([valueKey, valueSchema]) => {
                const value: string[] = [];

                if (valueSchema.description !== undefined) {
                  value.push(
                    "\n\n",
                    makeBlockComment(valueSchema.description, 2),
                    "\n",
                  );
                }

                value.push(
                  `${" ".repeat(4)}${
                    Number.isInteger(parseInt(valueKey.charAt(0), 10))
                      ? `"${valueKey}"`
                      : valueKey
                  } = "${valueSchema.value}",`,
                );

                return value.join("");
              },
            ).join("")
          }}\n`,
        );
      }

      return code.join("\n");
    })
    .replace(`// __PLACEHOLDER:KEYWORDS__`, () => {
      return `export const keywords = [${
        stringifyArray(Object.keys(draftSpec.keywords))
      }] as const;`;
    });

  assertCodeDoesNotHavePlaceholder(filename, newCode);
  return newCode;
};
