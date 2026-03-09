import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@accretion-ui/angular': resolve(
        rootDir,
        'packages/angular/src/public-api.ts',
      ),
      '@accretion-ui/core': resolve(rootDir, 'packages/core/src/index.ts'),
      '@accretion-ui/react': resolve(rootDir, 'packages/react/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['testing/**/*.test.ts', 'testing/**/*.test.tsx'],
    setupFiles: ['testing/vitest.setup.ts'],
  },
});
