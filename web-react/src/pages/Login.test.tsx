import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { LoginPage } from "./Login";
import { renderWithProviders } from "../test/utils";

const adminUser = {
  id: "3ad5",
  firstName: "admin",
  lastName: "admin",
  email: "admin@mail.com",
  password: "admin",
  roles: ["Administrator"],
  createdOn: "2024-07-03T19:22:15.464Z",
};

function tree() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<div>HOME-PAGE</div>} />
    </Routes>
  );
}

describe("Login page", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes("/users?email=")) {
        return new Response(JSON.stringify([adminUser]), { status: 200 });
      }
      return new Response("[]", { status: 200 });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the login form", () => {
    renderWithProviders(tree(), { route: "/" });
    expect(
      screen.getByRole("heading", { name: /login/i, level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("logs in successfully and navigates to /home", async () => {
    const user = userEvent.setup();
    renderWithProviders(tree(), { route: "/" });

    await user.type(screen.getByLabelText(/email/i), "admin@mail.com");
    await user.type(screen.getByLabelText(/password/i), "admin");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("HOME-PAGE")).toBeInTheDocument();
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/users?email=admin%40mail.com",
      expect.any(Object),
    );
  });

  it("shows an error message on bad credentials", async () => {
    (globalThis.fetch as any).mockImplementation(
      async () => new Response("[]", { status: 200 }),
    );
    const user = userEvent.setup();
    renderWithProviders(tree(), { route: "/" });

    await user.type(screen.getByLabelText(/email/i), "nope@mail.com");
    await user.type(screen.getByLabelText(/password/i), "badpass");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/invalid email or password/i),
    ).toBeInTheDocument();
  });
});
