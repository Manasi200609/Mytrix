import Card from "../common/Card";

// Two categories, not a rainbow of five made-up ones — matches the real
// schema (only "Project" is structurally special; everything else is a
// detail node) and keeps the single-accent design discipline.
export default function GraphLegend() {
  const items = [
    { color: "#F0A93E", label: "Project (root)" },
    { color: "#726E68", label: "Detail node (language, framework, dependency, etc.)" },
  ];

  return (
    <Card>
      <h3 style={{ marginBottom: 14, color: "#EEEAE4", fontSize: 14 }}>Legend</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#A39C93" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}