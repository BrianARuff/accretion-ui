'use client';

import * as React from 'react';
import {
  DEFAULT_ACCORDION_SIZE,
  getNextAccordionItemValue,
  normalizeAccordionValue,
  toAccordionValueOutput,
  toggleAccordionValue,
  type AccordionItemDescriptor,
} from '@accretion-ui/core';
import AccordionRootView from '../../generated/AccordionRootView';
import { AccordionRootContextProvider } from './context';
import type { AccordionProps } from './types';
import { assignRef, cx, dataAttribute } from './utils';

const getTriggerDescriptors = (
  rootElement: HTMLDivElement | null,
): AccordionItemDescriptor[] => {
  if (!rootElement) {
    return [];
  }

  return Array.from(
    rootElement.querySelectorAll<HTMLButtonElement>(
      '[data-accretion-accordion-trigger]',
    ),
  )
    .map((element) => ({
      disabled:
        element.disabled || element.getAttribute('aria-disabled') === 'true',
      value: element.dataset.accretionAccordionItem ?? '',
    }))
    .filter((item) => item.value.length > 0);
};

const AccordionComponent = React.forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(
    {
      children,
      className,
      collapsible = true,
      defaultValue,
      disabled = false,
      hiddenUntilFound = false,
      id,
      loopFocus = true,
      multiple = false,
      onValueChange,
      orientation = 'vertical',
      size = DEFAULT_ACCORDION_SIZE,
      value,
      ...rest
    },
    forwardedRef,
  ) {
    const generatedId = React.useId().replace(/:/g, '');
    const rootId = id ?? `ac-accordion-${generatedId}`;
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
      normalizeAccordionValue(defaultValue, multiple),
    );

    const controlledValue = normalizeAccordionValue(value, multiple);
    const currentValue = value !== undefined ? controlledValue : uncontrolledValue;

    const emitValueChange = (nextValue: string[]) => {
      onValueChange?.(toAccordionValueOutput(nextValue, multiple));
    };

    const commitValue = (nextValue: string[]) => {
      if (value === undefined) {
        setUncontrolledValue(nextValue);
      }

      emitValueChange(nextValue);
    };

    const toggleItem = (itemValue: string) => {
      if (disabled) {
        return;
      }

      const nextValue = toggleAccordionValue({
        collapsible,
        currentValue,
        multiple,
        value: itemValue,
      });

      commitValue(nextValue);
    };

    const focusItem = (
      currentItemValue: string,
      direction: 'next' | 'previous' | 'first' | 'last',
    ) => {
      const descriptors = getTriggerDescriptors(rootRef.current);
      const nextItemValue = getNextAccordionItemValue({
        currentValue: currentItemValue,
        direction,
        items: descriptors,
        loop: loopFocus,
      });

      if (!nextItemValue || !rootRef.current) {
        return;
      }

      const nextTrigger = rootRef.current.querySelector<HTMLButtonElement>(
        `[data-accretion-accordion-item="${CSS.escape(nextItemValue)}"]`,
      );

      nextTrigger?.focus();
    };

    const handleRootRef = (element: HTMLDivElement | null) => {
      rootRef.current = element;
      assignRef(forwardedRef, element);
    };

    return (
      <AccordionRootContextProvider
        value={{
          collapsible,
          disabled,
          focusItem,
          hiddenUntilFound,
          loopFocus,
          multiple,
          orientation,
          rootId,
          rootRef,
          size,
          toggleItem,
          value: currentValue,
        }}
      >
        <AccordionRootView
          attributes={{
            ...rest,
            className: cx('ac-accordion', className),
            'data-disabled': dataAttribute(disabled),
            'data-open': dataAttribute(currentValue.length > 0),
            'data-orientation': orientation,
            'data-size': size,
            'data-state': currentValue.length > 0 ? 'open' : 'closed',
            id: rootId,
            ref: handleRootRef,
          }}
        >
          {children}
        </AccordionRootView>
      </AccordionRootContextProvider>
    );
  },
);

export { AccordionComponent as Accordion };
