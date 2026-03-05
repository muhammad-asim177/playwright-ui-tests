import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('OrangeHRM Login', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.evaluate(() => {
            document.body.style.zoom = '0.7';
        });
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
        await loginPage.login('Admin', 'admin123');
        await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    });

    
});
