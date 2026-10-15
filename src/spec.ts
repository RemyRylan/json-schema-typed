import type * as types from "./types.ts";
import { assertDefinitionIsSorted } from "./utils/assert_definition_is_sorted.ts";
export * from "./types.ts";

export function desc(
  input: TemplateStringsArray | string,
): string {
  const text = Array.isArray(input) ? input.join("") : input as string;
  const lines = text
    .split("\n")
    .map((line) => line.trim().length === 0 ? "" : line)
    .filter((line, index, lines) => {
      if (line !== "") {
        return true;
      }
      return index !== 0 && index !== lines.length - 1;
    });

  const [firstLine] = lines;
  const indent = firstLine.length - firstLine.trimStart().length;
  const indentRegex = new RegExp(`^\\s{${indent}}`);

  const newText = lines
    .map((line) => line.replace(indentRegex, "").trimEnd())
    .join("\n");

  return newText;
}

export const defineValidationSpec = <
  Keywords extends Record<string, types.KeywordSchema>,
>(
  spec: {
    $license: string;
    $copyright: types.Copyright;
    $docsUrl: string;
    $draft: string;
    $schemaUrl: string;
    $title: string;
    enums: Record<string, types.EnumSchema>;
    keywords: Keywords;
    keywordsByType: {
      array: types.KeywordKind<keyof Keywords, "Array">;
      number: types.KeywordKind<keyof Keywords, "Number">;
      object: types.KeywordKind<keyof Keywords, "Object">;
      string: types.KeywordKind<keyof Keywords, "String">;
    };
  },
): typeof spec => {
  assertDefinitionIsSorted(spec);

  const keys = Object.keys(spec.keywords);
  const tk = spec.keywordsByType;
  const allKeywordByTypes: Array<keyof Keywords> = [
    ...tk.array.values,
    ...tk.number.values,
    ...tk.object.values,
    ...tk.string.values,
  ];

  spec.keywordsByType = {
    // @ts-expect-error this is valid
    any: {
      title: "Any",
      values: keys.filter(
        (key) => {
          return allKeywordByTypes.includes(key) === false;
        },
      ).sort((a, b) => a.localeCompare(b)),
    },
    ...spec.keywordsByType,
  };

  const { credits } = spec.$copyright;
  const creditList = credits.length <= 1
    ? credits.join("")
    : credits.length === 2
    ? `${credits[0]} and ${credits[1]}`
    : `${credits.slice(0, -1).join(", ")}, and ${credits.at(-1)}`;

  spec.$license = spec.$license.replace("{COPYRIGHT}", () => {
    return [
      `Documentation and keyword descriptions are copyright (c) ${spec.$copyright.year}`,
      `${creditList}. All rights reserved.`,
    ].join(" ");
  });

  return spec;
};
