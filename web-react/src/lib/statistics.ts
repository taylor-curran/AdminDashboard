import type { PaymentOrder, User } from "../types";

/** Same algorithm as Angular `StatisticsComponent.getLast30DaysData`. */
export function getLast30DaysData(dates: Date[]): {
  labels: string[];
  counts: number[];
} {
  const counts: Record<string, number> = {};
  const labels: string[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0]!;
    labels.push(dateString);
    counts[dateString] = 0;
  }

  dates.forEach((date) => {
    const dateString = date.toISOString().split("T")[0]!;
    if (counts[dateString] !== undefined) {
      counts[dateString]++;
    }
  });

  const countsArray: number[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0]!;
    countsArray.push(counts[dateString] ?? 0);
  }

  return { labels, counts: countsArray };
}

export function buildTransactionChartSeries(orders: PaymentOrder[]) {
  const successful = orders.filter((o) => o.status === "Successful");
  const dates = successful
    .map((o) => (o.paidOn ? new Date(o.paidOn) : null))
    .filter((d): d is Date => d !== null);
  return getLast30DaysData(dates);
}

export function buildUsersChartSeries(users: User[]) {
  return getLast30DaysData(
    users.map((u) => new Date(u.createdOn as string | Date)),
  );
}

export function buildPaymentStatusChart(orders: PaymentOrder[]) {
  const statusCounts = {
    Successful: 0,
    Unsuccessful: 0,
    Created: 0,
  };
  orders.forEach((order) => {
    statusCounts[order.status]++;
  });
  return {
    labels: ["Successful", "Unsuccessful", "Created"] as const,
    data: [
      statusCounts.Successful,
      statusCounts.Unsuccessful,
      statusCounts.Created,
    ],
  };
}
