import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // json-server uses /users; avoid hijacking SPA route /users on full page loads
      "/users": {
        target: "http://localhost:3000",
        changeOrigin: true,
        bypass(req) {
          const dest = req.headers["sec-fetch-dest"];
          if (dest === "document") return "/index.html";
        },
      },
      "/paymentOrders": "http://localhost:3000",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
