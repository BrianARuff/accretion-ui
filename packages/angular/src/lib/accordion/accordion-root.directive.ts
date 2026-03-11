import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';
import {
  DEFAULT_ACCORDION_SIZE,
  getNextAccordionItemValue,
  normalizeAccordionValue,
  toAccordionValueOutput,
  toggleAccordionValue,
} from '../../../../core/src/logic/accordion';
import type {
  AccordionItemDescriptor,
  AccordionNavigationDirection,
  AccordionOrientation,
  AccordionSize,
  AccordionValueInput,
  AccordionValueOutput,
} from '../../../../core/src/types/accordion';
import { createAccordionRootId } from './accordion-id';

@Directive({
  exportAs: 'acAccordion',
  selector: '[acAccordion]',
  standalone: true,
})
export class AccordionRootDirective {
  @Input({ transform: booleanAttribute }) collapsible = true;
  @Input() defaultValue: AccordionValueInput;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) hiddenUntilFound = false;
  @Input({ transform: booleanAttribute }) loopFocus = true;
  @Input({ transform: booleanAttribute }) multiple = false;
  @Input() orientation: AccordionOrientation = 'vertical';
  @Input() size: AccordionSize = DEFAULT_ACCORDION_SIZE;
  @Input() value: AccordionValueInput;
  @Output() readonly valueChange = new EventEmitter<AccordionValueOutput>();

  @HostBinding('class.ac-accordion') readonly accordionClass = true;

  @HostBinding('attr.data-disabled')
  get dataDisabled(): '' | null {
    return this.disabled ? '' : null;
  }

  @HostBinding('attr.data-open')
  get dataOpen(): '' | null {
    return this.currentValue.length > 0 ? '' : null;
  }

  @HostBinding('attr.data-orientation')
  get dataOrientation(): AccordionOrientation {
    return this.orientation;
  }

  @HostBinding('attr.data-size')
  get dataSize(): AccordionSize {
    return this.size;
  }

  @HostBinding('attr.data-state')
  get dataState(): 'open' | 'closed' {
    return this.currentValue.length > 0 ? 'open' : 'closed';
  }

  private uncontrolledValue: string[] | null = null;

  readonly rootId: string;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {
    const hostElement = this.elementRef.nativeElement;
    this.rootId = hostElement.id || createAccordionRootId();
    hostElement.id = this.rootId;
  }

  get currentValue(): string[] {
    if (this.value !== undefined) {
      return normalizeAccordionValue(this.value, this.multiple);
    }

    if (this.uncontrolledValue === null) {
      this.uncontrolledValue = normalizeAccordionValue(
        this.defaultValue,
        this.multiple,
      );
    }

    return this.uncontrolledValue;
  }

  isItemOpen(itemValue: string): boolean {
    return this.currentValue.includes(itemValue);
  }

  toggleItem(itemValue: string): void {
    if (this.disabled) {
      return;
    }

    const nextValue = toggleAccordionValue({
      collapsible: this.collapsible,
      currentValue: this.currentValue,
      multiple: this.multiple,
      value: itemValue,
    });

    if (this.value === undefined) {
      this.uncontrolledValue = nextValue;
    }

    this.valueChange.emit(toAccordionValueOutput(nextValue, this.multiple));
  }

  focusItem(
    currentValue: string,
    direction: AccordionNavigationDirection,
  ): void {
    const triggerDescriptors = Array.from(
      this.elementRef.nativeElement.querySelectorAll<HTMLElement>(
        '[acAccordionTrigger]',
      ),
    )
      .map<AccordionItemDescriptor>((element) => ({
        disabled:
          element.hasAttribute('data-disabled') ||
          (element instanceof HTMLButtonElement && element.disabled),
        value: element.getAttribute('data-accretion-accordion-item') ?? '',
      }))
      .filter((item) => item.value.length > 0);

    const dedupedDescriptors = new Map<string, AccordionItemDescriptor>();

    for (const descriptor of triggerDescriptors) {
      const existingDescriptor = dedupedDescriptors.get(descriptor.value);

      if (!existingDescriptor) {
        dedupedDescriptors.set(descriptor.value, descriptor);
        continue;
      }

      dedupedDescriptors.set(descriptor.value, {
        ...existingDescriptor,
        disabled: Boolean(existingDescriptor.disabled && descriptor.disabled),
      });
    }

    const nextValue = getNextAccordionItemValue({
      currentValue,
      direction,
      items: Array.from(dedupedDescriptors.values()),
      loop: this.loopFocus,
    });

    if (!nextValue) {
      return;
    }

    const nextTrigger = this.elementRef.nativeElement.querySelector<HTMLElement>(
      `[data-accretion-accordion-item="${CSS.escape(nextValue)}"]`,
    );

    nextTrigger?.focus();
  }
}
