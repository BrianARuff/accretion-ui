import { expect, test } from '@playwright/test';

test.describe('Angular SSR smoke app', () => {
  test('hydrates cleanly and supports controlled single mode', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Angular SSR Smoke Validation' }),
    ).toBeVisible();

    const singleCard = page.getByTestId('angular-single-card');
    const timingTrigger = singleCard.getByTestId(
      'angular-single-trigger-timing',
    );
    const billingTrigger = singleCard.getByTestId(
      'angular-single-trigger-billing',
    );
    const disabledTrigger = singleCard.getByTestId(
      'angular-single-trigger-disabled',
    );

    await expect(timingTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(billingTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(singleCard.getByTestId('angular-single-panel-timing')).toBeVisible();
    await expect(
      singleCard.getByText('Controlled state changes through Angular inputs and outputs.'),
    ).toHaveCount(0);

    await billingTrigger.click();

    await expect(timingTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(billingTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(singleCard.getByTestId('angular-single-panel-billing')).toBeVisible();
    await expect(
      singleCard.getByText('Controlled state changes through Angular inputs and outputs.'),
    ).toHaveCount(1);
    await expect(disabledTrigger).toBeDisabled();

    await singleCard.getByRole('button', { name: 'Close all' }).click();
    await expect(billingTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(
      singleCard.getByText('Controlled state changes through Angular inputs and outputs.'),
    ).toHaveCount(0);

    expect(
      consoleErrors.filter((message) => /hydration|did not match/i.test(message)),
    ).toEqual([]);
  });

  test('supports multiple mode and keyboard navigation', async ({ page }) => {
    await page.goto('/');

    const multipleCard = page.getByTestId('angular-multiple-card');
    const shippingTrigger = multipleCard.getByTestId(
      'angular-multiple-trigger-shipping',
    );
    const supportTrigger = multipleCard.getByTestId(
      'angular-multiple-trigger-support',
    );

    await expect(shippingTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(supportTrigger).toHaveAttribute('aria-expanded', 'false');

    await shippingTrigger.focus();
    await page.keyboard.press('End');
    await expect(supportTrigger).toBeFocused();
    await page.keyboard.press('Home');
    await expect(shippingTrigger).toBeFocused();

    await supportTrigger.click();

    await expect(shippingTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(supportTrigger).toHaveAttribute('aria-expanded', 'true');

    await multipleCard.getByRole('button', { name: 'Close all' }).click();
    await expect(shippingTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(supportTrigger).toHaveAttribute('aria-expanded', 'false');
  });
});
