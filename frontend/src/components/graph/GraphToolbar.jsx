import Button from "../common/Button";

export default function GraphToolbar({
  onReset,
  onCenter,
  onToggleLabels,
  onExport,
  search,
  setSearch,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      <input
        type="text"
        placeholder="Search files..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          flex: 1,
          minWidth: "220px",
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          outline: "none",
        }}
      />

      <Button onClick={onCenter}>
        🎯 Center
      </Button>

      <Button onClick={onReset}>
        🔄 Reset
      </Button>

      <Button onClick={onToggleLabels}>
        🏷 Toggle Labels
      </Button>

      <Button onClick={onExport}>
        📥 Export
      </Button>
    </div>
  );
}