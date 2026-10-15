// Guards the published package contents: only the generated modules at the
// package root (plus README, LICENSE, package.json). Tests, sources, and the
// spec/test-suite submodules must never ship.

import assert from "node:assert/strict";
import {
  execFileSync,
  type ExecFileSyncOptionsWithStringEncoding,
} from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";

type PackEntry = { path: string; size: number };
type PackInfo = { files: PackEntry[]; size: number; unpackedSize: number };

/**
 * Runs `npm pack --dry-run --json` and returns the package's pack info. Under
 * `npm run`, npm exposes its own CLI entry point as `npm_execpath`, so we run
 * it through the current Node binary — portable, and no shell needed (on
 * Windows `npm` is a `.cmd` shim that cannot be spawned directly). Outside
 * `npm run`, fall back to the shell.
 */
const npmPackDryRun = (): PackInfo => {
  const args = ["pack", "--dry-run", "--json", "--ignore-scripts"];
  const options: ExecFileSyncOptionsWithStringEncoding = {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  };
  const npmCli = process.env["npm_execpath"];
  const stdout = npmCli
    ? execFileSync(process.execPath, [npmCli, ...args], options)
    : execFileSync("npm", args, { ...options, shell: true });
  // npm 10 prints an array of packages; npm 12 prints an object keyed by
  // package name. Both carry the same per-package fields.
  const parsed = JSON.parse(stdout) as PackInfo[] | Record<string, PackInfo>;
  const info = Array.isArray(parsed) ? parsed[0] : Object.values(parsed)[0];
  assert.ok(info && Array.isArray(info.files), `unexpected npm pack output: ${stdout.slice(0, 200)}`);
  return info;
};

const pack = npmPackDryRun();

test("package ships only root-level modules and metadata", () => {
  for (const { path } of pack.files) {
    assert.ok(!path.includes("/"), `nested file in package: ${path}`);
    assert.match(
      path,
      /^(?:[\w]+\.(?:js|d\.ts)|README\.md|LICENSE\.md|package\.json)$/,
      `unexpected file in package: ${path}`,
    );
  }
});

test("package ships every module referenced by exports", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
    exports: Record<string, Record<string, string>>;
  };
  const shipped = new Set(pack.files.map((f) => f.path));
  for (const entry of Object.values(pkg.exports)) {
    for (const target of Object.values(entry)) {
      assert.ok(shipped.has(target.replace(/^\.\//, "")), `${target} not in package`);
    }
  }
});

test("package stays lightweight", () => {
  assert.ok(pack.unpackedSize < 400_000, `unpacked ${pack.unpackedSize} bytes`);
  assert.ok(pack.size < 100_000, `packed ${pack.size} bytes`);
});
