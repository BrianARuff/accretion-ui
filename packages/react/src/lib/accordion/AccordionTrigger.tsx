'use client';

import * as React from 'react';
import AccordionTriggerView from '../../generated/AccordionTriggerView';
import {
  useAccordionItemContext,
  useAccordionRootContext,
} from './context';
import type { AccordionTriggerProps } from './types';
import { cx, dataAttribute } from './utils';

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(function AccordionTrigger(
  {
    children,
    className,
    disabled,
    onClick,
    onKeyDown,
    showIndicator = true,
    ...rest
  },
  forwardedRef,
) {
  const accordion = useAccordionRootContext();
  const item = useAccordionItemContext();
  const isDisabled = accordion.disabled || item.disabled || Boolean(disabled);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || isDisabled) {
      return;
    }

    accordion.toggleItem(item.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || accordion.orientation !== 'vertical') {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      accordion.focusItem(item.value, 'next');
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      accordion.focusItem(item.value, 'previous');
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      accordion.focusItem(item.value, 'first');
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      accordion.focusItem(item.value, 'last');
    }
  };

  return (
    <AccordionTriggerView
      attributes={{
        ...rest,
        'aria-controls': item.ids.panelId,
        'aria-disabled': isDisabled || undefined,
        'aria-expanded': item.open,
        className: cx('ac-accordion__trigger', className),
        'data-accretion-accordion-item': item.value,
        'data-accretion-accordion-trigger': '',
        'data-disabled': dataAttribute(isDisabled),
        'data-indicator': showIndicator ? 'default' : 'hidden',
        'data-open': dataAttribute(item.open),
        'data-orientation': accordion.orientation,
        'data-size': accordion.size,
        'data-state': item.open ? 'open' : 'closed',
        disabled: isDisabled,
        id: rest.id ?? item.ids.triggerId,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        ref: forwardedRef,
        type: rest.type ?? 'button',
      }}
    >
      {children}
    </AccordionTriggerView>
  );
});
