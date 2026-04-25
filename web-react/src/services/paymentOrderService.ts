import axios from 'axios';
import { PaymentOrder } from '../types';

const API_URL = '/api/paymentOrders';

export const paymentOrderService = {
  getPaymentOrders(): Promise<PaymentOrder[]> {
    return axios.get<PaymentOrder[]>(API_URL).then((res) => res.data);
  },

  getPaymentOrderById(id: string): Promise<PaymentOrder> {
    return axios.get<PaymentOrder>(`${API_URL}/${id}`).then((res) => res.data);
  },
};
