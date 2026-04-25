import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/401" replace />;
  }
  return <>{children}</>;
}

export function RoleGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user || !user.roles?.includes("Administrator")) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
}

export function LoginGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  return <>{children}</>;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <RoleGuard>{children}</RoleGuard>
    </AuthGuard>
  );
}
