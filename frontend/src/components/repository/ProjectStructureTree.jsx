import { useState } from "react";
import Card from "../common/Card";

// Folders that are build/cache artifacts, not real project structure —
// showing these buries the signal a new developer actually needs.
const NOISE_FOLDERS = new Set([
  "node_modules", ".git", "dist", "build", ".expo", "cache",
  ".next", ".turbo", "coverage", "uploads",
]);

function TreeNode({ name, node, level = 0 }) {
  const isFolder = node && typeof node === "object";
  const children = isFolder ? Object.entries(node) : [];
  // Auto-expand only the first two levels — anything deeper starts collapsed,
  // since nobody needs .expo/web/cache/production/images visible by default.
  const [open, setOpen] = useState(level < 2);

  if (!name || NOISE_FOLDERS.has(name)) return null;

  return (
    <div style={{ marginLeft: `${level * 16}px` }}>
      <div
        className="tree-node"
        onClick={() => isFolder && setOpen(!open)}
        style={{ cursor: isFolder ? "pointer" : "default", display: "flex", alignItems: "center", gap: 6 }}
      >
        {isFolder ? (
          <i className={`ti ti-chevron-${open ? "down" : "right"}`} style={{ fontSize: 12, color: "#726E68" }} aria-hidden="true"></i>
        ) : (
          <i className="ti ti-file" style={{ fontSize: 12, color: "#726E68" }} aria-hidden="true"></i>
        )}
        <i className={isFolder ? "ti ti-folder" : "ti ti-file-text"} style={{ color: isFolder ? "#F0A93E" : "#726E68", fontSize: 13 }} aria-hidden="true"></i>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: "#DADDE1" }}>{name}</span>
      </div>

      {isFolder && open && children.map(([childName, childNode]) => (
        <TreeNode key={childName} name={childName} node={childNode} level={level + 1} />
      ))}
    </div>
  );
}

export default function ProjectStructureTree({ data }) {
  const rawStructure = data?.knowledgeObject?.project?.projectStructure;
  const structureEntries =
    rawStructure && typeof rawStructure === "object" ? Object.entries(rawStructure) : [];

  return (
    <Card>
      {structureEntries.length === 0 ? (
        <p className="muted">No project structure available.</p>
      ) : (
        structureEntries.map(([name, node]) => (
          <TreeNode key={name} name={name} node={node} level={0} />
        ))
      )}
    </Card>
  );
}