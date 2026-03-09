import { Component } from '@angular/core';
import {
  AccordionHeaderDirective,
  AccordionItemDirective,
  AccordionPanelDirective,
  AccordionRootDirective,
  AccordionTriggerDirective,
} from '@accretion-ui/angular';

@Component({
  imports: [
    AccordionRootDirective,
    AccordionItemDirective,
    AccordionHeaderDirective,
    AccordionTriggerDirective,
    AccordionPanelDirective,
  ],
  selector: 'app-root',
  standalone: true,
  template: `
    <main class="page-shell">
      <h1>Angular SSR Smoke Validation</h1>
      <p>
        This app validates the Angular Accordion directives in a real SSR and
        hydration flow.
      </p>

      <section class="demo-grid">
        <article class="demo-card" data-testid="angular-single-card">
          <h2>Single value, controlled state</h2>
          <div class="control-row">
            <button type="button" (click)="singleValue = 'timing'">
              Open timing
            </button>
            <button type="button" (click)="singleValue = null">
              Close all
            </button>
          </div>

          <div
            acAccordion
            [collapsible]="true"
            [value]="singleValue"
            (valueChange)="singleValue = normalizeSingleValue($event)"
            data-testid="angular-single-root"
            id="angular-single-root"
          >
            <div acAccordionItem value="timing">
              <h3 acAccordionHeader>
                <button
                  acAccordionTrigger
                  data-testid="angular-single-trigger-timing"
                  type="button"
                >
                  Delivery timeline
                </button>
              </h3>
              <div
                acAccordionPanel
                data-testid="angular-single-panel-timing"
              >
                Server-rendered Angular markup is present before hydration and
                remains stable after interaction.
              </div>
            </div>

            <div acAccordionItem value="billing">
              <h3 acAccordionHeader>
                <button
                  acAccordionTrigger
                  data-testid="angular-single-trigger-billing"
                  type="button"
                >
                  Billing handoff
                </button>
              </h3>
              <div
                acAccordionPanel
                data-testid="angular-single-panel-billing"
              >
                Controlled state changes through Angular inputs and outputs.
              </div>
            </div>

            <div acAccordionItem [disabled]="true" value="disabled">
              <h3 acAccordionHeader>
                <button
                  acAccordionTrigger
                  data-testid="angular-single-trigger-disabled"
                  type="button"
                >
                  Disabled item
                </button>
              </h3>
              <div
                acAccordionPanel
                data-testid="angular-single-panel-disabled"
              >
                This panel should remain unavailable to interaction.
              </div>
            </div>
          </div>
        </article>

        <article class="demo-card" data-testid="angular-multiple-card">
          <h2>Multiple value mode</h2>
          <div class="control-row">
            <button
              type="button"
              (click)="multipleValue = ['shipping', 'support']"
            >
              Open two items
            </button>
            <button type="button" (click)="multipleValue = []">
              Close all
            </button>
          </div>

          <div
            acAccordion
            [multiple]="true"
            [value]="multipleValue"
            (valueChange)="multipleValue = normalizeMultipleValue($event)"
            data-testid="angular-multiple-root"
            id="angular-multiple-root"
          >
            <div acAccordionItem value="shipping">
              <h3 acAccordionHeader>
                <button
                  acAccordionTrigger
                  data-testid="angular-multiple-trigger-shipping"
                  type="button"
                >
                  Shipping policy
                </button>
              </h3>
              <div
                acAccordionPanel
                data-testid="angular-multiple-panel-shipping"
              >
                Multiple mode keeps independent sections open.
              </div>
            </div>

            <div acAccordionItem value="support">
              <h3 acAccordionHeader>
                <button
                  acAccordionTrigger
                  data-testid="angular-multiple-trigger-support"
                  type="button"
                >
                  Support window
                </button>
              </h3>
              <div
                acAccordionPanel
                data-testid="angular-multiple-panel-support"
              >
                Keyboard and pointer controls should continue to work after
                hydration.
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  `,
})
export class AppComponent {
  multipleValue: string[] = ['shipping'];
  singleValue: string | null = 'timing';

  normalizeMultipleValue(value: string | string[] | null): string[] {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'string') {
      return [value];
    }

    return [];
  }

  normalizeSingleValue(value: string | string[] | null): string | null {
    if (Array.isArray(value)) {
      return value[0] ?? null;
    }

    return value;
  }
}
