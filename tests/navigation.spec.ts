import { test, expect } from '@playwright/test';

test.describe('Navigation, Layout, and Copy-Trading', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    await page.goto('/');
    await page.evaluate(() => window.localStorage.setItem('PLAYWRIGHT_TEST', 'true'));
    await page.reload();
  });

  test('Global navigation sidebar and top bar route to the correct pages without throwing errors', async ({ page }) => {
    // 1. App runs locally on http://localhost:5173
    await page.goto('/');

    // Verify Header is visible
    await expect(page.locator('header').first()).toBeVisible();

    // Click Login on top bar
    await page.getByRole('button', { name: 'Login' }).first().click();
    await expect(page.getByText('Welcome Back', { exact: false }).first()).toBeVisible();

    // Click Velo Home
    await page.getByRole('button', { name: 'Velo Home' }).click();
    await expect(page.getByRole('button', { name: /Start Trading Now/i }).first()).toBeVisible();

    // Click Start Trading to open the Trading view
    await page.getByRole('button', { name: /Start Trading Now/i }).first().click();

    // In Trading view, ensure SideNavigation and Trade header exist
    const tradeNav = page.locator('nav').filter({ hasText: 'Trade' });
    await expect(tradeNav).toBeVisible();

    // Click Settings in sidebar
    await page.locator('nav button[title="Settings"]').click();
    await expect(page.getByText('Settings', { exact: true }).first()).toBeVisible();
  });

  test('Mobile responsiveness (hamburger menu works)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check hamburger menu button
    const menuButton = page.getByRole('button', { name: 'Toggle navigation menu' });
    await expect(menuButton).toBeVisible();

    // Open menu
    await menuButton.click();
    
    // Expect mobile menu to be visible
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toBeVisible();
    
    // Check that 'Markets' link is visible inside the menu
    await expect(page.getByRole('button', { name: 'Markets' }).first()).toBeVisible();
    
    // Click Home inside mobile menu to close it
    await page.getByRole('button', { name: 'Home', exact: true }).click();
    
    // Wait for menu to hide
    await expect(mobileMenu).not.toBeVisible();
  });

  test('Copy-Trading panel displays Master Traders and the "Copy" action flow works in the UI', async ({ page }) => {
    await page.goto('/');

    // Go to Trading view
    await page.getByRole('button', { name: /Start Trading Now/i }).first().click();

    // Open Social / Copy Trading tab in the side navigation
    await page.locator('nav button[title="Social"]').click();
    
    // Check if Copy Trading Hub header is present
    await expect(page.getByText('Copy Trading', { exact: true }).first()).toBeVisible();

    // Wait for the Copy Trader button to be visible (which indicates master traders are loaded)
    const copyButton = page.getByRole('button', { name: 'Copy Trader' }).first();
    await expect(copyButton).toBeVisible({ timeout: 15000 });
    await copyButton.click();

    // It should open the Risk Disclosure & Authorization modal
    const modalHeader = page.getByText('Risk Disclosure & Authorization', { exact: false });
    await expect(modalHeader).toBeVisible();

    // Click "I Authorize & Follow"
    const authorizeBtn = page.getByRole('button', { name: 'I Authorize & Follow' });
    await authorizeBtn.click();

    // Wait for modal to close
    await expect(modalHeader).not.toBeVisible();
  });
});
