import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { getPaymentOrderById } from "../services/payment-order.service";

function formatDate(value: string | Date | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString();
}

export function PaymentOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const query = useQuery({
    queryKey: ["paymentOrder", id],
    queryFn: () => getPaymentOrderById(id!),
    enabled: !!id,
  });

  const order = query.data;

  return (
    <>
      <div className="title-container flex-row">
        <Link to="/payment-orders" className="back-link">
          <Button type="button" icon="pi pi-arrow-left" rounded />
        </Link>
        <h1 className="title">Payment Order Details</h1>
      </div>
      {query.isLoading ? (
        <div className="order-detail-container">
          <p>Loading…</p>
        </div>
      ) : order ? (
        <div className="order-detail-container">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <h3>{order.title}</h3>
                <p>{order.description}</p>
                <div className="reference">
                  <p>Reference: {order.paymentReference}</p>
                </div>
              </div>
              <div className="badge">{order.status}</div>
            </div>
            <div className="card-body">
              <h4 className="card-column-title">Payment Details</h4>
              <div className="card-section">
                <div className="card-column">
                  <div className="label">Amount</div>
                  <div className="value">{order.amount}</div>
                </div>
                <div className="card-column">
                  <div className="label">Currency</div>
                  <div className="value">{order.currency}</div>
                </div>
              </div>
              <hr />
              <h4 className="card-column-title">Customer Details</h4>
              <div className="card-section">
                <div className="card-column">
                  <div>
                    <div className="label">Name</div>
                    <div>
                      {order.customerData.firstName}{" "}
                      {order.customerData.lastName}
                    </div>
                  </div>
                  <div>
                    <div className="label">Phone</div>
                    <div>{order.customerData.phoneNumber}</div>
                  </div>
                </div>
                <div className="card-column">
                  <div>
                    <div className="label">Email</div>
                    <div>{order.customerData.email}</div>
                  </div>
                  <div>
                    <div className="label">Address</div>
                    <div>{order.customerData.streetAddress}</div>
                    <div>
                      {order.customerData.city},{" "}
                      {order.customerData.postalCode}
                    </div>
                    <div>{order.customerData.country}</div>
                  </div>
                </div>
              </div>
              <hr />
              <h4 className="card-column-title">Order Details</h4>
              <div className="card-section">
                <div className="card-column">
                  <div>
                    <div className="label">Created On</div>
                    <div>{formatDate(order.createdOn)}</div>
                  </div>
                  {order.status === "Successful" ? (
                    <div>
                      <div className="label">Paid On</div>
                      <div>{formatDate(order.paidOn)}</div>
                    </div>
                  ) : null}
                </div>
                {order.status === "Successful" ? (
                  <div className="card-column">
                    <div>
                      <div className="label">Authorization Code</div>
                      <div>{order.authorizationCode}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="order-detail-container">
          <h2>Payment Order Details</h2>
          <p>No payment order selected</p>
        </div>
      )}
    </>
  );
}
