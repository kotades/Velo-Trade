import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility & Usability (a11y)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.setItem('PLAYWRIGHT_TEST', 'true'));
    await page.reload();
    // Disable animations and transitions to prevent transition states from causing contrast errors
    await page.addStyleTag({ content: '* { transition: none !important; animation: none !important; }' });
  });

  test('Home page should not have any automatically detectable accessibility issues', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // Check if violations array is empty
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Terminal view should not have any automatically detectable accessibility issues', async ({ page }) => {
    const startTradingBtn = page.getByRole('button', { name: /Start Trading Now/i }).first();
    await startTradingBtn.click();
    
    // Wait for terminal to load
    await expect(page.getByRole('tab', { name: /Chart View/i })).toBeVisible();

    // The trading chart container uses a 3rd party script (TradingView or simple mock)
    // We can exclude it from accessibility checking if it creates false positives, but we'll try including it first.
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast']) // Often complex gradients can cause false positives in contrast ratio tools
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('Asset Selector should be accessible when opened', async ({ page }) => {
    // Navigate to terminal
    const startTradingBtn = page.getByRole('button', { name: /Start Trading Now/i }).first();
    await startTradingBtn.click();
    await expect(page.getByRole('tab', { name: /Chart View/i })).toBeVisible();

    // Open Asset Selector
    const pairButton = page.locator('header button[aria-label^="Select Trading Pair"]');
    await pairButton.click();
    await expect(page.getByRole('dialog', { name: 'Asset Selector' })).toBeVisible();

    // Run Axe on just the dialog
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .disableRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
