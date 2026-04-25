import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Route, Routes } from "react-router-dom";
import { screen, waitFor } from "@testing-library/react";
import { PaymentOrderDetailsPage } from "./PaymentOrderDetails";
import { renderWithProviders } from "../test/utils";

const successfulOrder = {
  id: "1",
  paymentReference: "PAY123456",
  title: "Order #1",
  description: "Payment for monthly subscription",
  status: "Successful",
  amount: 100.5,
  currency: "USD",
  customerData: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1234567890",
    streetAddress: "123 Main St",
    postalCode: "12345",
    city: "Springfield",
    country: "USA",
  },
  createdOn: "2024-06-15T08:00:00Z",
  paidOn: "2024-06-16T08:00:00Z",
  authorizationCode: "AUTH123456",
};

const createdOrder = { ...successfulOrder, id: "2", status: "Created" };

function tree() {
  return (
    <Routes>
      <Route
        path="/payment-orders/:id"
        element={<PaymentOrderDetailsPage />}
      />
    </Routes>
  );
}

describe("PaymentOrderDetails page", () => {
  let fetchSpy: any;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("issues GET /paymentOrders/:id and renders order fields", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(successfulOrder), { status: 200 }),
    );

    renderWithProviders(tree(), {
      route: "/payment-orders/1",
      authedAs: "admin",
    });

    expect(
      await screen.findByRole("heading", { name: "Order #1", level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Payment for monthly subscription"),
    ).toBeInTheDocument();
    expect(screen.getByText("Reference: PAY123456")).toBeInTheDocument();
    expect(screen.getByText("Successful")).toBeInTheDocument();
    expect(screen.getByText("100.5")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("AUTH123456")).toBeInTheDocument();

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:3000/paymentOrders/1",
      expect.any(Object),
    );
  });

  it("hides Paid On and Authorization Code for non-Successful orders", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(createdOrder), { status: 200 }),
    );

    renderWithProviders(tree(), {
      route: "/payment-orders/2",
      authedAs: "admin",
    });

    await waitFor(() =>
      screen.getByRole("heading", { name: "Order #1", level: 3 }),
    );

    expect(screen.queryByText("Paid On")).not.toBeInTheDocument();
    expect(screen.queryByText("Authorization Code")).not.toBeInTheDocument();
  });
});
