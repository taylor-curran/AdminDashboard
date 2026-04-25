import type { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../auth/AuthContext";
import { authService } from "../services/authService";

interface RenderOptions {
  route?: string;
  authedAs?: "admin" | "customer" | null;
}

export const adminUser = {
  id: "3ad5",
  firstName: "admin",
  lastName: "admin",
  email: "admin@mail.com",
  password: "admin",
  roles: ["Administrator"],
  createdOn: "2024-07-03T19:22:15.464Z",
};

export const customerUser = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "Password123!",
  roles: ["Customer"],
  createdOn: "2024-06-01T12:00:00Z",
};

export function setAuthedUser(role: "admin" | "customer" | null) {
  if (role === "admin") {
    localStorage.setItem("currentUser", JSON.stringify(adminUser));
  } else if (role === "customer") {
    localStorage.setItem("currentUser", JSON.stringify(customerUser));
  } else {
    localStorage.removeItem("currentUser");
  }
  // Reset the in-memory authService state to match localStorage
  (authService as any).current = role
    ? JSON.parse(localStorage.getItem("currentUser")!)
    : null;
}

export function renderWithProviders(
  ui: ReactElement,
  { route = "/", authedAs = null }: RenderOptions = {},
) {
  setAuthedUser(authedAs);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>{ui as ReactNode}</AuthProvider>
    </MemoryRouter>,
  );
}
