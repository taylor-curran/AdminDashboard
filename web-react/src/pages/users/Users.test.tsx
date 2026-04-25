import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { UsersPage } from "./Users";
import { renderWithProviders } from "../../test/utils";

const seed = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "Password123!",
    roles: ["Customer"],
    createdOn: "2024-06-01T12:00:00Z",
  },
];

function tree() {
  return (
    <Routes>
      <Route path="/users" element={<UsersPage />} />
    </Routes>
  );
}

describe("Users page", () => {
  let fetchSpy: any;

  beforeEach(() => {
    fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify(seed), { status: 200 }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads users via GET /users on mount", async () => {
    renderWithProviders(tree(), { route: "/users", authedAs: "admin" });
    await waitFor(() =>
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument(),
    );
    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:3000/users",
      expect.any(Object),
    );
  });

  it("shows required-field errors after user touches inputs", async () => {
    const user = userEvent.setup();
    renderWithProviders(tree(), { route: "/users", authedAs: "admin" });

    const firstName = screen.getByLabelText(/first name/i);
    const lastName = screen.getByLabelText(/last name/i);
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);

    // Touch each field then blur to trigger Angular-like onTouched behavior.
    await user.click(firstName);
    await user.click(lastName);
    await user.click(email);
    await user.click(password);
    await user.tab();

    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it("flags weak passwords with the strength message", async () => {
    const user = userEvent.setup();
    renderWithProviders(tree(), { route: "/users", authedAs: "admin" });
    const password = screen.getByLabelText(/password/i);
    await user.type(password, "weakpass");
    await user.tab();

    expect(
      await screen.findByText(/password not strong enough/i),
    ).toBeInTheDocument();
  });

  it("creates a user via POST /users when the form is submitted", async () => {
    const user = userEvent.setup();
    renderWithProviders(tree(), { route: "/users", authedAs: "admin" });

    await user.type(screen.getByLabelText(/first name/i), "Test");
    await user.type(screen.getByLabelText(/last name/i), "User");
    await user.type(screen.getByLabelText(/email/i), "test.user@example.com");
    await user.type(screen.getByLabelText(/password/i), "Password123!");

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ id: "x" }), { status: 201 }),
    );
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(seed), { status: 200 }),
    );

    await user.click(screen.getByRole("button", { name: /add user/i }));

    await waitFor(() => {
      const post = (fetchSpy.mock.calls as any[]).find(
        (c: any[]) =>
          c[0] === "http://localhost:3000/users" &&
          (c[1] as RequestInit | undefined)?.method === "POST",
      );
      expect(post).toBeTruthy();
      const body = JSON.parse((post![1] as RequestInit).body as string);
      expect(body.firstName).toBe("Test");
      expect(body.email).toBe("test.user@example.com");
      expect(body.roles).toEqual([]);
    });
  });
});
