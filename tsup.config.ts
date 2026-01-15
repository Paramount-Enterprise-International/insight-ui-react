import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/components/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: 'dist',
  // If you rely on JSX runtime, tsup will handle it; keep external to avoid bundling react.
  external: ['react', 'react-dom'],
});
