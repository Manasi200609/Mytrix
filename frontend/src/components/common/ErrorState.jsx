import Button from "./Button";

export default function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  onRetry,
}) {
  return (
    <div className="ui-error-state">
      <div className="ui-error-state__icon">
        <i className="ti ti-alert-circle"></i>
      </div>

      <h2>{title}</h2>

      <p>{message}</p>

      {onRetry && (
        <Button icon="refresh" onClick={onRetry} variant="secondary">
          Try Again
        </Button>
      )}
    </div>
  );
}
