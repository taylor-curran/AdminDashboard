import { Link } from "react-router-dom";
import "./error.css";

export function UnauthorizedPage() {
  return (
    <div className="error-page-container">
      <div className="error-container unauthorized-container">
        <i className="pi pi-exclamation-triangle"></i>
        <h1>401 - Unauthorized</h1>
        <p>You are not authorized to access this page.</p>
        <div>
          <Link to="/login" className="p-button font-bold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
