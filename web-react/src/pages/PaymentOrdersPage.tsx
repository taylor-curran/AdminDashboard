import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { FilterMatchMode } from "primereact/api";
import type { Toast as ToastType } from "primereact/toast";
import { getPaymentOrders } from "../services/payment-order.service";
import type { PaymentOrder } from "../types/payment-order";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  paymentReference: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.CONTAINS },
  amount: { value: null, matchMode: FilterMatchMode.CONTAINS },
  currency: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

export function PaymentOrdersPage() {
  const navigate = useNavigate();
  const toast = useRef<ToastType>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const query = useQuery({
    queryKey: ["paymentOrders"],
    queryFn: getPaymentOrders,
  });

  const orders = query.data ?? [];

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
      <span className="p-input-icon-left w-full md:w-20rem">
        <i className="pi pi-search" />
        <InputText
          type="text"
          placeholder="Global Search"
          className="w-full"
          value={
            (filters.global &&
            "value" in filters.global &&
            (filters.global as { value: string | null }).value) ||
            ""
          }
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              global: {
                value: e.target.value,
                matchMode: FilterMatchMode.CONTAINS,
              },
            }))
          }
        />
      </span>
    </div>
  );

  function viewDetails(order: PaymentOrder) {
    navigate(`/payment-orders/${order.id}`);
  }

  const actionsBody = (row: PaymentOrder) => (
    <Button
      type="button"
      icon="pi pi-external-link"
      onClick={() => viewDetails(row)}
    />
  );

  return (
    <>
      <Toast ref={toast} />
      <div className="title-container">
        <h1 className="title">Payment Orders</h1>
      </div>
      <div className="order-container">
        <DataTable
          value={orders}
          paginator
          rows={10}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          globalFilterFields={[
            "paymentReference",
            "title",
            "status",
            "amount",
            "currency",
          ]}
          header={header}
          filterDisplay="row"
          emptyMessage="No records found"
          loading={query.isLoading}
        >
          <Column
            field="paymentReference"
            header="Payment Reference"
            sortable
            filter
            filterPlaceholder="Search by Payment Reference"
          />
          <Column
            field="title"
            header="Title"
            sortable
            filter
            filterPlaceholder="Search by Title"
          />
          <Column
            field="status"
            header="Status"
            sortable
            filter
            filterPlaceholder="Search by Status"
          />
          <Column
            field="amount"
            header="Amount"
            sortable
            filter
            filterPlaceholder="Search by Amount"
          />
          <Column
            field="currency"
            header="Currency"
            sortable
            filter
            filterPlaceholder="Search by Currency"
          />
          <Column body={actionsBody} header="Actions" exportable={false} />
        </DataTable>
      </div>
    </>
  );
}
