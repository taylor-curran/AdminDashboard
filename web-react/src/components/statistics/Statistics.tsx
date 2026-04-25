import { useEffect, useState } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { Card } from "primereact/card";
import { paymentOrderService } from "../../services/payment-order.service";
import { userService } from "../../services/user.service";
import { PaymentOrder, User } from "../../types";
import "./Statistics.css";

ChartJS.register(...registerables);

function getLast30DaysData(dates: Date[]): { labels: string[]; counts: number[] } {
  const countsMap: Record<string, number> = {};
  const labels: string[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    labels.push(dateString);
    countsMap[dateString] = 0;
  }

  dates.forEach((date) => {
    const dateString = date.toISOString().split("T")[0];
    if (countsMap[dateString] !== undefined) {
      countsMap[dateString]++;
    }
  });

  const countsArray: number[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    countsArray.push(countsMap[dateString]);
  }

  return { labels, counts: countsArray };
}

export function Statistics() {
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    paymentOrderService.getPaymentOrders().then(setPaymentOrders);
    userService.getUsers().then(setUsers);
  }, []);

  const successfulTransactions = paymentOrders.filter(
    (order) => order.status === "Successful"
  );
  const transactionData = getLast30DaysData(
    successfulTransactions.map((order) => new Date(order.paidOn!))
  );

  const userData = getLast30DaysData(
    users.map((user) => new Date(user.createdOn))
  );

  const statusCounts = { Successful: 0, Unsuccessful: 0, Created: 0 };
  paymentOrders.forEach((order) => {
    statusCounts[order.status]++;
  });

  const transactionChartData = {
    labels: transactionData.labels,
    datasets: [
      {
        label: "Successful Transactions",
        data: transactionData.counts,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  const usersChartData = {
    labels: userData.labels,
    datasets: [
      {
        label: "New Users",
        data: userData.counts,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  const paymentStatusChartData = {
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

  const lineOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    maintainAspectRatio: true,
    responsive: true,
  };

  return (
    <div className="statistics-container">
      <Card className="transaction-chart" header={<span className="chart-header">Number of successful transactions</span>}>
        <Line data={transactionChartData} options={lineOptions} />
      </Card>
      <Card className="users-chart" header={<span className="chart-header">Number of users</span>}>
        <Line data={usersChartData} options={lineOptions} />
      </Card>
      <Card className="payment-chart" header={<span className="chart-header">Payment status distribution</span>}>
        <Pie data={paymentStatusChartData} options={pieOptions} />
      </Card>
    </div>
  );
}
