import Card from "../common/Card";
import Badge from "../common/Badge";

export default function TechStackCard({ data }) {
  const project = data?.knowledgeObject?.project || {};
  const techStack = [
    ...(project.languages || []),
    ...(project.frameworks || []),
    ...(project.buildTools || []),
    ...(project.testing || []),
    ...(project.database || []),
    ...(project.packageManager ? [project.packageManager] : []),
  ];
  const uniqueTechStack = [...new Set(techStack)];

  return (
    <Card>
      {uniqueTechStack.length === 0 ? (
        <p className="muted">
          No technologies detected.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "16px",
          }}
        >
          {uniqueTechStack.map((tech, index) => (
            <Badge
              key={index}
              type="info"
            >
              {tech}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}