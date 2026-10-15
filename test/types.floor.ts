// Compiled by the `oldest-typescript` CI job with TypeScript 4.7 (see
// tsconfig.floor.json) to guard the published declarations against
// "union type too complex" regressions on old compilers. Uses only syntax
// TypeScript 4.7 understands (no `satisfies`). Positive cases only: the
// location TypeScript reports a non-applicable keyword at differs between
// compiler versions, so negative cases live in types.check.ts.

import type { JSONSchema } from "../2020_12.js";
import { TypeName } from "../2020_12.js";

const name: JSONSchema.String = { type: "string", minLength: 1 };
const age: JSONSchema.Integer = { type: "integer", minimum: 0 };

export const person: JSONSchema = {
  type: "object",
  properties: { name, age, tags: { type: "array", items: { type: "string" } } },
  required: ["name"],
};

export const map: Record<string, JSONSchema> = { name, age, person };

export const nullable: JSONSchema<string | null> = { type: ["string", "null"] };

export const read = (s: JSONSchema): unknown =>
  typeof s === "boolean" ? s : [s.type, s.properties, s.minimum];

export const enumType: JSONSchema = {
  type: TypeName.Object,
  properties: { n: { type: TypeName.Number, exclusiveMinimum: 0 } },
};

export const asInterface = (s: JSONSchema): JSONSchema.Interface | boolean =>
  typeof s === "boolean" ? s : s;
