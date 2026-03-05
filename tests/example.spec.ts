import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

// Test: Navigate to API page and verify heading
test('API page has correct heading', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'API' }).click();
  // Wait for page to load and check for API-related heading
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading').filter({ hasText: /API/i })).toBeVisible({ timeout: 10000 });
});

// Test: Footer contains copyright
test('footer contains copyright', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  const footer = page.locator('footer');
  await expect(footer).toContainText('©');
});

// Test: Switch language (if available)
test('switch language to Chinese', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  const langButton = page.getByRole('button', { name: /language|lang|中文/i });
  if (await langButton.isVisible()) {
    await langButton.click();
    const chineseOption = page.getByRole('menuitem', { name: /中文|Chinese/i });
    if (await chineseOption.isVisible()) {
      await chineseOption.click();
      await expect(page).toHaveURL(/zh/);
    }
  }
});

// Test: Mobile menu interaction
test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 }); // iPhone X size
  await page.goto('https://playwright.dev/');
  const menuButton = page.locator('button[aria-label="Open navigation menu"]');
  if (await menuButton.isVisible()) {
    await menuButton.click();
    await expect(page.getByRole('navigation')).toBeVisible();
    // Close menu
    const closeButton = page.locator('button[aria-label="Close navigation menu"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await expect(page.getByRole('navigation')).not.toBeVisible();
    }
  }
});

// Test: External GitHub link
test('GitHub link opens in new tab', async ({ page, context }) => {
  await page.goto('https://playwright.dev/');
  // Target the specific header GitHub link to avoid ambiguity
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('.header-github-link').click(),
  ]);
  await newPage.waitForLoadState('networkidle');
  await expect(newPage).toHaveURL(/github.com\/microsoft\/playwright/, { timeout: 10000 });
  await newPage.close();
});
