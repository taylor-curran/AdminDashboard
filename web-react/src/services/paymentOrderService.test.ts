import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { paymentOrderService } from "./paymentOrderService";

describe("paymentOrderService HTTP shape", () => {
  let fetchSpy: any;

  beforeEach(() => {
    fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("[]", { status: 200 }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getPaymentOrders -> GET /paymentOrders", async () => {
    await paymentOrderService.getPaymentOrders();
    expect(fetchSpy.mock.calls[0][0]).toBe(
      "http://localhost:3000/paymentOrders",
    );
  });

  it("getPaymentOrderById -> GET /paymentOrders/:id", async () => {
    fetchSpy.mockResolvedValueOnce(new Response("{}", { status: 200 }));
    await paymentOrderService.getPaymentOrderById("7");
    expect(fetchSpy.mock.calls[0][0]).toBe(
      "http://localhost:3000/paymentOrders/7",
    );
  });
});
