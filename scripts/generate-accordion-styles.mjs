import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');

const readJson = (relativePath) =>
  JSON.parse(readFileSync(resolve(repoRoot, relativePath), 'utf8'));

const primitives = readJson('tokens/primitives.json');
const semantic = readJson('tokens/semantic/accordion.json');

const flattenTokens = (node, path = [], tokens = new Map()) => {
  if (node && typeof node === 'object' && '$value' in node) {
    tokens.set(path.join('.'), node.$value);
    return tokens;
  }

  if (!node || typeof node !== 'object') {
    return tokens;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) {
      continue;
    }

    flattenTokens(value, [...path, key], tokens);
  }

  return tokens;
};

const tokenMap = new Map([
  ...flattenTokens(primitives),
  ...flattenTokens(semantic),
]);

const resolvedCache = new Map();

const resolveTokenValue = (tokenPath) => {
  if (resolvedCache.has(tokenPath)) {
    return resolvedCache.get(tokenPath);
  }

  if (!tokenMap.has(tokenPath)) {
    throw new Error(`Unknown token reference: ${tokenPath}`);
  }

  const rawValue = tokenMap.get(tokenPath);
  const resolveValue = (value) => {
    if (typeof value === 'string') {
      const referenceMatch = value.match(/^\{(.+)\}$/);
      if (referenceMatch) {
        return resolveTokenValue(referenceMatch[1]);
      }

      return value.replace(/\{([^}]+)\}/g, (_, referencePath) =>
        String(resolveTokenValue(referencePath)),
      );
    }

    if (Array.isArray(value)) {
      return value
        .map((entry) => resolveValue(entry))
        .join(', ');
    }

    return String(value);
  };

  const resolvedValue = resolveValue(rawValue);
  resolvedCache.set(tokenPath, resolvedValue);
  return resolvedValue;
};

const cssVariables = {
  '--ac-accordion-root-background': resolveTokenValue(
    'component.accordion.root.background.default',
  ),
  '--ac-accordion-root-border-color': resolveTokenValue(
    'component.accordion.root.border.color',
  ),
  '--ac-accordion-root-border-width': resolveTokenValue(
    'component.accordion.root.border.width',
  ),
  '--ac-accordion-root-border-color-open': resolveTokenValue(
    'component.accordion.root.border.open',
  ),
  '--ac-accordion-root-radius': resolveTokenValue(
    'component.accordion.root.radius',
  ),
  '--ac-accordion-focus-ring-color': resolveTokenValue(
    'component.accordion.focus.ring.color',
  ),
  '--ac-accordion-focus-ring-width': resolveTokenValue(
    'component.accordion.focus.ring.width',
  ),
  '--ac-accordion-focus-ring-offset': resolveTokenValue(
    'component.accordion.focus.ring.offset',
  ),
  '--ac-accordion-disabled-opacity': resolveTokenValue(
    'component.accordion.disabled.opacity',
  ),
  '--ac-accordion-trigger-background': resolveTokenValue(
    'component.accordion.trigger.background.default',
  ),
  '--ac-accordion-trigger-background-hover': resolveTokenValue(
    'component.accordion.trigger.background.hover',
  ),
  '--ac-accordion-trigger-background-active': resolveTokenValue(
    'component.accordion.trigger.background.active',
  ),
  '--ac-accordion-trigger-background-open': resolveTokenValue(
    'component.accordion.trigger.background.open',
  ),
  '--ac-accordion-trigger-foreground': resolveTokenValue(
    'component.accordion.trigger.foreground.default',
  ),
  '--ac-accordion-trigger-foreground-open': resolveTokenValue(
    'component.accordion.trigger.foreground.open',
  ),
  '--ac-accordion-trigger-font-size': resolveTokenValue(
    'component.accordion.trigger.font.size',
  ),
  '--ac-accordion-trigger-font-weight': resolveTokenValue(
    'component.accordion.trigger.font.weight',
  ),
  '--ac-accordion-trigger-line-height': resolveTokenValue(
    'component.accordion.trigger.font.lineHeight',
  ),
  '--ac-accordion-trigger-gap': resolveTokenValue(
    'component.accordion.trigger.gap',
  ),
  '--ac-accordion-panel-background': resolveTokenValue(
    'component.accordion.panel.background.default',
  ),
  '--ac-accordion-panel-foreground': resolveTokenValue(
    'component.accordion.panel.foreground.default',
  ),
  '--ac-accordion-panel-border-color': resolveTokenValue(
    'component.accordion.panel.border.color',
  ),
  '--ac-accordion-item-border-color': resolveTokenValue(
    'component.accordion.panel.border.color',
  ),
  '--ac-accordion-motion-duration': resolveTokenValue(
    'component.accordion.motion.duration',
  ),
  '--ac-accordion-motion-easing': resolveTokenValue(
    'component.accordion.motion.easing',
  ),
};

const sizeVariables = {
  compact: {
    '--ac-accordion-trigger-min-height': resolveTokenValue(
      'component.accordion.sizeVariant.compact.trigger.minHeight',
    ),
    '--ac-accordion-trigger-padding-block': resolveTokenValue(
      'component.accordion.sizeVariant.compact.trigger.paddingBlock',
    ),
    '--ac-accordion-trigger-padding-inline': resolveTokenValue(
      'component.accordion.sizeVariant.compact.trigger.paddingInline',
    ),
    '--ac-accordion-trigger-gap-local': resolveTokenValue(
      'component.accordion.sizeVariant.compact.trigger.gap',
    ),
    '--ac-accordion-root-padding': resolveTokenValue(
      'component.accordion.sizeVariant.compact.trigger.gap',
    ),
    '--ac-accordion-panel-padding-inline': resolveTokenValue(
      'component.accordion.sizeVariant.compact.panel.paddingInline',
    ),
    '--ac-accordion-panel-padding-block-start': resolveTokenValue(
      'component.accordion.sizeVariant.compact.panel.paddingBlockStart',
    ),
    '--ac-accordion-panel-padding-block-end': resolveTokenValue(
      'component.accordion.sizeVariant.compact.panel.paddingBlockEnd',
    ),
  },
  comfortable: {
    '--ac-accordion-trigger-min-height': resolveTokenValue(
      'component.accordion.sizeVariant.comfortable.trigger.minHeight',
    ),
    '--ac-accordion-trigger-padding-block': resolveTokenValue(
      'component.accordion.sizeVariant.comfortable.trigger.paddingBlock',
    ),
    '--ac-accordion-trigger-padding-inline': resolveTokenValue(
      'component.accordion.sizeVariant.comfortable.trigger.paddingInline',
    ),
    '--ac-accordion-trigger-gap-local': resolveTokenValue(
      'component.accordion.sizeVariant.comfortable.trigger.gap',
    ),
    '--ac-accordion-root-padding': resolveTokenValue(
      'component.accordion.sizeVariant.comfortable.trigger.gap',
    ),
    '--ac-accordion-panel-padding-inline': resolveTokenValue(
      'component.accordion.sizeVariant.comfortable.panel.paddingInline',
    ),
    '--ac-accordion-panel-padding-block-start': resolveTokenValue(
      'component.accordion.sizeVariant.comfortable.panel.paddingBlockStart',
    ),
    '--ac-accordion-panel-padding-block-end': resolveTokenValue(
      'component.accordion.sizeVariant.comfortable.panel.paddingBlockEnd',
    ),
  },
  spacious: {
    '--ac-accordion-trigger-min-height': resolveTokenValue(
      'component.accordion.sizeVariant.spacious.trigger.minHeight',
    ),
    '--ac-accordion-trigger-padding-block': resolveTokenValue(
      'component.accordion.sizeVariant.spacious.trigger.paddingBlock',
    ),
    '--ac-accordion-trigger-padding-inline': resolveTokenValue(
      'component.accordion.sizeVariant.spacious.trigger.paddingInline',
    ),
    '--ac-accordion-trigger-gap-local': resolveTokenValue(
      'component.accordion.sizeVariant.spacious.trigger.gap',
    ),
    '--ac-accordion-root-padding': resolveTokenValue(
      'component.accordion.sizeVariant.spacious.trigger.gap',
    ),
    '--ac-accordion-panel-padding-inline': resolveTokenValue(
      'component.accordion.sizeVariant.spacious.panel.paddingInline',
    ),
    '--ac-accordion-panel-padding-block-start': resolveTokenValue(
      'component.accordion.sizeVariant.spacious.panel.paddingBlockStart',
    ),
    '--ac-accordion-panel-padding-block-end': resolveTokenValue(
      'component.accordion.sizeVariant.spacious.panel.paddingBlockEnd',
    ),
  },
};

const renderVariables = (variables) =>
  Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

const css = `/* This file is generated from tokens/primitives.json and tokens/semantic/accordion.json. */
:where(.ac-accordion) {
${renderVariables(cssVariables)}
${renderVariables(sizeVariables.comfortable)}
  display: block;
  margin: 0;
  border: var(--ac-accordion-root-border-width) solid var(--ac-accordion-root-border-color);
  border-radius: var(--ac-accordion-root-radius);
  background: var(--ac-accordion-root-background);
  box-shadow: 0 0 0 0 transparent;
  color: var(--ac-accordion-panel-foreground);
  overflow: clip;
  padding: var(--ac-accordion-root-padding);
  transition:
    border-color var(--ac-accordion-motion-duration) var(--ac-accordion-motion-easing),
    box-shadow var(--ac-accordion-motion-duration) var(--ac-accordion-motion-easing);
}

:where(.ac-accordion[data-state='open']) {
  border-color: var(--ac-accordion-root-border-color-open);
}

:where(.ac-accordion:focus-within) {
  border-color: var(--ac-accordion-root-border-color-open);
}

:where(.ac-accordion[data-size='compact']) {
${renderVariables(sizeVariables.compact)}
}

:where(.ac-accordion[data-size='spacious']) {
${renderVariables(sizeVariables.spacious)}
}

:where(.ac-accordion__item) {
  display: block;
  margin: 0;
  border: 1px solid var(--ac-accordion-item-border-color);
  background: var(--ac-accordion-trigger-background);
  overflow: clip;
}

:where(.ac-accordion__item:only-child) {
  border-radius: calc(var(--ac-accordion-root-radius) - var(--ac-accordion-root-border-width));
}

:where(.ac-accordion__item:first-child:not(:only-child)) {
  border-radius:
    calc(var(--ac-accordion-root-radius) - var(--ac-accordion-root-border-width))
    calc(var(--ac-accordion-root-radius) - var(--ac-accordion-root-border-width))
    0
    0;
}

:where(.ac-accordion__item:last-child:not(:only-child)) {
  border-radius:
    0
    0
    calc(var(--ac-accordion-root-radius) - var(--ac-accordion-root-border-width))
    calc(var(--ac-accordion-root-radius) - var(--ac-accordion-root-border-width));
}

:where(.ac-accordion__item + .ac-accordion__item) {
  margin-top: calc(var(--ac-accordion-root-padding) / 2);
}

:where(.ac-accordion__header) {
  margin: 0;
}

:where(.ac-accordion__trigger) {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  min-height: var(--ac-accordion-trigger-min-height);
  align-items: center;
  justify-content: space-between;
  gap: var(--ac-accordion-trigger-gap-local, var(--ac-accordion-trigger-gap));
  border: 0;
  border-radius: 0;
  background: var(--ac-accordion-trigger-background);
  color: var(--ac-accordion-trigger-foreground);
  cursor: pointer;
  font: inherit;
  font-size: var(--ac-accordion-trigger-font-size);
  font-weight: var(--ac-accordion-trigger-font-weight);
  line-height: var(--ac-accordion-trigger-line-height);
  padding-block: var(--ac-accordion-trigger-padding-block);
  padding-inline: var(--ac-accordion-trigger-padding-inline);
  position: relative;
  text-align: left;
  transition:
    background-color var(--ac-accordion-motion-duration) var(--ac-accordion-motion-easing),
    color var(--ac-accordion-motion-duration) var(--ac-accordion-motion-easing);
}

:where(.ac-accordion__item:only-child > .ac-accordion__header > .ac-accordion__trigger:not([data-state='open'])) {
  border-radius: calc(var(--ac-accordion-root-radius) - var(--ac-accordion-root-border-width));
}

:where(.ac-accordion__item:only-child > .ac-accordion__header > .ac-accordion__trigger[data-state='open']),
:where(.ac-accordion__item:first-child:not(:only-child) > .ac-accordion__header > .ac-accordion__trigger) {
  border-top-left-radius: calc(var(--ac-accordion-root-radius) - var(--ac-accordion-root-border-width));
  border-top-right-radius: calc(var(--ac-accordion-root-radius) - var(--ac-accordion-root-border-width));
}

:where(.ac-accordion__item:last-child:not(:only-child) > .ac-accordion__header > .ac-accordion__trigger:not([data-state='open'])) {
  border-bottom-left-radius: calc(var(--ac-accordion-root-radius) - var(--ac-accordion-root-border-width));
  border-bottom-right-radius: calc(var(--ac-accordion-root-radius) - var(--ac-accordion-root-border-width));
}

:where(.ac-accordion__trigger)::after {
  box-sizing: border-box;
  content: '';
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border-block-end: 2px solid currentColor;
  border-inline-end: 2px solid currentColor;
  flex: 0 0 auto;
  transform: translateY(-1px) rotate(45deg);
  transition: transform var(--ac-accordion-motion-duration) var(--ac-accordion-motion-easing);
}

:where(.ac-accordion__trigger:hover:not([data-disabled])) {
  background: var(--ac-accordion-trigger-background-hover);
}

:where(.ac-accordion__trigger:active:not([data-disabled])) {
  background: var(--ac-accordion-trigger-background-active);
}

:where(.ac-accordion__trigger[data-state='open']) {
  background: var(--ac-accordion-trigger-background-open);
  color: var(--ac-accordion-trigger-foreground-open);
}

:where(.ac-accordion__trigger[data-state='open'])::after {
  transform: translateY(2px) rotate(-135deg);
}

:where(.ac-accordion__trigger:focus-visible),
:where(.ac-accordion__trigger[data-state='open']:focus) {
  outline: var(--ac-accordion-focus-ring-width) solid var(--ac-accordion-focus-ring-color);
  outline-offset: calc(
    -1 * (
      var(--ac-accordion-focus-ring-width) +
      var(--ac-accordion-focus-ring-offset)
    )
  );
  z-index: 1;
}

:where(.ac-accordion__trigger[data-disabled]),
:where(.ac-accordion__item[data-disabled]),
:where(.ac-accordion[data-disabled]) :where(.ac-accordion__trigger) {
  cursor: not-allowed;
  opacity: var(--ac-accordion-disabled-opacity);
}

:where(.ac-accordion__panel) {
  box-sizing: border-box;
  background: var(--ac-accordion-panel-background);
  border-top: 1px solid var(--ac-accordion-panel-border-color);
  color: var(--ac-accordion-panel-foreground);
  padding-inline: var(--ac-accordion-panel-padding-inline);
  padding-block-start: var(--ac-accordion-panel-padding-block-start);
  padding-block-end: var(--ac-accordion-panel-padding-block-end);
}

:where(.ac-accordion__item:only-child > .ac-accordion__panel),
:where(.ac-accordion__item:last-child:not(:only-child) > .ac-accordion__panel) {
  border-bottom-left-radius: calc(var(--ac-accordion-root-radius) - var(--ac-accordion-root-border-width));
  border-bottom-right-radius: calc(var(--ac-accordion-root-radius) - var(--ac-accordion-root-border-width));
}

:where(.ac-accordion__panel[hidden]) {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  :where(.ac-accordion__trigger),
  :where(.ac-accordion__trigger)::after {
    transition: none;
  }
}
`;

for (const relativePath of [
  'packages/core/src/styles/accordion.css',
  'packages/react/src/styles.css',
  'packages/angular/src/styles.css',
]) {
  const destination = resolve(repoRoot, relativePath);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, `${css}\n`, 'utf8');
}
