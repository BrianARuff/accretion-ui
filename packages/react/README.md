# `@accretion-ui/react`

Native React Accordion primitives from the Accretion UI shared source layer.

## Install

```bash
npm install @accretion-ui/react react react-dom
```

## Use

Import the shared stylesheet once near the app root:

```tsx
import '@accretion-ui/react/styles.css';
```

Use the compound API:

```tsx
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@accretion-ui/react';

export function Example() {
  return (
    <Accordion defaultValue="delivery" id="faq-accordion">
      <AccordionItem value="delivery">
        <AccordionHeader>
          <AccordionTrigger>Delivery timeline</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Server-rendered React markup is present before hydration and remains stable after interaction.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
```

## Styling Requirements

The package expects `@accretion-ui/react/styles.css` to be loaded before rendering the Accordion. The stylesheet exposes CSS variables such as:

- `--ac-accordion-root-border-color`
- `--ac-accordion-root-border-color-open`
- `--ac-accordion-trigger-background-open`
- `--ac-accordion-trigger-min-height`
- `--ac-accordion-panel-padding-inline`
- `--ac-accordion-panel-padding-block-start`
- `--ac-accordion-focus-ring-color`
- `--ac-accordion-focus-ring-offset`

## SSR Expectations

The package is designed for client-first usage with SSR validation included in this repo through the Next.js smoke app.

- Deterministic item ids render on the server when you provide a stable Accordion `id`.
- Closed panels remain mounted to keep hydration predictable.
- `hiddenUntilFound` is corrected after hydration because React DOM serializes the initial `hidden` attribute as a boolean during SSR.

## Storybook

Run the local React Storybook from the repo root:

```bash
npm run storybook:react
```

## Testing And Development Notes

- Unit and integration coverage lives in the repo root under `testing/`.
- SSR smoke validation uses `smoke-apps/react-next`.
- Browser smoke checks run with `npm run smoke:react`.
