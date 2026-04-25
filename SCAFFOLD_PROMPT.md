# Agent prompt: Scaffold a React sibling for an Angular repo

You're prepping an Angular repo so a future agent can race to port it to React. **Don't migrate anything.** Just stand up a sibling React scaffold and wire it into `.cursor/environment.json` so three servers auto-boot side-by-side: the existing data layer, the existing Angular app, and the new empty React app.

## Discover first

1. Angular dev server command + port. Read root `package.json` and `angular.json`. Default is `ng serve` on `:4200`; respect whatever's actually configured.
2. Data layer. Look for one of:
   - `json-server` script + a `db.json` → reuse it on `:3000`
   - `ng serve --proxy-config` → there's an external API; note its base URL
   - MSW / in-memory mocks → no separate API server
3. The endpoints the app calls: `rg -n "this\.http\.(get|post|put|delete|patch)" src/app | head -40`. The React app's Vite proxy will need to reach the same ones.

## Build

1. `web-react/` — bare Vite + React + TS, dependencies limited to `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom`. Nothing else. Files: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx` (renders `<App />`), `src/App.tsx` (placeholder heading), `.gitignore`, short `README.md` saying "bare scaffold; pick your own router/UI/forms/state/test runner".
2. `web-react/vite.config.ts`: `server.port: 5173` + a `server.proxy` block forwarding the endpoints from step 3 to the backend from step 2. If the Angular app uses MSW / in-memory mocks, leave proxy empty with a TODO for the future agent.
3. Root `package.json` scripts (mirror existing style if any):
   - `"api": "<command for the data layer>"` — omit if N/A
   - `"web": "<existing Angular dev command bound to 0.0.0.0>"`
   - `"react": "npm --prefix web-react run dev -- --host 0.0.0.0 --port 5173"`

## Wire `.cursor/environment.json`

Create the file if it doesn't exist; otherwise edit in place. Final shape (drop the `api` entries if there's no separate data layer):

```json
{
  "$schema": "https://www.cursor.com/schemas/environment.schema.json",
  "name": "<repo-name>-cloud",
  "install": "npm install && npm --prefix web-react install",
  "ports": [
    { "name": "Angular app", "port": 4200 },
    { "name": "React app",   "port": 5173 },
    { "name": "API",         "port": 3000 }
  ],
  "start": "true",
  "terminals": [
    { "name": "api",   "command": "npm run api"   },
    { "name": "web",   "command": "npm run web"   },
    { "name": "react", "command": "npm run react" }
  ]
}
```

Three things this file must do, in order — verify each one:

1. **`install` warms both apps.** A fresh cloud agent VM should land with both `node_modules` populated. Test by deleting both, running the `install` command verbatim, and checking `web-react/node_modules/react` exists.
2. **`ports` exposes all three.** Cursor's UI will only surface ports listed here. Omitting `:5173` is the most common mistake.
3. **`terminals` auto-launches all three commands.** Each entry creates a named terminal that runs its `command` on cold start. There must be one per service so a future agent doesn't have to boot anything manually.

## Verify

```sh
npm install && npm --prefix web-react install
# launch api / web / react in three tmux sessions (or just trust the cursor env on a fresh VM)
lsof -iTCP -sTCP:LISTEN -P -n | grep -E ':(3000|4200|5173)'
curl http://localhost:4200/                       # Angular index
curl http://localhost:5173/                       # React scaffold
curl http://localhost:5173/<one-real-endpoint>    # proxy hits backend
```

The last curl must return the same payload as hitting the backend directly.

## Done when

- `npm --prefix web-react run build` succeeds.
- `npm run react` boots Vite on `:5173`.
- All three ports listen simultaneously.
- A request through the Vite proxy reaches the same backend the Angular app uses.
- `.cursor/environment.json` lists all three ports and auto-launches all three terminals.
- One PR: `web-react/` scaffold + root scripts + env config. No migration code.
