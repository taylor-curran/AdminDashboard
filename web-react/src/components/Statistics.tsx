import { useQuery } from "@tanstack/react-query";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import { Chart as ChartJS, registerables } from "chart.js";
import { getPaymentOrders } from "../services/payment-order.service";
import { getUsers } from "../services/user.service";
import {
  buildPaymentStatusChartData,
  buildTransactionChartData,
  buildUsersChartData,
} from "../lib/statistics";

ChartJS.register(...registerables);

export function Statistics() {
  const ordersQuery = useQuery({
    queryKey: ["paymentOrders"],
    queryFn: getPaymentOrders,
  });
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const paymentOrders = ordersQuery.data ?? [];
  const users = usersQuery.data ?? [];

  const transactionChartData = buildTransactionChartData(paymentOrders);
  const transactionChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const usersChartData = buildUsersChartData(users);
  const usersChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const paymentStatusChartData = buildPaymentStatusChartData(paymentOrders);
  const paymentStatusChartOptions = {
    maintainAspectRatio: true,
    aspectRatio: 0.6,
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
      <Card className="users-chart" title="Number of users">
        <Chart
          type="line"
          data={usersChartData}
          options={usersChartOptions}
        />
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
