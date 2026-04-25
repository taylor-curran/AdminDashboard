import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Route, Routes } from "react-router-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaymentOrdersPage } from "./PaymentOrders";
import { renderWithProviders } from "../test/utils";

const sampleOrders = [
  {
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
      phoneNumber: "+1",
      streetAddress: "x",
      postalCode: "0",
      city: "x",
      country: "x",
    },
    createdOn: "2024-06-15T08:00:00Z",
    paidOn: "2024-06-16T08:00:00Z",
    authorizationCode: "AUTH123456",
  },
  {
    id: "2",
    paymentReference: "PAY123457",
    title: "Order #2",
    description: "Payment for Order #2",
    status: "Created",
    amount: 200.75,
    currency: "EUR",
    customerData: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phoneNumber: "+1",
      streetAddress: "x",
      postalCode: "0",
      city: "x",
      country: "x",
    },
    createdOn: "2024-06-17T09:00:00Z",
  },
];

function tree() {
  return (
    <Routes>
      <Route path="/payment-orders" element={<PaymentOrdersPage />} />
      <Route
        path="/payment-orders/:id"
        element={<div data-testid="details-page">DETAILS</div>}
      />
    </Routes>
  );
}

describe("PaymentOrders page", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(sampleOrders), { status: 200 }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests GET /paymentOrders and renders rows from db.json shape", async () => {
    renderWithProviders(tree(), {
      route: "/payment-orders",
      authedAs: "admin",
    });

    await waitFor(() => {
      expect(screen.getByText("PAY123456")).toBeInTheDocument();
    });
    expect(screen.getByText("PAY123457")).toBeInTheDocument();
    expect(screen.getByText("Order #1")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/paymentOrders",
      expect.any(Object),
    );
  });

  it("navigates to /payment-orders/:id when the row action is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(tree(), {
      route: "/payment-orders",
      authedAs: "admin",
    });

    await waitFor(() => screen.getByText("PAY123456"));
    await user.click(screen.getByLabelText("View PAY123456"));

    expect(await screen.findByTestId("details-page")).toBeInTheDocument();
  });
});
