// Compile-time assertions, checked by `npm run test:types` (tsc). A case
// passes when it compiles; negative cases are marked with `@ts-expect-error`
// and fail the build if the error disappears. Not a runtime test.

import {
  ContentEncoding,
  type JSONSchema,
  keywords,
  TypeName,
} from "json-schema-typed";
import * as draft2019 from "json-schema-typed/2019-09";
import * as draft07 from "json-schema-typed/draft-07";
import * as v1 from "json-schema-typed/v1";
import * as next from "json-schema-typed/next";
import * as legacy2019 from "json-schema-typed/draft-2019-09";

// -----------------------------------------------------------------------------
// JSONSchema: one documented object type, 8.x-compatible
// -----------------------------------------------------------------------------

export const booleanSchema: JSONSchema = true;

export const arraySchema: JSONSchema.Array = {
  type: "array",
  items: { type: "string" },
  minItems: 1,
};

export const narrowedString: JSONSchema<string> = {
  contentEncoding: ContentEncoding.Base64,
  type: "string",
};

export const stringSchema: JSONSchema.String = { type: "string", maxLength: 100 };

export const enumMemberType: JSONSchema = {
  type: TypeName.Object,
  properties: { id: { type: TypeName.Integer, minimum: 0 } },
};

export const typeList: JSONSchema = {
  type: [TypeName.String, "number"],
  maxLength: 10,
  minimum: 0,
};

export const untyped: JSONSchema = {
  properties: { a: { $ref: "#/$defs/a" } },
  required: ["a"],
  $defs: { a: { enum: [1, 2, 3] } },
};

export const conditional: JSONSchema = {
  type: "object",
  if: { properties: { kind: { const: "a" } } },
  then: { required: ["a"] },
  else: { required: ["b"] },
};

// A schema whose literal types were widened (e.g. imported from JSON) is a
// JSONSchema: `type` accepts any string on the unconstrained type.
const widened = { type: "string", minLength: 1 };
export const fromJson: JSONSchema = widened;

// `JSONSchema.Interface` is the object half of `JSONSchema` and can be
// extended; values flow back into `JSONSchema` without a cast.
export interface WithCustomKeyword extends JSONSchema.Interface {
  "x-custom"?: string;
}
export const extended: WithCustomKeyword = { type: "string", "x-custom": "ok" };
export const extendedIsSchema: JSONSchema = extended;

// Every keyword can be read, and the object half of a JSONSchema is an
// Interface (both directions).
export const read = (s: JSONSchema): unknown => {
  if (typeof s === "boolean") return s;
  const asInterface: JSONSchema.Interface = s;
  return [s.type, s.properties, s.items, s.minimum, s.$ref, asInterface.title];
};

// JSONSchema<Value> constrains `type` (and accepts the list form for unions).
export const nullable: JSONSchema<string | null> = { type: ["string", "null"] };
export const nullable2: JSONSchema<string | null> = { type: "null" };
export const numeric: JSONSchema<number> = { type: ["number", "integer"], minimum: 0 };
export const wrongType: JSONSchema<string> = {
  // @ts-expect-error `JSONSchema<string>` only allows `type: "string"`
  type: "number",
};
// Narrowed schemas flow into the unconstrained type.
export const flows: JSONSchema[] = [nullable, numeric, stringSchema, arraySchema];

// Named types only declare the keywords for their type (as in 8.x).
export const namedWrong: JSONSchema.String = {
  type: "string",
  // @ts-expect-error `minimum` is not a string keyword
  minimum: 1,
};

// Every keyword in the `keywords` array is a property of the interface, and
// vice versa.
type KeywordNames = (typeof keywords)[number];
type InterfaceKeys = keyof JSONSchema.Interface;
export const keywordsMatchInterface: [
  InterfaceKeys extends KeywordNames ? true : false,
  KeywordNames extends InterfaceKeys ? true : false,
] = [true, true];

// -----------------------------------------------------------------------------
// Issue #119: `$vocabulary` values are booleans
// -----------------------------------------------------------------------------

export const vocabulary: JSONSchema = {
  $vocabulary: {
    "https://json-schema.org/draft/2020-12/vocab/core": true,
    "https://json-schema.org/draft/2020-12/vocab/format-annotation": false,
  },
};
export const vocabulary2019: draft2019.JSONSchema = {
  $vocabulary: { "https://json-schema.org/draft/2019-09/vocab/core": true },
};
export const vocabularyWrongValue: JSONSchema = {
  $vocabulary: {
    // @ts-expect-error values must be booleans, not strings
    "https://json-schema.org/draft/2020-12/vocab/core": "true",
  },
};
export const vocabularyMissingInDraft07: draft07.JSONSchema = {
  // @ts-expect-error `$vocabulary` was introduced in draft 2019-09
  $vocabulary: {},
};

// -----------------------------------------------------------------------------
// Spec audit fixes
// -----------------------------------------------------------------------------

export const prefixItemsArray: JSONSchema = { prefixItems: [{ type: "string" }] };
export const prefixItemsWrong: JSONSchema = {
  // @ts-expect-error `prefixItems` must be an array of schemas
  prefixItems: { type: "string" },
};
export const int64: draft07.JSONSchema.Integer = { type: "integer", format: "int64" };
export const recursive: JSONSchema = { $recursiveAnchor: true, $recursiveRef: "#" };
export const rfc4648: JSONSchema = { type: "string", contentEncoding: ContentEncoding.Base64URL };

// -----------------------------------------------------------------------------
// Aliases share types with their canonical module
// -----------------------------------------------------------------------------

export const legacyEnumIsSameType: draft2019.TypeName = legacy2019.TypeName.Object;
export const legacySchema: legacy2019.JSONSchema = { type: draft2019.TypeName.String };
export const nextIsV1: v1.JSONSchema = { type: next.TypeName.Object } satisfies next.JSONSchema;

// -----------------------------------------------------------------------------
// v1
// -----------------------------------------------------------------------------

export const v1Schema: v1.JSONSchema = {
  $schema: "https://json-schema.org/v1",
  $id: "https://example.com/person",
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    self: { $dynamicRef: "node" },
  },
  $defs: { node: { $dynamicAnchor: "node", type: "object" } },
};
export const v1NoVocabulary: v1.JSONSchema = {
  // @ts-expect-error `$vocabulary` is only a proposal in v1
  $vocabulary: {},
};
export const v1NoDefinitions: v1.JSONSchema = {
  // @ts-expect-error `definitions` was removed in v1 (use `$defs`)
  definitions: {},
};
