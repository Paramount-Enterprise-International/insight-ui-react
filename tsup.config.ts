import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/components/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  tsconfig: 'tsconfig.lib.json',
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: 'dist',
  external: ['react', 'react-dom'],
});
