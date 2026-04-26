import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import "./ErrorPages.css";

export function NotFoundPage() {
  return (
    <div className="error-page-container">
      <div className="error-container">
        <i className="pi pi-exclamation-triangle" />
        <h1>404 - Not Found</h1>
        <p>Oops, it looks like the page you&apos;re looking for doesn&apos;t exist.</p>
        <div>
          <Link to="/home">
            <Button label="Go to Homepage" className="font-bold" />
          </Link>
        </div>
      </div>
    </div>
  );
}
