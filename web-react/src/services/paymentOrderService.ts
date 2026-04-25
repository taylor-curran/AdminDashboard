import { getJSON } from "./http";
import type { PaymentOrder } from "./types";

const API_URL = "/paymentOrders";

export const paymentOrderService = {
  getPaymentOrders(): Promise<PaymentOrder[]> {
    return getJSON<PaymentOrder[]>(API_URL);
  },

  getPaymentOrderById(id: string): Promise<PaymentOrder> {
    return getJSON<PaymentOrder>(`${API_URL}/${id}`);
  },
};
