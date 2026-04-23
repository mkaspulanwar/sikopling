import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: true,
		timeout: 120_000
	},
	testMatch: '**/*.e2e.{ts,js}'
});
