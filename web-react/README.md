# web-react

Empty Vite + React + TypeScript scaffold for porting the Angular app in `../src`.

Vite proxies `/users` and `/paymentOrders` to `http://localhost:3000` so this app
shares the same `json-server` backend (`../db.json`) as the Angular app.

## Run all three side-by-side

Three separate terminals, all from the repo root:

```sh
npm run api                                     # :3000  json-server (shared)
npm run web                                     # :4200  Angular reference
cd web-react && npm install && npm run dev      # :5173  React port
```

Open `http://localhost:4200` and `http://localhost:5173` together to compare.

## Pick your own stack

This scaffold is intentionally bare. Add a router, UI library, forms,
state management, data fetching, and test runner as you need them.
