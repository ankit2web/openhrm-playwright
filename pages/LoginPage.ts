import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly dashboardHeader: Locator;
  readonly userDropdown: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.dashboardHeader = page.getByRole('heading', { name: 'Dashboard' });
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
  }

  async navigate(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
    await expect(this.loginButton, 'Login page failed to render.').toBeVisible();
  }

  async login(username: string, pass: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
    await this.waitForLoaders();
  }

  async verifyDashboardVisible(): Promise<void> {
    await expect(this.dashboardHeader, 'Dashboard not visible post-login.').toBeVisible();
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.logoutButton.click();
    await expect(this.loginButton, 'Session invalidation check failed; login button not found.').toBeVisible();
  }
}