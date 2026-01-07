
// scripts/build.mjs (ESM script)
import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['dist-esm/extension.js'],
  bundle: true,
  platform: 'node',
  format: 'cjs',                // <-- CommonJS output for VS Code
  outfile: 'out/extension.js',
  sourcemap: true,
  external: ['vscode'],         // VS Code provides this at runtime
});
console.log('Built CJS bundle to out/extension.js');
