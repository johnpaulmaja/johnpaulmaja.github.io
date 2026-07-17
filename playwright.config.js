// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * If BASE_URL is set (e.g. by the post-deploy smoke test workflow), tests run
 * against that URL and no local server is started.
 * Otherwise, tests run against a locally-served copy of this repo's static
 * files — so PR checks actually test the code being changed, not production.
 */
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Only spin up a local static server when we're NOT pointed at a live URL.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npx serve . -l 3000',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
});
