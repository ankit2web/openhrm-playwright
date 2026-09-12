import { test } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';
import { ApiService } from '../services/ApiService';
import employeeData from '../data/employeeData.json';

test.describe('OrangeHRM - Employee Lifecycle E2E Suite', () => {
  let loginPage: LoginPage;
  let pimPage: PimPage;
  let apiService: ApiService;

  // Dynamic 5-digit ID to prevent collision across shared public instances
  const dynamicEmployeeId = `${Math.floor(10000 + Math.random() * 90000)}`;
  const avatarFilePath = path.resolve(__dirname, '../data/profile-pic.png');

  test.beforeEach(async ({ page, request }) => {
    loginPage = new LoginPage(page);
    pimPage = new PimPage(page);
    apiService = new ApiService(request);
  });

  test('Employee Lifecycle Management: Create, Update, API Verify, Delete, and Logout', async () => {
    // 1. Login
    await test.step('1. Authenticate with valid credentials', async () => {
      await loginPage.navigate();
      await loginPage.login('Admin', 'admin123');
      await loginPage.verifyDashboardVisible();
    });

    // 2. Add New Employee
    await test.step('2. Add new employee with data-driven payload', async () => {
      await pimPage.navigateToPim();
      await pimPage.addNewEmployee(
        employeeData.firstName,
        employeeData.lastName,
        dynamicEmployeeId,
        avatarFilePath
      );
    });

    // 3. Edit Employee Information
    await test.step('3. Update employee job title and employment status', async () => {
      await pimPage.navigateToPim();
      await pimPage.updateJobDetails(
        dynamicEmployeeId,
        employeeData.jobTitle,
        employeeData.employmentStatus
      );
    });

    // 4. Validate Employee via API
    await test.step('4. Cross-check UI data with API', async () => {
      await apiService.verifyEmployeeData(dynamicEmployeeId, {
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        jobTitle: employeeData.jobTitle,
      });
    });

    // 5. Delete the Employee
    await test.step('5. Delete employee from UI and verify via UI and API', async () => {
      await pimPage.navigateToPim();
      await pimPage.deleteEmployee(dynamicEmployeeId);
      await pimPage.verifyEmployeeDeleted(dynamicEmployeeId);
      await apiService.verifyEmployeeDeletion(dynamicEmployeeId);
    });

    // 6. Logout
    await test.step('6. Confirm logout and session invalidation', async () => {
      await loginPage.logout();
    });
  });
});