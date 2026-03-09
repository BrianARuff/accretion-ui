'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@accretion-ui/react';

export function AccordionDemo() {
  const [multipleValue, setMultipleValue] = useState<string[]>(['shipping']);
  const [singleValue, setSingleValue] = useState<string | null>('timing');

  return (
    <section className="demo-grid">
      <article className="demo-card" data-testid="react-single-card">
        <h2>Single value, controlled state</h2>
        <div className="control-row">
          <button onClick={() => setSingleValue('timing')} type="button">
            Open timing
          </button>
          <button onClick={() => setSingleValue(null)} type="button">
            Close all
          </button>
        </div>

        <Accordion
          collapsible
          data-testid="react-single-root"
          id="react-single-root"
          onValueChange={(value) => {
            if (Array.isArray(value)) {
              setSingleValue(value[0] ?? null);
              return;
            }

            setSingleValue(value);
          }}
          value={singleValue}
        >
          <AccordionItem value="timing">
            <AccordionHeader>
              <AccordionTrigger data-testid="react-single-trigger-timing">
                Delivery timeline
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel data-testid="react-single-panel-timing">
              Server-rendered React markup is present before hydration and
              remains stable after interaction.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="billing">
            <AccordionHeader>
              <AccordionTrigger data-testid="react-single-trigger-billing">
                Billing handoff
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel data-testid="react-single-panel-billing">
              Controlled state changes flow through the package API.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem disabled value="disabled">
            <AccordionHeader>
              <AccordionTrigger data-testid="react-single-trigger-disabled">
                Disabled item
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel data-testid="react-single-panel-disabled">
              This panel should stay unavailable to interaction.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </article>

      <article className="demo-card" data-testid="react-multiple-card">
        <h2>Multiple value mode</h2>
        <div className="control-row">
          <button
            onClick={() => setMultipleValue(['shipping', 'support'])}
            type="button"
          >
            Open two items
          </button>
          <button onClick={() => setMultipleValue([])} type="button">
            Close all
          </button>
        </div>

        <Accordion
          data-testid="react-multiple-root"
          id="react-multiple-root"
          multiple
          onValueChange={(value) => {
            if (Array.isArray(value)) {
              setMultipleValue(value);
              return;
            }

            setMultipleValue(value ? [value] : []);
          }}
          value={multipleValue}
        >
          <AccordionItem value="shipping">
            <AccordionHeader>
              <AccordionTrigger data-testid="react-multiple-trigger-shipping">
                Shipping policy
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel data-testid="react-multiple-panel-shipping">
              Multiple mode keeps independent sections open.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="support">
            <AccordionHeader>
              <AccordionTrigger data-testid="react-multiple-trigger-support">
                Support window
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel data-testid="react-multiple-panel-support">
              Keyboard and pointer controls should continue to work after
              hydration.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </article>
    </section>
  );
}
