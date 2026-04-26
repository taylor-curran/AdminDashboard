import type { PaymentOrder } from "../types/payment-order";
import { apiFetch } from "../api/client";

export async function getPaymentOrders(): Promise<PaymentOrder[]> {
  const res = await apiFetch("/paymentOrders");
  if (!res.ok) {
    throw new Error("Something bad happened; please try again later.");
  }
  return res.json() as Promise<PaymentOrder[]>;
}

export async function getPaymentOrderById(
  id: string,
): Promise<PaymentOrder> {
  const res = await apiFetch(`/paymentOrders/${id}`);
  if (!res.ok) {
    throw new Error("Something bad happened; please try again later.");
  }
  return res.json() as Promise<PaymentOrder>;
}
