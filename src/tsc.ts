import { execFileSync } from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { createRequire } from "node:module";

/**
 * Compiles the generated draft modules to JavaScript + declaration files by
 * running `tsc` on a tsconfig written next to them. TypeScript 7 ships only
 * the native compiler (no JavaScript API), so the CLI is the stable interface.
 *
 * @param sourceFiles - Paths to the generated TypeScript modules
 * @param outputDir - Directory where the `.js` and `.d.ts` files are written
 */
export async function compileTypeScript(
  sourceFiles: string[],
  outputDir: string,
): Promise<void> {
  if (sourceFiles.length === 0) return;
  const buildDir = path.dirname(sourceFiles[0]);
  const tsconfigPath = path.join(buildDir, "tsconfig.json");

  await fs.writeFile(
    tsconfigPath,
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2020",
          module: "ES2020",
          declaration: true,
          strict: true,
          newLine: "lf",
          rootDir: buildDir,
          outDir: outputDir,
          types: [],
          skipLibCheck: true,
        },
        files: sourceFiles.map((file) => path.basename(file)),
      },
      undefined,
      2,
    ) + "\n",
  );

  // Resolve the `tsc` binary from the installed `typescript` package so the
  // build does not depend on PATH or npm's bin shims.
  const require = createRequire(import.meta.url);
  const tsc = path.join(
    path.dirname(require.resolve("typescript/package.json")),
    "bin",
    "tsc",
  );

  try {
    execFileSync(process.execPath, [tsc, "-p", tsconfigPath], {
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    });
  } catch (error) {
    const { stdout, stderr } = error as { stdout?: string; stderr?: string };
    throw new Error(
      `TypeScript compilation failed:\n${stdout ?? ""}${stderr ?? ""}`,
    );
  }
}
