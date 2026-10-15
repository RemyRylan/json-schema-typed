# Changelog

All notable changes to this package are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the package
follows [Semantic Versioning](https://semver.org).

## [9.0.0] - 2026-10-15

### Breaking

- **`$vocabulary` is `Record<string, boolean>`** in 2019-09 and 2020-12,
  matching the meta-schema. It was `Record<string, string>`. (#119)
- **`prefixItems` must be an array of schemas** in 2020-12. A bare schema was
  accepted before; the spec requires a non-empty array.
- **`contentEncoding` is `string`** in 2019-09 and 2020-12 (it remains the
  RFC 2045 union in draft-07). The spec allows RFC 4648 encodings (`base16`,
  `base32`, `base32hex`, `base64url`) as well as RFC 2045, so the closed union
  rejected valid values. Schema authors are unaffected; code that *reads*
  `schema.contentEncoding` now sees `string` instead of the union.
- **`JSONSchema<Value>` with a union `Value` constrains `type` to those
  names** (plus the list form): `JSONSchema<string | null>` accepts
  `type: "string"`, `"null"`, or `["string", "null"]`. Previously the generic
  only constrained `type` for a single-kind `Value`.
- **The Deno distribution is retired.** `dist/deno` and the deno.land/x
  publishing are gone; Deno can consume the npm package directly
  (`npm:json-schema-typed`). Previously published deno.land/x versions remain
  available but will not be updated.

`JSONSchema` itself keeps its 8.x shape — one object type with every keyword,
`type` accepting any string on the unconstrained type, full documentation on
hover, and `JSONSchema.Interface` interchangeable with its object half — so
existing schemas and schema-reading code compile unchanged.

Not done, deliberately (#118): checking keywords against `type` at every
nesting level. It is achievable only by making `JSONSchema` a union
discriminated on `type`, and TypeScript then stops showing keyword
documentation on hover wherever the union cannot be resolved to one member
(every schema without a `type`, and every position when list `type`s are
supported). Inline documentation is the point of this package, so `JSONSchema`
stays a single object type. `JSONSchema.Object`, `JSONSchema.String`, etc.
remain for top-level narrowing.

### Added

- `json-schema-typed/v1`: the upcoming **JSON Schema v1** specification,
  generated from the spec repository's `main` branch. v1 is **unreleased**;
  the module tracks the working copy ahead of the first release (`v1/2026`)
  and may change until then. The main package export stays on `2020-12` until
  v1 is published.
- `json-schema-typed/next`: a moving alias for the newest in-progress
  specification (currently the same module as `v1`).
- `json-schema-typed/2019-09` and `json-schema-typed/2020-12` as the canonical
  import paths. `draft-2019-09` and `draft-2020-12` remain as aliases that
  re-export the same modules, so the two paths share identical types and
  enums.
- `KeywordByType` is exported from every module (keyword names grouped by the
  `type` they apply to), along with `JSONSchema.KeywordsFor` and
  `JSONSchema.Narrowed`, the pieces `JSONSchema.String`, `JSONSchema.Object`,
  etc. are built from. `JSONSchema.Interface` takes a third type parameter,
  `Sub`, for the type of nested schemas.
- `ContentEncoding.Base16`, `Base32`, `Base32Hex`, and `Base64URL` (2019-09
  and 2020-12).
- draft 2020-12 includes the deprecated `$recursiveAnchor` and `$recursiveRef`
  keywords that its meta-schema still lists.
- Compile-time compatibility tests generated from the official
  JSON-Schema-Test-Suite for every supported dialect (every suite schema
  type-checks as a `JSONSchema`), and a hover-documentation test against the
  TypeScript language service.

### Changed

- **License is BSD-3-Clause** (was BSD-2-Clause). The JSON Schema v1
  documentation is published under BSD-3-Clause, so the whole package now uses
  that license rather than mixing the two. The only addition is the standard
  non-endorsement clause.
- The in-place applicators (`allOf`, `anyOf`, `oneOf`, `not`, `if`, `then`,
  `else`), `contains`, and `contentSchema` no longer inherit the parent
  schema's `type`; a child may declare any type, as the spec allows. On the
  read side this means `schema.allOf[0]` is a `JSONSchema` rather than a
  `JSONSchema<Value, SchemaType>`.
- draft-07's `format` keyword is permitted on every type, not only strings
  (`{ type: "integer", format: "int64" }`).
- `JSONSchema.TypeValue` is now `TypeName | \`${TypeName}\` |
  MaybeReadonlyArray<...>`; it no longer includes `string` (nor `string`'s
  method types) that leaked in through `ValueOf<TypeName>`, so a plain
  `string` is no longer a `TypeValue`. The unconstrained `JSONSchema` still
  accepts any string for `type`, via `string & {}` so that completions keep
  offering the known names.
- 2020-12 keyword documentation refreshed to the patch 1 text
  (draft-bhutton-json-schema-01): `type`, `contains`, `minContains`, `$id`,
  `contentEncoding`, RFC 3339 format wording, and the applicator annotation
  notes.
- Keyword descriptions are re-flowed consistently; the previous build skipped
  formatting keyword descriptions because of a bug.
- The repository is a plain Node.js project: `src/` holds the generator, the
  package root holds the published modules, and the build runs with
  `npm run build` (Node 22.18+, TypeScript 7). The published declarations are
  tested against TypeScript 4.7 and up.

### Fixed

- `maxContains` and `minContains` carry `minimum: 0`; `deprecated` and
  `$recursiveAnchor` carry `default: false`, matching the meta-schemas.
- Typo in the `email` format documentation and a broken RFC 5321 link.
- `$dynamicRef` in v1 is a plain anchor name, not a URI reference, per the v1
  meta-schema.

## [8.0.2] - 2025-11-17

- Documentation, reference link, and credit updates.
- Build migrated to Deno 2 (thanks @jhnns).

## [8.0.0] - 2022-03-04

### Breaking

- Now a
  [pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
- Many exports were renamed. The export table in the README reflects the new
  names, which are considered final.
- `JSONSchema` changed from an `interface` to a `type`: a union that allows
  `boolean` values in order to align with the JSON Schema spec. Code that
  extended the `JSONSchema` interface can extend `JSONSchema.Interface`.
- The main package export moved from Draft 7 to Draft 2020-12. Import
  `json-schema-typed/draft-07` to keep using Draft 7.

## [7.0.0] - 2019-02-20

Older history is available in the
[git log](https://github.com/RemyRylan/json-schema-typed/commits/main).

[9.0.0]: https://github.com/RemyRylan/json-schema-typed/compare/v8.0.2...v9.0.0
[8.0.2]: https://github.com/RemyRylan/json-schema-typed/compare/v8.0.0...v8.0.2
[8.0.0]: https://github.com/RemyRylan/json-schema-typed/compare/fd50f0d...v8.0.0
[7.0.0]: https://github.com/RemyRylan/json-schema-typed/commit/fd50f0d
