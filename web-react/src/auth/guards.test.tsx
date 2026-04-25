import { describe, expect, it } from "vitest";
import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import { ProtectedRoute, LoginGuard } from "./guards";
import { renderWithProviders } from "../test/utils";

function ProtectedTree() {
  return (
    <Routes>
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <div>HOME-CONTENT</div>
          </ProtectedRoute>
        }
      />
      <Route path="/401" element={<div>UNAUTHORIZED-PAGE</div>} />
      <Route path="/403" element={<div>FORBIDDEN-PAGE</div>} />
    </Routes>
  );
}

describe("auth + role guards", () => {
  it("redirects unauthenticated users to /401", () => {
    renderWithProviders(<ProtectedTree />, { route: "/home", authedAs: null });
    expect(screen.getByText("UNAUTHORIZED-PAGE")).toBeInTheDocument();
  });

  it("redirects authenticated non-admins to /403", () => {
    renderWithProviders(<ProtectedTree />, {
      route: "/home",
      authedAs: "customer",
    });
    expect(screen.getByText("FORBIDDEN-PAGE")).toBeInTheDocument();
  });

  it("renders children when user is authenticated and is an Administrator", () => {
    renderWithProviders(<ProtectedTree />, {
      route: "/home",
      authedAs: "admin",
    });
    expect(screen.getByText("HOME-CONTENT")).toBeInTheDocument();
  });
});

function LoginTree() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginGuard>
            <div>LOGIN-FORM</div>
          </LoginGuard>
        }
      />
      <Route path="/home" element={<div>HOME-CONTENT</div>} />
    </Routes>
  );
}

describe("login guard", () => {
  it("shows the login form when not authenticated", () => {
    renderWithProviders(<LoginTree />, { route: "/login", authedAs: null });
    expect(screen.getByText("LOGIN-FORM")).toBeInTheDocument();
  });

  it("redirects authenticated users to /home", () => {
    renderWithProviders(<LoginTree />, { route: "/login", authedAs: "admin" });
    expect(screen.getByText("HOME-CONTENT")).toBeInTheDocument();
  });
});
