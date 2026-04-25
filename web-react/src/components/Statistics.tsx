import { useEffect, useMemo, useState } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Chart as ChartJS, registerables } from "chart.js";
import { paymentOrderService } from "../services/paymentOrderService";
import { userService } from "../services/userService";
import type { PaymentOrder, User } from "../services/types";
import "./Statistics.css";

ChartJS.register(...registerables);

function getLast30DaysData(dates: Date[]): {
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

export function Statistics() {
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    paymentOrderService.getPaymentOrders().then(setPaymentOrders).catch(() => {});
    userService.getUsers().then(setUsers).catch(() => {});
  }, []);

  const transactionChartData = useMemo(() => {
    const successful = paymentOrders.filter((o) => o.status === "Successful");
    const daily = getLast30DaysData(
      successful.map((o) => new Date(o.paidOn!)),
    );
    return {
      labels: daily.labels,
      datasets: [
        {
          label: "Successful Transactions",
          data: daily.counts,
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 1,
        },
      ],
    };
  }, [paymentOrders]);

  const transactionChartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
  };

  const usersChartData = useMemo(() => {
    const daily = getLast30DaysData(users.map((u) => new Date(u.createdOn)));
    return {
      labels: daily.labels,
      datasets: [
        {
          label: "New Users",
          data: daily.counts,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderWidth: 1,
        },
      ],
    };
  }, [users]);

  const usersChartOptions = {
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
    },
  };

  const paymentStatusChartData = useMemo(() => {
    const statusCounts = { Successful: 0, Unsuccessful: 0, Created: 0 };
    paymentOrders.forEach((o) => {
      statusCounts[o.status]++;
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
  }, [paymentOrders]);

  const paymentStatusChartOptions = {
    maintainRatio: true,
    ratio: 0.6,
    responsive: true,
  };

  return (
    <div className="statistics-container">
      <Card
        className="transaction-chart"
        title="Number of successful transactions"
      >
        <Chart
          type="line"
          data={transactionChartData}
          options={transactionChartOptions}
        />
      </Card>
      <Card
        className="users-chart"
        title="Number of users"
      >
        <Chart type="line" data={usersChartData} options={usersChartOptions} />
      </Card>
      <Card
        className="payment-chart"
        title="Payment status distribution"
      >
        <Chart
          type="pie"
          data={paymentStatusChartData}
          options={paymentStatusChartOptions}
        />
      </Card>
    </div>
  );
}
