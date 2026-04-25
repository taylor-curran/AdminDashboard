import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/401" replace />;
  }
  return <>{children}</>;
}
