import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { FilterMatchMode } from "primereact/api";
import { paymentOrderService } from "../services/paymentOrderService";
import type { PaymentOrder } from "../services/types";
import "./PaymentOrders.css";

const FILTER_FIELDS = [
  "paymentReference",
  "title",
  "status",
  "amount",
  "currency",
] as const;

function makeInitialFilters(): DataTableFilterMeta {
  const filters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  for (const f of FILTER_FIELDS) {
    filters[f] = { value: null, matchMode: FilterMatchMode.CONTAINS };
  }
  return filters;
}

export function PaymentOrdersPage() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>(
    makeInitialFilters(),
  );

  useEffect(() => {
    paymentOrderService
      .getPaymentOrders()
      .then(setOrders)
      .catch(() => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load payment orders",
        });
      });
  }, []);

  const setFilter = (
    field: string,
    value: string,
    matchMode = FilterMatchMode.CONTAINS,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: { value: value === "" ? null : value, matchMode },
    }));
  };

  const viewDetails = (order: PaymentOrder) => {
    navigate(`/payment-orders/${order.id}`);
  };

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
          globalFilterFields={[...FILTER_FIELDS]}
          dataKey="id"
          header={
            <div className="table-header">
              <span className="p-input-icon-left">
                <i className="pi pi-search"></i>
                <InputText
                  type="text"
                  placeholder="Global Search"
                  onInput={(e) =>
                    setFilter(
                      "global",
                      (e.target as HTMLInputElement).value,
                    )
                  }
                />
              </span>
            </div>
          }
        >
          <Column
            field="paymentReference"
            header="Payment Reference"
            sortable
            filter
            showFilterMenu={false}
            filterPlaceholder="Search by Payment Reference"
            filterElement={(opts) => (
              <InputText
                value={(opts.value as string) ?? ""}
                onChange={(e) => {
                  opts.filterApplyCallback(e.target.value);
                }}
                placeholder="Search by Payment Reference"
              />
            )}
          />
          <Column
            field="title"
            header="Title"
            sortable
            filter
            showFilterMenu={false}
            filterElement={(opts) => (
              <InputText
                value={(opts.value as string) ?? ""}
                onChange={(e) => opts.filterApplyCallback(e.target.value)}
                placeholder="Search by Title"
              />
            )}
          />
          <Column
            field="status"
            header="Status"
            sortable
            filter
            showFilterMenu={false}
            filterElement={(opts) => (
              <InputText
                value={(opts.value as string) ?? ""}
                onChange={(e) => opts.filterApplyCallback(e.target.value)}
                placeholder="Search by Status"
              />
            )}
          />
          <Column
            field="amount"
            header="Amount"
            sortable
            filter
            showFilterMenu={false}
            filterElement={(opts) => (
              <InputText
                value={(opts.value as string) ?? ""}
                onChange={(e) => opts.filterApplyCallback(e.target.value)}
                placeholder="Search by Amount"
              />
            )}
          />
          <Column
            field="currency"
            header="Currency"
            sortable
            filter
            showFilterMenu={false}
            filterElement={(opts) => (
              <InputText
                value={(opts.value as string) ?? ""}
                onChange={(e) => opts.filterApplyCallback(e.target.value)}
                placeholder="Search by Currency"
              />
            )}
          />
          <Column
            header="Actions"
            body={(rowData: PaymentOrder) => (
              <Button
                type="button"
                icon="pi pi-external-link"
                aria-label={`View ${rowData.paymentReference}`}
                onClick={() => viewDetails(rowData)}
              />
            )}
          />
        </DataTable>
      </div>
    </>
  );
}
