import * as ts from "npm:typescript";

/**
 * Compiles a TypeScript file to JavaScript using the TypeScript compiler API.
 * 
 * @param sourceFile - Path to the TypeScript source file
 * @param outputDir - Directory where the compiled files should be written
 */
export async function compileTypeScript(
  sourceFile: string,
  outputDir: string,
): Promise<void> {
  // Use TypeScript compiler API programmatically
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2015,
    module: ts.ModuleKind.ES2015,
    declaration: true,
    outDir: outputDir,
  };

  const host = ts.createCompilerHost(compilerOptions);
  const program = ts.createProgram([sourceFile], compilerOptions, host);

  // Emit the compiled code
  const emitResult = program.emit();

  // Check for compilation errors
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  if (allDiagnostics.length > 0) {
    const errors = allDiagnostics.map((diagnostic) => {
      if (diagnostic.file) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
          diagnostic.start!,
        );
        const message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          "\n",
        );
        return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
      } else {
        return ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      }
    });
    throw new Error(`TypeScript compilation failed:\n${errors.join("\n")}`);
  }

  if (emitResult.emitSkipped) {
    throw new Error("TypeScript compilation was skipped");
  }
}

