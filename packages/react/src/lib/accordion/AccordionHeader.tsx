'use client';

import AccordionHeaderView from '../../generated/AccordionHeaderView';
import {
  useAccordionItemContext,
  useAccordionRootContext,
} from './context';
import type { AccordionHeaderProps } from './types';
import { cx, dataAttribute } from './utils';

export function AccordionHeader({
  children,
  className,
  ...rest
}: AccordionHeaderProps) {
  const accordion = useAccordionRootContext();
  const item = useAccordionItemContext();

  return (
    <AccordionHeaderView
      attributes={{
        ...rest,
        className: cx('ac-accordion__header', className),
        'data-disabled': dataAttribute(item.disabled),
        'data-open': dataAttribute(item.open),
        'data-orientation': accordion.orientation,
        'data-size': accordion.size,
        'data-state': item.open ? 'open' : 'closed',
        id: rest.id ?? item.ids.headerId,
      }}
    >
      {children}
    </AccordionHeaderView>
  );
}
