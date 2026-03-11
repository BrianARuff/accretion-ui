# `@accretion-ui/angular`

Native Angular Accordion primitives delivered as standalone host-bound primitives attached directly to real DOM elements.

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

Import the standalone primitives where you use them:

```ts
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  type AccordionValueOutput,
} from '@accretion-ui/angular';
```

Use those imports in the Angular component metadata where the Accordion appears:

```ts
@Component({
  imports: [Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionPanel],
  standalone: true,
})
export class ExampleComponent {
  handleValueChange(value: AccordionValueOutput) {
    console.log(value);
  }
}
```

Template example:

```html
<div acAccordion defaultValue="delivery" id="faq-accordion" (valueChange)="handleValueChange($event)">
  <div acAccordionItem value="delivery">
    <h3 acAccordionHeader>
      <button acAccordionTrigger [showIndicator]="false" type="button">
        <span>Delivery timeline</span>
        <span aria-hidden="true">Custom</span>
      </button>
    </h3>
    <div acAccordionPanel>
      Angular inputs and outputs control the component without adding extra wrapper elements.
    </div>
  </div>
</div>
```

Closed panel content is not mounted by default. Set `keepMounted` on `acAccordionPanel` when a hidden panel must stay in the DOM.
Shared types such as `AccordionValueInput`, `AccordionValueOutput`, `AccordionOrientation`, and `AccordionSize` are exported from the package entry point.
Set `[showIndicator]="false"` on `acAccordionTrigger` when you want to replace the default chevron with fully custom trigger content.

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
- The primitives are applied directly to native host elements, so no wrapper nodes are added around triggers or panels.
- Closed panel containers stay in the DOM for stable `aria-controls` relationships, while panel content is unmounted by default unless `keepMounted` or `hiddenUntilFound` is enabled.

## Storybook

Run the local Angular Storybook from the repo root:

```bash
npm run storybook:angular
```

Published Chromatic Storybook:

- [https://69ae3de6fef62640081354ec-fbslbprsoe.chromatic.com/](https://69ae3de6fef62640081354ec-fbslbprsoe.chromatic.com/)

When Chromatic is republished, update this Storybook link and the root README link in the repo.

## Testing And Development Notes

- Angular integration tests run through `ng test angular-ssr --watch=false`.
- SSR smoke validation uses `smoke-apps/angular-ssr`.
- Browser smoke checks run with `npm run smoke:angular`.
