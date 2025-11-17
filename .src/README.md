# ⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️

The entire contents of the `.src` directory are unstable and could change at any
moment.

## Preparing a new release

- Manually bump the version number in `.src/version.ts`.
- Run the build script, the new version will be included in the output.

## Building

```sh
deno run -A .src/build.ts
```

By default, the build script will skip building drafts that have no
modifications to their `definition.ts` file. If you need to force a rebuild, add
`--force` onto the end of the build command:

```sh
deno run -A .src/build.ts --force
```

## Adding a new draft

- Add the spec branch as a submodule:

  ```sh
  git submodule add -b 2020-12 git@github.com:json-schema-org/json-schema-spec.git ./.src/draft/2020_12/spec
  ```
