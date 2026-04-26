import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useAuth } from "../auth/AuthContext";

export function ForbiddenPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    flushSync(() => {
      logout();
    });
    navigate("/login");
  }

  return (
    <div className="error-page">
      <div className="error-page-inner">
        <i className="pi pi-exclamation-triangle" />
        <h1>403 - Forbidden</h1>
        <p>
          You don&apos;t have permission to access this page. Login with an admin
          account!
        </p>
        <div>
          <Button label="Logout" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}
