export default function Spinner({
  size = "md",
  label = "Loading...",
  fullScreen = false,
}) {
  const sizeClass = {
    sm: "spinner-sm",
    md: "",
    lg: "spinner-lg",
  }[size] || "";

  const spinner = (
    <div className="ui-spinner-wrap">
      <div className={`spinner ${sizeClass}`.trim()} aria-hidden="true" />
      {label && <p>{label}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="ui-spinner-fullscreen">{spinner}</div>;
  }

  return spinner;
}
