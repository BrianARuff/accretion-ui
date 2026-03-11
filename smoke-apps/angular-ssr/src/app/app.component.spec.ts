import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  type AccordionValueOutput,
} from '@accretion-ui/angular';

const cssEscape = (value: string): string =>
  value.replace(/[^a-zA-Z0-9_\u0080-\uFFFF-]/g, (character) => {
    const codePoint = character.codePointAt(0);
    return codePoint === undefined ? character : `\\${codePoint.toString(16)} `;
  });

if (!globalThis.CSS) {
  Object.defineProperty(globalThis, 'CSS', {
    value: { escape: cssEscape },
    writable: true,
  });
} else if (!globalThis.CSS.escape) {
  globalThis.CSS.escape = cssEscape;
}

@Component({
  imports: [
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionTrigger,
    AccordionPanel,
  ],
  standalone: true,
  template: `
    <div
      acAccordion
      [collapsible]="collapsible"
      [defaultValue]="defaultValue"
      [disabled]="rootDisabled"
      [hiddenUntilFound]="hiddenUntilFound"
      [loopFocus]="loopFocus"
      [multiple]="multiple"
      [orientation]="orientation"
      [size]="size"
      [value]="controlled ? controlledValue : undefined"
      (valueChange)="handleValueChange($event)"
      data-testid="root"
      id="angular-unit-root"
    >
      <div acAccordionItem (openChange)="alphaChanges.push($event)" value="alpha">
        <h3 acAccordionHeader>
          <button acAccordionTrigger data-testid="alpha-trigger" type="button">
            Alpha
          </button>
          <button
            acAccordionTrigger
            aria-label="Toggle Alpha"
            data-testid="alpha-trigger-icon"
            id="angular-unit-root-alpha-trigger-icon"
            [showIndicator]="false"
            type="button"
          >
            <span aria-hidden="true">+</span>
          </button>
        </h3>
        <div
          acAccordionPanel
          [keepMounted]="alphaKeepMounted"
          data-testid="alpha-panel"
        >
          Alpha panel
        </div>
      </div>

      <div acAccordionItem value="beta">
        <h3 acAccordionHeader>
          <button
            acAccordionTrigger
            [showIndicator]="betaShowIndicator"
            data-testid="beta-trigger"
            type="button"
          >
            <span>Beta</span>
            <span aria-hidden="true" data-testid="beta-trigger-meta">
              Custom
            </span>
          </button>
        </h3>
        <div
          acAccordionPanel
          [hiddenUntilFound]="betaHiddenUntilFound"
          [keepMounted]="betaKeepMounted"
          data-testid="beta-panel"
        >
          Beta panel
        </div>
      </div>

      <div acAccordionItem [disabled]="true" value="disabled">
        <h3 acAccordionHeader>
          <button
            acAccordionTrigger
            data-testid="disabled-trigger"
            type="button"
          >
            Disabled
          </button>
        </h3>
        <div acAccordionPanel data-testid="disabled-panel">Disabled panel</div>
      </div>
    </div>
  `,
})
class AccordionTestHostComponent {
  alphaChanges: boolean[] = [];
  alphaKeepMounted = false;
  betaHiddenUntilFound?: boolean;
  betaKeepMounted = false;
  betaShowIndicator = false;
  collapsible = true;
  controlled = false;
  controlledValue: string | string[] | null = 'alpha';
  defaultValue: string | string[] | null = 'alpha';
  hiddenUntilFound = false;
  loopFocus = true;
  multiple = false;
  orientation: 'vertical' = 'vertical';
  rootDisabled = false;
  size: 'compact' | 'comfortable' | 'spacious' = 'comfortable';
  valueChanges: Array<string | string[] | null> = [];

  handleValueChange(value: AccordionValueOutput): void {
    this.valueChanges.push(value);

    if (this.controlled) {
      this.controlledValue = value;
    }
  }
}

describe('Angular Accordion directives', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [AccordionTestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AccordionTestHostComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('renders uncontrolled single mode with the correct open and closed state', async () => {
    const fixture = await setup();
    const host = fixture.nativeElement as HTMLElement;

    const alphaTrigger = host.querySelector(
      '[data-testid="alpha-trigger"]',
    ) as HTMLButtonElement;
    const betaTrigger = host.querySelector(
      '[data-testid="beta-trigger"]',
    ) as HTMLButtonElement;
    const alphaPanel = host.querySelector(
      '[data-testid="alpha-panel"]',
    ) as HTMLDivElement;
    const betaPanel = host.querySelector(
      '[data-testid="beta-panel"]',
    ) as HTMLDivElement;

    expect(alphaTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(alphaPanel.hasAttribute('hidden')).toBe(false);
    expect(betaTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(betaPanel.getAttribute('hidden')).toBe('');
    expect(alphaPanel.textContent?.trim()).toBe('Alpha panel');
    expect(betaPanel.textContent?.trim()).toBe('');
  });

  it('does not mount closed panel content by default and keeps it mounted when keepMounted is true', async () => {
    const fixture = await setup();
    const component = fixture.componentInstance;
    component.controlled = true;
    component.controlledValue = null;
    component.betaKeepMounted = true;
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const alphaPanel = host.querySelector(
      '[data-testid="alpha-panel"]',
    ) as HTMLDivElement;
    const betaPanel = host.querySelector(
      '[data-testid="beta-panel"]',
    ) as HTMLDivElement;

    expect(alphaPanel.getAttribute('hidden')).toBe('');
    expect(alphaPanel.textContent?.trim()).toBe('');
    expect(betaPanel.getAttribute('hidden')).toBe('');
    expect(betaPanel.textContent?.trim()).toBe('Beta panel');

    const alphaTrigger = host.querySelector(
      '[data-testid="alpha-trigger"]',
    ) as HTMLButtonElement;
    alphaTrigger.click();
    fixture.detectChanges();

    expect(alphaPanel.textContent?.trim()).toBe('Alpha panel');
  });

  it('supports controlled value changes, inherited hiddenUntilFound, and item openChange output', async () => {
    const fixture = await setup();
    const component = fixture.componentInstance;
    component.controlled = true;
    component.controlledValue = 'alpha';
    component.hiddenUntilFound = true;
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const betaTrigger = host.querySelector(
      '[data-testid="beta-trigger"]',
    ) as HTMLButtonElement;
    betaTrigger.click();
    fixture.detectChanges();

    const alphaPanel = host.querySelector(
      '[data-testid="alpha-panel"]',
    ) as HTMLDivElement;

    expect(component.valueChanges.at(-1)).toBe('beta');
    expect(component.alphaChanges).toEqual([false]);
    expect(alphaPanel.getAttribute('hidden')).toBe('until-found');
    expect(alphaPanel.textContent?.trim()).toBe('Alpha panel');

    component.controlledValue = 'alpha';
    fixture.detectChanges();

    const alphaTrigger = host.querySelector(
      '[data-testid="alpha-trigger"]',
    ) as HTMLButtonElement;
    expect(alphaTrigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('supports multiple mode, keyboard navigation, and disabled items', async () => {
    const fixture = await setup();
    const component = fixture.componentInstance;
    component.defaultValue = ['alpha'];
    component.multiple = true;
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const alphaTrigger = host.querySelector(
      '[data-testid="alpha-trigger"]',
    ) as HTMLButtonElement;
    const betaTrigger = host.querySelector(
      '[data-testid="beta-trigger"]',
    ) as HTMLButtonElement;
    const disabledTrigger = host.querySelector(
      '[data-testid="disabled-trigger"]',
    ) as HTMLButtonElement;

    betaTrigger.click();
    fixture.detectChanges();

    expect(alphaTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(betaTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(component.valueChanges.at(-1)).toEqual(['alpha', 'beta']);

    alphaTrigger.focus();
    alphaTrigger.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(betaTrigger);

    betaTrigger.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'Home' }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(alphaTrigger);

    expect(disabledTrigger.disabled).toBe(true);
    disabledTrigger.click();
    fixture.detectChanges();

    const disabledPanel = host.querySelector(
      '[data-testid="disabled-panel"]',
    ) as HTMLDivElement;
    expect(disabledPanel.getAttribute('hidden')).toBe('');
  });

  it('keeps the last open item expanded when collapsible is false', async () => {
    const fixture = await setup();
    const component = fixture.componentInstance;
    component.collapsible = false;
    component.defaultValue = 'alpha';
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const alphaTrigger = host.querySelector(
      '[data-testid="alpha-trigger"]',
    ) as HTMLButtonElement;
    alphaTrigger.click();
    fixture.detectChanges();

    expect(alphaTrigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('respects root disabled, orientation, and size inputs', async () => {
    const fixture = await setup();
    const component = fixture.componentInstance;
    component.rootDisabled = true;
    component.orientation = 'vertical';
    component.size = 'spacious';
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const root = host.querySelector('[data-testid="root"]') as HTMLDivElement;
    const alphaTrigger = host.querySelector(
      '[data-testid="alpha-trigger"]',
    ) as HTMLButtonElement;
    const betaTrigger = host.querySelector(
      '[data-testid="beta-trigger"]',
    ) as HTMLButtonElement;
    const alphaPanel = host.querySelector(
      '[data-testid="alpha-panel"]',
    ) as HTMLDivElement;

    expect(root.getAttribute('data-disabled')).toBe('');
    expect(root.getAttribute('data-orientation')).toBe('vertical');
    expect(root.getAttribute('data-size')).toBe('spacious');
    expect(alphaTrigger.disabled).toBe(true);
    expect(betaTrigger.disabled).toBe(true);
    expect(alphaTrigger.getAttribute('data-orientation')).toBe('vertical');
    expect(alphaTrigger.getAttribute('data-size')).toBe('spacious');
    expect(alphaPanel.getAttribute('data-orientation')).toBe('vertical');
    expect(alphaPanel.getAttribute('data-size')).toBe('spacious');

    betaTrigger.click();
    fixture.detectChanges();

    expect(betaTrigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('supports custom trigger content and hides the default indicator when requested', async () => {
    const fixture = await setup();
    const host = fixture.nativeElement as HTMLElement;
    const betaTrigger = host.querySelector(
      '[data-testid="beta-trigger"]',
    ) as HTMLButtonElement;
    const betaMeta = host.querySelector(
      '[data-testid="beta-trigger-meta"]',
    ) as HTMLSpanElement;

    expect(betaTrigger.getAttribute('data-indicator')).toBe('hidden');
    expect(betaTrigger.textContent?.replace(/\s+/g, ' ').trim()).toContain('Beta');
    expect(betaMeta.textContent?.trim()).toBe('Custom');
  });

  it('supports multiple triggers for the same item when additional trigger ids are unique', async () => {
    const fixture = await setup();
    const host = fixture.nativeElement as HTMLElement;
    const alphaTrigger = host.querySelector(
      '[data-testid="alpha-trigger"]',
    ) as HTMLButtonElement;
    const alphaIconTrigger = host.querySelector(
      '[data-testid="alpha-trigger-icon"]',
    ) as HTMLButtonElement;
    const alphaPanel = host.querySelector(
      '[data-testid="alpha-panel"]',
    ) as HTMLDivElement;
    const betaTrigger = host.querySelector(
      '[data-testid="beta-trigger"]',
    ) as HTMLButtonElement;

    expect(alphaPanel.getAttribute('aria-labelledby')).toBe(
      'angular-unit-root-alpha-trigger',
    );
    expect(alphaTrigger.getAttribute('aria-controls')).toBe(
      'angular-unit-root-alpha-panel',
    );
    expect(alphaIconTrigger.getAttribute('aria-controls')).toBe(
      'angular-unit-root-alpha-panel',
    );

    alphaIconTrigger.focus();
    alphaIconTrigger.click();
    fixture.detectChanges();

    expect(alphaIconTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(alphaTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(alphaIconTrigger);
    expect(alphaPanel.getAttribute('hidden')).toBe('');

    alphaTrigger.click();
    fixture.detectChanges();

    expect(alphaTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(alphaIconTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(alphaPanel.getAttribute('hidden')).toBeNull();

    alphaIconTrigger.focus();
    alphaIconTrigger.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }),
    );
    fixture.detectChanges();

    expect(document.activeElement).toBe(betaTrigger);
  });

  it('respects loopFocus keyboard rules', async () => {
    const fixture = await setup();
    const component = fixture.componentInstance;
    component.loopFocus = false;
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const alphaTrigger = host.querySelector(
      '[data-testid="alpha-trigger"]',
    ) as HTMLButtonElement;
    const betaTrigger = host.querySelector(
      '[data-testid="beta-trigger"]',
    ) as HTMLButtonElement;

    alphaTrigger.focus();
    alphaTrigger.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(alphaTrigger);

    betaTrigger.focus();
    betaTrigger.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(betaTrigger);

  });

  it('lets panel hiddenUntilFound override the root setting', async () => {
    const fixture = await setup();
    const component = fixture.componentInstance;
    component.hiddenUntilFound = true;
    component.betaHiddenUntilFound = false;
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const alphaPanel = host.querySelector(
      '[data-testid="alpha-panel"]',
    ) as HTMLDivElement;
    const betaPanel = host.querySelector(
      '[data-testid="beta-panel"]',
    ) as HTMLDivElement;

    expect(alphaPanel.getAttribute('hidden')).toBeNull();

    const alphaTrigger = host.querySelector(
      '[data-testid="alpha-trigger"]',
    ) as HTMLButtonElement;
    alphaTrigger.click();
    fixture.detectChanges();

    expect(alphaPanel.getAttribute('hidden')).toBe('until-found');
    expect(betaPanel.getAttribute('hidden')).toBe('');
    expect(alphaPanel.textContent?.trim()).toBe('Alpha panel');
    expect(betaPanel.textContent?.trim()).toBe('');
  });
});
