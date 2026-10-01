import { test, expect } from '@playwright/test';

test.describe('Error Resilience & Boundary Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authenticated state for resilience testing
    await page.goto('/');
    await page.evaluate(() => window.localStorage.setItem('PLAYWRIGHT_TEST', 'true'));
    await page.reload();
    
    // Go to terminal
    await page.getByRole('button', { name: /Start Trading Now/i }).first().click();
    await expect(page.getByRole('tab', { name: /Chart View/i })).toBeVisible();
  });

  test('Simulating API failure does not crash the application UI', async ({ page }) => {
    // We can simulate an API failure by intercepting KuCoin WebSockets or API calls
    await page.route('**/api.kucoin.com/**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ code: '500', msg: 'Internal Server Error' })
      });
    });

    // The UI should still be usable, perhaps showing "Connecting..." or handling gracefully without White Screen of Death
    // Open asset selector to trigger API fetches
    await page.locator('header button[aria-label^="Select Trading Pair"]').click();
    
    // UI should not crash
    await expect(page.getByRole('dialog', { name: 'Asset Selector' })).toBeVisible();
    
    // App continues to function
    const closeBtn = page.getByRole('dialog', { name: 'Asset Selector' }).locator('button').first();
    await closeBtn.click();
    await expect(page.getByRole('dialog', { name: 'Asset Selector' })).not.toBeVisible();
  });
});
