import {
  Directive,
  DoCheck,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';
import { createAccordionIds } from '../../../../core/src/logic/accordion';
import type { AccordionIds } from '../../../../core/src/types/accordion';
import { AccordionRootDirective } from './accordion-root.directive';

@Directive({
  exportAs: 'acAccordionItem',
  selector: '[acAccordionItem]',
  standalone: true,
})
export class AccordionItemDirective implements DoCheck {
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ required: true }) value!: string;
  @Output() readonly openChange = new EventEmitter<boolean>();

  @HostBinding('class.ac-accordion__item') readonly itemClass = true;

  @HostBinding('attr.data-disabled')
  get dataDisabled(): '' | null {
    return this.isDisabled ? '' : null;
  }

  @HostBinding('attr.data-open')
  get dataOpen(): '' | null {
    return this.open ? '' : null;
  }

  @HostBinding('attr.data-orientation')
  get dataOrientation(): string {
    return this.accordion.orientation;
  }

  @HostBinding('attr.data-size')
  get dataSize(): string {
    return this.accordion.size;
  }

  @HostBinding('attr.data-state')
  get dataState(): 'open' | 'closed' {
    return this.open ? 'open' : 'closed';
  }

  private previousOpen: boolean | null = null;

  constructor(readonly accordion: AccordionRootDirective) {}

  ngDoCheck(): void {
    if (this.previousOpen === null) {
      this.previousOpen = this.open;
      return;
    }

    if (this.previousOpen !== this.open) {
      this.previousOpen = this.open;
      this.openChange.emit(this.open);
    }
  }

  get ids(): AccordionIds {
    return createAccordionIds(this.accordion.rootId, this.value);
  }

  get isDisabled(): boolean {
    return this.accordion.disabled || this.disabled;
  }

  get open(): boolean {
    return this.accordion.isItemOpen(this.value);
  }
}
