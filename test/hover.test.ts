// Inline documentation is the point of this package: hovering a keyword in a
// schema literal must show the spec text. TypeScript only attaches a
// keyword's documentation when the contextual type resolves to one
// declaration, which a union type would break — so `JSONSchema` must stay a
// single object type. This test asks the TypeScript language service
// (TypeScript 5, which still ships the JavaScript API) for the hover text at
// representative positions.

import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { test } from "node:test";
import ts from "typescript5";

const root = process.cwd();
const dir = mkdtempSync(path.join(tmpdir(), "json-schema-typed-hover-"));
const file = path.join(dir, "sample.ts");

const sample = `
import { type JSONSchema, TypeName } from "json-schema-typed";
import * as v1 from "json-schema-typed/v1";
export const a: JSONSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, format: "email" },
    age: { type: TypeName.Integer, minimum: 0 },
    tags: { type: "array", items: { type: "string" }, uniqueItems: true },
  },
  required: ["name"],
};
export const b: JSONSchema.String = { type: "string", maxLength: 5 };
export const c: JSONSchema = { $ref: "#/x", title: "t", oneOf: [{ const: 1 }] };
export const d: JSONSchema<string> = { type: "string", pattern: "^a" };
export const l: JSONSchema = { type: ["string", "null"], maxLength: 3 };
export const e: v1.JSONSchema = { $dynamicRef: "node", unevaluatedProperties: false };
`;
writeFileSync(file, sample);

// Resolve `json-schema-typed` to this checkout via a synthetic node_modules.
const options: ts.CompilerOptions = {
  strict: true,
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  target: ts.ScriptTarget.ES2022,
  paths: { "json-schema-typed": [root], "json-schema-typed/*": [`${root}/*`] },
  baseUrl: root,
  types: [],
};
const host: ts.LanguageServiceHost = {
  getScriptFileNames: () => [file],
  getScriptVersion: () => "1",
  getScriptSnapshot: (f) => ts.sys.fileExists(f) ? ts.ScriptSnapshot.fromString(ts.sys.readFile(f)!) : undefined,
  getCurrentDirectory: () => root,
  getCompilationSettings: () => options,
  getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
  fileExists: ts.sys.fileExists,
  readFile: ts.sys.readFile,
  readDirectory: ts.sys.readDirectory,
  directoryExists: ts.sys.directoryExists,
  getDirectories: ts.sys.getDirectories,
};
const service = ts.createLanguageService(host);

const hoverDocs = (needle: string): string => {
  const pos = sample.indexOf(needle);
  assert.notEqual(pos, -1, `needle not found: ${needle}`);
  const info = service.getQuickInfoAtPosition(file, pos);
  return info ? ts.displayPartsToString(info.documentation) : "";
};

test("sample compiles against the checkout", () => {
  const diagnostics = service.getSemanticDiagnostics(file).concat(service.getSyntacticDiagnostics(file));
  assert.deepEqual(diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")), []);
});

test("hover shows spec documentation on every keyword of a JSONSchema literal", () => {
  for (const needle of [
    'type: "object"', "properties: {", "minLength: 1", 'format: "email"', "minimum: 0",
    "items: {", "uniqueItems", "required:", "maxLength: 5", "$ref:", "title:", "oneOf:",
    'pattern: "^a"', "maxLength: 3", "$dynamicRef:", "unevaluatedProperties:",
  ]) {
    assert.ok(hoverDocs(needle).length > 50, `no hover documentation at \`${needle.trim()}\``);
  }
});

test("hover documentation is the spec text", () => {
  assert.match(hoverDocs("minLength: 1"), /non-negative integer/);
  assert.match(hoverDocs("required:"), /MUST be an array/);
  assert.match(hoverDocs("$dynamicRef:"), /dynamic/i);
});

test("completions carry documentation", () => {
  const pos = sample.indexOf("{ $ref:") + 2;
  const completions = service.getCompletionsAtPosition(file, pos, {});
  assert.ok(completions, "no completions");
  const details = service.getCompletionEntryDetails(file, pos, "additionalProperties", {}, undefined, {}, undefined);
  assert.ok(details && ts.displayPartsToString(details.documentation).length > 50);
});
