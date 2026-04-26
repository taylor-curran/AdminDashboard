import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { FilterMatchMode } from "primereact/api";
import type { Toast as ToastType } from "primereact/toast";
import { getPaymentOrders } from "../api/payment-orders";
import type { PaymentOrder } from "../types";
import "./PageTitle.css";
import "./PaymentOrdersPage.css";

const initialFilters = {
  paymentReference: { value: null as string | null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null as string | null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null as string | null, matchMode: FilterMatchMode.CONTAINS },
  amount: { value: null as string | null, matchMode: FilterMatchMode.CONTAINS },
  currency: { value: null as string | null, matchMode: FilterMatchMode.CONTAINS },
};

export function PaymentOrdersPage() {
  const navigate = useNavigate();
  const toast = useRef<ToastType>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(initialFilters);

  const query = useQuery({
    queryKey: ["paymentOrders"],
    queryFn: getPaymentOrders,
  });

  useEffect(() => {
    if (query.isError) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load payment orders",
      });
    }
  }, [query.isError]);

  const header = (
    <div className="table-header">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={(e) => setGlobalFilterValue(e.target.value)}
          placeholder="Global Search"
        />
      </span>
    </div>
  );

  const viewDetails = (order: PaymentOrder) => {
    navigate(`/payment-orders/${order.id}`);
  };

  const actionBody = (row: PaymentOrder) => (
    <Button type="button" icon="pi pi-external-link" onClick={() => viewDetails(row)} />
  );

  return (
    <>
      <Toast ref={toast} />
      <div className="title-container">
        <h1 className="title">Payment Orders</h1>
      </div>
      <div className="order-container">
        <DataTable
          value={query.data ?? []}
          paginator
          rows={10}
          filters={filters}
          onFilter={(e) => setFilters(e.filters as typeof initialFilters)}
          globalFilter={globalFilterValue}
          globalFilterFields={["paymentReference", "title", "status", "amount", "currency"]}
          globalFilterMatchMode="contains"
          filterDisplay="row"
          header={header}
          emptyMessage={query.isLoading ? "Loading…" : "No payment orders found."}
        >
          <Column
            field="paymentReference"
            header="Payment Reference"
            sortable
            filter
            showFilterMenu={false}
            filterPlaceholder="Search by Payment Reference"
          />
          <Column
            field="title"
            header="Title"
            sortable
            filter
            showFilterMenu={false}
            filterPlaceholder="Search by Title"
          />
          <Column
            field="status"
            header="Status"
            sortable
            filter
            showFilterMenu={false}
            filterPlaceholder="Search by Status"
          />
          <Column
            field="amount"
            header="Amount"
            sortable
            filter
            showFilterMenu={false}
            filterPlaceholder="Search by Amount"
          />
          <Column
            field="currency"
            header="Currency"
            sortable
            filter
            showFilterMenu={false}
            filterPlaceholder="Search by Currency"
          />
          <Column body={actionBody} header="Actions" exportable={false} />
        </DataTable>
      </div>
    </>
  );
}
