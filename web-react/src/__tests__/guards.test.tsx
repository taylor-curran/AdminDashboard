import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "../guards/AuthGuard";
import { RoleGuard } from "../guards/RoleGuard";
import { LoginGuard } from "../guards/LoginGuard";
import { AuthContext } from "../contexts/AuthContext";
import { User } from "../types";

const adminUser: User = {
  id: "1",
  firstName: "Admin",
  lastName: "User",
  email: "admin@mail.com",
  password: "admin",
  roles: ["Administrator"],
  createdOn: "2024-01-01",
};

const customerUser: User = {
  id: "2",
  firstName: "Customer",
  lastName: "User",
  email: "customer@mail.com",
  password: "pass",
  roles: ["Customer"],
  createdOn: "2024-01-01",
};

function renderWithAuth(
  ui: React.ReactNode,
  {
    user,
    initialPath = "/test",
  }: { user: User | null; initialPath?: string }
) {
  const authValue = {
    currentUser: user,
    isAuthenticated: !!user,
    login: vi.fn(),
    logout: vi.fn(),
  };

  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/test" element={ui} />
          <Route path="/401" element={<div>401 Page</div>} />
          <Route path="/403" element={<div>403 Page</div>} />
          <Route path="/home" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("AuthGuard", () => {
  it("renders children when authenticated", () => {
    renderWithAuth(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>,
      { user: adminUser }
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to /401 when not authenticated", () => {
    renderWithAuth(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>,
      { user: null }
    );
    expect(screen.getByText("401 Page")).toBeInTheDocument();
  });
});

describe("RoleGuard", () => {
  it("renders children for admin users", () => {
    renderWithAuth(
      <RoleGuard>
        <div>Admin Content</div>
      </RoleGuard>,
      { user: adminUser }
    );
    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });

  it("redirects to /403 for non-admin users", () => {
    renderWithAuth(
      <RoleGuard>
        <div>Admin Content</div>
      </RoleGuard>,
      { user: customerUser }
    );
    expect(screen.getByText("403 Page")).toBeInTheDocument();
  });
});

describe("LoginGuard", () => {
  it("renders children when not authenticated", () => {
    renderWithAuth(
      <LoginGuard>
        <div>Login Form</div>
      </LoginGuard>,
      { user: null }
    );
    expect(screen.getByText("Login Form")).toBeInTheDocument();
  });

  it("redirects to /home when authenticated", () => {
    renderWithAuth(
      <LoginGuard>
        <div>Login Form</div>
      </LoginGuard>,
      { user: adminUser }
    );
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
});
