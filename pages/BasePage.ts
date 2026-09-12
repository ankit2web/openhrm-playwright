import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForLoaders(): Promise<void> {
    const spinner = this.page.locator('.oxd-loading-spinner');
    if (await spinner.count() > 0) {
      await spinner.first().waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    }
  }

  async selectDropdown(dropdownLocator: Locator, optionText: string): Promise<void> {
    await dropdownLocator.click();
    const option = this.page.locator('.oxd-select-dropdown').getByRole('option', { name: optionText, exact: true });
    await option.scrollIntoViewIfNeeded();
    await option.click();
  }
}