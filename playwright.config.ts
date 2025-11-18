import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL:
      'http://localhost:7701/#/testlogin?fornamn=stefan&efternamn=andersson&email=stefan.andersson%40ehm.se&primarysid=123456&username=anitablom&groups=InternAdmin_ServiceDesk;InternAdmin_Registratur;InternAdmin_SecondLine;InternAdmin_ObjektspecialistFoerskrivningUttag;InternAdmin_Kodverk_Las;InternAdmin_Kodverk_Hantera&type=ADFS',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
});
