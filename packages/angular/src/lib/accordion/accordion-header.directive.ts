import { Directive, ElementRef, HostBinding } from '@angular/core';
import { AccordionItemDirective } from './accordion-item.directive';

@Directive({
  exportAs: 'acAccordionHeader',
  selector: '[acAccordionHeader]',
  standalone: true,
})
export class AccordionHeaderDirective {
  @HostBinding('class.ac-accordion__header') readonly headerClass = true;

  @HostBinding('attr.data-disabled')
  get dataDisabled(): '' | null {
    return this.item.isDisabled ? '' : null;
  }

  @HostBinding('attr.data-open')
  get dataOpen(): '' | null {
    return this.item.open ? '' : null;
  }

  @HostBinding('attr.data-orientation')
  get dataOrientation(): string {
    return this.item.accordion.orientation;
  }

  @HostBinding('attr.data-size')
  get dataSize(): string {
    return this.item.accordion.size;
  }

  @HostBinding('attr.data-state')
  get dataState(): 'open' | 'closed' {
    return this.item.open ? 'open' : 'closed';
  }

  @HostBinding('attr.id')
  get hostId(): string {
    return this.elementRef.nativeElement.id || this.item.ids.headerId;
  }

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    readonly item: AccordionItemDirective,
  ) {}
}
