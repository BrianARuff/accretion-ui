'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  type AccordionValueOutput,
} from '@accretion-ui/react';

export function AccordionDemo() {
  const [multipleValue, setMultipleValue] = useState<string[]>(['shipping']);
  const [singleValue, setSingleValue] = useState<string | null>('timing');

  const normalizeMultipleValue = (value: AccordionValueOutput): string[] => {
    if (Array.isArray(value)) {
      return value;
    }

    return value ? [value] : [];
  };

  const normalizeSingleValue = (value: AccordionValueOutput): string | null => {
    if (Array.isArray(value)) {
      return value[0] ?? null;
    }

    return value;
  };

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
          onValueChange={(value) => setSingleValue(normalizeSingleValue(value))}
          value={singleValue}
        >
          <AccordionItem value="timing">
            <AccordionHeader className="dual-trigger-row">
              <AccordionTrigger
                className="dual-trigger dual-trigger--label"
                data-testid="react-single-trigger-timing"
              >
                Delivery timeline
              </AccordionTrigger>
              <AccordionTrigger
                aria-label="Toggle delivery timeline"
                className="dual-trigger dual-trigger--icon"
                data-testid="react-single-trigger-timing-icon"
                id="react-single-root-timing-trigger-icon"
                showIndicator={false}
              >
                <span aria-hidden="true" className="dual-trigger__icon">
                  +
                </span>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel data-testid="react-single-panel-timing">
              Server-rendered React markup is present before hydration and
              remains stable after interaction.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="billing">
            <AccordionHeader>
              <AccordionTrigger
                data-testid="react-single-trigger-billing"
                showIndicator={false}
              >
                <span>Billing handoff</span>
                <span aria-hidden="true" data-testid="react-single-trigger-billing-meta">
                  Custom
                </span>
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
          onValueChange={(value) => setMultipleValue(normalizeMultipleValue(value))}
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
