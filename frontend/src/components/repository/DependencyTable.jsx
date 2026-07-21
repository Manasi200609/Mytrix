import Card from "../common/Card";
import Badge from "../common/Badge";

export default function DependencyTable({ data }) {
  const rawDependencies = data?.knowledgeObject?.project?.dependencies;
  const productionDependencies = Object.entries(rawDependencies?.dependencies || {}).map(
    ([name, version]) => ({ name, version, type: "prod" })
  );
  const developmentDependencies = Object.entries(rawDependencies?.devDependencies || {}).map(
    ([name, version]) => ({ name, version, type: "dev" })
  );
  const dependencies = [...productionDependencies, ...developmentDependencies];

  return (
    <Card>
      {dependencies.length === 0 ? (
        <p className="muted">No dependencies found.</p>
      ) : (
        <table className="dependency-table">
          <thead>
            <tr>
              <th>Package</th>
              <th>Version</th>
              <th>Type</th>
            </tr>
          </thead>

          <tbody>
            {dependencies.map((dependency, index) => (
              <tr key={index}>
                <td>{dependency.name}</td>

                <td>
                  <code>{dependency.version}</code>
                </td>

                <td>
                  <Badge
                    type={
                      dependency.type === "dev"
                        ? "warning"
                        : "success"
                    }
                  >
                    {dependency.type === "dev"
                      ? "Dev"
                      : "Production"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}