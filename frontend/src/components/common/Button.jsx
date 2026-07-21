export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  onClick,
  className = "",
}) {
  const variantClass = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
    success: "btn-success",
  }[variant] || "btn-primary";

  const sizeClass = {
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg",
  }[size] || "btn-md";

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${loading ? "btn-loading" : ""} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <i className="ti ti-loader-2"></i>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <i className={`ti ti-${icon}`}></i>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
