import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useAuth } from "../../auth/AuthContext";
import "./error.css";

export function ForbiddenPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="error-page-container">
      <div className="error-container forbidden-container">
        <i className="pi pi-exclamation-triangle"></i>
        <h1>403 - Forbidden</h1>
        <p>
          You don't have permission to access this page. Login with an admin
          account!
        </p>
        <div>
          <Button onClick={handleLogout} className="p-button font-bold">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
