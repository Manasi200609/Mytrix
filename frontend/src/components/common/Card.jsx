export default function Card({
  children,
  className = "",
  variant = "default",
  onClick,
}) {
  const variantClass = {
    default: "card--default",
    featured: "card--featured",
    success: "card--accent",
    accent: "card--accent",
    primary: "card--user",
    risk: "card--risk",
  }[variant] || "card--default";

  return (
    <div
      onClick={onClick}
      className={`card ${variantClass} ${onClick ? "card--clickable hover-lift" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
