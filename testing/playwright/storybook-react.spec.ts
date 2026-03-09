import { expect, test } from '@playwright/test';

test('React Storybook docs and default story load successfully', async ({ page }) => {
  await page.goto('/?path=/docs/react-accordion--overview');

  const docsFrame = page.frameLocator('#storybook-preview-iframe');

  await expect(docsFrame.getByRole('heading', { name: 'React Accordion' })).toBeVisible();
  await expect(
    docsFrame.getByText('Accessible disclosure content for product, support, and documentation flows.'),
  ).toBeVisible();
  expect(await docsFrame.locator('table').count()).toBeGreaterThanOrEqual(2);
  await expect(docsFrame.getByRole('columnheader', { name: 'Prop / event' })).toBeVisible();
  await expect(docsFrame.getByRole('columnheader', { name: 'CSS variable' })).toBeVisible();

  await page.goto('/?path=/story/react-accordion--default');

  const frame = page.frameLocator('#storybook-preview-iframe');
  const root = frame.locator('#storybook-react-default');
  const firstItem = root.locator('.ac-accordion__item').first();
  const lastItem = root.locator('.ac-accordion__item').last();
  const deliveryTrigger = frame.getByRole('button', { name: 'Delivery timeline' });
  const handoffTrigger = frame.getByRole('button', { name: 'Engineering handoff' });
  const deliveryPanel = frame.locator('#storybook-react-default-timeline-panel');

  await expect(deliveryTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(root).toHaveAttribute('data-state', 'open');
  await expect(root).toHaveCSS('border-top-color', 'rgb(7, 166, 200)');
  await expect(root).toHaveCSS('padding-top', '12px');
  await expect(firstItem).toHaveCSS('border-top-left-radius', '7px');
  await expect(lastItem).toHaveCSS('border-bottom-left-radius', '7px');
  await expect(deliveryTrigger).toHaveCSS('border-top-left-radius', '7px');
  await expect(deliveryPanel).toHaveCSS('padding-top', '16px');
  await expect(deliveryPanel).toHaveCSS('padding-bottom', '16px');

  await deliveryTrigger.focus();
  const firstTriggerFocus = await deliveryTrigger.evaluate((node) => ({
    radius: getComputedStyle(node).borderTopLeftRadius,
    ringColor: getComputedStyle(node).outlineColor,
    ringOffset: getComputedStyle(node).outlineOffset,
    ringWidth: getComputedStyle(node).outlineWidth,
  }));
  expect(firstTriggerFocus).toEqual({
    radius: '7px',
    ringColor: 'rgb(7, 166, 200)',
    ringOffset: '-5px',
    ringWidth: '2px',
  });

  await deliveryTrigger.click();
  await expect(deliveryTrigger).toHaveAttribute('aria-expanded', 'false');
  await expect(root).toHaveAttribute('data-state', 'closed');
  await expect(root).toHaveCSS('border-top-color', 'rgb(7, 166, 200)');
  expect(
    await deliveryTrigger.evaluate(
      (node) => node.ownerDocument.activeElement === node,
    ),
  ).toBe(true);

  await deliveryTrigger.evaluate((node) => node.blur());
  await expect(root).toHaveCSS('border-top-color', 'rgb(189, 204, 228)');

  await deliveryTrigger.click();
  await expect(deliveryTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(root).toHaveAttribute('data-state', 'open');

  await handoffTrigger.click();
  await expect(deliveryTrigger).toHaveAttribute('aria-expanded', 'false');
  await expect(handoffTrigger).toHaveAttribute('aria-expanded', 'true');
  const clickedOpenFocus = await handoffTrigger.evaluate((node) => ({
    outlineColor: getComputedStyle(node).outlineColor,
    outlineOffset: getComputedStyle(node).outlineOffset,
    outlineWidth: getComputedStyle(node).outlineWidth,
    active: node.ownerDocument.activeElement === node,
  }));
  expect(clickedOpenFocus).toEqual({
    active: true,
    outlineColor: 'rgb(7, 166, 200)',
    outlineOffset: '-5px',
    outlineWidth: '2px',
  });

  await deliveryTrigger.click();
  await expect(deliveryTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(handoffTrigger).toHaveAttribute('aria-expanded', 'false');

  await handoffTrigger.focus();
  await expect(handoffTrigger).toHaveCSS('border-bottom-left-radius', '7px');

  await root.evaluate((node) => {
    node.style.setProperty('--ac-accordion-root-border-color-open', 'rgb(255, 0, 0)');
    node.style.setProperty('--ac-accordion-focus-ring-color', 'rgb(255, 0, 0)');
    node.style.setProperty('--ac-accordion-panel-padding-block-start', '24px');
    node.style.setProperty('--ac-accordion-panel-padding-block-end', '24px');
  });

  await expect(root).toHaveCSS('border-top-color', 'rgb(255, 0, 0)');
  await expect(deliveryPanel).toHaveCSS('padding-top', '24px');
  await expect(deliveryPanel).toHaveCSS('padding-bottom', '24px');
  await deliveryTrigger.focus();
  const overriddenFocus = await deliveryTrigger.evaluate((node) => ({
    active: node.ownerDocument.activeElement === node,
    outlineColor: getComputedStyle(node).outlineColor,
    outlineOffset: getComputedStyle(node).outlineOffset,
    outlineWidth: getComputedStyle(node).outlineWidth,
  }));
  expect(overriddenFocus).toEqual({
    active: true,
    outlineColor: 'rgb(255, 0, 0)',
    outlineOffset: '-5px',
    outlineWidth: '2px',
  });
});
