import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

const sampleUsers = [
  { id: 1, name: "Admin", email: "admin@mail.com", role: "Administrator" },
  { id: 2, name: "Jane", email: "jane@mail.com", role: "Customer" },
];

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = typeof input === "string" ? input : input.toString();
        if (url.endsWith("/users")) {
          return new Response(JSON.stringify(sampleUsers), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response("not found", { status: 404 });
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the heading", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /admin dashboard/i }),
    ).toBeInTheDocument();
  });

  it("renders users fetched from the mock API", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
    });
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText(/admin@mail\.com/)).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });
});
