import Card from "../common/Card";
import Badge from "../common/Badge";

export default function NodeInspector({ node }) {
  if (!node) {
    return (
      <Card>
        <h3 style={{ color: "#EEEAE4" }}>Node Inspector</h3>
        <p style={{ color: "#726E68", fontSize: 13 }}>
          Select any node from the graph to inspect it.
        </p>
      </Card>
    );
  }

  const metadataEntries = Object.entries(node.metadata ?? {}).filter(
    ([, value]) => value !== null && value !== undefined && String(value).length > 0
  );

  return (
    <Card>
      <h2 style={{ marginBottom: 8, color: "#EEEAE4", fontFamily: "'Space Grotesk', sans-serif", fontSize: 17 }}>
        {node.label}
      </h2>

      <Badge type="file">{node.type}</Badge>

      <div style={{ marginTop: 18 }}>
        <h4 style={{ fontSize: 11, color: "#726E68", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
          Details
        </h4>
        {metadataEntries.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {metadataEntries.map(([key, value]) => (
              <div key={key} style={{ fontSize: 12.5, color: "#A39C93" }}>
                <span style={{ color: "#726E68" }}>{key}: </span>
                {Array.isArray(value) ? value.join(", ") || "none" : String(value)}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#726E68", fontSize: 12.5 }}>No additional details for this node.</p>
        )}
      </div>
    </Card>
  );
}