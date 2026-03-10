import { ensurePortAvailable, repoRoot, runCommand } from './lib/runtime.mjs';

const target = process.argv[2];

const configByTarget = {
  angular: {
    matchers: [
      'ng run angular-ssr:storybook',
      '@accretion-ui/chromatic-angular',
      `${repoRoot}/node_modules/.bin/storybook`,
    ],
    port: 6007,
    workspace: '@accretion-ui/chromatic-angular',
  },
  react: {
    matchers: [
      'storybook dev -p 6006',
      '@accretion-ui/chromatic-react',
      `${repoRoot}/node_modules/.bin/storybook`,
    ],
    port: 6006,
    workspace: '@accretion-ui/chromatic-react',
  },
};

if (!target || !(target in configByTarget)) {
  throw new Error('Usage: node scripts/run-storybook.mjs <react|angular>');
}

const config = configByTarget[target];

runCommand({
  args: ['run', 'generate'],
  command: 'npm',
});

ensurePortAvailable({
  matchers: config.matchers,
  port: config.port,
});

runCommand({
  args: ['run', '--workspace', config.workspace, 'storybook'],
  command: 'npm',
});
