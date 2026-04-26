import { Link } from "react-router-dom";
import { Button } from "primereact/button";

export function UnauthorizedPage() {
  return (
    <div className="error-page">
      <div className="error-page-inner">
        <i className="pi pi-exclamation-triangle" />
        <h1>401 - Unauthorized</h1>
        <p>You are not authorized to access this page.</p>
        <div>
          <Link to="/login">
            <Button label="Login" />
          </Link>
        </div>
      </div>
    </div>
  );
}
