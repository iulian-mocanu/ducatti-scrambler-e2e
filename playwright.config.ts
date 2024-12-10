import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	timeout: 120000, // Set test timeout to 120 seconds
	expect: {
		timeout: 60000, // Set assertion timeout to 60 seconds
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
