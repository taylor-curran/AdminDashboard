export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
  createdOn: string;
}

export interface PaymentOrder {
  id: string;
  paymentReference: string;
  title: string;
  description: string;
  status: 'Created' | 'Successful' | 'Unsuccessful';
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
  createdOn: string;
  paidOn?: string;
  authorizationCode?: string;
}
