'use client';

import * as React from 'react';
import type {
  AccordionIds,
  AccordionNavigationDirection,
  AccordionOrientation,
  AccordionSize,
} from '@accretion-ui/core';

type AccordionRootContextValue = {
  collapsible: boolean;
  disabled: boolean;
  focusItem: (
    currentValue: string,
    direction: AccordionNavigationDirection,
  ) => void;
  hiddenUntilFound: boolean;
  loopFocus: boolean;
  multiple: boolean;
  orientation: AccordionOrientation;
  rootId: string;
  rootRef: React.MutableRefObject<HTMLDivElement | null>;
  size: AccordionSize;
  toggleItem: (value: string) => void;
  value: string[];
};

type AccordionItemContextValue = {
  disabled: boolean;
  ids: AccordionIds;
  open: boolean;
  value: string;
};

const AccordionRootContext =
  React.createContext<AccordionRootContextValue | null>(null);

const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null);

export const AccordionRootContextProvider = AccordionRootContext.Provider;
export const AccordionItemContextProvider = AccordionItemContext.Provider;

export const useAccordionRootContext = (): AccordionRootContextValue => {
  const context = React.useContext(AccordionRootContext);

  if (!context) {
    throw new Error(
      'Accordion parts must be rendered within the Accordion root component.',
    );
  }

  return context;
};

export const useAccordionItemContext = (): AccordionItemContextValue => {
  const context = React.useContext(AccordionItemContext);

  if (!context) {
    throw new Error(
      'Accordion header, trigger, and panel parts must be rendered within an Accordion item.',
    );
  }

  return context;
};
