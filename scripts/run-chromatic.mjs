import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');
const target = process.argv[2];

const configByTarget = {
  react: {
    envVar: 'CHROMATIC_PROJECT_TOKEN_REACT_MITOSIS',
    workspace: '@accretion-ui/chromatic-react',
  },
  angular: {
    envVar: 'CHROMATIC_PROJECT_TOKEN_ANGULAR_MITOSIS',
    workspace: '@accretion-ui/chromatic-angular',
  },
};

if (!target || !(target in configByTarget)) {
  throw new Error('Usage: node scripts/run-chromatic.mjs <react|angular>');
}

const { envVar, workspace } = configByTarget[target];
const token = process.env[envVar];

if (!token) {
  throw new Error(`Missing required environment variable: ${envVar}`);
}

const result = spawnSync(
  'npm',
  [
    'run',
    '--workspace',
    workspace,
    'chromatic',
    '--',
    `--project-token=${token}`,
  ],
  {
    cwd: repoRoot,
    stdio: 'inherit',
    env: process.env,
  },
);

process.exit(result.status ?? 1);
