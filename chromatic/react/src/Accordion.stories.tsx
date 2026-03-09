import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '../../../packages/react/src';

const meta = {
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component:
          'Accessible Accordion primitives for React, generated from the shared Mitosis-authored view layer and wrapped with a framework-native state model.',
      },
    },
  },
  title: 'React/Accordion',
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Accordion defaultValue="timeline" id="storybook-react-default">
      <AccordionItem value="timeline">
        <AccordionHeader>
          <AccordionTrigger>Delivery timeline</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Estimate, production status, and implementation timing stay grouped in
          one scannable section.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="handoff">
        <AccordionHeader>
          <AccordionTrigger>Engineering handoff</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          The handoff checklist can stay collapsed until a delivery owner needs
          it.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
};

export const ControlledSingle: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('billing');

    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setValue('billing')} type="button">
            Open billing
          </button>
          <button onClick={() => setValue(null)} type="button">
            Close all
          </button>
        </div>

        <Accordion
          collapsible
          id="storybook-react-controlled"
          onValueChange={(nextValue) =>
            setValue(Array.isArray(nextValue) ? nextValue[0] ?? null : nextValue)
          }
          value={value}
        >
          <AccordionItem value="billing">
            <AccordionHeader>
              <AccordionTrigger>Billing handoff</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              Programmatic state changes work the same way as user interaction.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="support">
            <AccordionHeader>
              <AccordionTrigger>Support readiness</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              This state is controlled from React state to demonstrate a
              framework-native API.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
};

export const Multiple: Story = {
  render: () => (
    <Accordion defaultValue={['shipping', 'support']} id="storybook-react-multiple" multiple>
      <AccordionItem value="shipping">
        <AccordionHeader>
          <AccordionTrigger>Shipping policy</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Multiple mode keeps parallel topics open without forcing a single
          active section.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="support">
        <AccordionHeader>
          <AccordionTrigger>Support window</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          This is useful for FAQ layouts where people compare sections.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
};

export const DisabledItem: Story = {
  render: () => (
    <Accordion defaultValue="active" id="storybook-react-disabled">
      <AccordionItem value="active">
        <AccordionHeader>
          <AccordionTrigger>Active item</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Enabled items remain interactive.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem disabled value="disabled">
        <AccordionHeader>
          <AccordionTrigger>Disabled item</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Disabled items should not toggle or receive action styling.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
};
