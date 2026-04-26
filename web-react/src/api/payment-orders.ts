import type { PaymentOrder } from "../types";
import { apiGet } from "./client";

export function getPaymentOrders(): Promise<PaymentOrder[]> {
  return apiGet<PaymentOrder[]>("/paymentOrders");
}

export function getPaymentOrderById(id: string): Promise<PaymentOrder> {
  return apiGet<PaymentOrder>(`/paymentOrders/${id}`);
}
