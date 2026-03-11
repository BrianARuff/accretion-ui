import { Component, signal } from '@angular/core';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  type AccordionValueOutput,
} from '../../../../packages/angular/src/public-api';

const multipleItems = ['support', 'launch', 'reporting'];

@Component({
  selector: 'app-root',
  imports: [
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionTrigger,
    AccordionPanel,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly multipleValue = signal<string[]>(['support', 'reporting']);
  readonly singleValue = signal<string | null>('delivery');

  collapseAllSingle(): void {
    this.singleValue.set(null);
  }

  expandAllMultiple(): void {
    this.multipleValue.set(multipleItems);
  }

  onMultipleValueChange(value: AccordionValueOutput): void {
    if (Array.isArray(value)) {
      this.multipleValue.set(value);
      return;
    }

    this.multipleValue.set(value ? [value] : []);
  }

  onSingleValueChange(value: AccordionValueOutput): void {
    if (Array.isArray(value)) {
      this.singleValue.set(value[0] ?? null);
      return;
    }

    this.singleValue.set(value);
  }
}
