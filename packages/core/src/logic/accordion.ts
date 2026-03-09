import type {
  AccordionIds,
  AccordionItemDescriptor,
  AccordionNavigateOptions,
  AccordionToggleOptions,
  AccordionValueInput,
  AccordionValueOutput,
} from '../types/accordion';

export const DEFAULT_ACCORDION_SIZE = 'comfortable';
export const DEFAULT_HEADING_LEVEL = 3;

export const normalizeAccordionValue = (
  value: AccordionValueInput,
  multiple: boolean,
): string[] => {
  if (Array.isArray(value)) {
    const normalized = Array.from(new Set(value.filter(Boolean)));
    return multiple ? normalized : normalized.slice(0, 1);
  }

  if (typeof value === 'string' && value.length > 0) {
    return [value];
  }

  return [];
};

export const toAccordionValueOutput = (
  value: string[],
  multiple: boolean,
): AccordionValueOutput => {
  if (multiple) {
    return value;
  }

  return value[0] ?? null;
};

export const isAccordionItemOpen = (
  currentValue: string[],
  itemValue: string,
): boolean => currentValue.includes(itemValue);

export const toggleAccordionValue = ({
  collapsible,
  currentValue,
  multiple,
  value,
}: AccordionToggleOptions): string[] => {
  const isOpen = currentValue.includes(value);

  if (multiple) {
    if (isOpen) {
      return currentValue.filter((entry) => entry !== value);
    }

    return [...currentValue, value];
  }

  if (isOpen) {
    return collapsible ? [] : currentValue;
  }

  return [value];
};

export const getNextAccordionItemValue = ({
  currentValue,
  direction,
  items,
  loop,
}: AccordionNavigateOptions): string | null => {
  const enabledItems = items.filter((item) => !item.disabled);

  if (enabledItems.length === 0) {
    return null;
  }

  if (direction === 'first') {
    return enabledItems[0]?.value ?? null;
  }

  if (direction === 'last') {
    return enabledItems[enabledItems.length - 1]?.value ?? null;
  }

  const currentIndex = enabledItems.findIndex(
    (item) => item.value === currentValue,
  );

  if (currentIndex === -1) {
    return enabledItems[0]?.value ?? null;
  }

  const step = direction === 'previous' ? -1 : 1;
  const nextIndex = currentIndex + step;

  if (nextIndex >= 0 && nextIndex < enabledItems.length) {
    return enabledItems[nextIndex]?.value ?? null;
  }

  if (!loop) {
    return enabledItems[currentIndex]?.value ?? null;
  }

  return direction === 'previous'
    ? enabledItems[enabledItems.length - 1]?.value ?? null
    : enabledItems[0]?.value ?? null;
};

export const sanitizeAccordionIdSegment = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';

export const createAccordionIds = (
  rootId: string,
  itemValue: string,
): AccordionIds => {
  const valueSegment = sanitizeAccordionIdSegment(itemValue);
  const idBase = `${rootId}-${valueSegment}`;

  return {
    triggerId: `${idBase}-trigger`,
    headerId: `${idBase}-header`,
    panelId: `${idBase}-panel`,
  };
};
