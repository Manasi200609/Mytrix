export default function Badge({
  children,
  icon,
  type = "default",
  size = "md",
  onClick,
}) {
  const typeClass = {
    default: "",
    success: "badge-component--success",
    danger: "badge-component--danger",
    warning: "badge-component--warning",
    info: "badge-component--info",
    primary: "badge-component--primary",
  }[type] || "";

  const sizeClass = {
    sm: "badge-component--sm",
    md: "badge-component--md",
    lg: "badge-component--lg",
  }[size] || "badge-component--md";

  return (
    <span
      onClick={onClick}
      className={`badge-component ${typeClass} ${sizeClass} ${onClick ? "badge-component--clickable" : ""}`.trim()}
    >
      {icon && <i className={`ti ti-${icon}`} />}
      <span>{children}</span>
    </span>
  );
}
