import { spawn, spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));

export const repoRoot = resolve(scriptDir, '..', '..');

export const runCommand = ({
  args,
  command,
  cwd = repoRoot,
  env = process.env,
}) => {
  const result = spawnSync(command, args, {
    cwd,
    env,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
};

export const startServer = ({
  args,
  command,
  cwd = repoRoot,
  env = process.env,
}) =>
  spawn(command, args, {
    cwd,
    detached: process.platform !== 'win32',
    env,
    stdio: 'inherit',
  });

export const stopServer = (child) => {
  if (!child || child.exitCode !== null) {
    return;
  }

  const isMissingProcessError = (error) =>
    error && typeof error === 'object' && 'code' in error && error.code === 'ESRCH';
  const isPermissionError = (error) =>
    error && typeof error === 'object' && 'code' in error && error.code === 'EPERM';

  if (process.platform === 'win32') {
    try {
      child.kill('SIGTERM');
    } catch (error) {
      if (isMissingProcessError(error) || isPermissionError(error)) {
        return;
      }

      throw error;
    }
    return;
  }

  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch (error) {
    if (isMissingProcessError(error)) {
      return;
    }

    if (isPermissionError(error)) {
      try {
        child.kill('SIGTERM');
        return;
      } catch (killError) {
        if (isMissingProcessError(killError) || isPermissionError(killError)) {
          return;
        }

        throw killError;
      }
    }

    throw error;
  }
};

export const waitForUrl = (url, timeout = 180_000) => {
  const resource = url.startsWith('https://')
    ? url.replace('https://', 'https-get://')
    : url.replace('http://', 'http-get://');

  runCommand({
    args: ['wait-on', resource, '--timeout', String(timeout)],
    command: 'npx',
  });
};
