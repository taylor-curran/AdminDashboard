import { describe, it, expect, vi, beforeEach } from "vitest";
import { paymentOrderService } from "../services/payment-order.service";

describe("PaymentOrderService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getPaymentOrders fetches GET /paymentOrders", async () => {
    const mockOrders = [
      { id: "1", paymentReference: "PAY123456", title: "Order #1" },
    ];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOrders),
    });

    const result = await paymentOrderService.getPaymentOrders();
    expect(fetch).toHaveBeenCalledWith("/api/paymentOrders");
    expect(result).toEqual(mockOrders);
  });

  it("getPaymentOrderById fetches GET /paymentOrders/:id", async () => {
    const mockOrder = {
      id: "1",
      paymentReference: "PAY123456",
      title: "Order #1",
    };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOrder),
    });

    const result = await paymentOrderService.getPaymentOrderById("1");
    expect(fetch).toHaveBeenCalledWith("/api/paymentOrders/1");
    expect(result).toEqual(mockOrder);
  });
});
