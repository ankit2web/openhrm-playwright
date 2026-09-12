# OrangeHRM UI & API Automation Assessment

Automated end-to-end testing suite for OrangeHRM covering the complete **Employee Lifecycle Management** workflow using **Playwright** and **TypeScript**.

## Architecture & Design Patterns
- **Page Object Model (POM):** Complete separation of UI interactions/locators from test assertions.
- **Data-Driven Execution:** External JSON payload (`data/employeeData.json`) decoupled from test logic.
- **Hybrid UI/API Verification:** Combines browser UI operations with Playwright API contexts for state and deletion contract assertions.
- **Reporting & Video:** Configured with Playwright native HTML reports, step-by-step logs, failure screenshots, and full-run video recording.

---

## Setup & Running Instructions

### 1. Prerequisites
- Node.js (v18 or later)
- npm (v9 or later)

### 2. Installation
```bash
git clone <YOUR_REPO_URL>
cd orangehrm-qa-automation
npm install
npx playwright install --with-deps chromium