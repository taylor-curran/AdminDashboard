export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
  createdOn: string;
}

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
}

export type PaymentStatus = "Created" | "Successful" | "Unsuccessful";

export interface PaymentOrder {
  id: string;
  paymentReference: string;
  title: string;
  description: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  customerData: CustomerData;
  createdOn: string;
  paidOn?: string;
  authorizationCode?: string;
}
