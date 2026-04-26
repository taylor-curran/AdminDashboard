# Audit page inventory — Admin Dashboard (Angular reference vs React in `web-react/`)

Sources: `src/app/app.routes.ts`, `web-react/src/App.tsx`, sidebar navigation, error routes, README.

## Root redirect

- Route/path: `/` → `/home`
- Angular source files: `src/app/app.routes.ts`
- React source files, if present: `web-react/src/App.tsx`
- Auth required: yes (after redirect)
- Role/permission gating: Administrator for `/home`
- How to reach it: open `/`
- Backend/API dependencies: none for redirect
- Important UI states to compare: redirect target
- Status: compared
- Notes: Both send authenticated admins to home.

## Login

- Route/path: `/login`
- Angular source files: `src/app/pages/login/login.component.*`, `src/app/guards/login.guard.ts`
- React source files, if present: `web-react/src/pages/LoginPage.tsx`, `web-react/src/routes/GuestOnly.tsx`
- Auth required: no
- Role/permission gating: none; logged-in users redirected away
- How to reach it: sidebar Login when logged out, or direct `/login`
- Backend/API dependencies: `GET /users?email=` via json-server
- Important UI states to compare: validation, error message, layout classes, document title, favicon
- Status: compared
- Notes: Playwright uses `admin@mail.com` / `admin` for admin flows.

## Home (dashboard)

- Route/path: `/home`
- Angular source files: `src/app/pages/home/home.component.*`, `src/app/components/statistics/*`
- React source files, if present: `web-react/src/pages/HomePage.tsx`, `web-react/src/components/Statistics.tsx`
- Auth required: yes
- Role/permission gating: Administrator
- How to reach it: sidebar Home, post-login redirect
- Backend/API dependencies: payment orders and users lists for charts
- Important UI states to compare: welcome copy, chart card headers, shell layout, date bucketing in charts
- Status: compared
- Notes: Customer users hit `/403` when navigating here (both apps in this audit).

## Payment orders list

- Route/path: `/payment-orders`
- Angular source files: `src/app/pages/payment-orders/payment-orders.component.*`, `src/app/services/payment-order.service.ts`
- React source files, if present: `web-react/src/pages/PaymentOrdersPage.tsx`, `web-react/src/api/payment-orders.ts`
- Auth required: yes
- Role/permission gating: Administrator
- How to reach it: sidebar Orders
- Backend/API dependencies: `GET /paymentOrders` (Angular: absolute localhost:3000; React: same-origin proxied path in dev/preview)
- Important UI states to compare: table columns, filters, pagination, global search, view action
- Status: compared
- Notes: API URL/host differs between stacks under default config.

## Payment order detail

- Route/path: `/payment-orders/:id` (sample `1`)
- Angular source files: `src/app/pages/payment-order-details/payment-order-details.component.*`
- React source files, if present: `web-react/src/pages/PaymentOrderDetailsPage.tsx`
- Auth required: yes
- Role/permission gating: Administrator
- How to reach it: external-link action from list, or deep link
- Backend/API dependencies: `GET /paymentOrders/:id`
- Important UI states to compare: dates (`date` pipe vs `toLocaleDateString`), successful-only fields, back control
- Status: compared
- Notes: Order #1 is Successful in `db.json`.

## User management

- Route/path: `/users`
- Angular source files: `src/app/pages/users/users.component.*`
- React source files, if present: `web-react/src/pages/UsersPage.tsx`
- Auth required: yes
- Role/permission gating: Administrator
- How to reach it: sidebar Users
- Backend/API dependencies: `GET/POST/PUT/DELETE /users`
- Important UI states to compare: form labels, submit button text, validation, roles multiselect, table, delete confirm
- Status: compared
- Notes: Submit label differs (`Add User` vs `Add User` with different PrimeNG vs PrimeReact wiring — see tests).

## 401 Unauthorized

- Route/path: `/401`
- Angular source files: `src/app/pages/errors/unauthorized/*`
- React source files, if present: `web-react/src/pages/UnauthorizedPage.tsx`
- Auth required: no
- Role/permission gating: none
- How to reach it: visit protected route while logged out (e.g. `/home`)
- Backend/API dependencies: none
- Important UI states to compare: copy, Login CTA pattern
- Status: compared
- Notes: Parity checks included in Angular `@angular` suite; not logged as CSV discrepancy.

## 403 Forbidden

- Route/path: `/403`
- Angular source files: `src/app/pages/errors/forbidden/*`, `src/app/guards/role.guard.ts`
- React source files, if present: `web-react/src/pages/ForbiddenPage.tsx`, `web-react/src/routes/RequireAdmin.tsx`
- Auth required: no (page itself)
- Role/permission gating: shown when non-admin hits admin routes
- How to reach it: customer logs in then opens `/home`
- Backend/API dependencies: none
- Important UI states to compare: copy, logout CTA
- Status: compared
- Notes: Same redirect behavior for customer in both apps for this dataset.

## 404 Not Found

- Route/path: catch-all → `/404` (Angular); unknown path → `/404` (React)
- Angular source files: `src/app/pages/errors/not-found/*`
- React source files, if present: `web-react/src/pages/NotFoundPage.tsx`
- Auth required: no
- Role/permission gating: none
- How to reach it: unknown path under layout
- Backend/API dependencies: none
- Important UI states to compare: outer DOM structure, apostrophe in copy, “Go to Homepage” control structure
- Status: compared
- Notes: Angular uses `.container`; React uses `.error-page-container`.

## Customer session — post-login landing

- Route/path: `/home` or immediate `/403` after login
- Angular source files: `role.guard.ts`, `auth.service.ts`
- React source files, if present: `RequireAdmin.tsx`, `AuthContext.tsx`
- Auth required: yes
- Role/permission gating: Customer cannot use admin shell routes
- How to reach it: login as `john.doe@example.com` / `Password123!`
- Backend/API dependencies: user lookup
- Important UI states to compare: redirect to `/403` on `/home`
- Status: matches
- Notes: Used to validate parity; no CSV row (both redirect to `/403`).

## Deep link — invalid payment order id

- Route/path: `/payment-orders/99999` (example)
- Angular source files: `payment-order-details.component.ts` (HTTP error handling)
- React source files, if present: `PaymentOrderDetailsPage.tsx` + React Query
- Auth required: yes
- Role/permission gating: Administrator
- How to reach it: manual URL
- Backend/API dependencies: `GET` returns 404
- Important UI states to compare: empty vs error UI
- Status: not started
- Notes: Left unaudited in this run to avoid mutating json-server state; no CSV row.

## Logout from sidebar

- Route/path: n/a (action)
- Angular source files: `src/app/components/sidebar/sidebar.component.*`, `auth.service.ts`
- React source files, if present: `web-react/src/components/Sidebar.tsx`, `AuthContext.tsx`
- Auth required: was authenticated
- Role/permission gating: n/a
- How to reach it: Logout in sidebar
- Backend/API dependencies: none
- Important UI states to compare: clears session, navigates to login
- Status: not started
- Notes: No dedicated Playwright row in this audit.

## Index / shell document metadata

- Route/path: global (`index.html`)
- Angular source files: `src/index.html`
- React source files, if present: `web-react/index.html`
- Auth required: n/a
- Role/permission gating: n/a
- How to reach it: any first load
- Backend/API dependencies: none
- Important UI states to compare: `<title>`, favicon link
- Status: compared
- Notes: Title and favicon differ.
