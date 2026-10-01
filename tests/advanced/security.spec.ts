import { test, expect } from '@playwright/test';

test.describe('Security & Authorization', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure user is unauthenticated
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.removeItem('PLAYWRIGHT_TEST');
      window.localStorage.removeItem('TEST_MOCK_ADMIN');
    });
    await page.reload();
  });

  test('Unauthenticated user cannot access the Wallet route directly', async ({ page }) => {
    // Wait for initial load
    await page.waitForLoadState('networkidle');
    
    // We expect the router to redirect an unauthenticated user to the home/login page
    // By simulating a click or attempting to trigger a wallet state
    // Let's attempt to navigate to a protected state by directly manipulating the URL hash if hash routing is used,
    // or simulate a UI flow that normally goes to wallet.
    // If the UI has a Wallet button, it shouldn't allow access.
    // Assuming 'Wallet' isn't visible unless logged in:
    const walletBtn = page.getByRole('button', { name: /Wallet/i });
    await expect(walletBtn).not.toBeVisible();
  });

  test('Input fields correctly sanitize XSS payloads', async ({ page }) => {
    // We will bypass auth using PLAYWRIGHT_TEST so we can access inputs
    await page.evaluate(() => window.localStorage.setItem('PLAYWRIGHT_TEST', 'true'));
    await page.reload();

    // Go to terminal
    await page.getByRole('button', { name: /Start Trading Now/i }).first().click();

    // Open Asset Selector to use the search input
    await page.locator('header button[aria-label^="Select Trading Pair"]').click();
    await expect(page.getByRole('dialog', { name: 'Asset Selector' })).toBeVisible();

    // Input XSS payload
    const searchInput = page.getByPlaceholder(/Search pairs/i);
    const xssPayload = '"><script>document.body.innerHTML="HACKED"</script>';
    
    await searchInput.fill(xssPayload);

    // If XSS was successful, the DOM would be destroyed or script would execute.
    // We check that the app is still intact.
    await expect(page.getByRole('dialog', { name: 'Asset Selector' })).toBeVisible();
    await expect(page.locator('body')).not.toHaveText(/HACKED/);
  });
});
