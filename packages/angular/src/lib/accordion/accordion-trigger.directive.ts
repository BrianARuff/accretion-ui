import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
} from '@angular/core';
import { AccordionItemDirective } from './accordion-item.directive';

@Directive({
  exportAs: 'acAccordionTrigger',
  selector: '[acAccordionTrigger]',
  standalone: true,
})
export class AccordionTriggerDirective {
  @HostBinding('class.ac-accordion__trigger') readonly triggerClass = true;
  @HostBinding('attr.data-accretion-accordion-item')
  get dataItem(): string {
    return this.item.value;
  }

  @HostBinding('attr.data-accretion-accordion-trigger')
  readonly dataTrigger = '';

  @HostBinding('attr.data-disabled')
  get dataDisabled(): '' | null {
    return this.isDisabled ? '' : null;
  }

  @HostBinding('attr.data-open')
  get dataOpen(): '' | null {
    return this.item.open ? '' : null;
  }

  @HostBinding('attr.data-orientation')
  get dataOrientation(): string {
    return this.item.accordion.orientation;
  }

  @HostBinding('attr.data-state')
  get dataState(): 'open' | 'closed' {
    return this.item.open ? 'open' : 'closed';
  }

  @HostBinding('attr.aria-controls')
  get ariaControls(): string {
    return this.item.ids.panelId;
  }

  @HostBinding('attr.aria-disabled')
  get ariaDisabled(): 'true' | null {
    return this.isDisabled ? 'true' : null;
  }

  @HostBinding('attr.aria-expanded')
  get ariaExpanded(): 'true' | 'false' {
    return this.item.open ? 'true' : 'false';
  }

  @HostBinding('attr.data-size')
  get dataSize(): string {
    return this.item.accordion.size;
  }

  @HostBinding('attr.disabled')
  get disabledAttribute(): '' | null {
    return this.isNativeButton && this.isDisabled ? '' : null;
  }

  @HostBinding('attr.id')
  get hostId(): string {
    return this.elementRef.nativeElement.id || this.item.ids.triggerId;
  }

  @HostBinding('attr.role')
  get role(): 'button' | null {
    return this.isNativeButton ? null : 'button';
  }

  @HostBinding('attr.tabindex')
  get tabIndex(): '0' | '-1' | null {
    if (this.isNativeButton) {
      return null;
    }

    return this.isDisabled ? '-1' : '0';
  }

  @HostBinding('attr.type')
  get type(): 'button' | null {
    return this.isNativeButton ? 'button' : null;
  }

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    readonly item: AccordionItemDirective,
  ) {}

  get isDisabled(): boolean {
    return (
      this.item.isDisabled ||
      (this.isNativeButton &&
        (this.elementRef.nativeElement as HTMLButtonElement).disabled)
    );
  }

  private get isNativeButton(): boolean {
    return this.elementRef.nativeElement.tagName.toLowerCase() === 'button';
  }

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent): void {
    if (event.defaultPrevented || this.isDisabled) {
      return;
    }

    this.item.accordion.toggleItem(this.item.value);
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.defaultPrevented) {
      return;
    }

    if (!this.isNativeButton && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.item.accordion.toggleItem(this.item.value);
      return;
    }

    if (this.item.accordion.orientation !== 'vertical') {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.item.accordion.focusItem(this.item.value, 'next');
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.item.accordion.focusItem(this.item.value, 'previous');
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.item.accordion.focusItem(this.item.value, 'first');
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.item.accordion.focusItem(this.item.value, 'last');
    }
  }
}
