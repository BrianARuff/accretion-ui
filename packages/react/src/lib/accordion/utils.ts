'use client';

import type * as React from 'react';

export const assignRef = <T,>(
  ref: React.ForwardedRef<T>,
  value: T | null,
): void => {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
};

export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export const dataAttribute = (value: boolean) => (value ? '' : undefined);
