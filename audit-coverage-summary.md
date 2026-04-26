# Audit Coverage Summary

## Provenance

- Migration PR: https://github.com/taylor-curran/AdminDashboard/pull/13
- Audit branch: `cursor/angular-react-migration-audit-880a`
- Angular commit: `ca30471d42928ecf2a32e551d1f6e59d77e06640`
- React commit: `ca30471d42928ecf2a32e551d1f6e59d77e06640` (same tree as migration branch in this workspace snapshot)
- Angular URL: `http://127.0.0.1:4200`
- React URL: `http://127.0.0.1:4173` (Vite preview)
- API/backend URL: `http://127.0.0.1:3000` (json-server)

## Inventory

- Pages/states inventoried: 14
- Pages/states fully compared: 11
- Pages/states blocked: 0
- Pages/states matching: 1 (customer `/home` → `/403` parity for seed user `john.doe@example.com`)
- Pages/states not reached: 2 (invalid payment order deep link; explicit logout flow)

## Blockers

| route/state | blocker | Angular reachable? | React reachable? | notes |
|---|---|---:|---:|---|
| _none_ | — | — | — | Both apps and json-server were available on the recorded ports. |

## CSV rows by category

| category | count |
|---|---:|
| missing functionality | 1 |
| missing content | 2 |
| visual difference | 3 |
| behavior difference | 0 |
| navigation difference | 1 |
| form UX difference | 0 |
| data display difference | 1 |
| auth/permission difference | 0 |
| api parity difference | 1 |

## CSV rows by priority

| priority | count |
|---|---:|
| high | 0 |
| medium | 3 |
| low | 6 |

## Tests

- Total checks: 23 (14 `@angular` reference assertions + 9 `@reactMismatch` assertions + 5 screenshot pair flows; screenshot project does not add CSV rows)
- Angular passing: 14 (`npx playwright test --project=angular-audit`)
- React failing as intended: 0 (React project runs `@reactMismatch` tests that **pass** when React differs from Angular as specified)
- Excluded/flaky/invalid checks: none observed in the final run
- Notes: Evidence JSON reporter output is at `e2e-comparison/test-results/results.json` after `npx playwright test`. HTML report is written to `e2e-comparison/playwright-report/`.

## Reproduction commands

```bash
# From repository root — ensure json-server is available (reuse if already on :3000)
npm run api

# In another terminals (or rely on Playwright webServer — recommended):
npm run web -- --host 127.0.0.1 --port 4200
cd web-react && npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort

# Audit Playwright (starts api/angular/react via webServer when ports are free)
cd e2e-comparison
npm install
npx playwright install chromium
npx playwright test
npm run test:angular   # only Angular oracle checks
npm run test:react     # only React mismatch checks
npm run test:screenshots
```

## Red-flag checklist (from audit prompt)

- Inventory has at least 5 entries: yes (14).
- CSV has at least 5 rows: yes (9).
- CSV spans multiple categories: yes.
- Screenshots exist for visual-heavy rows: paired PNGs under `e2e-comparison/screenshots/`.
- Apps booted: yes for Angular, React preview, and json-server during the Playwright run.
