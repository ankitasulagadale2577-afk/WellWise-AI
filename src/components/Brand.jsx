import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function Brand({ to = "/", showTagline = false }) {
  return (
    <Link to={to} className="brand" aria-label="WellWise AI Home">
      <span className="brand-logo-icon">
        <Leaf size={22} className="brand-leaf" />
      </span>
      <span className="brand-text">
        <span className="brand-name">
          WellWise <strong>AI</strong>
        </span>
        {showTagline && <small className="brand-tagline">Smarter healthcare for everyone</small>}
      </span>
    </Link>
  );
}
