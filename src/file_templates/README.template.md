[![npm](https://img.shields.io/npm/v/json-schema-typed.svg?style=flat-square)](https://npmjs.org/package/json-schema-typed)
[![downloads-per-month](https://img.shields.io/npm/dm/json-schema-typed.svg?style=flat-square&label=npm%20downloads)](https://npmjs.org/package/json-schema-typed)
[![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg?style=flat-square)][license]

# JSON Schema Typed

JSON Schema TypeScript definitions with complete inline documentation.

**NOTE:** This library only supports defining schemas. You will need a separate
library for data validation.

There are {DRAFT_TOTAL} JSON Schema dialects included in this package:

- {DRAFT_LIST}

## Install

```sh
npm install json-schema-typed
```

## Usage

1. Choose which dialect you'd like to import.

- The main package export points to the latest **released** specification,
  currently `{LATEST_DRAFT}`. Future releases that point the main package export
  to a new specification will always incur a bump to the major semantic version.

  ```ts
  import { type JSONSchema } from "json-schema-typed";
  ```

- Or you can specify the exact dialect you need.
  ```ts
  import { type JSONSchema } from "json-schema-typed/{LATEST_DRAFT}";
  ```

2. Define a schema

   ```ts
   import { Format, type JSONSchema } from "json-schema-typed";

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

## Specification versions

JSON Schema changed how it is versioned after 2020-12. The IETF-style drafts
(`draft-07`, `2019-09`, `2020-12`) were each incompatible with one another, so
this package exposes one module per draft and you pin the one you write against.

The next specification is **JSON Schema v1**. It is versioned by a major version
number plus a release year (`v1/2026`, `v1/2027`, ...). Releases within a version
are additive and backwards compatible, so a schema written for `v1/2026` stays
valid for every later `v1` release. The `$schema` value `https://json-schema.org/v1`
always means "latest v1". This package mirrors that: there is one `v1` module,
updated additively as yearly releases land (a minor version bump here). A new
module would only appear for a breaking `v2`.

```ts
import { type JSONSchema } from "json-schema-typed/v1";
```

> **v1 is unreleased.** The `v1` module is generated from the current `main`
> branch of the specification repository and tracks it ahead of the first
> official release (`v1/2026`). Keywords may still change until then. The main
> package export stays on `2020-12` until v1 is published.

### `json-schema-typed/next`

`next` always points at the newest in-progress specification, whatever it is
called — today that is `v1`. Import it if you want to follow the spec's working
copy; import `v1` if you want to stay on v1 even after a v2 appears.

```ts
import { type JSONSchema } from "json-schema-typed/next";
```

### Legacy import paths

`json-schema-typed/draft-2019-09` and `json-schema-typed/draft-2020-12` still
work and are the same modules as `json-schema-typed/2019-09` and
`json-schema-typed/2020-12` (re-exports, not copies, so the types and enums are
identical whichever path you use). New code should use the shorter names.

## Type checking

`JSONSchema` describes any schema. Every keyword is optional and documented
inline, so hovering a keyword in your editor shows the specification text.

```ts
const schema: JSONSchema = {
  type: "object",
  properties: { count: { type: "number", minimum: 0 } },
};
```

- `JSONSchema<Value>` constrains `type` to the kind of value described:
  `JSONSchema<string>` has `type?: "string"`, and `JSONSchema<string | null>`
  accepts `"string"`, `"null"`, or `["string", "null"]`.
- `JSONSchema.String`, `JSONSchema.Object`, `JSONSchema.Array`, ... declare
  only the keywords that apply to that type.
- `JSONSchema.Interface` is the object half of `JSONSchema`; extend it to add
  custom keywords.
- A schema whose literal types have been widened — imported from a `.json`
  file, or built in a variable without `as const` — is still a `JSONSchema`.

Every schema in the official
[JSON-Schema-Test-Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite)
is checked against `JSONSchema` as part of the test suite, and hover
documentation is tested against the TypeScript language service. The published
declarations are tested with TypeScript 4.7 and newer.

`JSONSchema` is deliberately one object type rather than a union discriminated
on `type`: TypeScript only shows a keyword's documentation on hover when the
contextual type is a single declaration, so a union would remove the inline
documentation that this package exists to provide. Use `JSONSchema.String`,
`JSONSchema.Object`, etc. when you want only a type's own keywords offered.

## Changelog

Release notes, including breaking changes and upgrade guidance, are in the
[CHANGELOG](https://github.com/RemyRylan/json-schema-typed/blob/main/CHANGELOG.md).

## Exports supported in each module

| Name              | Type            | Purpose                                                            |
| ----------------- | --------------- | ------------------------------------------------------------------ |
| `$schema`         | `string`        | Meta-schema URL that can be used with the `$schema` keyword.       |
| `ContentEncoding` | Enum object     | String content encoding strategies.                                |
| `draft`           | `string`        | Specification identifier (`"7"`, `"2019-09"`, `"2020-12"`, `"v1"`).   |
| `Format`          | Enum object     | String formats.                                                    |
| `JSONSchema`      | TypeScript Type | Used to define a JSON Schema.                                      |
| `keywords`        | `readonly string[]` | All the keywords for the imported specification.               |
| `KeywordByType`   | TypeScript Type | Keyword names grouped by the `type` they apply to.                 |
| `TypeName`        | Enum object     | Simple type names for the `type` keyword.                          |

## Versioning

This library follows [semantic versioning](https://semver.org).

## Contributing

The draft modules at the package root are generated from the definitions in
[`src/draft`](https://github.com/RemyRylan/json-schema-typed/tree/main/src/draft).
See [`src/README.md`](https://github.com/RemyRylan/json-schema-typed/blob/main/src/README.md)
for how to build and test.

---

## Maintainers

- [Remy Rylan](https://github.com/RemyRylan)

## License

[BSD-3-Clause][license]

[license]: https://github.com/RemyRylan/json-schema-typed/blob/main/LICENSE.md
