/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The React app talks to json-server via absolute URLs
// (http://localhost:3000/...), the same way the Angular reference does.
// We deliberately do NOT proxy `/users` or `/paymentOrders` here, because
// those are also React Router SPA paths and the dev server must return
// index.html for them. json-server already responds with permissive CORS,
// so direct cross-origin requests work in the browser.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
