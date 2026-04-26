import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { PaymentOrdersPage } from "./pages/PaymentOrdersPage";
import { PaymentOrderDetailsPage } from "./pages/PaymentOrderDetailsPage";
import { UsersPage } from "./pages/UsersPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { RequireAdmin } from "./routes/RequireAdmin";
import { LoginGuard } from "./routes/LoginGuard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="app-container">
            <Sidebar />
            <div className="app-content">
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route
                  path="home"
                  element={
                    <RequireAdmin>
                      <HomePage />
                    </RequireAdmin>
                  }
                />
                <Route
                  path="payment-orders"
                  element={
                    <RequireAdmin>
                      <PaymentOrdersPage />
                    </RequireAdmin>
                  }
                />
                <Route
                  path="payment-orders/:id"
                  element={
                    <RequireAdmin>
                      <PaymentOrderDetailsPage />
                    </RequireAdmin>
                  }
                />
                <Route
                  path="users"
                  element={
                    <RequireAdmin>
                      <UsersPage />
                    </RequireAdmin>
                  }
                />
                <Route
                  path="login"
                  element={
                    <LoginGuard>
                      <LoginPage />
                    </LoginGuard>
                  }
                />
                <Route path="401" element={<UnauthorizedPage />} />
                <Route path="403" element={<ForbiddenPage />} />
                <Route path="404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </div>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
