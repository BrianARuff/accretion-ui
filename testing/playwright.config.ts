import { defineConfig } from '@playwright/test';

const managedServers = process.env.PLAYWRIGHT_MANAGED_SERVERS !== 'false';
const reactSmokePort = process.env.REACT_SMOKE_PORT ?? '3100';
const reactSmokeUrl = `http://127.0.0.1:${reactSmokePort}`;

export default defineConfig({
  fullyParallel: true,
  testDir: './playwright',
  timeout: 45_000,
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  webServer: managedServers
    ? [
        {
          command: `npx next dev --port ${reactSmokePort} --hostname 127.0.0.1`,
          cwd: 'smoke-apps/react-next',
          reuseExistingServer: true,
          timeout: 240_000,
          url: reactSmokeUrl,
        },
        {
          command: 'npx ng serve angular-ssr --host 127.0.0.1 --port 4300',
          env: {
            ...process.env,
            NG_ALLOWED_HOSTS: 'localhost,127.0.0.1',
          },
          reuseExistingServer: true,
          timeout: 240_000,
          url: 'http://localhost:4300',
        },
        {
          command: 'npx storybook dev -p 6006 --ci --host 127.0.0.1',
          cwd: 'chromatic/react',
          reuseExistingServer: true,
          timeout: 240_000,
          url: 'http://127.0.0.1:6006',
        },
        {
          command: 'npx ng run angular-ssr:storybook --host 127.0.0.1 --port 6007 --ci',
          reuseExistingServer: true,
          timeout: 240_000,
          url: 'http://127.0.0.1:6007',
        },
      ]
    : undefined,
  projects: [
    {
      name: 'react-smoke',
      testMatch: /react-smoke\.spec\.ts/,
      use: {
        baseURL: reactSmokeUrl,
      },
    },
    {
      name: 'angular-smoke',
      testMatch: /angular-smoke\.spec\.ts/,
      use: {
        baseURL: 'http://localhost:4300',
      },
    },
    {
      name: 'storybook-react',
      testMatch: /storybook-react\.spec\.ts/,
      use: {
        baseURL: 'http://127.0.0.1:6006',
      },
    },
    {
      name: 'storybook-angular',
      testMatch: /storybook-angular\.spec\.ts/,
      use: {
        baseURL: 'http://127.0.0.1:6007',
      },
    },
  ],
});
