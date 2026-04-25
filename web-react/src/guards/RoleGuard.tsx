import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  if (!currentUser || !currentUser.roles.includes('Administrator')) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
}
