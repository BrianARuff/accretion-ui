let nextAccordionId = 0;

export const createAccordionRootId = (): string => {
  nextAccordionId += 1;
  return `ac-accordion-${nextAccordionId}`;
};
