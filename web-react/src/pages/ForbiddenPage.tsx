import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useAuth } from "../auth/AuthContext";
import "./ErrorPages.css";

export function ForbiddenPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="error-page-container">
      <div className="forbidden-container">
        <i className="pi pi-exclamation-triangle" />
        <h1>403 - Forbidden</h1>
        <p>
          You don&apos;t have permission to access this page. Login with an admin account!
        </p>
        <div>
          <Button label="Logout" className="font-bold" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}
