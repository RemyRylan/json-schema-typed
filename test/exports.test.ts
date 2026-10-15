// Runtime tests for the published module surface. Run with `npm run test:runtime`.

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import * as main from "json-schema-typed";
import * as draft07 from "json-schema-typed/draft-07";
import * as draft2019 from "json-schema-typed/2019-09";
import * as draft2020 from "json-schema-typed/2020-12";
import * as v1 from "json-schema-typed/v1";
import * as legacy2019 from "json-schema-typed/draft-2019-09";
import * as legacy2020 from "json-schema-typed/draft-2020-12";
import * as next from "json-schema-typed/next";

const drafts = [
  { mod: draft07, draft: "7", $schema: "https://json-schema.org/draft-07/schema" },
  { mod: draft2019, draft: "2019-09", $schema: "https://json-schema.org/draft/2019-09/schema" },
  { mod: draft2020, draft: "2020-12", $schema: "https://json-schema.org/draft/2020-12/schema" },
  { mod: v1, draft: "v1", $schema: "https://json-schema.org/v1" },
];

test("main export is the latest stable draft", () => {
  assert.equal(main.draft, "2020-12");
  assert.deepEqual(Object.keys(main).sort(), Object.keys(draft2020).sort());
});

for (const { mod, draft, $schema } of drafts) {
  test(`draft ${draft}: exports`, () => {
    assert.equal(mod.draft, draft);
    assert.equal(mod.$schema, $schema);
    assert.deepEqual(
      Object.keys(mod).sort(),
      ["$schema", "ContentEncoding", "Format", "TypeName", "draft", "keywords"],
    );
  });

  test(`draft ${draft}: keywords are unique and sorted`, () => {
    assert.ok(mod.keywords.length > 0);
    assert.deepEqual([...mod.keywords], [...new Set(mod.keywords)]);
    assert.deepEqual(
      [...mod.keywords],
      [...mod.keywords].sort((a, b) => a.localeCompare(b)),
    );
  });

  test(`draft ${draft}: enums carry their spec values`, () => {
    assert.equal(mod.TypeName.Object, "object");
    assert.equal(mod.TypeName.Integer, "integer");
    assert.equal(mod.Format.Email, "email");
    assert.equal(mod.ContentEncoding.Base64, "base64");
  });
}

test("$vocabulary exists in drafts 2019-09 and 2020-12 only", () => {
  const has = (mod: { keywords: readonly string[] }) =>
    mod.keywords.includes("$vocabulary");
  assert.equal(has(draft07), false);
  assert.equal(has(draft2019), true);
  assert.equal(has(draft2020), true);
  assert.equal(has(v1), false); // demoted to a proposal in v1
});

test("v1 drops the keywords removed from its meta-schema", () => {
  for (const removed of ["additionalItems", "definitions", "dependencies", "$vocabulary"]) {
    assert.ok(!(v1.keywords as readonly string[]).includes(removed), removed);
  }
});

test("legacy and alias paths are the same module, not copies", () => {
  // Same object identity means the enums are the same TypeScript types too.
  assert.equal(legacy2019.TypeName, draft2019.TypeName);
  assert.equal(legacy2019.keywords, draft2019.keywords);
  assert.equal(legacy2020.TypeName, draft2020.TypeName);
  assert.equal(legacy2020.keywords, draft2020.keywords);
  assert.equal(next.TypeName, v1.TypeName);
  assert.equal(next.keywords, v1.keywords);
  assert.equal(next.draft, "v1");
});

test("every module's runtime exports match its declaration file", async () => {
  for (const file of readdirSync(".").filter((f) => f.endsWith(".js"))) {
    const mod = await import(`../${file}`);
    const dts = readFileSync(file.replace(/\.js$/, ".d.ts"), "utf8");
    const declared = [...dts.matchAll(/^export declare (?:const|enum) ([\w$]+)/gm)]
      .map((m) => m[1]).sort();
    if (declared.length === 0) continue; // alias: `export * from` only
    assert.deepEqual(Object.keys(mod).sort(), declared, file);
  }
});

test("spec_definitions JSON agrees with the modules", async () => {
  for (const file of readdirSync("spec_definitions").filter((f) => f.endsWith(".json"))) {
    const def = JSON.parse(readFileSync(`spec_definitions/${file}`, "utf8")) as {
      $draft: string;
      $schemaUrl: string;
      keywords: Record<string, unknown>;
    };
    const mod = await import(`../${file.replace(/\.json$/, ".js")}`);
    assert.equal(def.$draft, mod.draft, file);
    assert.equal(def.$schemaUrl, mod.$schema, file);
    assert.deepEqual(Object.keys(def.keywords).sort(), [...mod.keywords].sort(), file);
  }
});
