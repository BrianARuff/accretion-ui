# `@accretion-ui/angular`

Native Angular Accordion primitives delivered as standalone directives attached directly to real DOM elements.

## Install

```bash
npm install @accretion-ui/angular @angular/common @angular/core rxjs
```

## Use

Add the stylesheet to your Angular app configuration:

```json
{
  "styles": [
    "node_modules/@accretion-ui/angular/styles.css",
    "src/styles.css"
  ]
}
```

Import the standalone directives where you use them:

```ts
import {
  AccordionHeaderDirective,
  AccordionItemDirective,
  AccordionPanelDirective,
  AccordionRootDirective,
  AccordionTriggerDirective,
} from '@accretion-ui/angular';
```

Template example:

```html
<div acAccordion defaultValue="delivery" id="faq-accordion">
  <div acAccordionItem value="delivery">
    <h3 acAccordionHeader>
      <button acAccordionTrigger type="button">Delivery timeline</button>
    </h3>
    <div acAccordionPanel>
      Angular inputs and outputs control the component without adding extra wrapper elements.
    </div>
  </div>
</div>
```

## Styling Requirements

The package expects `@accretion-ui/angular/styles.css` to be present in the application styles pipeline. The stylesheet exposes CSS variables such as:

- `--ac-accordion-root-border-color`
- `--ac-accordion-root-border-color-open`
- `--ac-accordion-trigger-background-open`
- `--ac-accordion-trigger-min-height`
- `--ac-accordion-panel-padding-inline`
- `--ac-accordion-panel-padding-block-start`
- `--ac-accordion-focus-ring-color`
- `--ac-accordion-focus-ring-offset`

## SSR Expectations

This repo validates the Angular package in a real Angular SSR app.

- Stable Accordion `id` values produce deterministic trigger and panel ids during SSR.
- The directives are applied directly to native host elements, so no wrapper nodes are added around triggers or panels.
- Closed panels remain mounted to keep server markup and hydration behavior stable.

## Storybook

Run the local Angular Storybook from the repo root:

```bash
npm run storybook:angular
```

## Testing And Development Notes

- Angular integration tests run through `ng test angular-ssr --watch=false`.
- SSR smoke validation uses `smoke-apps/angular-ssr`.
- Browser smoke checks run with `npm run smoke:angular`.
