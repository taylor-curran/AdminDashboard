# Agent prompt: Angular → React migration

Port the Angular 18 admin dashboard in `src/` to React. A bare Vite + React + TS scaffold lives at `web-react/`. Don't modify `src/`, `angular.json`, or `db.json` — they're the spec.

You pick the stack: router, UI library, forms, state, data fetching, test runner. Add them to `web-react/`.

## The environment is already booted

Three terminals auto-launch on cold start:

| terminal | port  | purpose                                       |
| -------- | ----- | --------------------------------------------- |
| `api`    | `:3000` | `json-server` against `db.json` (shared)      |
| `web`    | `:4200` | Angular reference (the spec)                  |
| `react`  | `:5173` | Your React port                               |

Vite already proxies `/users` and `/paymentOrders` to `:3000`. Add more endpoint proxies in `web-react/vite.config.ts` as needed. If a port is dead: `lsof -iTCP -sTCP:LISTEN -P -n | grep -E ':(3000|4200|5173)'`, re-run `npm run api` / `web` / `react` from the repo root.

## How to validate parity

Work through every route in `src/app/app.routes.ts`. For each one:

1. Read the Angular source (`src/app/pages/<feature>/`, its service, its guard).
2. Open `http://localhost:4200/<route>` and `http://localhost:5173/<route>` side-by-side.
3. Perform the same action in each. They must look identical and emit the same HTTP requests against `:3000` (watch the `api` terminal log).
4. Add tests on **both** sides asserting the same things. You decide what kind and how much — unit, integration, e2e, snapshot, whatever fits the feature. If the Angular side has no tests for it, add them first to lock in current behavior, then mirror them in React.

## Definition of done

- Every Angular route has a working React equivalent at the same path.
- Side-by-side, every page is visually indistinguishable (layout, fields, validation messages, role gating, error states).
- Same user actions produce the same HTTP method + path + body against `:3000`.
- Tests exist on both sides for every feature and assert the same things; both test suites pass. Pick the type and depth you think the feature deserves.
- `cd web-react && npm run build` succeeds.
- `npx ng build` still succeeds (you didn't break the reference).

Submit the full migration as a single PR. Embed before/after screenshots per page and one short demo video showing the React app exercised end-to-end.
