import { describe, expect, it } from "vitest";
import { Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { Sidebar } from "./Sidebar";
import { renderWithProviders } from "../test/utils";

function tree() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="*" element={<div data-testid="route" />} />
      </Routes>
    </>
  );
}

describe("Sidebar", () => {
  it("links to all primary routes", () => {
    renderWithProviders(tree(), { route: "/home" });
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/home",
    );
    expect(screen.getByRole("link", { name: /orders/i })).toHaveAttribute(
      "href",
      "/payment-orders",
    );
    expect(screen.getByRole("link", { name: /users/i })).toHaveAttribute(
      "href",
      "/users",
    );
  });

  it("shows Login when unauthenticated", () => {
    renderWithProviders(tree(), { route: "/home", authedAs: null });
    expect(
      screen.getByRole("button", { name: /login/i }),
    ).toBeInTheDocument();
  });

  it("shows Logout when authenticated", () => {
    renderWithProviders(tree(), { route: "/home", authedAs: "admin" });
    expect(
      screen.getByRole("button", { name: /logout/i }),
    ).toBeInTheDocument();
  });

  it("logs the user out when Logout is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(tree(), { route: "/home", authedAs: "admin" });
    await user.click(screen.getByRole("button", { name: /logout/i }));
    expect(localStorage.getItem("currentUser")).toBeNull();
  });
});
