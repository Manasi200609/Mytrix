import Card from "../common/Card";
import Badge from "../common/Badge";

export default function EnvironmentVariableList({ data }) {
  const variables =
    data?.knowledgeObject?.project?.environmentVariables || [];

  return (
    <Card>
      {variables.length === 0 ? (
        <p className="muted">No environment variables detected.</p>
      ) : (
        <div className="env-list">
          {variables.map((env, index) => (
            <div key={index} className="env-item">
              <div className="env-header">
                <strong>{typeof env === "string" ? env : env.name}</strong>
                <Badge type="warning">Detected</Badge>
              </div>

              <p className="muted">
                {typeof env === "string"
                  ? "Detected from README or environment templates."
                  : env.description || "No description available."}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}