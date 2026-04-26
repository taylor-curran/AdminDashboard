import { describe, expect, it } from "vitest";
import {
  buildPaymentStatusChartData,
  buildTransactionChartData,
  buildUsersChartData,
  getLast30DaysData,
} from "./statistics";
import type { PaymentOrder } from "../types/payment-order";
import type { User } from "../types/user";

describe("statistics helpers", () => {
  it("getLast30DaysData returns 30 labels and counts", () => {
    const out = getLast30DaysData([new Date()]);
    expect(out.labels.length).toBe(30);
    expect(out.counts.length).toBe(30);
  });

  it("buildTransactionChartData matches Angular labels", () => {
    const orders: PaymentOrder[] = [
      {
        id: "1",
        paymentReference: "P1",
        title: "T",
        description: "D",
        status: "Successful",
        amount: 1,
        currency: "USD",
        customerData: {
          firstName: "A",
          lastName: "B",
          email: "a@b.com",
          phoneNumber: "1",
          streetAddress: "s",
          postalCode: "1",
          city: "c",
          country: "US",
        },
        createdOn: "2024-06-01",
        paidOn: "2024-06-02",
      },
    ];
    const data = buildTransactionChartData(orders);
    expect(data.datasets[0].label).toBe("Successful Transactions");
  });

  it("buildUsersChartData labels New Users", () => {
    const users: User[] = [
      {
        id: "1",
        firstName: "U",
        lastName: "V",
        email: "u@v.com",
        password: "x",
        roles: ["Customer"],
        createdOn: "2024-06-03",
      },
    ];
    const data = buildUsersChartData(users);
    expect(data.datasets[0].label).toBe("New Users");
  });

  it("buildPaymentStatusChartData aggregates statuses", () => {
    const orders: PaymentOrder[] = [
      {
        id: "1",
        paymentReference: "P1",
        title: "T",
        description: "D",
        status: "Successful",
        amount: 1,
        currency: "USD",
        customerData: {
          firstName: "A",
          lastName: "B",
          email: "a@b.com",
          phoneNumber: "1",
          streetAddress: "s",
          postalCode: "1",
          city: "c",
          country: "US",
        },
        createdOn: "2024-06-01",
      },
      {
        id: "2",
        paymentReference: "P2",
        title: "T2",
        description: "D2",
        status: "Created",
        amount: 2,
        currency: "EUR",
        customerData: {
          firstName: "C",
          lastName: "D",
          email: "c@d.com",
          phoneNumber: "2",
          streetAddress: "t",
          postalCode: "2",
          city: "e",
          country: "DE",
        },
        createdOn: "2024-06-02",
      },
    ];
    const data = buildPaymentStatusChartData(orders);
    expect(data.labels).toEqual(["Successful", "Unsuccessful", "Created"]);
    expect(data.datasets[0].data).toEqual([1, 0, 1]);
  });
});
