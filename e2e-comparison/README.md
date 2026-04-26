# Angular vs React migration comparison (Playwright)

This folder contains executable checks that encode **Angular as the oracle**: each spec’s `angular` project assertion must pass, and the paired `react` project assertion must fail when the migration diverges.

## Prerequisites

- Root `npm install` (Angular CLI, `json-server`, app deps).
- `web-react/npm install` and `npx playwright install chromium` (or install Chromium via Playwright in this folder).

## Run from repository root

```bash
cd e2e-comparison
npm install
CI=1 npx playwright test --project=angular
CI=1 npx playwright test --project=react
```

`CI=1` disables `reuseExistingServer` so Playwright starts `json-server`, `ng serve`, and the Vite dev server defined in `playwright.config.ts`.

## URLs (default)

- Angular: `http://127.0.0.1:4200`
- React: `http://127.0.0.1:5173`
- API: `http://127.0.0.1:3000` (`db.json` via `json-server`)

HTML report: `e2e-comparison/test-results/html-report/index.html` after a run.
