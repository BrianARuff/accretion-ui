import type { Meta, StoryObj } from '@storybook/angular';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '../../../packages/angular/src/public-api';

const meta: Meta = {
  decorators: [
    (story) => ({
      ...story(),
      moduleMetadata: {
        imports: [
          Accordion,
          AccordionItem,
          AccordionHeader,
          AccordionTrigger,
          AccordionPanel,
        ],
      },
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Native Angular Accordion primitives applied directly to host elements for one-element-per-part rendering.',
      },
    },
  },
  title: 'Angular/Accordion',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <div acAccordion defaultValue="timeline" id="storybook-angular-default">
        <div acAccordionItem value="timeline">
          <h3 acAccordionHeader>
            <button acAccordionTrigger type="button">Delivery timeline</button>
          </h3>
          <div acAccordionPanel>
            Estimate, production status, and implementation timing stay grouped in one scannable section.
          </div>
        </div>

        <div acAccordionItem value="handoff">
          <h3 acAccordionHeader>
            <button acAccordionTrigger type="button">Engineering handoff</button>
          </h3>
          <div acAccordionPanel>
            The handoff checklist can stay collapsed until a delivery owner needs it.
          </div>
        </div>
      </div>
    `,
  }),
};

export const ControlledSingle: Story = {
  render: () => ({
    props: {
      singleValue: 'billing',
      toSingleValue(nextValue: string | string[] | null) {
        this.singleValue = Array.isArray(nextValue) ? nextValue[0] ?? null : nextValue;
      },
    },
    template: `
      <div style="display:grid;gap:1rem;">
        <div style="display:flex;gap:0.75rem;">
          <button type="button" (click)="singleValue = 'billing'">Open billing</button>
          <button type="button" (click)="singleValue = null">Close all</button>
        </div>

        <div
          acAccordion
          [collapsible]="true"
          [value]="singleValue"
          (valueChange)="toSingleValue($event)"
          id="storybook-angular-controlled"
        >
          <div acAccordionItem value="billing">
            <h3 acAccordionHeader>
              <button acAccordionTrigger type="button">Billing handoff</button>
            </h3>
            <div acAccordionPanel>
              Programmatic state changes work the same way as direct interaction.
            </div>
          </div>

          <div acAccordionItem value="support">
            <h3 acAccordionHeader>
              <button acAccordionTrigger type="button">Support readiness</button>
            </h3>
            <div acAccordionPanel>
              The directive model uses Angular inputs and outputs instead of a custom event bridge.
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const Multiple: Story = {
  render: () => ({
    props: {
      multipleDefaultValue: ['shipping', 'support'],
    },
    template: `
      <div
        acAccordion
        [defaultValue]="multipleDefaultValue"
        [multiple]="true"
        id="storybook-angular-multiple"
      >
        <div acAccordionItem value="shipping">
          <h3 acAccordionHeader>
            <button acAccordionTrigger type="button">Shipping policy</button>
          </h3>
          <div acAccordionPanel>
            Multiple mode keeps parallel topics open without forcing a single active section.
          </div>
        </div>

        <div acAccordionItem value="support">
          <h3 acAccordionHeader>
            <button acAccordionTrigger type="button">Support window</button>
          </h3>
          <div acAccordionPanel>
            This is useful for FAQ layouts where people compare sections.
          </div>
        </div>
      </div>
    `,
  }),
};

export const DisabledItem: Story = {
  render: () => ({
    template: `
      <div acAccordion defaultValue="active" id="storybook-angular-disabled">
        <div acAccordionItem value="active">
          <h3 acAccordionHeader>
            <button acAccordionTrigger type="button">Active item</button>
          </h3>
          <div acAccordionPanel>Enabled items remain interactive.</div>
        </div>

        <div acAccordionItem [disabled]="true" value="disabled">
          <h3 acAccordionHeader>
            <button acAccordionTrigger type="button">Disabled item</button>
          </h3>
          <div acAccordionPanel>
            Disabled items should not toggle or receive action styling.
          </div>
        </div>
      </div>
    `,
  }),
};
