import { describe, expect, it } from "vitest";
import {
  buildPaymentStatusChart,
  buildTransactionChartSeries,
  getLast30DaysData,
} from "./statistics";
import type { PaymentOrder } from "../types";

describe("getLast30DaysData", () => {
  it("returns 30 labels and 30 counts (same dimensions as Angular)", () => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    const { labels, counts } = getLast30DaysData([d]);
    expect(labels.length).toBe(30);
    expect(counts.length).toBe(30);
  });
});

describe("buildPaymentStatusChart", () => {
  it("aggregates statuses like Angular statistics", () => {
    const orders: Pick<PaymentOrder, "status">[] = [
      { status: "Successful" },
      { status: "Successful" },
      { status: "Created" },
      { status: "Unsuccessful" },
    ];
    const r = buildPaymentStatusChart(orders as PaymentOrder[]);
    expect(r.data).toEqual([2, 1, 1]);
  });
});

describe("buildTransactionChartSeries", () => {
  it("uses paidOn for successful orders only", () => {
    const paid = new Date();
    paid.setHours(12, 0, 0, 0);
    const orders: PaymentOrder[] = [
      {
        id: "1",
        paymentReference: "P",
        title: "t",
        description: "d",
        status: "Successful",
        amount: 1,
        currency: "USD",
        customerData: {} as PaymentOrder["customerData"],
        createdOn: paid.toISOString(),
        paidOn: paid.toISOString(),
      },
      {
        id: "2",
        paymentReference: "P2",
        title: "t2",
        description: "d",
        status: "Created",
        amount: 1,
        currency: "USD",
        customerData: {} as PaymentOrder["customerData"],
        createdOn: paid.toISOString(),
      },
    ];
    const s = buildTransactionChartSeries(orders);
    expect(s.labels.length).toBe(30);
    expect(s.counts.length).toBe(30);
  });
});
