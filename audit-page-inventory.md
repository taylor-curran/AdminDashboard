# Audit page inventory (Angular reference vs React migration)

**Apps:** Angular — `ng serve` on port **4200** (script `web`).  
React — Vite in `web-react` on port **5173** (script `react`).  
**API:** `json-server --watch db.json --port 3000` (script `api`).  
**Admin login (db.json):** `admin@mail.com` / `admin`.

| Route | Auth & roles | Reached from | What it is |
|-------|----------------|-------------|------------|
| `/` | n/a (redirect) | default load | Redirects to `/home`. |
| `/login` | public; `loginGuard` blocks when already logged in | sidebar **Login** when logged out, direct URL | Email/password form, error on bad credentials, navigates to `/home` on success. |
| `/home` | authenticated + `roleGuard` (**Administrator** only) | **Home** nav, brand click | “Home” title, welcome copy, statistics cards with charts. |
| `/payment-orders` | same | **Orders** nav | Paginated table: global search, per-column search, sort, row action to open details. |
| `/payment-orders/:id` | same | from Orders table (external link button) or URL | Back control, order card: payment/customer/order sections, dates for successful orders. |
| `/users` | same | **Users** nav | Create/edit user form (with roles multi-select), data table, edit/delete. |
| `/401` | public | unauthenticated access to a protected URL | Unauthorized message, link to login. |
| `/403` | public | e.g. customer token hitting admin route | Forbidden message, logout-style action to return to login flow. |
| `/404` | public | unknown path (catch-all) | Not found, link to home. |

**Navigation surface (sidebar, both apps when layout shown):** brand “Dashboard” (goes to home), links **Home**, **Orders**, **Users**, and **Login** or **Logout** depending on session.

**Notes:** `roleGuard` on Angular routes and `ProtectedRoute` (auth + `RoleGuard`) on React both require the **Administrator** role; non-admins are sent to `/403` when hitting protected content.

**Unreachability in React for this audit:** None — admin login, home, orders, order details, users, and error pages were all reachable in both apps in this environment (same `db.json` and API URL patterns).
