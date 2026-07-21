import Button from "./Button";

export default function EmptyState({
  title = "Nothing here yet",
  message = "There isn't any data to display.",
  description,
  icon = "database-off",
  actionLabel,
  onAction,
}) {
  const body = message || description;

  return (
    <div className="ui-empty-state">
      <div className="ui-empty-state__icon">
        <i className={`ti ti-${icon}`}></i>
      </div>

      <h2>{title}</h2>

      <p>{body}</p>

      {actionLabel && onAction && (
        <Button icon="plus" onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
