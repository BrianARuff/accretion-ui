'use client';

import * as React from 'react';
import AccordionPanelView from '../../generated/AccordionPanelView';
import {
  useAccordionItemContext,
  useAccordionRootContext,
} from './context';
import type { AccordionPanelProps } from './types';
import { cx, dataAttribute } from './utils';

export function AccordionPanel({
  children,
  className,
  hiddenUntilFound,
  ...rest
}: AccordionPanelProps) {
  const accordion = useAccordionRootContext();
  const item = useAccordionItemContext();
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const finalHiddenUntilFound =
    hiddenUntilFound ?? accordion.hiddenUntilFound;

  React.useEffect(() => {
    const panelElement = panelRef.current;

    if (!panelElement) {
      return;
    }

    if (item.open) {
      panelElement.removeAttribute('hidden');
      return;
    }

    if (finalHiddenUntilFound) {
      panelElement.setAttribute('hidden', 'until-found');
      return;
    }

    panelElement.setAttribute('hidden', '');
  }, [finalHiddenUntilFound, item.open]);

  return (
    <AccordionPanelView
      attributes={{
        ...rest,
        'aria-labelledby': item.ids.triggerId,
        className: cx('ac-accordion__panel', className),
        'data-disabled': dataAttribute(item.disabled),
        'data-open': dataAttribute(item.open),
        'data-orientation': accordion.orientation,
        'data-size': accordion.size,
        'data-state': item.open ? 'open' : 'closed',
        hidden: item.open
          ? undefined
          : finalHiddenUntilFound
            ? 'until-found'
            : true,
        id: rest.id ?? item.ids.panelId,
        ref: panelRef,
        role: rest.role ?? 'region',
      }}
    >
      {children}
    </AccordionPanelView>
  );
}
