import {
  createAccordionIds,
  getNextAccordionItemValue,
  normalizeAccordionValue,
  toAccordionValueOutput,
  toggleAccordionValue,
} from '@accretion-ui/core';

describe('accordion logic', () => {
  it('normalizes single-mode values to one entry', () => {
    expect(normalizeAccordionValue(['alpha', 'beta', 'alpha'], false)).toEqual([
      'alpha',
    ]);
    expect(normalizeAccordionValue(['alpha', 'beta', 'alpha'], true)).toEqual([
      'alpha',
      'beta',
    ]);
    expect(normalizeAccordionValue('alpha', false)).toEqual(['alpha']);
  });

  it('toggles values for single and multiple modes', () => {
    expect(
      toggleAccordionValue({
        collapsible: true,
        currentValue: ['alpha'],
        multiple: false,
        value: 'alpha',
      }),
    ).toEqual([]);

    expect(
      toggleAccordionValue({
        collapsible: false,
        currentValue: ['alpha'],
        multiple: false,
        value: 'alpha',
      }),
    ).toEqual(['alpha']);

    expect(
      toggleAccordionValue({
        collapsible: true,
        currentValue: ['alpha'],
        multiple: true,
        value: 'beta',
      }),
    ).toEqual(['alpha', 'beta']);
  });

  it('converts values back to framework-facing output', () => {
    expect(toAccordionValueOutput(['alpha', 'beta'], true)).toEqual([
      'alpha',
      'beta',
    ]);
    expect(toAccordionValueOutput(['alpha', 'beta'], false)).toBe('alpha');
    expect(toAccordionValueOutput([], false)).toBeNull();
  });

  it('navigates enabled items and skips disabled entries', () => {
    const items = [
      { value: 'alpha' },
      { disabled: true, value: 'beta' },
      { value: 'gamma' },
    ];

    expect(
      getNextAccordionItemValue({
        currentValue: 'alpha',
        direction: 'next',
        items,
        loop: true,
      }),
    ).toBe('gamma');

    expect(
      getNextAccordionItemValue({
        currentValue: 'gamma',
        direction: 'next',
        items,
        loop: true,
      }),
    ).toBe('alpha');

    expect(
      getNextAccordionItemValue({
        currentValue: 'gamma',
        direction: 'previous',
        items,
        loop: false,
      }),
    ).toBe('alpha');
  });

  it('creates deterministic ids from the root id and item value', () => {
    expect(createAccordionIds('release-plan', 'Billing & Support')).toEqual({
      headerId: 'release-plan-billing-support-header',
      panelId: 'release-plan-billing-support-panel',
      triggerId: 'release-plan-billing-support-trigger',
    });
  });
});
