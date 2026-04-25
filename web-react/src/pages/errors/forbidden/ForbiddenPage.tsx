import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { useAuth } from '../../../context/AuthContext';
import './ForbiddenPage.css';

export function ForbiddenPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="error-page-container">
      <div className="forbidden-content">
        <i className="pi pi-exclamation-triangle"></i>
        <h1>403 - Forbidden</h1>
        <p>
          You don't have permission to access this page. Login with an admin
          account!
        </p>
        <div>
          <Button
            className="p-button font-bold"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
