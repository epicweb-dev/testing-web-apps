/// <reference types="vitest" />
/// <reference types="vite/client" />

import { react } from './other/test-setup/vitejs-plugin-react.cjs'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		include: ['./app/**/*.test.{ts,tsx}'],
		environment: 'jsdom',
		setupFiles: ['./other/test-setup/setup-test-env.ts'],
		// 🐨 add globalSetup config here
		coverage: {
			include: ['app/**/*.{ts,tsx}'],
			all: true,
		},
	},
})
