import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', 
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8080', 
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }, // Necesar pentru cerința Gold (Responsiveness)
    },
  ],

  // porneste singur app-u
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
});