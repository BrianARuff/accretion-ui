import {
  cpSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');
const compiledRoot = resolve(repoRoot, 'dist', 'out-tsc', 'angular');
const packageDistRoot = resolve(repoRoot, 'dist', 'packages', 'angular');
const importPathRewrite = {
  from: '../../../../core/src/',
  to: '../../../core/src/',
};

const rewritePackageImports = (directory) => {
  for (const entry of readdirSync(directory)) {
    const entryPath = resolve(directory, entry);
    const entryStat = statSync(entryPath);

    if (entryStat.isDirectory()) {
      rewritePackageImports(entryPath);
      continue;
    }

    if (!entryPath.endsWith('.js') && !entryPath.endsWith('.d.ts')) {
      continue;
    }

    const fileContents = readFileSync(entryPath, 'utf8');
    const updatedContents = fileContents.replaceAll(
      importPathRewrite.from,
      importPathRewrite.to,
    );

    if (updatedContents !== fileContents) {
      writeFileSync(entryPath, updatedContents, 'utf8');
    }
  }
};

rmSync(packageDistRoot, { recursive: true, force: true });
mkdirSync(packageDistRoot, { recursive: true });

const compileResult = spawnSync(
  'npx',
  ['ngc', '-p', 'packages/angular/tsconfig.lib.json'],
  {
    cwd: repoRoot,
    stdio: 'inherit',
    env: process.env,
  },
);

if (compileResult.status !== 0) {
  process.exit(compileResult.status ?? 1);
}

cpSync(resolve(compiledRoot, 'angular', 'src'), resolve(packageDistRoot, 'src'), {
  recursive: true,
});
cpSync(resolve(compiledRoot, 'core', 'src'), resolve(packageDistRoot, 'core', 'src'), {
  recursive: true,
});
rewritePackageImports(resolve(packageDistRoot, 'src'));
cpSync(resolve(repoRoot, 'packages', 'angular', 'src', 'styles.css'), resolve(packageDistRoot, 'styles.css'));
cpSync(resolve(repoRoot, 'packages', 'angular', 'README.md'), resolve(packageDistRoot, 'README.md'));

const sourcePackageJson = JSON.parse(
  readFileSync(resolve(repoRoot, 'packages', 'angular', 'package.json'), 'utf8'),
);

const distPackageJson = {
  name: sourcePackageJson.name,
  version: sourcePackageJson.version,
  description: sourcePackageJson.description,
  type: 'module',
  sideEffects: ['styles.css'],
  peerDependencies: sourcePackageJson.peerDependencies,
  dependencies: sourcePackageJson.dependencies,
  exports: {
    '.': {
      types: './src/public-api.d.ts',
      default: './src/public-api.js',
    },
    './styles.css': './styles.css',
  },
  types: './src/public-api.d.ts',
};

writeFileSync(
  resolve(packageDistRoot, 'package.json'),
  `${JSON.stringify(distPackageJson, null, 2)}\n`,
  'utf8',
);
