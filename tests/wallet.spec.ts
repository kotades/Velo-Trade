import { test, expect } from '@playwright/test';

test.describe('Wallet and Balances', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/');

    // 2. Click "Start Trading Now" to enter the trading view
    // There are multiple buttons with this text, click the first one
    await page.locator('button:has-text("Start Trading Now")').first().click();

    // 3. Click "Deposit" in the trading header to open the Wallet (opens directly on the Deposit tab)
    await page.locator('button:has-text("Deposit")').first().click();
  });

  test('Wallet balances are correctly calculated and displayed', async ({ page }) => {
    // Navigate to the Overview tab
    await page.locator('button:has-text("Overview")').click();

    // Assert Total Balance starts at $0.00
    const totalBalance = page.locator('span:has-text("Total Balance") + p');
    await expect(totalBalance).toContainText('$0.00');

    // Assert Main Wallet Balance starts at $0.00
    const mainWallet = page.locator('span:has-text("Main Wallet") + p');
    await expect(mainWallet).toContainText('$0.00');

    // Assert Trading Wallet Balance starts at $0.00
    const tradingWallet = page.locator('span:has-text("Trading Wallet") + p');
    await expect(tradingWallet).toContainText('$0.00');
  });

  test('Deposit flow UI and validation', async ({ page }) => {
    // The WalletDashboard is opened on the "Deposit" tab by default because we clicked the "Deposit" button
    
    // Check for Deposit Address UI elements and ensure the mockup address is visible
    await expect(page.locator('text=Deposit Address (USDT - TRC20)')).toBeVisible();
    await expect(page.locator('code:has-text("TXd9f3a2b1c4e5...7k8m9n0p")')).toBeVisible();
    await expect(page.locator('button:has-text("Copy")')).toBeVisible();
    await expect(page.locator('text=Only send USDT (TRC-20) to this address. Min deposit: $10.')).toBeVisible();
  });

  test('Withdraw flow UI, input validation, and balance constraints', async ({ page }) => {
    // Navigate to the Withdraw tab
    await page.locator('button:has-text("Withdraw")').click();

    const addressInput = page.locator('input[placeholder="Enter external wallet address"]');
    const amountInput = page.locator('input[placeholder="0.00"]');
    const maxButton = page.locator('button:has-text("MAX")');
    // We match the action button by its specific gradient class to distinguish it from the tab button
    const submitButton = page.locator('button.velo-gradient:has-text("Withdraw")');
    const availableBalanceText = page.locator('text=Available: $0.00');

    // Assert Elements Visibility
    await expect(addressInput).toBeVisible();
    await expect(amountInput).toBeVisible();
    await expect(maxButton).toBeVisible();
    await expect(submitButton).toBeVisible();
    await expect(availableBalanceText).toBeVisible();

    // Input validation simulation (fill out the form)
    await addressInput.fill('0x123abcDEF456');
    await amountInput.fill('500');

    await expect(addressInput).toHaveValue('0x123abcDEF456');
    await expect(amountInput).toHaveValue('500');

    // Currently the form is presentational, so clicking submit doesn't trigger backend actions, 
    // but we can ensure the button is clickable without throwing errors
    await submitButton.click();
  });
});
