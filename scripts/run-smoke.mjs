import {
  ensurePortAvailable,
  runCommand,
  startServer,
  stopServer,
  waitForUrl,
} from './lib/runtime.mjs';

const target = process.argv[2];
const reactSmokePort = process.env.REACT_SMOKE_PORT ?? '3100';
const reactSmokeUrl = `http://127.0.0.1:${reactSmokePort}`;

const targetConfig = {
  angular: {
    buildSteps: [
      ['npm', ['run', 'build:angular']],
      ['npx', ['ng', 'build', 'angular-ssr']],
    ],
    playwrightProject: 'angular-smoke',
    start: {
      args: ['smoke-apps/angular-ssr/dist/angular-ssr/server/server.mjs'],
      command: 'node',
      env: {
        ...process.env,
        NG_ALLOWED_HOSTS: 'localhost,127.0.0.1',
        PORT: '4300',
      },
    },
    url: 'http://localhost:4300',
  },
  react: {
    buildSteps: [
      ['npm', ['run', 'build:react']],
      ['npm', ['run', '--workspace', '@accretion-ui/react-smoke', 'build']],
    ],
    playwrightProject: 'react-smoke',
    start: {
      args: ['next', 'start', '--port', reactSmokePort, '--hostname', '127.0.0.1'],
      command: 'npx',
      cwd: 'smoke-apps/react-next',
      env: {
        ...process.env,
        PORT: reactSmokePort,
      },
    },
    url: reactSmokeUrl,
  },
};

if (!target || !(target in targetConfig)) {
  throw new Error('Usage: node scripts/run-smoke.mjs <react|angular>');
}

const config = targetConfig[target];

ensurePortAvailable({
  matchers:
    target === 'react'
      ? [`next start --port ${reactSmokePort}`, '@accretion-ui/react-smoke']
      : ['angular-ssr/dist/angular-ssr/server/server.mjs', 'angular-ssr'],
  port: target === 'react' ? Number(reactSmokePort) : 4300,
});

for (const [command, args] of config.buildSteps) {
  runCommand({ args, command });
}

const server = startServer(config.start);

const cleanup = () => stopServer(server);
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(130);
});
process.on('SIGTERM', () => {
  cleanup();
  process.exit(143);
});

try {
  waitForUrl(config.url);
  runCommand({
    args: [
      'playwright',
      'test',
      '--config',
      'testing/playwright.config.ts',
      '--project',
      config.playwrightProject,
    ],
    command: 'npx',
    env: {
      ...process.env,
      PLAYWRIGHT_MANAGED_SERVERS: 'false',
    },
  });
} finally {
  cleanup();
}
