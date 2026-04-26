import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  return <>{children}</>;
}
