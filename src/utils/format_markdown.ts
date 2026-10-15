import * as prettier from "prettier";

export type FormatMarkdownOptions = {
  lineWidth?: number;
};

/**
 * Re-flows markdown prose so that lines fit within `lineWidth` columns.
 */
export const formatMarkdown = async (
  source: string,
  options: FormatMarkdownOptions = {},
): Promise<string> => {
  const { lineWidth = 80 } = options;

  const formatted = await prettier.format(source, {
    parser: "markdown",
    printWidth: lineWidth,
    proseWrap: "always",
  });

  return formatted.trimEnd();
};
