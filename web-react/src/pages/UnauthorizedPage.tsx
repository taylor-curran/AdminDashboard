import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import "./ErrorPages.css";

export function UnauthorizedPage() {
  return (
    <div className="error-page-container">
      <div className="unauthorized-container">
        <i className="pi pi-exclamation-triangle" />
        <h1>401 - Unauthorized</h1>
        <p>You are not authorized to access this page.</p>
        <div>
          <Link to="/login">
            <Button label="Login" className="font-bold" />
          </Link>
        </div>
      </div>
    </div>
  );
}
