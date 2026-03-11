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

const assertIncludes = (html, value, message) => {
  if (!html.includes(value)) {
    throw new Error(message);
  }
};

const targetConfig = {
  angular: {
    assertions: (html) => {
      assertIncludes(
        html,
        'Angular SSR Smoke Validation',
        'Angular SSR response is missing the page heading.',
      );
      assertIncludes(
        html,
        'data-testid="angular-single-root"',
        'Angular SSR response is missing the single accordion root.',
      );
      assertIncludes(
        html,
        'aria-expanded="true"',
        'Angular SSR response is missing expanded trigger markup.',
      );
      assertIncludes(
        html,
        'id="angular-single-root-timing-panel"',
        'Angular SSR response is missing deterministic panel ids.',
      );
      assertIncludes(
        html,
        'styles.css',
        'Angular SSR response is missing the stylesheet reference.',
      );
    },
    buildSteps: [
      ['npm', ['run', 'build:angular']],
      ['npx', ['ng', 'build', 'angular-ssr']],
    ],
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
    assertions: (html) => {
      assertIncludes(
        html,
        'React SSR Smoke Validation',
        'React SSR response is missing the page heading.',
      );
      assertIncludes(
        html,
        'data-testid="react-single-root"',
        'React SSR response is missing the single accordion root.',
      );
      assertIncludes(
        html,
        'aria-expanded="true"',
        'React SSR response is missing expanded trigger markup.',
      );
      assertIncludes(
        html,
        'id="react-single-root-timing-panel"',
        'React SSR response is missing deterministic panel ids.',
      );
      assertIncludes(
        html,
        'rel="stylesheet"',
        'React SSR response is missing the stylesheet link tag.',
      );
      assertIncludes(
        html,
        '/_next/static/',
        'React SSR response is missing the bundled stylesheet asset reference.',
      );
    },
    buildSteps: [
      ['npm', ['run', 'build:react']],
      ['npm', ['run', '--workspace', '@accretion-ui/react-smoke', 'build']],
    ],
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
  throw new Error('Usage: node scripts/run-ssr-validation.mjs <react|angular>');
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

  const response = await fetch(config.url);

  if (!response.ok) {
    throw new Error(`SSR validation request failed with ${response.status}`);
  }

  const html = await response.text();
  config.assertions(html);
} finally {
  cleanup();
}
