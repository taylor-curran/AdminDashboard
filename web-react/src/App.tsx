import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute, LoginGuard } from "./auth/guards";
import { Sidebar } from "./components/Sidebar";
import { HomePage } from "./pages/Home";
import { LoginPage } from "./pages/Login";
import { PaymentOrdersPage } from "./pages/PaymentOrders";
import { PaymentOrderDetailsPage } from "./pages/PaymentOrderDetails";
import { UsersPage } from "./pages/users/Users";
import { NotFoundPage } from "./pages/errors/NotFound";
import { UnauthorizedPage } from "./pages/errors/Unauthorized";
import { ForbiddenPage } from "./pages/errors/Forbidden";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">{children}</div>
    </div>
  );
}

export function App() {
  return (
    <PrimeReactProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-orders"
                element={
                  <ProtectedRoute>
                    <PaymentOrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-orders/:id"
                element={
                  <ProtectedRoute>
                    <PaymentOrderDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <LoginGuard>
                    <LoginPage />
                  </LoginGuard>
                }
              />
              <Route path="/401" element={<UnauthorizedPage />} />
              <Route path="/403" element={<ForbiddenPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </PrimeReactProvider>
  );
}
