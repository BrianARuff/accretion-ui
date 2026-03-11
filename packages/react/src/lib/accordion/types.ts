'use client';

import type * as React from 'react';
import type {
  AccordionOrientation,
  AccordionSize,
  AccordionValueInput,
  AccordionValueOutput,
} from '@accretion-ui/core';

export interface AccordionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  collapsible?: boolean;
  defaultValue?: AccordionValueInput;
  disabled?: boolean;
  hiddenUntilFound?: boolean;
  loopFocus?: boolean;
  multiple?: boolean;
  onValueChange?: (value: AccordionValueOutput) => void;
  orientation?: AccordionOrientation;
  size?: AccordionSize;
  value?: AccordionValueInput;
}

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  value: string;
}

export interface AccordionHeaderProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export interface AccordionPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  hiddenUntilFound?: boolean;
  keepMounted?: boolean;
}
