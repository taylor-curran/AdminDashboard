import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export function NotFoundPage() {
  return (
    <div className="error-page-container">
      <div className="error-content">
        <i className="pi pi-exclamation-triangle"></i>
        <h1>404 - Not Found</h1>
        <p>Oops, it looks like the page you're looking for doesn't exist.</p>
        <div>
          <Link to="/home" className="p-button font-bold">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
