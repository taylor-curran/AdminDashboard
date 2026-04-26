import type { PaymentOrder } from "../types/payment-order";
import type { User } from "../types/user";

export function getLast30DaysData(dates: Date[]): {
  labels: string[];
  counts: number[];
} {
  const counts: Record<string, number> = {};
  const labels: string[] = [];
  const countsArray: number[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    labels.push(dateString);
    counts[dateString] = 0;
  }

  dates.forEach((date) => {
    const dateString = date.toISOString().split("T")[0];
    if (counts[dateString] !== undefined) {
      counts[dateString]++;
    }
  });

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    countsArray.push(counts[dateString]);
  }

  return { labels, counts: countsArray };
}

export function buildTransactionChartData(orders: PaymentOrder[]) {
  const successfulTransactions = orders.filter(
    (order) => order.status === "Successful",
  );
  const dailyCount = getLast30DaysData(
    successfulTransactions
      .filter((o) => o.paidOn)
      .map((order) => new Date(order.paidOn!)),
  );
  return {
    labels: dailyCount.labels,
    datasets: [
      {
        label: "Successful Transactions",
        data: dailyCount.counts,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
    ],
  };
}

export function buildUsersChartData(users: User[]) {
  const dailyCount = getLast30DaysData(
    users.map((user) => new Date(user.createdOn)),
  );
  return {
    labels: dailyCount.labels,
    datasets: [
      {
        label: "New Users",
        data: dailyCount.counts,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 1,
      },
    ],
  };
}

export function buildPaymentStatusChartData(orders: PaymentOrder[]) {
  const statusCounts = {
    Successful: 0,
    Unsuccessful: 0,
    Created: 0,
  };
  orders.forEach((order) => {
    statusCounts[order.status]++;
  });
  return {
    labels: ["Successful", "Unsuccessful", "Created"],
    datasets: [
      {
        label: "Payment Status",
        data: [
          statusCounts.Successful,
          statusCounts.Unsuccessful,
          statusCounts.Created,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
}
