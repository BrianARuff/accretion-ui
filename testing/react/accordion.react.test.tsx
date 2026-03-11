import { fireEvent, render, screen, within } from '@testing-library/react';
import * as React from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  type AccordionValueOutput,
} from '@accretion-ui/react';

describe('React Accordion', () => {
  it('renders uncontrolled single mode with the expected open and closed panels', () => {
    render(
      <Accordion defaultValue="delivery" id="react-unit-default">
        <AccordionItem value="delivery">
          <AccordionHeader>
            <AccordionTrigger>Delivery timeline</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="delivery-panel">
            Delivery panel
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="billing">
          <AccordionHeader>
            <AccordionTrigger>Billing handoff</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="billing-panel">Billing panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    expect(
      screen.getByRole('button', { name: 'Delivery timeline' }),
    ).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('delivery-panel')).not.toHaveAttribute('hidden');
    expect(
      screen.getByRole('button', { name: 'Billing handoff' }),
    ).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('billing-panel')).toHaveAttribute('hidden', '');
    expect(screen.queryByText('Billing panel')).toBeNull();
  });

  it('does not mount closed panel content by default and keeps it mounted when keepMounted is true', () => {
    render(
      <Accordion id="react-unit-keep-mounted">
        <AccordionItem value="delivery">
          <AccordionHeader>
            <AccordionTrigger>Delivery timeline</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="delivery-panel">Delivery panel</AccordionPanel>
        </AccordionItem>

        <AccordionItem value="billing">
          <AccordionHeader>
            <AccordionTrigger>Billing handoff</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="billing-panel" keepMounted>
            Billing panel
          </AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByTestId('delivery-panel')).toHaveAttribute('hidden', '');
    expect(screen.queryByText('Delivery panel')).toBeNull();
    expect(screen.getByTestId('billing-panel')).toHaveAttribute('hidden', '');
    expect(screen.getByText('Billing panel')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Delivery timeline' }));

    expect(screen.getByText('Delivery panel')).toBeInTheDocument();
  });

  it('supports controlled state, inherited hiddenUntilFound, and item open change callbacks', () => {
    const rootChange = vi.fn();
    const itemOpenChange = vi.fn();
    const normalizeSingleValue = (nextValue: AccordionValueOutput) =>
      Array.isArray(nextValue) ? nextValue[0] ?? null : nextValue;

    function ControlledHarness() {
      const [value, setValue] = React.useState<string | null>('delivery');

      return (
        <>
          <button onClick={() => setValue('billing')} type="button">
            Open billing
          </button>

          <Accordion
            collapsible
            hiddenUntilFound
            id="react-unit-controlled"
          onValueChange={(nextValue) => {
            rootChange(nextValue);
            setValue(normalizeSingleValue(nextValue));
          }}
          value={value}
        >
            <AccordionItem onOpenChange={itemOpenChange} value="delivery">
              <AccordionHeader>
                <AccordionTrigger>Delivery timeline</AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel data-testid="delivery-panel">
                Delivery panel
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem value="billing">
              <AccordionHeader>
                <AccordionTrigger>Billing handoff</AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel data-testid="billing-panel">Billing panel</AccordionPanel>
            </AccordionItem>
          </Accordion>
        </>
      );
    }

    render(<ControlledHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'Billing handoff' }));

    expect(rootChange).toHaveBeenCalledWith('billing');
    expect(itemOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByTestId('delivery-panel')).toHaveAttribute(
      'hidden',
      'until-found',
    );
    expect(
      screen.getByRole('button', { name: 'Billing handoff' }),
    ).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByText('Open billing'));

    expect(
      screen.getByRole('button', { name: 'Billing handoff' }),
    ).toHaveAttribute('aria-expanded', 'true');
  });

  it('supports multiple mode and roving keyboard navigation', () => {
    const rootChange = vi.fn();

    render(
      <Accordion
        defaultValue={['delivery']}
        id="react-unit-multiple"
        multiple
        onValueChange={rootChange}
      >
        <AccordionItem value="delivery">
          <AccordionHeader>
            <AccordionTrigger>Delivery timeline</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="delivery-panel">
            Delivery panel
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="support">
          <AccordionHeader>
            <AccordionTrigger>Support readiness</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="support-panel">Support panel</AccordionPanel>
        </AccordionItem>

        <AccordionItem value="handoff">
          <AccordionHeader>
            <AccordionTrigger>Engineering handoff</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="handoff-panel">Handoff panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    const deliveryTrigger = screen.getByRole('button', {
      name: 'Delivery timeline',
    });
    const supportTrigger = screen.getByRole('button', {
      name: 'Support readiness',
    });
    const handoffTrigger = screen.getByRole('button', {
      name: 'Engineering handoff',
    });

    fireEvent.click(supportTrigger);

    expect(screen.getByTestId('delivery-panel')).not.toHaveAttribute('hidden');
    expect(screen.getByTestId('support-panel')).not.toHaveAttribute('hidden');
    expect(rootChange).toHaveBeenLastCalledWith(['delivery', 'support']);

    deliveryTrigger.focus();
    fireEvent.keyDown(deliveryTrigger, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(supportTrigger);

    fireEvent.keyDown(supportTrigger, { key: 'End' });
    expect(document.activeElement).toBe(handoffTrigger);

    fireEvent.keyDown(handoffTrigger, { key: 'Home' });
    expect(document.activeElement).toBe(deliveryTrigger);
  });

  it('reopens a collapsed item and swaps correctly between uncontrolled single items', () => {
    render(
      <Accordion defaultValue="delivery" id="react-unit-reopen">
        <AccordionItem value="delivery">
          <AccordionHeader>
            <AccordionTrigger>Delivery timeline</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="delivery-panel">Delivery panel</AccordionPanel>
        </AccordionItem>

        <AccordionItem value="billing">
          <AccordionHeader>
            <AccordionTrigger>Billing handoff</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="billing-panel">Billing panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    const deliveryTrigger = screen.getByRole('button', {
      name: 'Delivery timeline',
    });
    const billingTrigger = screen.getByRole('button', {
      name: 'Billing handoff',
    });

    fireEvent.click(deliveryTrigger);
    expect(deliveryTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('delivery-panel')).toHaveAttribute('hidden', '');

    fireEvent.click(deliveryTrigger);
    expect(deliveryTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('delivery-panel')).not.toHaveAttribute('hidden');

    fireEvent.click(billingTrigger);
    expect(deliveryTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(billingTrigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(deliveryTrigger);
    expect(deliveryTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(billingTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('prevents disabled items from toggling', () => {
    render(
      <Accordion defaultValue="delivery" id="react-unit-disabled">
        <AccordionItem value="delivery">
          <AccordionHeader>
            <AccordionTrigger>Delivery timeline</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>Delivery panel</AccordionPanel>
        </AccordionItem>

        <AccordionItem disabled value="disabled">
          <AccordionHeader>
            <AccordionTrigger>Disabled section</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="disabled-panel">Disabled panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    const disabledTrigger = screen.getByRole('button', {
      name: 'Disabled section',
    });

    expect(disabledTrigger).toBeDisabled();

    fireEvent.click(disabledTrigger);

    expect(disabledTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('disabled-panel')).toHaveAttribute('hidden', '');
  });

  it('keeps the last open item expanded when collapsible is false', () => {
    render(
      <Accordion collapsible={false} defaultValue="delivery" id="react-unit-non-collapsible">
        <AccordionItem value="delivery">
          <AccordionHeader>
            <AccordionTrigger>Delivery timeline</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="delivery-panel">Delivery panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    const deliveryTrigger = screen.getByRole('button', {
      name: 'Delivery timeline',
    });

    fireEvent.click(deliveryTrigger);

    expect(deliveryTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('delivery-panel')).not.toHaveAttribute('hidden');
  });

  it('respects root disabled, orientation, and size props', () => {
    render(
      <Accordion
        data-testid="root"
        defaultValue="delivery"
        disabled
        id="react-unit-root-props"
        orientation="vertical"
        size="spacious"
      >
        <AccordionItem data-testid="item" value="delivery">
          <AccordionHeader>
            <AccordionTrigger data-testid="trigger">Delivery timeline</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="panel">Delivery panel</AccordionPanel>
        </AccordionItem>

        <AccordionItem value="billing">
          <AccordionHeader>
            <AccordionTrigger>Billing handoff</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="billing-panel">Billing panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    const root = screen.getByTestId('root');
    const item = screen.getByTestId('item');
    const trigger = screen.getByTestId('trigger');
    const panel = screen.getByTestId('panel');
    const billingTrigger = screen.getByRole('button', { name: 'Billing handoff' });

    expect(root).toHaveAttribute('data-disabled', '');
    expect(root).toHaveAttribute('data-orientation', 'vertical');
    expect(root).toHaveAttribute('data-size', 'spacious');
    expect(item).toHaveAttribute('data-orientation', 'vertical');
    expect(item).toHaveAttribute('data-size', 'spacious');
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('data-orientation', 'vertical');
    expect(trigger).toHaveAttribute('data-size', 'spacious');
    expect(panel).toHaveAttribute('data-orientation', 'vertical');
    expect(panel).toHaveAttribute('data-size', 'spacious');

    fireEvent.click(billingTrigger);

    expect(billingTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('billing-panel')).toHaveAttribute('hidden', '');
  });

  it('respects loopFocus keyboard rules', () => {
    render(
      <Accordion id="react-unit-no-loop" loopFocus={false}>
        <AccordionItem value="delivery">
          <AccordionHeader>
            <AccordionTrigger>Delivery timeline</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>Delivery panel</AccordionPanel>
        </AccordionItem>

        <AccordionItem value="billing">
          <AccordionHeader>
            <AccordionTrigger>Billing handoff</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>Billing panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    const deliveryTrigger = screen.getByRole('button', {
      name: 'Delivery timeline',
    });
    const billingTrigger = screen.getByRole('button', {
      name: 'Billing handoff',
    });

    deliveryTrigger.focus();
    fireEvent.keyDown(deliveryTrigger, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(deliveryTrigger);

    billingTrigger.focus();
    fireEvent.keyDown(billingTrigger, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(billingTrigger);
  });

  it('lets panel hiddenUntilFound override the root default', () => {
    render(
      <Accordion hiddenUntilFound id="react-unit-hidden-override">
        <AccordionItem value="delivery">
          <AccordionHeader>
            <AccordionTrigger>Delivery timeline</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="delivery-panel">Delivery panel</AccordionPanel>
        </AccordionItem>

        <AccordionItem value="billing">
          <AccordionHeader>
            <AccordionTrigger>Billing handoff</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="billing-panel" hiddenUntilFound={false}>
            Billing panel
          </AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByTestId('delivery-panel')).toHaveAttribute(
      'hidden',
      'until-found',
    );
    expect(screen.getByText('Delivery panel')).toBeInTheDocument();
    expect(screen.getByTestId('billing-panel')).toHaveAttribute('hidden', '');
    expect(screen.queryByText('Billing panel')).toBeNull();
  });

  it('prevents a trigger-level disabled prop from toggling', () => {
    render(
      <Accordion id="react-unit-trigger-disabled">
        <AccordionItem value="delivery">
          <AccordionHeader>
            <AccordionTrigger disabled>Delivery timeline</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="delivery-panel">Delivery panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    const deliveryTrigger = screen.getByRole('button', {
      name: 'Delivery timeline',
    });

    expect(deliveryTrigger).toBeDisabled();

    fireEvent.click(deliveryTrigger);

    expect(deliveryTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('delivery-panel')).toHaveAttribute('hidden', '');
  });

  it('preserves native attribute passthrough on each part', () => {
    render(
      <Accordion className="root-class" data-testid="root" id="react-attrs">
        <AccordionItem className="item-class" data-testid="item" value="alpha">
          <AccordionHeader className="header-class" data-testid="header">
            <AccordionTrigger className="trigger-class" data-testid="trigger">
              Trigger label
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel className="panel-class" data-testid="panel">
            Panel content
          </AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByTestId('root')).toHaveClass('root-class');
    expect(screen.getByTestId('item')).toHaveClass('item-class');
    expect(screen.getByTestId('header')).toHaveClass('header-class');
    expect(screen.getByTestId('trigger')).toHaveClass('trigger-class');
    expect(screen.getByTestId('panel')).toHaveClass('panel-class');

    const root = screen.getByTestId('root');
    const item = screen.getByTestId('item');
    const panel = screen.getByTestId('panel');

    expect(root).toHaveAttribute('data-size', 'comfortable');
    expect(item).toHaveAttribute('data-orientation', 'vertical');
    expect(panel).toHaveAttribute('data-state', 'closed');

    const trigger = within(item).getByRole('button', { name: 'Trigger label' });
    expect(trigger).toHaveAttribute('type', 'button');
  });

  it('supports custom trigger content and hides the default indicator when requested', () => {
    render(
      <Accordion defaultValue="alpha" id="react-unit-custom-trigger">
        <AccordionItem value="alpha">
          <AccordionHeader>
            <AccordionTrigger data-testid="alpha-trigger" showIndicator={false}>
              <span>Alpha</span>
              <span aria-hidden="true" data-testid="alpha-trigger-meta">
                Custom
              </span>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>Alpha panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByTestId('alpha-trigger');

    expect(trigger).toHaveAttribute('data-indicator', 'hidden');
    expect(within(trigger).getByText('Alpha')).toBeInTheDocument();
    expect(within(trigger).getByTestId('alpha-trigger-meta')).toHaveTextContent(
      'Custom',
    );
  });

  it('supports multiple triggers for one item when additional trigger ids are unique', () => {
    render(
      <Accordion defaultValue="alpha" id="react-unit-dual-trigger">
        <AccordionItem value="alpha">
          <AccordionHeader>
            <AccordionTrigger data-testid="alpha-trigger">
              Alpha
            </AccordionTrigger>
            <AccordionTrigger
              aria-label="Toggle Alpha"
              data-testid="alpha-trigger-icon"
              id="react-unit-dual-trigger-alpha-trigger-icon"
              showIndicator={false}
            >
              <span aria-hidden="true">+</span>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="alpha-panel">Alpha panel</AccordionPanel>
        </AccordionItem>

        <AccordionItem value="beta">
          <AccordionHeader>
            <AccordionTrigger data-testid="beta-trigger">Beta</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel data-testid="beta-panel">Beta panel</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    const alphaTrigger = screen.getByTestId('alpha-trigger');
    const alphaIconTrigger = screen.getByTestId('alpha-trigger-icon');
    const betaTrigger = screen.getByTestId('beta-trigger');
    const alphaPanel = screen.getByTestId('alpha-panel');

    expect(alphaPanel).toHaveAttribute(
      'aria-labelledby',
      'react-unit-dual-trigger-alpha-trigger',
    );
    expect(alphaTrigger).toHaveAttribute(
      'aria-controls',
      'react-unit-dual-trigger-alpha-panel',
    );
    expect(alphaIconTrigger).toHaveAttribute(
      'aria-controls',
      'react-unit-dual-trigger-alpha-panel',
    );

    alphaIconTrigger.focus();
    fireEvent.click(alphaIconTrigger);

    expect(alphaIconTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(alphaTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(alphaIconTrigger);
    expect(alphaPanel).toHaveAttribute('hidden', '');

    fireEvent.click(alphaTrigger);

    expect(alphaTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(alphaIconTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(alphaPanel).not.toHaveAttribute('hidden');

    alphaIconTrigger.focus();
    fireEvent.keyDown(alphaIconTrigger, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(betaTrigger);
  });
});
