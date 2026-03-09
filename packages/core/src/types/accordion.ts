export type AccordionSize = 'compact' | 'comfortable' | 'spacious';
export type AccordionOrientation = 'vertical';
export type AccordionState = 'open' | 'closed';
export type AccordionValueInput = string | string[] | null | undefined;
export type AccordionValueOutput = string | string[] | null;
export type AccordionHiddenAttribute = true | 'until-found' | undefined;
export type AccordionNavigationDirection =
  | 'next'
  | 'previous'
  | 'first'
  | 'last';

export interface AccordionItemDescriptor {
  disabled?: boolean;
  value: string;
}

export interface AccordionToggleOptions {
  collapsible: boolean;
  currentValue: string[];
  multiple: boolean;
  value: string;
}

export interface AccordionNavigateOptions {
  currentValue: string;
  direction: AccordionNavigationDirection;
  items: AccordionItemDescriptor[];
  loop: boolean;
}

export interface AccordionIds {
  headerId: string;
  panelId: string;
  triggerId: string;
}

export interface BaseAccordionViewProps {
  attributes?: Record<string, any>;
  children?: any;
}
