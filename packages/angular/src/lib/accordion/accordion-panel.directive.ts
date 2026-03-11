import { NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  booleanAttribute,
} from '@angular/core';
import { AccordionItemDirective } from './accordion-item.directive';

@Component({
  exportAs: 'acAccordionPanel',
  imports: [NgIf],
  selector: '[acAccordionPanel]',
  standalone: true,
  template: `
    <ng-container *ngIf="shouldRenderContent">
      <ng-content />
    </ng-container>
  `,
})
export class AccordionPanelDirective {
  @Input({ transform: booleanAttribute }) hiddenUntilFound?: boolean;
  @Input({ transform: booleanAttribute }) keepMounted = false;

  @HostBinding('class.ac-accordion__panel') readonly panelClass = true;

  @HostBinding('attr.aria-labelledby')
  get labelledBy(): string {
    return this.item.ids.triggerId;
  }

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

  @HostBinding('attr.hidden')
  get hiddenState(): '' | 'until-found' | null {
    if (this.item.open) {
      return null;
    }

    return this.useHiddenUntilFound ? 'until-found' : '';
  }

  @HostBinding('attr.id')
  get hostId(): string {
    return this.elementRef.nativeElement.id || this.item.ids.panelId;
  }

  @HostBinding('attr.role')
  readonly role = 'region';

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    readonly item: AccordionItemDirective,
  ) {}

  get shouldRenderContent(): boolean {
    return this.item.open || this.keepMounted || this.useHiddenUntilFound;
  }

  private get useHiddenUntilFound(): boolean {
    return this.hiddenUntilFound ?? this.item.accordion.hiddenUntilFound;
  }
}
