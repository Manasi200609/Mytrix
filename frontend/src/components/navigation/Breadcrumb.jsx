import { Link } from "react-router-dom";

export default function Breadcrumb({
  projectName,
  step,
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        marginBottom: "24px",
        fontSize: "14px",
        color: "#6b7280",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "#2563eb",
        }}
      >
        Home
      </Link>

      <span style={{ margin: "0 8px" }}>
        /
      </span>

      <Link
        to="/saved-projects"
        style={{
          textDecoration: "none",
          color: "#2563eb",
        }}
      >
        Projects
      </Link>

      {projectName && (
        <>
          <span style={{ margin: "0 8px" }}>
            /
          </span>

          <span
            style={{
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {projectName}
          </span>
        </>
      )}

      {step && (
        <>
          <span style={{ margin: "0 8px" }}>
            /
          </span>

          <span>{step}</span>
        </>
      )}
    </nav>
  );
}