import * as prettier from "prettier";

/**
 * Formats generated TypeScript source so the intermediate modules (and the
 * JSDoc comments that flow through to the emitted `.d.ts` files) are tidy.
 */
export const formatTypeScript = async (source: string): Promise<string> => {
  return prettier.format(source, { parser: "typescript" });
};
