import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';
import packageJson from './package.json' assert { type: 'json' };

export default [
  {
    input: 'src/editor/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    external: ['react', 'react-dom', 'react-scripts'],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: true }),
      postcss({
        extract: 'style.css',
      }),
      terser(),
      json(),
    ],
  },
  {
    input: 'dist/editor/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts(), del({ hook: 'buildEnd', targets: 'dist/editor' })],
    // .css aren't part of type exports
    external: [/\.css$/],
  },
];
