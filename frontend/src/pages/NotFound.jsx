import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__inner">
        <div className="not-found__code">404</div>

        <h2 className="not-found__title gradient-text">Page Not Found</h2>

        <p className="not-found__message">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link to="/">
          <Button variant="primary">← Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
