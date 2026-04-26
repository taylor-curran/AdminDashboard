import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { getCurrentUser } = useAuth();
  const location = useLocation();
  const user = getCurrentUser();

  if (!user || !user.roles.includes("Administrator")) {
    return <Navigate to="/403" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
