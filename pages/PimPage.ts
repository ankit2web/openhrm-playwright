import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PimPage extends BasePage {
  readonly pimMenu: Locator;
  readonly addEmployeeButton: Locator;
  readonly employeeListButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly fileInput: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;

  readonly searchEmpIdInput: Locator;
  readonly searchSubmitButton: Locator;
  readonly resultsTable: Locator;

  readonly jobTab: Locator;
  readonly jobTitleSelect: Locator;
  readonly empStatusSelect: Locator;

  readonly confirmDeleteButton: Locator;
  readonly noRecordsFoundText: Locator;

  constructor(page: Page) {
    super(page);
    this.pimMenu = page.getByRole('link', { name: 'PIM' });
    this.addEmployeeButton = page.getByRole('link', { name: 'Add Employee' });
    this.employeeListButton = page.getByRole('link', { name: 'Employee List' });

    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('div.oxd-input-group:has-text("Employee Id") input');
    this.fileInput = page.locator('input[type="file"]');
    this.saveButton = page.locator('button[type="submit"]');
    this.successMessage = page.locator('.oxd-toast-content--success');

    this.searchEmpIdInput = page.locator('div.oxd-input-group:has-text("Employee Id") input');
    this.searchSubmitButton = page.locator('button[type="submit"]');
    this.resultsTable = page.locator('.oxd-table-body');

    this.jobTab = page.getByRole('link', { name: 'Job' });
    this.jobTitleSelect = page.locator('div.oxd-input-group:has-text("Job Title") .oxd-select-text');
    this.empStatusSelect = page.locator('div.oxd-input-group:has-text("Employment Status") .oxd-select-text');

    this.confirmDeleteButton = page.locator('button.oxd-button--label-danger');
    this.noRecordsFoundText = page.getByText('No Records Found');
  }

  async navigateToPim(): Promise<void> {
    await this.pimMenu.click();
    await this.waitForLoaders();
  }

  async addNewEmployee(firstName: string, lastName: string, empId: string, photoPath?: string): Promise<void> {
    await this.addEmployeeButton.click();
    await this.waitForLoaders();

    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);

    await this.employeeIdInput.click();
    await this.employeeIdInput.fill('');
    await this.employeeIdInput.fill(empId);

    if (photoPath) {
      await this.fileInput.setInputFiles(photoPath);
    }

    await this.saveButton.click();
    await expect(this.successMessage).toBeVisible({ message: 'Success notification was not triggered for employee creation.' });
    await this.waitForLoaders();
  }

  async searchEmployee(empId: string): Promise<void> {
    await this.employeeListButton.click();
    await this.waitForLoaders();

    await this.searchEmpIdInput.first().fill(empId);
    await this.searchSubmitButton.click();
    await this.waitForLoaders();
  }

  async updateJobDetails(empId: string, jobTitle: string, status: string): Promise<void> {
    await this.searchEmployee(empId);

    const recordRow = this.resultsTable.locator('.oxd-table-card').first();
    await expect(recordRow).toBeVisible({ message: `Target record ${empId} not visible in UI list.` });

    await recordRow.locator('i.bi-pencil-fill').click();
    await this.waitForLoaders();

    await this.jobTab.click();
    await this.waitForLoaders();

    await this.selectDropdown(this.jobTitleSelect, jobTitle);
    await this.selectDropdown(this.empStatusSelect, status);

    await this.saveButton.first().click();
    await expect(this.successMessage).toBeVisible({ message: 'Job updates failed to save.' });
    await this.waitForLoaders();
  }

  async deleteEmployee(empId: string): Promise<void> {
    await this.searchEmployee(empId);

    const recordRow = this.resultsTable.locator('.oxd-table-card').first();
    await expect(recordRow).toBeVisible({ message: `Record ${empId} not located for deletion.` });

    await recordRow.locator('i.bi-trash').click();
    await this.confirmDeleteButton.click();
    await expect(this.successMessage).toBeVisible({ message: 'Deletion success alert not received.' });
    await this.waitForLoaders();
  }

  async verifyEmployeeDeleted(empId: string): Promise<void> {
    await this.searchEmployee(empId);
    await expect(this.noRecordsFoundText).toBeVisible({ message: `Employee record ${empId} is still visible in table.` });
  }
}