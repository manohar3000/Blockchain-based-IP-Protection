import { Link } from 'react-router-dom';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="error-code">404</div>
        <FiAlertCircle className="error-icon" />
        <h1>Page Not Found</h1>
        <p>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="actions">
          <Link to="/" className="btn btn-primary">
            <FiArrowLeft />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 