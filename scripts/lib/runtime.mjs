import { spawn, spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));

export const repoRoot = resolve(scriptDir, '..', '..');

const sleep = (milliseconds) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
};

const getListeningPids = (port) => {
  const result = spawnSync(
    'lsof',
    ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t'],
    {
      encoding: 'utf8',
    },
  );

  if (result.status !== 0) {
    return [];
  }

  return result.stdout
    .split('\n')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
};

const getProcessCommand = (pid) => {
  const result = spawnSync('ps', ['-p', String(pid), '-o', 'command='], {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    return '';
  }

  return result.stdout.trim();
};

export const ensurePortAvailable = ({ matchers = [], port }) => {
  const pids = getListeningPids(port);

  if (pids.length === 0) {
    return;
  }

  for (const pid of pids) {
    const command = getProcessCommand(pid);
    const isRepoOwned = matchers.some((matcher) => command.includes(matcher));

    if (!isRepoOwned) {
      throw new Error(
        `Port ${port} is already in use by a non-repo process (${pid}: ${command}).`,
      );
    }

    try {
      process.kill(Number(pid), 'SIGTERM');
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ESRCH') {
        continue;
      }

      throw error;
    }
  }

  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (getListeningPids(port).length === 0) {
      return;
    }

    sleep(100);
  }

  for (const pid of getListeningPids(port)) {
    const command = getProcessCommand(pid);
    const isRepoOwned = matchers.some((matcher) => command.includes(matcher));

    if (!isRepoOwned) {
      continue;
    }

    process.kill(Number(pid), 'SIGKILL');
  }

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (getListeningPids(port).length === 0) {
      return;
    }

    sleep(100);
  }

  throw new Error(`Port ${port} is still in use after attempting cleanup.`);
};

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
