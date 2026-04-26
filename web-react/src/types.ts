export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
  createdOn: string | Date;
}

export type PaymentOrderStatus = "Created" | "Successful" | "Unsuccessful";

export interface PaymentOrder {
  id: string;
  paymentReference: string;
  title: string;
  description: string;
  status: PaymentOrderStatus;
  amount: number;
  currency: string;
  customerData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    streetAddress: string;
    postalCode: string;
    city: string;
    country: string;
  };
  createdOn: string | Date;
  paidOn?: string | Date;
  authorizationCode?: string;
}
