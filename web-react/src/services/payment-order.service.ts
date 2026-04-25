import { PaymentOrder } from "../types";

const API_URL = "/paymentOrders";

export const paymentOrderService = {
  async getPaymentOrders(): Promise<PaymentOrder[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to load payment orders");
    return res.json();
  },

  async getPaymentOrderById(id: string): Promise<PaymentOrder> {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to load payment order");
    return res.json();
  },
};
