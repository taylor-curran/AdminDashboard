import { Link } from "react-router-dom";
import { Button } from "primereact/button";

export function NotFoundPage() {
  return (
    <div className="error-page">
      <div className="error-page-inner">
        <i className="pi pi-exclamation-triangle" />
        <h1>404 - Not Found</h1>
        <p>Oops, it looks like the page you&apos;re looking for doesn&apos;t exist.</p>
        <div>
          <Link to="/home">
            <Button label="Go to Homepage" />
          </Link>
        </div>
      </div>
    </div>
  );
}
