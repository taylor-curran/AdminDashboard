import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth/AuthContext";
import { AppLayout } from "./layout/AppLayout";
import { GuestOnly } from "./routes/GuestOnly";
import { RequireAuth } from "./routes/RequireAuth";
import { RequireAdmin } from "./routes/RequireAdmin";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { PaymentOrdersPage } from "./pages/PaymentOrdersPage";
import { PaymentOrderDetailsPage } from "./pages/PaymentOrderDetailsPage";
import { UsersPage } from "./pages/UsersPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
});

function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <RequireAdmin>{children}</RequireAdmin>
    </RequireAuth>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route
                path="login"
                element={
                  <GuestOnly>
                    <LoginPage />
                  </GuestOnly>
                }
              />
              <Route path="401" element={<UnauthorizedPage />} />
              <Route path="403" element={<ForbiddenPage />} />
              <Route path="404" element={<NotFoundPage />} />
              <Route
                path="home"
                element={
                  <AdminRoute>
                    <HomePage />
                  </AdminRoute>
                }
              />
              <Route
                path="payment-orders"
                element={
                  <AdminRoute>
                    <PaymentOrdersPage />
                  </AdminRoute>
                }
              />
              <Route
                path="payment-orders/:id"
                element={
                  <AdminRoute>
                    <PaymentOrderDetailsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="users"
                element={
                  <AdminRoute>
                    <UsersPage />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
