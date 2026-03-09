'use client';

import * as React from 'react';
import {
  createAccordionIds,
  isAccordionItemOpen,
} from '@accretion-ui/core';
import AccordionItemView from '../../generated/AccordionItemView';
import {
  AccordionItemContextProvider,
  useAccordionRootContext,
} from './context';
import type { AccordionItemProps } from './types';
import { cx, dataAttribute } from './utils';

export function AccordionItem({
  children,
  className,
  disabled = false,
  onOpenChange,
  value,
  ...rest
}: AccordionItemProps) {
  const accordion = useAccordionRootContext();
  const isDisabled = accordion.disabled || disabled;
  const open = isAccordionItemOpen(accordion.value, value);
  const previousOpen = React.useRef<boolean | null>(null);

  React.useEffect(() => {
    if (previousOpen.current === null) {
      previousOpen.current = open;
      return;
    }

    if (previousOpen.current !== open) {
      previousOpen.current = open;
      onOpenChange?.(open);
    }
  }, [onOpenChange, open]);

  return (
    <AccordionItemContextProvider
      value={{
        disabled: isDisabled,
        ids: createAccordionIds(accordion.rootId, value),
        open,
        value,
      }}
    >
      <AccordionItemView
        attributes={{
          ...rest,
          className: cx('ac-accordion__item', className),
          'data-disabled': dataAttribute(isDisabled),
          'data-open': dataAttribute(open),
          'data-orientation': accordion.orientation,
          'data-size': accordion.size,
          'data-state': open ? 'open' : 'closed',
        }}
      >
        {children}
      </AccordionItemView>
    </AccordionItemContextProvider>
  );
}
