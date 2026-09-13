import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PimPage extends BasePage {
  // Sidebar & Top Navigation
  readonly pimMenu: Locator;
  readonly topNavAddEmployee: Locator;
  readonly topNavEmployeeList: Locator;

  // Add Employee Form
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addEmpIdInput: Locator;
  readonly photoUploadInput: Locator;
  readonly saveButton: Locator;

  // Employee List & Search
  readonly searchEmpIdInput: Locator;
  readonly searchButton: Locator;
  readonly recordsTableBody: Locator;
  readonly tableRows: Locator;
  readonly recordsCountText: Locator;

  // Job Tab / Edit Details
  readonly jobTabLink: Locator;
  readonly jobTitleDropdown: Locator;
  readonly empStatusDropdown: Locator;

  // Action Confirmations & Feedback
  readonly successToast: Locator;
  readonly confirmDeleteDialogBtn: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation elements
    this.pimMenu = page.getByRole('link', { name: 'PIM' });
    this.topNavAddEmployee = page.getByRole('link', { name: 'Add Employee' });
    this.topNavEmployeeList = page.getByRole('link', { name: 'Employee List' });

    // Add Employee inputs
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.addEmpIdInput = page.locator('.oxd-input-group:has-text("Employee Id") input');
    this.photoUploadInput = page.locator('input[type="file"]');
    this.saveButton = page.getByRole('button', { name: 'Save' });

    // Search filters and table result locators
    this.searchEmpIdInput = page.locator('.oxd-input-group:has-text("Employee Id") input');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.recordsTableBody = page.locator('.oxd-table-body');
    this.tableRows = page.locator('.oxd-table-body .oxd-table-card');
    this.recordsCountText = page.locator('.orangehrm-horizontal-padding span.oxd-text');

    // Personal details / Job tab
    this.jobTabLink = page.getByRole('link', { name: 'Job' });
    this.jobTitleDropdown = page.locator('.oxd-input-group:has-text("Job Title") .oxd-select-text');
    this.empStatusDropdown = page.locator('.oxd-input-group:has-text("Employment Status") .oxd-select-text');

    // Alerts and dialog triggers
    this.successToast = page.locator('.oxd-toast-content--success');
    this.confirmDeleteDialogBtn = page.getByRole('button', { name: 'Yes, Delete' });
  }

  async navigateToPim(): Promise<void> {
    await this.pimMenu.click();
    await this.waitForLoaders();
  }

  async navigateToAddEmployee(): Promise<void> {
    await this.topNavAddEmployee.click();
    await this.waitForLoaders();
    await expect(this.firstNameInput, 'Add Employee form failed to load.').toBeVisible();
  }

  async navigateToEmployeeList(): Promise<void> {
    await this.topNavEmployeeList.click();
    await this.waitForLoaders();
  }

  async createEmployee(
    firstName: string,
    lastName: string,
    empId: string,
    photoPath?: string,
    middleName?: string
  ): Promise<void> {
    await this.navigateToAddEmployee();

    await this.firstNameInput.fill(firstName);
    if (middleName) {
      await this.middleNameInput.fill(middleName);
    }
    await this.lastNameInput.fill(lastName);

    // Overwrite the auto-generated ID
    await this.addEmpIdInput.click();
    await this.page.keyboard.press('ControlOrMeta+A');
    await this.page.keyboard.press('Backspace');
    await this.addEmpIdInput.fill(empId);

    // Attach profile picture fixture if provided
    if (photoPath) {
      await this.photoUploadInput.setInputFiles(photoPath);
    }

    await this.saveButton.click();
    await expect(this.successToast, 'Success notification was not displayed on employee creation.').toBeVisible();
    await this.waitForLoaders();
  }

  async searchByEmployeeId(empId: string): Promise<void> {
    await this.navigateToEmployeeList();

    await this.searchEmpIdInput.first().click();
    await this.page.keyboard.press('ControlOrMeta+A');
    await this.page.keyboard.press('Backspace');
    await this.searchEmpIdInput.first().fill(empId);

    await this.searchButton.click();
    await this.waitForLoaders();
  }

  async editJobDetails(empId: string, jobTitle: string, status: string): Promise<void> {
    await this.searchByEmployeeId(empId);

    const recordRow = this.tableRows.first();
    await expect(recordRow, `Record with ID ${empId} was not found in the search results table.`).toBeVisible();

    // Click the edit pencil icon in the row's Actions column
    await recordRow.locator('button i.bi-pencil-fill, i.bi-pencil-fill').click();
    await this.waitForLoaders();

    // Navigate to Job sub-tab
    await this.jobTabLink.click();
    await this.waitForLoaders();

    // Select dropdown options
    await this.selectDropdown(this.jobTitleDropdown, jobTitle);
    await this.selectDropdown(this.empStatusDropdown, status);

    await this.saveButton.first().click();
    await expect(this.successToast, 'Success notification was not displayed after saving job details.').toBeVisible();
    await this.waitForLoaders();
  }

  async deleteEmployee(empId: string): Promise<void> {
    await this.searchByEmployeeId(empId);

    const recordRow = this.tableRows.first();
    await expect(recordRow, `Record with ID ${empId} not present for deletion.`).toBeVisible();

    // Click the trash icon in the Actions column
    await recordRow.locator('button i.bi-trash, i.bi-trash').click();
    await this.confirmDeleteDialogBtn.click();
    await expect(this.successToast, 'Success notification was not displayed after deletion.').toBeVisible();
    await this.waitForLoaders();
  }

  async verifyEmployeeDeleted(empId: string): Promise<void> {
    await this.searchByEmployeeId(empId);

    // Wait for any remaining loader spinners to finish
    await this.waitForLoaders();

    // 1. Verify that the table rows collection contains zero cards
    await expect(
      this.tableRows,
      `Employee record ${empId} is still visible in the search results table.`
    ).toHaveCount(0);

    // 2. Validate the persistent record counter label above the table
    await expect(
      this.recordsCountText.first(),
      `Expected empty state record counter for ID ${empId}.`
    ).toHaveText(/No Records Found|\(0\) Records Found/);
  }
}