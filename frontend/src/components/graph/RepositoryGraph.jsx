import { useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

// Real order your backend actually produces (from createNodes.js) — used to
// lay nodes out in readable rows by category instead of a random grid.
const TYPE_ORDER = [
  "Project", "Language", "Framework", "PackageManager", "BuildTool",
  "Database", "TestingFramework", "ConfigFile", "EntryPoint",
  "EnvironmentVariable", "Dependency",
];

const ROW_HEIGHT = 110;
const COL_WIDTH = 190;

export default function RepositoryGraph({ graph, onNodeClick }) {
  const { nodes, edges } = useMemo(() => {
    if (!graph?.nodes?.length) return { nodes: [], edges: [] };

    // Group nodes by their real type, in a sensible order, so each category
    // becomes its own row instead of an arbitrary index % 5 grid.
    const byType = new Map();
    graph.nodes.forEach((node) => {
      const list = byType.get(node.type) ?? [];
      list.push(node);
      byType.set(node.type, list);
    });

    const orderedTypes = [
      ...TYPE_ORDER.filter((t) => byType.has(t)),
      ...[...byType.keys()].filter((t) => !TYPE_ORDER.includes(t)),
    ];

    const flowNodes = [];
    orderedTypes.forEach((type, rowIndex) => {
      const nodesInRow = byType.get(type);
      const rowWidth = nodesInRow.length * COL_WIDTH;
      const startX = -rowWidth / 2;
      const isProject = type === "Project";

      nodesInRow.forEach((node, colIndex) => {
        flowNodes.push({
          id: node.id,
          data: { label: node.label ?? node.id, rawNode: node },
          position: {
            x: startX + colIndex * COL_WIDTH,
            y: rowIndex * ROW_HEIGHT,
          },
          style: isProject
            ? {
                borderRadius: 10,
                padding: "12px 18px",
                border: "1.5px solid #F0A93E",
                background: "#2E2618",
                color: "#F0A93E",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 13,
                fontWeight: 500,
              }
            : {
                borderRadius: 8,
                padding: "8px 14px",
                border: "1px solid #3A3733",
                background: "#252321",
                color: "#DADDE1",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11.5,
                maxWidth: 170,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
        });
      });
    });

    const flowEdges = (graph.edges ?? []).map((edge, index) => ({
      id: edge.id || String(index),
      source: edge.source,
      target: edge.target,
      animated: false,
      style: { stroke: "#3A3733", strokeWidth: 1 },
    }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [graph]);

  return (
    <div
      style={{
        width: "100%",
        height: "700px",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#1C1B1A",
        border: "0.5px solid #3A3733",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodeClick={(event, node) => onNodeClick?.(node.data.rawNode)}
      >
        <MiniMap
          style={{ background: "#252321" }}
          maskColor="rgba(28, 27, 26, 0.7)"
          nodeColor={(n) => (n.style?.background === "#2E2618" ? "#F0A93E" : "#3A3733")}
        />
        <Controls />
        <Background color="#3A3733" gap={20} />
      </ReactFlow>

      <style>{`
        .react-flow__controls button {
          background: #252321;
          border-bottom: 1px solid #3A3733;
          fill: #DADDE1;
        }
        .react-flow__controls button:hover { background: #3A3733; }
        .react-flow__attribution { background: transparent; }
      `}</style>
    </div>
  );
}