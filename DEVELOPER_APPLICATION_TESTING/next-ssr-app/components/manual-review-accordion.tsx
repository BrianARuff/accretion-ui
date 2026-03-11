'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  type AccordionValueOutput,
} from '../../../packages/react/dist/index.js';

const multipleItems = ['support', 'launch', 'reporting'];

const toSingleValue = (value: AccordionValueOutput): string | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
};

const toMultipleValue = (value: AccordionValueOutput): string[] => {
  if (Array.isArray(value)) {
    return value;
  }

  return value ? [value] : [];
};

export function ManualReviewAccordion() {
  const [singleValue, setSingleValue] = useState<string | null>('delivery');
  const [multipleValue, setMultipleValue] = useState<string[]>([
    'support',
    'reporting',
  ]);

  return (
    <section className="review-grid">
      <article className="review-card">
        <div className="card-header">
          <div>
            <p className="card-kicker">Controlled single</p>
            <h2>Delivery decision flow</h2>
          </div>
          <div className="control-row">
            <button onClick={() => setSingleValue('delivery')} type="button">
              Open delivery
            </button>
            <button onClick={() => setSingleValue('handoff')} type="button">
              Open handoff
            </button>
            <button onClick={() => setSingleValue(null)} type="button">
              Collapse all
            </button>
          </div>
        </div>

        <Accordion
          collapsible
          id="developer-react-single"
          onValueChange={(value) => setSingleValue(toSingleValue(value))}
          value={singleValue}
        >
          <AccordionItem value="delivery">
            <AccordionHeader className="split-trigger-row">
              <AccordionTrigger
                className="split-trigger split-trigger--label"
                data-testid="developer-react-delivery-label-trigger"
              >
                Delivery timeline
              </AccordionTrigger>
              <AccordionTrigger
                aria-label="Toggle delivery timeline"
                className="split-trigger split-trigger--icon"
                data-testid="developer-react-delivery-icon-trigger"
                id="developer-react-single-delivery-trigger-icon"
                showIndicator={false}
              >
                <span aria-hidden="true" className="split-trigger__icon">
                  +
                </span>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              Estimated milestones, environment readiness, and downstream
              release timing stay grouped together without forcing a custom
              wrapper around the native parts.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="handoff">
            <AccordionHeader>
              <AccordionTrigger showIndicator={false}>
                <span>Engineering handoff</span>
                <span aria-hidden="true" className="trigger-meta">
                  Spec pack
                </span>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel keepMounted>
              This panel uses <code>keepMounted</code> so the content remains in
              the DOM even after it closes.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem disabled value="archived">
            <AccordionHeader>
              <AccordionTrigger>Archived scope</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              Disabled items stay present but should not toggle.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </article>

      <article className="review-card">
        <div className="card-header">
          <div>
            <p className="card-kicker">Controlled multiple</p>
            <h2>Launch readiness checklist</h2>
          </div>
          <div className="control-row">
            <button
              onClick={() => setMultipleValue(multipleItems)}
              type="button"
            >
              Expand all
            </button>
            <button onClick={() => setMultipleValue([])} type="button">
              Collapse all
            </button>
          </div>
        </div>

        <Accordion
          id="developer-react-multiple"
          multiple
          onValueChange={(value) => setMultipleValue(toMultipleValue(value))}
          value={multipleValue}
        >
          <AccordionItem value="support">
            <AccordionHeader>
              <AccordionTrigger>Support readiness</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              Verify support scripts, escalation notes, and launch-window
              coverage.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="launch">
            <AccordionHeader>
              <AccordionTrigger>Launch communications</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel hiddenUntilFound>
              This panel opts into hidden-until-found behavior so browser search
              can still surface the section.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="reporting">
            <AccordionHeader>
              <AccordionTrigger>Operational reporting</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              KPI ownership, rollout dashboards, and follow-up review notes stay
              open independently in multiple mode.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </article>
    </section>
  );
}
