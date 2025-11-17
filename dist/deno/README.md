# JSON Schema Typed

JSON Schema TypeScript definitions with complete inline documentation.

**NOTE:** This library only supports defining schemas. You will need a separate
library for data validation.

## Usage

1. Chose which JSON Schema draft you'd like to import:

   - `draft_07.ts`
   - `draft_2019_09.ts`
   - `draft_2020_12.ts`
   - `draft_latest.ts` - this always re-exports the latest supported stable
     draft, currently `draft_2020_12.ts`. Future releases that re-export a new
     draft will always incur a bump to the major semantic version.

2. Define a schema

   ```ts
   import {
     Format,
     type JSONSchema,
   } from "https://deno.land/x/json_schema_typed@v8.0.2/draft_latest.ts";

   const schema: JSONSchema = {
     properties: {
       email: {
         format: Format.Email,
         type: "string",
       },
     },
     type: "object",
   };

   // The JSONSchema namespace also provides type-specific narrowed interfaces
   const stringSchema: JSONSchema.String = {
     // Only { type: "string" } and common keywords are allowed
     maxLength: 100,
     type: "string",
   };
   ```

## Exports supported in each draft module

| Name              | Type            | Purpose                                                            |
| ----------------- | --------------- | ------------------------------------------------------------------ |
| `$schema`         | `string`        | Draft meta schema URL that can be used with the `$schema` keyword. |
| `ContentEncoding` | Enum object     | String content encoding strategies.                                |
| `draft`           | `string`        | Draft version.                                                     |
| `Format`          | Enum object     | String formats.                                                    |
| `JSONSchema`      | TypeScript Type | Used to define a JSON Schema.                                      |
| `keywords`        | `string[]`      | All the keywords for the imported draft.                           |
| `TypeName`        | Enum object     | Simple type names for the `type` keyword.                          |

## Versioning

This library follows [semantic versioning](https://semver.org).

---

## Maintainers

- [Remy Rylan](https://github.com/RemyRylan)

## License

[BSD-2-Clause](https://github.com/RemyRylan/json-schema-typed/blob/main/dist/deno/LICENSE.md)
