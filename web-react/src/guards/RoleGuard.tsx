import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactNode } from "react";

export function RoleGuard({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  if (!currentUser || !currentUser.roles.includes("Administrator")) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
}
