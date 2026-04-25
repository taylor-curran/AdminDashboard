import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { FilterMatchMode } from 'primereact/api';
import { paymentOrderService } from '../../services/paymentOrderService';
import { PaymentOrder } from '../../types';
import './PaymentOrdersPage.css';

export function PaymentOrdersPage() {
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [filters, setFilters] = useState({
    global: { value: '', matchMode: FilterMatchMode.CONTAINS },
    paymentReference: { value: '', matchMode: FilterMatchMode.CONTAINS },
    title: { value: '', matchMode: FilterMatchMode.CONTAINS },
    status: { value: '', matchMode: FilterMatchMode.CONTAINS },
    amount: { value: '', matchMode: FilterMatchMode.CONTAINS },
    currency: { value: '', matchMode: FilterMatchMode.CONTAINS },
  });
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  useEffect(() => {
    paymentOrderService
      .getPaymentOrders()
      .then(setPaymentOrders)
      .catch(() => {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load payment orders',
        });
      });
  }, []);

  const onGlobalFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      global: { ...prev.global, value },
    }));
  }, []);

  const onColumnFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
      const value = e.target.value;
      setFilters((prev) => ({
        ...prev,
        [field]: { ...prev[field as keyof typeof prev], value },
      }));
    },
    []
  );

  const header = (
    <div className="table-header">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="text"
          placeholder="Global Search"
          value={filters.global.value}
          onChange={onGlobalFilterChange}
        />
      </span>
    </div>
  );

  const paymentReferenceFilter = (
    <InputText
      type="text"
      placeholder="Search by Payment Reference"
      onChange={(e) => onColumnFilterChange(e, 'paymentReference')}
    />
  );

  const titleFilter = (
    <InputText
      type="text"
      placeholder="Search by Title"
      onChange={(e) => onColumnFilterChange(e, 'title')}
    />
  );

  const statusFilter = (
    <InputText
      type="text"
      placeholder="Search by Status"
      onChange={(e) => onColumnFilterChange(e, 'status')}
    />
  );

  const amountFilter = (
    <InputText
      type="text"
      placeholder="Search by Amount"
      onChange={(e) => onColumnFilterChange(e, 'amount')}
    />
  );

  const currencyFilter = (
    <InputText
      type="text"
      placeholder="Search by Currency"
      onChange={(e) => onColumnFilterChange(e, 'currency')}
    />
  );

  const actionsBodyTemplate = (order: PaymentOrder) => {
    return (
      <Button
        type="button"
        icon="pi pi-external-link"
        onClick={() => navigate(`/payment-orders/${order.id}`)}
      />
    );
  };

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
          filterDisplay="row"
          globalFilterFields={[
            'paymentReference',
            'title',
            'status',
            'amount',
            'currency',
          ]}
          header={header}
          sortMode="single"
        >
          <Column
            field="paymentReference"
            header="Payment Reference"
            sortable
            filter
            showFilterMenu={false}
            filterElement={paymentReferenceFilter}
          />
          <Column
            field="title"
            header="Title"
            sortable
            filter
            showFilterMenu={false}
            filterElement={titleFilter}
          />
          <Column
            field="status"
            header="Status"
            sortable
            filter
            showFilterMenu={false}
            filterElement={statusFilter}
          />
          <Column
            field="amount"
            header="Amount"
            sortable
            filter
            showFilterMenu={false}
            filterElement={amountFilter}
          />
          <Column
            field="currency"
            header="Currency"
            sortable
            filter
            showFilterMenu={false}
            filterElement={currencyFilter}
          />
          <Column header="Actions" body={actionsBodyTemplate} />
        </DataTable>
      </div>
    </>
  );
}
