import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('OrangeHRM Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await loginPage.login('Admin', 'admin123');
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.login('invalid', 'invalid');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
  });

  test('should show error with empty credentials', async () => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Required');
  });

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.login('Admin', 'admin123');
      await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
      // Open user dropdown and click logout
      await page.locator('.oxd-userdropdown-icon').click();
      await page.getByRole('menuitem', { name: /logout/i }).click();
      await expect(page).toHaveURL(/auth\/login/);
      await expect(loginPage.loginButton).toBeVisible();
    });
  });

  test('should show error for locked user', async () => {
    await loginPage.login('locked_out_user', 'admin123');
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
