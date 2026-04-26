# Audit Coverage Summary

## Provenance

- Migration PR: https://github.com/taylor-curran/AdminDashboard/pull/12
- Audit branch: `cursor/angular-react-migration-audit-20a2`
- Angular commit: `a91938589c075ffa38842c5d4b21b95bf09d6103`
- React commit: `a91938589c075ffa38842c5d4b21b95bf09d6103` (same tree as PR head in this environment)
- Angular URL: `http://127.0.0.1:4200`
- React URL: `http://127.0.0.1:5173`
- API/backend URL: `http://127.0.0.1:3000` (`json-server` watching `db.json`)

## Inventory

- Pages/states inventoried: 18
- Pages/states fully compared: 8 (those with passing Angular + failing React Playwright checks)
- Pages/states blocked: 0
- Pages/states matching: 1 (root redirect — no encoded test)
- Pages/states not reached: 9 (home loaded only as login side-effect; users list, orders list, loaded order detail, invalid order, invalid login, logout, charts, delete dialog — no dual-app tests committed)

## Blockers

| route/state | blocker | Angular reachable? | React reachable? | notes |
|---|---|---:|---:|---|
| — | none | — | — | Both apps boot under Playwright `webServer` with `CI=1`. |

## CSV rows by category

| category | count |
|---|---:|
| missing functionality | 0 |
| missing content | 2 |
| visual difference | 5 |
| behavior difference | 1 |
| navigation difference | 0 |
| form UX difference | 0 |
| data display difference | 0 |
| auth/permission difference | 0 |
| api parity difference | 0 |

## CSV rows by priority

| priority | count |
|---|---:|
| high | 0 |
| medium | 1 |
| low | 7 |

## Tests

- Total checks: 16 Playwright tests (8 scenarios × 2 projects: `angular` oracle + `react` mismatch)
- Angular passing: 8 (all `angular` project tests)
- React failing as intended: 8 (each scenario’s `react` test asserts the divergent React behavior; the `angular` project asserts the reference behavior)
- Excluded/flaky/invalid checks: 0 in the final run (`CI=1 npx playwright test` from `e2e-comparison/`)
- Notes: Early runs failed on strict-mode duplicate “Login” buttons and `localStorage` on `about:blank`; helpers were fixed to scope the form submit button and to navigate to `/login` before clearing storage. HTML reporter output folder was moved to `e2e-comparison/playwright-report` to avoid clashing with `test-results`.

## Reproduction commands

```bash
# From repository root — install once
npm install
cd web-react && npm install && cd ..

# Comparison tests (starts json-server + ng serve + Vite when CI=1)
cd e2e-comparison
npm install
npx playwright install chromium
CI=1 npx playwright test

# Oracle-only or React-only slices
CI=1 npx playwright test --project=angular
CI=1 npx playwright test --project=react
```

## Red-flag notes

- CSV row count is 8 (below 5 is not the case; still fewer than a full CRUD audit because many inventory rows are **not started** — only findings backed by the committed Playwright suite are listed in `migration-audit-results.csv`).
- No `missing functionality` or `navigation difference` rows in this CSV: the automated checks in this pass focused on head metadata, shell/error layout classes, login heading structure, and one loading-state branch on order detail.
