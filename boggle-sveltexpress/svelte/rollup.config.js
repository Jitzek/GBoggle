import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import alias from '@rollup/plugin-alias';
import path from 'path';

const production = !process.env.ROLLUP_WATCH;

const projectRootDir = path.resolve(__dirname);

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),
		// commonjs might have to process ts output, so put it after ts
		commonjs(),
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		alias({
			entries: [
				{
					find: '@src',
					replacement: path.resolve(projectRootDir, 'src')
				},
				{
					find: '@components',
					replacement: path.resolve(projectRootDir, 'src/components')
				},
				{
					find: '@routes',
					replacement: path.resolve(projectRootDir, 'src/routes')
				},
				{
					find: '@stores',
					replacement: path.resolve(projectRootDir, 'src/stores')
				},
				// @types is useless, not picked up by IntelliSense
				// {
				// 	find: '@types',
				// 	replacement: path.resolve(projectRootDir, 'src/types')
				// }
			]
		})
	],
	watch: {
		clearScreen: false
	}
};
