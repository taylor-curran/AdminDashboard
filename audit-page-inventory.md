# Audit page inventory — Admin Dashboard (Angular reference vs `web-react`)

Source: `src/app/app.routes.ts`, `web-react/src/App.tsx`, sidebar/nav templates, and route guards (`authGuard`, `roleGuard`, `loginGuard` / `RequireAdmin`, `LoginGuard`).

## Root redirect

- Route/path: `/` → `/home`
- Angular source files: `src/app/app.routes.ts`
- React source files, if present: `web-react/src/App.tsx`
- Auth required: yes (redirect lands on guarded home)
- Role/permission gating: Administrator on `/home`
- How to reach it: Open `/`
- Backend/API dependencies: none for redirect; home needs API for charts
- Important UI states to compare: lands on login (401) if unauthenticated, else home
- Status: matches
- Notes: No discrepancy recorded for redirect behavior in this audit run.

## Login

- Route/path: `/login`
- Angular source files: `src/app/pages/login/*`, `src/app/guards/login.guard.ts`
- React source files, if present: `web-react/src/pages/LoginPage.tsx`, `web-react/src/routes/LoginGuard.tsx`
- Auth required: no (inverse: logged-in users redirected to `/home`)
- Role/permission gating: none
- How to reach it: Sidebar “Login”, direct navigation, or 401 link
- Backend/API dependencies: `GET /users?email=` via `AuthService`
- Important UI states to compare: heading structure, validation timing, invalid credentials message, document title, favicon
- Status: compared
- Notes: Playwright oracle tests cover document title, favicon `<link>`, and login heading role (h2 vs card title).

## Home (dashboard)

- Route/path: `/home`
- Angular source files: `src/app/pages/home/*`, `src/app/components/statistics/*`
- React source files, if present: `web-react/src/pages/HomePage.tsx`, `web-react/src/components/Statistics.tsx`
- Auth required: yes
- Role/permission gating: Administrator (`roleGuard` / `RequireAdmin`)
- How to reach it: Sidebar “Home”, post-login redirect
- Backend/API dependencies: `GET /paymentOrders`, `GET /users` for charts
- Important UI states to compare: copy, chart cards/headers, loading/error for API
- Status: not started
- Notes: Reached transiently after login in e2e helpers; no dedicated parity assertions in this run.

## Payment orders list

- Route/path: `/payment-orders`
- Angular source files: `src/app/pages/payment-orders/*`
- React source files, if present: `web-react/src/pages/PaymentOrdersPage.tsx`
- Auth required: yes
- Role/permission gating: Administrator
- How to reach it: Sidebar “Orders”
- Backend/API dependencies: `GET /paymentOrders`
- Important UI states to compare: columns, sort, global/column filters, pagination, row actions, empty state
- Status: not started
- Notes: No executed dual-app assertions this run.

## Payment order detail (loaded)

- Route/path: `/payment-orders/:id`
- Angular source files: `src/app/pages/payment-order-details/*`, `src/app/services/payment-order.service.ts`
- React source files, if present: `web-react/src/pages/PaymentOrderDetailsPage.tsx`, `web-react/src/services/payment-order.service.ts`
- Auth required: yes
- Role/permission gating: Administrator
- How to reach it: From orders table “open” action or deep link
- Backend/API dependencies: `GET /paymentOrders/:id`
- Important UI states to compare: layout, date formatting, conditional Paid On / Authorization Code, back control
- Status: not started
- Notes: Slow-request loading state was compared (see tests); successful load state not asserted in Playwright this run.

## Payment order detail (loading / in-flight)

- Route/path: `/payment-orders/:id` (same route, pending XHR)
- Angular source files: `src/app/pages/payment-order-details/payment-order-details.component.ts` (single `order` field, no loading flag)
- React source files, if present: `PaymentOrderDetailsPage.tsx` (`useQuery` `isLoading`)
- Auth required: yes
- Role/permission gating: Administrator
- How to reach it: Throttled `GET /paymentOrders/:id` in Playwright
- Backend/API dependencies: same as loaded state
- Important UI states to compare: placeholder vs spinner/loading copy vs empty copy
- Status: compared
- Notes: Validated discrepancy — Angular shows “No payment order selected” until response; React shows “Loading…”.

## Payment order detail (missing id / empty)

- Route/path: `/payment-orders/:id` when API returns empty or id invalid
- Angular source files: `payment-order-details.component.html` (`@else` block)
- React source files, if present: `PaymentOrderDetailsPage.tsx` (query settled, no data)
- Auth required: yes
- Role/permission gating: Administrator
- How to reach it: Invalid id or error response
- Backend/API dependencies: `GET /paymentOrders/:id`
- Important UI states to compare: copy in empty/error branch
- Status: not started
- Notes: Not separately exercised in Playwright this run.

## Users (CRUD)

- Route/path: `/users`
- Angular source files: `src/app/pages/users/*`
- React source files, if present: `web-react/src/pages/UsersPage.tsx`
- Auth required: yes
- Role/permission gating: Administrator
- How to reach it: Sidebar “Users”
- Backend/API dependencies: `GET/POST/PATCH/DELETE /users`
- Important UI states to compare: validation messages, submit labels, multi-select, table, delete confirm, toasts
- Status: not started
- Notes: Code review only this run; no Playwright parity checks committed.

## Users — delete confirmation dialog

- Route/path: `/users` (modal overlay, no URL change)
- Angular source files: `users.component.ts` (`ConfirmationService`)
- React source files, if present: `UsersPage.tsx` (`confirmDialog`)
- Auth required: yes
- Role/permission gating: Administrator
- How to reach it: Trash icon on a user row
- Backend/API dependencies: `DELETE /users/:id` on accept
- Important UI states to compare: copy, button styles, reject toast
- Status: not started
- Notes: —

## 401 Unauthorized

- Route/path: `/401`
- Angular source files: `src/app/pages/errors/unauthorized/*`, `src/app/guards/auth.guard.ts`
- React source files, if present: `web-react/src/pages/UnauthorizedPage.tsx`, `web-react/src/routes/RequireAdmin.tsx`
- Auth required: no
- Role/permission gating: n/a
- How to reach it: Visit guarded route without session (e.g. `/home`)
- Backend/API dependencies: none
- Important UI states to compare: layout wrapper class, CTA to login
- Status: compared
- Notes: Root DOM class differs (`.unauthorized-container` vs `.error-page`).

## 403 Forbidden

- Route/path: `/403`
- Angular source files: `src/app/pages/errors/forbidden/*`, `src/app/guards/role.guard.ts`
- React source files, if present: `web-react/src/pages/ForbiddenPage.tsx`, `RequireAdmin.tsx`
- Auth required: no (shown when authenticated as non-admin)
- Role/permission gating: Customer (or non-Administrator) hitting admin routes
- How to reach it: Log in as customer; navigate to `/home` or other admin routes
- Backend/API dependencies: none for page shell
- Important UI states to compare: layout wrapper, primary action (logout vs link styling)
- Status: compared
- Notes: Root DOM class differs (`.forbidden-container` vs `.error-page`).

## 404 Not Found

- Route/path: `/404` (also via unknown paths → redirect)
- Angular source files: `src/app/pages/errors/not-found/*`, `src/app/app.routes.ts` wildcard
- React source files, if present: `web-react/src/pages/NotFoundPage.tsx`, `App.tsx` catch-all
- Auth required: no
- Role/permission gating: none
- How to reach it: Unknown path (e.g. `/missing-page-test`)
- Backend/API dependencies: none
- Important UI states to compare: layout wrapper, “Go to Homepage” control
- Status: compared
- Notes: Root DOM class differs (`.error-container` vs `.error-page`).

## App shell (sidebar + main outlet)

- Route/path: all routes (persistent chrome)
- Angular source files: `src/app/app.component.*`, `src/app/components/sidebar/*`
- React source files, if present: `web-react/src/App.tsx`, `web-react/src/components/Sidebar.tsx`
- Auth required: sidebar visible logged out or in
- Role/permission gating: nav targets still guarded server-side by routes
- How to reach it: Any page
- Backend/API dependencies: indirect (menu does not call API)
- Important UI states to compare: main content wrapper class (`.content` vs `.app-content`), sidebar when logged out
- Status: compared
- Notes: Playwright asserts main region class name difference.

## Customer session on admin deep link (guard outcome)

- Route/path: `/home`, `/payment-orders`, `/users`, etc. as Customer
- Angular source files: `role.guard.ts`
- React source files, if present: `RequireAdmin.tsx`
- Auth required: yes
- Role/permission gating: must be Administrator
- How to reach it: Customer login then navigate
- Backend/API dependencies: login `GET /users?email=`
- Important UI states to compare: redirect to `/403`, sidebar still visible
- Status: compared
- Notes: Covered while capturing 403 layout screenshots.

## Login — invalid credentials

- Route/path: `/login` (error message visible)
- Angular source files: `login.component.ts/html`
- React source files, if present: `LoginPage.tsx`
- Auth required: no
- Role/permission gating: none
- How to reach it: Submit wrong password
- Backend/API dependencies: user lookup
- Important UI states to compare: error copy, field validation display
- Status: not started
- Notes: —

## Document `<head>` (title + icon)

- Route/path: global (sampled at `/login`)
- Angular source files: `src/index.html`
- React source files, if present: `web-react/index.html`
- Auth required: no
- Role/permission gating: none
- How to reach it: Any initial load
- Backend/API dependencies: none
- Important UI states to compare: `<title>`, `<link rel="icon">`
- Status: compared
- Notes: Playwright asserts title string and presence/absence of favicon link.

## Statistics / charts (home widget)

- Route/path: embedded in `/home`
- Angular source files: `statistics.component.html`
- React source files, if present: `Statistics.tsx`
- Auth required: yes (via home)
- Role/permission gating: Administrator
- How to reach it: Home page scroll
- Backend/API dependencies: orders + users lists
- Important UI states to compare: card headers, chart options, PrimeNG vs PrimeReact chart wrappers
- Status: not started
- Notes: —

## Logout flow

- Route/path: n/a (action); navigates to `/login`
- Angular source files: `sidebar.component.ts`
- React source files, if present: `Sidebar.tsx`
- Auth required: was yes before logout
- Role/permission gating: n/a
- How to reach it: Sidebar Logout
- Backend/API dependencies: none
- Important UI states to compare: navigation timing, session cleared
- Status: not started
- Notes: —
