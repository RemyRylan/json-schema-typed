# Source

Everything under `src/` is build tooling. The published package is the set of
module files at the repository root (`draft_07`, `2019_09`, `2020_12`, `v1`,
and their aliases, each as `.js` + `.d.ts`), generated from the definitions in
`src/draft/*/definition.ts`.

## Requirements

- Node.js 22.18 or newer (the build scripts are TypeScript and rely on Node's
  built-in type stripping).
- Dev dependencies: TypeScript 7 (the native compiler; the build invokes its
  `tsc` CLI, there is no JavaScript API any more), Prettier 3, `@types/node`.

```sh
npm install
```

## Building

```sh
npm run build
```

This regenerates, from the draft definitions:

- the `.js` and `.d.ts` module files at the root (via `src/mod_template.ts`),
  named by the `MODULES` table in `src/build.ts`
- `spec_definitions/<module>.json`
- `README.md` (from `src/file_templates/README.template.md`)
- `LICENSE.md` (from `src/file_templates/LICENSE.template.md`)
- `version`, `main`, `types`, and `exports` in `package.json`

Intermediate TypeScript is written to `build/` (git-ignored).

## Testing

```sh
npm test
```

- `npm run test:types` type-checks `src/` and `test/`. `test/types.check.ts`
  and `test/suite/*.test.ts` hold compile-time assertions; negative cases use
  `@ts-expect-error`.
- `npm run test:runtime` runs `test/*.test.ts` with `node --test`.
- `npm run check` is a stricter audit than the tests gate on: unused locals and
  parameters across `src/` and `test/`, and the emitted `.d.ts` files compiled
  as a strict consumer would see them (`exactOptionalPropertyTypes`, no
  `skipLibCheck`). It prints nothing when clean.

Prefer `npm run <script>` over `npx tsc` — `npm run` resolves the project's
own TypeScript on every platform, whereas `npx tsc` falls back to an unrelated
registry package called `tsc` if the local binary is not found.

## Preparing a new release

1. Add the release notes to `CHANGELOG.md`.
2. Bump `VERSION` in `src/version.ts`.
3. `npm run build` — the version is written into `package.json`.
4. `npm test`.
5. Commit and push, then tag and push the tag:

   ```sh
   git tag v9.0.0 && git push origin v9.0.0
   ```

   The `Release` workflow (`.github/workflows/release.yml`) builds, verifies
   the generated files are up to date, runs the tests, and publishes to npm
   with provenance via trusted publishing (OIDC). No npm token is involved;
   publishing from a local machine is intentionally not supported because
   `publishConfig.provenance` requires a CI runner.

## Spec sources

Each `src/draft/<id>/spec` directory is a git submodule pointing at the branch
of [json-schema-org/json-schema-spec](https://github.com/json-schema-org/json-schema-spec)
that the definition was written from (`v1` tracks `main`). They are reference
material only; the build does not read them. The commit a definition reflects
is recorded in a comment at the top of its `definition.ts`.

```sh
git submodule update --init --remote src/draft/2020_12/spec
```

## Test-suite compatibility tests

`test/suite/*.test.ts` are generated from the official
[JSON-Schema-Test-Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite)
(submodule at `test/suite/JSON-Schema-Test-Suite`): every schema in the suite
must satisfy our `JSONSchema` type. Regenerate after changing the types or
updating the submodule:

```sh
git submodule update --init test/suite/JSON-Schema-Test-Suite
npm run build
npm run test:suite:generate
```

## Adding a new draft

1. Add the spec branch as a submodule for reference:

   ```sh
   git submodule add -b 2020-12 https://github.com/json-schema-org/json-schema-spec.git ./src/draft/2020_12/spec
   ```

2. Create `src/draft/<id>/definition.ts` using `defineValidationSpec` from
   `src/spec.ts`. Keys must be kept in alphabetical order (the build asserts
   this).
3. Register it in `MODULES` in `src/build.ts` (export name and any aliases).
4. `npm run build`. The newest numeric draft becomes the main package export;
   non-numeric ids such as `v1` never do.
