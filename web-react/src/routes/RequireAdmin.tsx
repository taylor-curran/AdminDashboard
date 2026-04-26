import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdministrator } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/401" replace state={{ from: location }} />;
  }
  if (!isAdministrator) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
}
