# Admin Dashboard — React POC

A tiny sibling of the Angular app (in `../src`). Proves that both apps can:

- Live on the same branch without stepping on each other.
- Share the same `json-server` backend (`../db.json` on `:3000`).
- Run their own test runners independently (Karma/Jasmine for Angular, Vitest for React).

This is **not** a port of the full app — it only fetches `/users` and renders them,
enough to validate the migration layout.

## Run

```sh
# terminal 1 (from repo root)
npx json-server --watch db.json

# terminal 2 (from repo root)
cd web-react
npm install
npm run dev                 # http://localhost:5173
```

The Vite dev server proxies `/users` and `/paymentOrders` to `:3000`.

## Test

```sh
cd web-react
npm test                    # Vitest, headless
```

Meanwhile, from the repo root, `npm test` still runs the original Angular Karma suite.
