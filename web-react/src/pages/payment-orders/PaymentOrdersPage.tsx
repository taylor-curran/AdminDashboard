import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { FilterMatchMode } from "primereact/api";
import { paymentOrderService } from "../../services/payment-order.service";
import { PaymentOrder } from "../../types";
import "./PaymentOrdersPage.css";

export function PaymentOrdersPage() {
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    paymentReference: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    amount: { value: null, matchMode: FilterMatchMode.CONTAINS },
    currency: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  useEffect(() => {
    paymentOrderService.getPaymentOrders().then(setPaymentOrders).catch(() => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load payment orders",
      });
    });
  }, []);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
    setFilters((prev) => ({
      ...prev,
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    }));
  };

  const onColumnFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      [field]: { value, matchMode: FilterMatchMode.CONTAINS },
    }));
  };

  const header = (
    <div className="table-header">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="text"
          placeholder="Global Search"
          value={globalFilter}
          onChange={onGlobalFilterChange}
        />
      </span>
    </div>
  );

  const filterRow = (
    <tr>
      <th>
        <InputText
          type="text"
          placeholder="Search by Payment Reference"
          onChange={(e) => onColumnFilterChange(e, "paymentReference")}
        />
      </th>
      <th>
        <InputText
          type="text"
          placeholder="Search by Title"
          onChange={(e) => onColumnFilterChange(e, "title")}
        />
      </th>
      <th>
        <InputText
          type="text"
          placeholder="Search by Status"
          onChange={(e) => onColumnFilterChange(e, "status")}
        />
      </th>
      <th>
        <InputText
          type="text"
          placeholder="Search by Amount"
          onChange={(e) => onColumnFilterChange(e, "amount")}
        />
      </th>
      <th>
        <InputText
          type="text"
          placeholder="Search by Currency"
          onChange={(e) => onColumnFilterChange(e, "currency")}
        />
      </th>
      <th></th>
    </tr>
  );

  const actionsTemplate = (order: PaymentOrder) => (
    <Button
      type="button"
      icon="pi pi-external-link"
      onClick={() => navigate(`/payment-orders/${order.id}`)}
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
          value={paymentOrders}
          paginator
          rows={10}
          filters={filters}
          globalFilterFields={[
            "paymentReference",
            "title",
            "status",
            "amount",
            "currency",
          ]}
          header={header}
          filterDisplay="row"
          emptyMessage="No payment orders found."
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
          <Column header="Actions" body={actionsTemplate} />
        </DataTable>
      </div>
    </>
  );
}
