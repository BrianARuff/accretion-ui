import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

const cssEscape = (value: string): string =>
  value.replace(/[^a-zA-Z0-9_\u0080-\uFFFF-]/g, (character) => {
    const codePoint = character.codePointAt(0);
    return codePoint === undefined ? character : `\\${codePoint.toString(16)} `;
  });

if (!globalThis.CSS) {
  Object.defineProperty(globalThis, 'CSS', {
    value: { escape: cssEscape },
    writable: true,
  });
} else if (!globalThis.CSS.escape) {
  globalThis.CSS.escape = cssEscape;
}
