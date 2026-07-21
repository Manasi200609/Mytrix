import Card from "../common/Card";

export default function AnalysisCard({
  title,
  icon,
  value,
  description,
  color = "primary",
  children,
}) {
  return (
    <Card className={`analysis-card analysis-card--${color}`}>
      <div className="analysis-card__header">
        <div className="analysis-card__icon">
          <i className={`ti ti-${icon}`} />
        </div>

        <div className="analysis-card__title">
          {title}
        </div>
      </div>

      {value && (
        <div className="analysis-card__value">
          {value}
        </div>
      )}

      {description && (
        <p className="analysis-card__description">
          {description}
        </p>
      )}

      {children}
    </Card>
  );
}