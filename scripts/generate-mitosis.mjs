import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');
const generatedRoot = resolve(repoRoot, '.generated', 'mitosis');
const reactOutput = resolve(repoRoot, 'packages', 'react', 'src', 'generated');
const angularOutput = resolve(repoRoot, 'packages', 'angular', 'src', 'generated');

for (const targetPath of [generatedRoot, reactOutput, angularOutput]) {
  rmSync(targetPath, { recursive: true, force: true });
}

const cliPath = resolve(repoRoot, 'node_modules', '.bin', 'mitosis');
const buildResult = spawnSync(cliPath, ['build'], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: process.env,
});

if (buildResult.status !== 0) {
  process.exit(buildResult.status ?? 1);
}

const copyGenerated = (sourceDirectory, destinationDirectory) => {
  if (!existsSync(sourceDirectory)) {
    throw new Error(`Missing generated output at ${sourceDirectory}`);
  }

  mkdirSync(destinationDirectory, { recursive: true });
  cpSync(sourceDirectory, destinationDirectory, { recursive: true });
};

copyGenerated(
  resolve(generatedRoot, 'react', 'packages', 'core', 'src', 'components', 'accordion'),
  reactOutput,
);
copyGenerated(
  resolve(generatedRoot, 'angular', 'packages', 'core', 'src', 'components', 'accordion'),
  angularOutput,
);
