// Build script: expands `mod_template.ts` for every draft definition, compiles
// the result to JavaScript + declaration files at the package root, and
// regenerates the spec definition JSON, README, LICENSE, and package.json.
//
// Usage: npm run build

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type * as types from "./types.ts";
import { expandSourcePlaceholders } from "./utils/source_code.ts";
import { formatMarkdown } from "./utils/format_markdown.ts";
import { formatTypeScript } from "./utils/format_typescript.ts";
import { formatDefinitionDescriptions } from "./utils/format_definition_descriptions.ts";
import { compileTypeScript } from "./tsc.ts";
import { VERSION } from "./version.ts";

// -----------------------------------------------------------------------------

const SRC_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SRC_DIR, "..");
const FILE_TEMPLATES_DIR = path.join(SRC_DIR, "file_templates");
const BUILD_DIR = path.join(ROOT_DIR, "build");
const SPEC_DEFS_DIR = path.join(ROOT_DIR, "spec_definitions");

await fs.mkdir(BUILD_DIR, { recursive: true });
await fs.mkdir(SPEC_DEFS_DIR, { recursive: true });

/**
 * How each draft directory under `src/draft/` is published.
 *
 * - `exportName` is the package subpath (`json-schema-typed/<exportName>`)
 *   and, with `-` replaced by `_`, the module file name at the package root.
 * - `aliases` are additional subpaths whose files simply re-export the module
 *   (kept for backwards compatibility, or as a moving pointer like `next`).
 *
 * The main package export points at the newest *released* draft, which is the
 * highest numeric id; identifiers that are not numeric (`v1`) never become the
 * main export.
 */
const MODULES: Record<string, { exportName: string; aliases?: string[] }> = {
  "07": { exportName: "draft-07" },
  "2019_09": { exportName: "2019-09", aliases: ["draft-2019-09"] },
  "2020_12": { exportName: "2020-12", aliases: ["draft-2020-12"] },
  v1: { exportName: "v1", aliases: ["next"] },
};

const fileNameOf = (exportName: string): string => exportName.replaceAll("-", "_");

const modTemplateFilename = path.join(SRC_DIR, "mod_template.ts");
const modTemplateCode = await fs.readFile(modTemplateFilename, "utf8");

// -----------------------------------------------------------------------------
// Collect all drafts
// -----------------------------------------------------------------------------

const drafts: string[] = [];

for (const entry of await fs.readdir(path.join(SRC_DIR, "draft"), {
  withFileTypes: true,
})) {
  if (!entry.isDirectory()) continue;
  try {
    await fs.access(path.join(SRC_DIR, "draft", entry.name, "definition.ts"));
    drafts.push(entry.name);
  } catch {
    // Directory without a definition (e.g. a spec submodule placeholder)
  }
}

drafts.sort((a, b) => a.localeCompare(b));

if (drafts.length === 0) {
  throw new Error("No draft definitions found in src/draft/*/definition.ts");
}

for (const draftId of drafts) {
  if (!(draftId in MODULES)) {
    throw new Error(`src/draft/${draftId} has no entry in MODULES (src/build.ts)`);
  }
}

// -----------------------------------------------------------------------------
// Generate one TypeScript module per draft
// -----------------------------------------------------------------------------

const licenseCopyrights: Array<
  { draft: string; year: number; credits: string[] }
> = [];
/** draft directory id → the definition's `$draft` value */
const rawDrafts: Record<string, string> = {};
const generatedModules: string[] = [];

/** "A", "A and B", or "A, B, and C" */
const formatCredits = (credits: string[]): string => {
  if (credits.length <= 1) return credits.join("");
  if (credits.length === 2) return `${credits[0]} and ${credits[1]}`;
  return `${credits.slice(0, -1).join(", ")}, and ${credits.at(-1)}`;
};

for (const draftId of drafts) {
  const draftDefFilename = path.join(SRC_DIR, "draft", draftId, "definition.ts");

  const rawDraftSpec = (await import(pathToFileURL(draftDefFilename).href))
    .default as types.ValidationSpecDefinition;

  licenseCopyrights.push({
    ...rawDraftSpec.$copyright,
    draft: rawDraftSpec.$draft,
  });
  rawDrafts[draftId] = rawDraftSpec.$draft;

  // Spec definition JSON (unwrapped descriptions)
  {
    const jsonDef = await formatDefinitionDescriptions(rawDraftSpec, {
      lineWidth: 100_000,
    });
    await fs.writeFile(
      path.join(SPEC_DEFS_DIR, `${fileNameOf(MODULES[draftId].exportName)}.json`),
      JSON.stringify(jsonDef, undefined, 2) + "\n",
    );
  }

  // TypeScript module (descriptions wrapped to fit in JSDoc comments)
  const draftSpec = await formatDefinitionDescriptions(rawDraftSpec, {
    lineWidth: 75,
  });
  draftSpec.$license = (await formatMarkdown(draftSpec.$license, {
    lineWidth: 76,
  })).trim();

  const modCode = expandSourcePlaceholders(
    modTemplateFilename,
    modTemplateCode,
    draftSpec,
  );

  const outputFilename = path.join(
    BUILD_DIR,
    `${fileNameOf(MODULES[draftId].exportName)}.ts`,
  );
  await fs.writeFile(
    outputFilename,
    await formatTypeScript(
      [
        "// @generated",
        "// This code is automatically generated. Manual editing is not recommended.",
        "",
        modCode,
      ].join("\n"),
    ),
  );
  generatedModules.push(outputFilename);

  console.log(`${fileNameOf(MODULES[draftId].exportName)}: generated`);
}

// -----------------------------------------------------------------------------
// Compile to JavaScript + declarations at the package root
// -----------------------------------------------------------------------------

await compileTypeScript(generatedModules, ROOT_DIR);
console.log(`compiled ${generatedModules.length} module(s)`);

// -----------------------------------------------------------------------------
// Alias modules (legacy names and `next`)
// -----------------------------------------------------------------------------

for (const draftId of drafts) {
  const { exportName, aliases = [] } = MODULES[draftId];
  const target = fileNameOf(exportName);
  for (const alias of aliases) {
    const header = [
      "// @generated",
      `// \`json-schema-typed/${alias}\` is an alias of \`json-schema-typed/${exportName}\`.`,
      `// It re-exports \`./${target}\` so both import paths share the same types and enums.`,
      "",
    ];
    await fs.writeFile(
      path.join(ROOT_DIR, `${fileNameOf(alias)}.js`),
      [...header, `export * from "./${target}.js";`, ""].join("\n"),
    );
    await fs.writeFile(
      path.join(ROOT_DIR, `${fileNameOf(alias)}.d.ts`),
      [...header, `export * from "./${target}.js";`, ""].join("\n"),
    );
    console.log(`${fileNameOf(alias)}: alias of ${target}`);
  }
}

// -----------------------------------------------------------------------------
// Latest draft
// -----------------------------------------------------------------------------

const latestDraft = [...drafts].filter((draftId) => {
  return Number.isInteger(parseInt(draftId.split("_")[0], 10));
}).pop();

if (latestDraft === undefined) {
  throw new Error("Could not determine the latest draft");
}

// -----------------------------------------------------------------------------
// README
// -----------------------------------------------------------------------------

{
  const templateSource = await fs.readFile(
    path.join(FILE_TEMPLATES_DIR, "README.template.md"),
    "utf8",
  );
  const readme = templateSource
    .replaceAll("{DRAFT_TOTAL}", drafts.length.toLocaleString("en"))
    .replaceAll("{LATEST_DRAFT}", MODULES[latestDraft].exportName)
    .replace("{DRAFT_LIST}", () => {
      return drafts.map((draft) => {
        const { exportName, aliases = [] } = MODULES[draft];
        const aliasText = aliases.length > 0
          ? ` (also \`${aliases.map((a) => `json-schema-typed/${a}`).join("`, `")}\`)`
          : "";
        return `\`json-schema-typed/${exportName}\`${aliasText}`;
      }).join("\n- ");
    });
  await fs.writeFile(
    path.join(ROOT_DIR, "README.md"),
    (await formatMarkdown(readme, { lineWidth: 80 })) + "\n",
  );
}

// -----------------------------------------------------------------------------
// LICENSE
// -----------------------------------------------------------------------------

{
  const licenseTemplate = await fs.readFile(
    path.join(FILE_TEMPLATES_DIR, "LICENSE.template.md"),
    "utf8",
  );
  const copyright = licenseCopyrights
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.draft.localeCompare(b.draft);
    })
    .map(({ draft, year, credits }) => {
      const label = MODULES[drafts.find((id) => rawDrafts[id] === draft) ?? ""]
        ?.exportName ?? draft;
      return `${year} [${label}] ${formatCredits(credits)}.`;
    })
    .join("\n\n");

  const license = await formatMarkdown(
    licenseTemplate.replace("{COPYRIGHT}", () => copyright),
  );
  await fs.writeFile(path.join(ROOT_DIR, "LICENSE.md"), license + "\n");
}

// -----------------------------------------------------------------------------
// package.json
// -----------------------------------------------------------------------------

{
  const packageJsonFilename = path.join(ROOT_DIR, "package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonFilename, "utf8"));

  packageJson.version = VERSION;
  const mainFile = fileNameOf(MODULES[latestDraft].exportName);
  const entry = (file: string) => ({
    types: `./${file}.d.ts`,
    default: `./${file}.js`,
  });
  packageJson.main = `./${mainFile}.js`;
  packageJson.types = `./${mainFile}.d.ts`;
  packageJson.exports = {
    ".": entry(mainFile),
    ...Object.fromEntries(
      drafts.flatMap((draftId) => {
        const { exportName, aliases = [] } = MODULES[draftId];
        return [exportName, ...aliases].map((name) => [
          `./${name}`,
          entry(fileNameOf(name)),
        ]);
      }),
    ),
  };

  await fs.writeFile(
    packageJsonFilename,
    JSON.stringify(packageJson, undefined, 2) + "\n",
  );
}

console.log(`json-schema-typed v${VERSION}: build complete`);
