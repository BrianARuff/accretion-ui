import {
  ensurePortAvailable,
  repoRoot,
  runCommand,
  startServer,
  stopServer,
  waitForUrl,
} from './lib/runtime.mjs';

const reactSmokePort = process.env.REACT_SMOKE_PORT ?? '3100';
const reactSmokeUrl = `http://127.0.0.1:${reactSmokePort}`;

const servers = [
  {
    args: ['next', 'dev', '--port', reactSmokePort, '--hostname', '127.0.0.1'],
    command: 'npx',
    cwd: 'smoke-apps/react-next',
    url: reactSmokeUrl,
  },
  {
    args: ['ng', 'serve', 'angular-ssr', '--host', '127.0.0.1', '--port', '4300'],
    command: 'npx',
    env: {
      ...process.env,
      NG_ALLOWED_HOSTS: 'localhost,127.0.0.1',
    },
    url: 'http://localhost:4300',
  },
  {
    args: ['storybook', 'dev', '-p', '6006', '--ci', '--host', '127.0.0.1'],
    command: 'npx',
    cwd: 'chromatic/react',
    url: 'http://127.0.0.1:6006',
  },
  {
    args: ['ng', 'run', 'angular-ssr:storybook', '--host', '127.0.0.1', '--port', '6007', '--ci'],
    command: 'npx',
    url: 'http://127.0.0.1:6007',
  },
];

for (const { port, matchers } of [
  {
    matchers: [`next dev --port ${reactSmokePort}`, '@accretion-ui/react-smoke'],
    port: Number(reactSmokePort),
  },
  {
    matchers: ['ng serve angular-ssr', 'angular-ssr'],
    port: 4300,
  },
  {
    matchers: ['storybook dev -p 6006', '@accretion-ui/chromatic-react', `${repoRoot}/node_modules/.bin/storybook`],
    port: 6006,
  },
  {
    matchers: ['ng run angular-ssr:storybook', '@accretion-ui/chromatic-angular'],
    port: 6007,
  },
]) {
  ensurePortAvailable({ matchers, port });
}

const runningServers = servers.map((server) => startServer(server));

const cleanup = () => {
  for (const server of runningServers) {
    stopServer(server);
  }
};

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
  for (const server of servers) {
    waitForUrl(server.url, 240_000);
  }

  runCommand({
    args: ['playwright', 'test', '--config', 'testing/playwright.config.ts'],
    command: 'npx',
    env: {
      ...process.env,
      PLAYWRIGHT_MANAGED_SERVERS: 'false',
    },
  });
} finally {
  cleanup();
}
