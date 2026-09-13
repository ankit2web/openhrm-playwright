# OrangeHRM UI & API Automation Assessment

Production-grade automated end-to-end testing suite for OrangeHRM covering the complete **Employee Lifecycle Management** workflow using **Playwright** and **TypeScript**.

🔗 **Repository:** [https://github.com/ankit2web/openhrm-playwright](https://github.com/ankit2web/openhrm-playwright)

---

## 🏗 Framework Architecture & Best Practices

This framework is built using industry standard test automation principles:

- **Page Object Model (POM):** Complete decoupling between element locators, page interactions, and assertion logic across dedicated classes (`LoginPage.ts`, `PimPage.ts`, and `BasePage.ts`).
- **Data-Driven Testing (DDT):** Test input data (`data/employeeData.json`) and fixture assets (`data/profile-pic.png`) are separated from the test scripts. Dynamic ID generation is utilized to avoid record collisions on public shared demo environments.
- **Hybrid UI and API Validation:** Combines browser operations with Playwright's native API client (`ApiService.ts`) to cross-validate data integrity and verify resource deletion contracts over HTTP REST endpoints.
- **Resilient Dynamic Waits:** Avoids hard-coded sleeps by tying assertions directly to DOM visibility, network idle states, and OrangeHRM loading spinner dismissals (`.oxd-loading-spinner`).
- **Comprehensive Observability:** Native configuration capturing step-by-step traces, failure screenshots, HTML execution reports, and full-length screen recording videos on every run.
- **Continuous Integration (CI):** Fully configured GitHub Actions workflow (`.github/workflows/playwright.yml`) executing tests headless on Ubuntu runners and publishing reports/videos as persistent artifacts on every push or pull request.

---

## 📦 Project Structure

```text
openhrm-playwright/
├── .github/
│   └── workflows/
│       └── playwright.yml            # CI pipeline workflow for GitHub Actions
├── data/
│   ├── employeeData.json             # Data-driven JSON payload (names, jobs, status)
│   └── profile-pic.png               # Profile picture binary fixture
├── pages/                            # Page Object Model layer
│   ├── BasePage.ts                   # Core reusable actions and loader synchronizers
│   ├── LoginPage.ts                  # Authentication & session invalidation abstractions
│   └── PimPage.ts                    # Add, Search, Update, and Delete employee handlers
├── services/
│   └── ApiService.ts                 # REST API validation & contract assertions
├── tests/
│   └── employeeLifecycle.spec.ts     # End-to-end scenario covering steps 1 to 6
├── playwright.config.ts              # Playwright test runner, reporters, and browser setup
├── package.json                      # NPM project dependencies and execution scripts
├── package-lock.json                 # Pinned dependency tree lockfile
├── tsconfig.json                     # TypeScript compilation configuration
└── README.md                         # Comprehensive documentation & execution guide

```

## ⚙ Prerequisites & Dependencies

### Prerequisites

* **Node.js**: `v18.x` or `v20.x` (LTS recommended)
* **npm**: `v9.x` or higher
* **Git**: Installed and configured locally

### Dependencies

* `@playwright/test` (`^1.49.0`): Test runner, headless browser driver, and native API request client.


* `typescript` (`^5.3.3`): TypeScript compiler providing static typing and modern JavaScript module support.


* `@types/node` (`^20.11.0`): Type definitions for Node.js runtime environments.

---

## 🚀 Installation & Setup

Follow these exact steps to set up the project locally:

### 1. Clone the Repository

Clone the repository using Git and navigate into the project directory:

```bash
git clone https://github.com/ankit2web/openhrm-playwright
cd openhrm-playwright
```

### 2. Install Project Dependencies

Run `npm install` (or `npm ci` for clean reproducible CI builds) to install all required dependencies specified in `package.json`:

```bash
npm install
```

### 3. Install Playwright Browsers and System Binaries

Download the Chromium browser binaries and all required OS-level system dependencies:

```bash
npx playwright install --with-deps chromium
```

---

## 🧪 Test Execution

The automated suite executes the complete Employee Lifecycle Management scenario (Login ➔ Add Employee with Photo ➔ Search & Edit Job Details ➔ API Cross-Validation ➔ UI & API Delete Verification ➔ Logout & Session Invalidation).

### Run Headless (Default)

Executes the test suite headlessly via Chromium:

```bash
npm test
```

### Run in Headed Mode

Runs tests inside a visible Chromium browser window to observe interactions:

```bash
npm run test:headed
```

### Run with Playwright UI Mode

Provides an interactive GUI with time-travel debugging, DOM inspection, and execution tracing:

```bash
npx playwright test --ui
```

---

## 📊 HTML Reports & Screen Recording (`.webm`)

Full screen recording is enabled natively in `playwright.config.ts` via `video: 'on'`. Every execution generates video recordings and an HTML execution report.

### 1. Where the `.webm` Video Files Are Saved

Video recordings of every run are produced in standard `.webm` format and reside in two locations:

1. **`test-results/` directory:**
* Path: `test-results/<test-run-folder>/video.webm`

* Playwright automatically saves the raw `.webm` recording here immediately upon test completion.




2. **`playwright-report/` directory:**
* Path: `playwright-report/data/<hash>.webm`
* When the HTML report is bundled, Playwright attaches the `.webm` video file directly into the report bundle assets for web viewing.





### 2. Viewing the HTML Report & Playing the Video

To open the comprehensive interactive HTML test report in your browser:

```bash
npm run report
```

Once the report opens in your browser:

1. Click on the **`OrangeHRM - Employee Lifecycle E2E Suite`** test run.
2. Scroll down to the bottom **Videos / Attachments** section.
3. You can play the full test recording directly inside the browser player or right-click to download the underlying `.webm` file.


---

## 🔄 CI/CD Execution (GitHub Actions)

This repository includes continuous integration configured under `.github/workflows/playwright.yml`. On every `push` or `pull_request` to `main`:

1. The workflow checks out the repository.
2. Node.js environment and dependencies are cached and installed using `npm ci`.
3. Playwright Chromium binaries with system libraries are installed.
4. Tests are executed headlessly.
5. Both `playwright-report/` (HTML report) and `test-results/` (containing traces and `.webm` videos) are uploaded as workflow artifacts, downloadable under the **Actions** tab of the GitHub repository.