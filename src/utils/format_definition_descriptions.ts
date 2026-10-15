import {
  formatMarkdown,
  type FormatMarkdownOptions,
} from "./format_markdown.ts";
import type * as types from "../types.ts";

/**
 * Returns a deep copy of `def` with every markdown description re-flowed to
 * the requested line width.
 */
export const formatDefinitionDescriptions = async (
  def: types.ValidationSpecDefinition,
  options: FormatMarkdownOptions,
): Promise<types.ValidationSpecDefinition> => {
  const defClone = structuredClone(def);

  for (const enumDef of Object.values(defClone.enums)) {
    if (enumDef.description !== undefined) {
      enumDef.description = await formatMarkdown(enumDef.description, options);
    }
    for (const enumValue of Object.values(enumDef.values)) {
      if (enumValue.description !== undefined) {
        enumValue.description = await formatMarkdown(
          enumValue.description,
          options,
        );
      }
    }
  }

  for (const keywordEntry of Object.values(defClone.keywords)) {
    if (keywordEntry.description !== undefined) {
      keywordEntry.description = await formatMarkdown(
        keywordEntry.description,
        options,
      );
    }
  }

  return defClone;
};
