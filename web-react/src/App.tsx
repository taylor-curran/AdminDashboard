import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Sidebar } from "./components/sidebar/Sidebar";
import { AuthGuard } from "./guards/AuthGuard";
import { RoleGuard } from "./guards/RoleGuard";
import { LoginGuard } from "./guards/LoginGuard";
import { LoginPage } from "./pages/login/LoginPage";
import { HomePage } from "./pages/home/HomePage";
import { UsersPage } from "./pages/users/UsersPage";
import { PaymentOrdersPage } from "./pages/payment-orders/PaymentOrdersPage";
import { PaymentOrderDetailsPage } from "./pages/payment-order-details/PaymentOrderDetailsPage";
import { NotFoundPage } from "./pages/errors/not-found/NotFoundPage";
import { UnauthorizedPage } from "./pages/errors/unauthorized/UnauthorizedPage";
import { ForbiddenPage } from "./pages/errors/forbidden/ForbiddenPage";
import "./App.css";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <RoleGuard>{children}</RoleGuard>
    </AuthGuard>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="container">
          <Sidebar />
          <div className="content">
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
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
