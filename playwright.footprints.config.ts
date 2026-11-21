import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 45000,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    headless: true,
    browserName: 'chromium',
    launchOptions: { executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' },
  },
  reporter: 'line',
});
