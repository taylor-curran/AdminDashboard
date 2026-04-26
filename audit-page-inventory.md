# Audit page inventory — Admin Dashboard (Angular reference vs `web-react`)

This inventory is derived from `src/app/app.routes.ts`, the sidebar (`src/app/components/sidebar/`), and reachable error routes. All routes were verified against the Angular source; reachability in the React app is noted per route.

| Route / entry | What it does | Auth / role | How to reach (Angular) | Reachable in React? |
|---------------|--------------|------------|------------------------|----------------------|
| `/` | Redirects to `/home` | N/A (redirect) | Open root URL | Yes (`/` loads SPA shell; React has no client router) |
| `/login` | Email/password login, error on bad credentials, navigates to `/home` on success | Public (`loginGuard` redirects if already logged in) | Sidebar "Login" when logged out, or direct URL, or redirect from 401 | **No** — no login UI or auth flow in React |
| `/home` | Dashboard title, welcome copy, statistics charts (3 cards: transactions, users, pie) | `authGuard` + `roleGuard` (Administrator) | Sidebar "Home" / "Dashboard" header link | **No** — no such page |
| `/payment-orders` | Sortable, filterable table of orders; global search; per-column filters; row action opens details | Auth + Administrator | Sidebar "Orders" | **No** |
| `/payment-orders/:id` | Order detail: back link, title, description, reference, status badge, payment block, customer block, order dates, conditional paid/auth fields | Auth + Administrator | From orders table external-link action | **No** |
| `/users` | User form (create/edit), roles multi-select, data table with actions, toasts, confirm delete | Auth + Administrator | Sidebar "Users" | **No** |
| `/401` | Unauthorized message; link to login | None (routed directly) | When accessing protected route without session | **No** — no route |
| `/403` | Forbidden message; Logout button clears session to login | None | Non-admin user hitting protected route (would redirect here) | **No** — no route |
| `/404` | Not found; link to home | None | Any unknown path (also `**` redirect) | **No** — no route |
| Logout (not a path) | Clears user, navigates to `/login` | From sidebar when logged in | "Logout" in sidebar | **N/A** in React (no session UI) |

## Modals and overlays

- **Users:** PrimeNG confirm dialog for delete; toast notifications for success/error (not separate URLs).

## Self-check: coverage

- Every **inventory row** was checked against the Angular app behavior via source review and (where applicable) Playwright against `localhost:4200` with `json-server` on `3000`.
- The **React** app under `web-react` was loaded at `localhost:5173`; deep routes fall through to the same placeholder shell (no `react-router`), so all listed "app" pages are **unreachable as implemented** in React except the static root view.

## Notes

- `role.guard` requires `Administrator` in `user.roles` for all main app routes (`/home`, `/payment-orders*`, `/users`). Tests use the admin user from `db.json` (`admin@mail.com` / `admin`).
