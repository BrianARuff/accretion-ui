import { expect, test } from '@playwright/test';

test.describe('React SSR smoke app', () => {
  test('hydrates cleanly and supports controlled single mode', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'React SSR Smoke Validation' }),
    ).toBeVisible();

    const singleCard = page.getByTestId('react-single-card');
    const timingTrigger = singleCard.getByTestId('react-single-trigger-timing');
    const billingTrigger = singleCard.getByTestId('react-single-trigger-billing');
    const disabledTrigger = singleCard.getByTestId('react-single-trigger-disabled');

    await expect(timingTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(billingTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(singleCard.getByTestId('react-single-panel-timing')).toBeVisible();

    await billingTrigger.click();

    await expect(timingTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(billingTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(singleCard.getByTestId('react-single-panel-billing')).toBeVisible();
    await expect(disabledTrigger).toBeDisabled();

    await singleCard.getByRole('button', { name: 'Close all' }).click();
    await expect(billingTrigger).toHaveAttribute('aria-expanded', 'false');

    expect(
      consoleErrors.filter((message) => /hydration|did not match/i.test(message)),
    ).toEqual([]);
  });

  test('supports multiple mode and keyboard navigation', async ({ page }) => {
    await page.goto('/');

    const multipleCard = page.getByTestId('react-multiple-card');
    const shippingTrigger = multipleCard.getByTestId(
      'react-multiple-trigger-shipping',
    );
    const supportTrigger = multipleCard.getByTestId(
      'react-multiple-trigger-support',
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
