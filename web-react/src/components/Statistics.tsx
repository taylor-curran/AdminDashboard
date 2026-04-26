import { useQuery } from "@tanstack/react-query";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import { Chart as ChartJS, registerables } from "chart.js";
import { getPaymentOrders } from "../api/payment-orders";
import { getUsers } from "../api/users";
import {
  buildPaymentStatusChart,
  buildTransactionChartSeries,
  buildUsersChartSeries,
} from "../lib/statistics";
import "./Statistics.css";

ChartJS.register(...registerables);

export function Statistics() {
  const ordersQuery = useQuery({ queryKey: ["paymentOrders"], queryFn: getPaymentOrders });
  const usersQuery = useQuery({ queryKey: ["users"], queryFn: getUsers });

  const orders = ordersQuery.data ?? [];
  const users = usersQuery.data ?? [];

  const tx = buildTransactionChartSeries(orders);
  const transactionChartData = {
    labels: tx.labels,
    datasets: [
      {
        label: "Successful Transactions",
        data: tx.counts,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
    ],
  };
  const transactionChartOptions = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  };

  const uc = buildUsersChartSeries(users);
  const usersChartData = {
    labels: uc.labels,
    datasets: [
      {
        label: "New Users",
        data: uc.counts,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 1,
      },
    ],
  };
  const usersChartOptions = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  };

  const ps = buildPaymentStatusChart(orders);
  const paymentStatusChartData = {
    labels: [...ps.labels],
    datasets: [
      {
        label: "Payment Status",
        data: ps.data,
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
  const paymentStatusChartOptions = {
    maintainAspectRatio: true,
    aspectRatio: 0.6,
    responsive: true,
  };

  return (
    <div className="statistics-container">
      <Card className="transaction-chart" title="Number of successful transactions">
        <Chart type="line" data={transactionChartData} options={transactionChartOptions} />
      </Card>
      <Card className="users-chart" title="Number of users">
        <Chart type="line" data={usersChartData} options={usersChartOptions} />
      </Card>
      <Card className="payment-chart" title="Payment status distribution">
        <Chart type="pie" data={paymentStatusChartData} options={paymentStatusChartOptions} />
      </Card>
    </div>
  );
}
