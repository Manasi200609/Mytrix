import { useEffect, useMemo, useState } from "react";
import { getProjectMemory } from "../services/repositoryApi";

export default function useRepositoryGraph(projectId) {
  const [graph, setGraph] = useState(null);

  const [selectedNode, setSelectedNode] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!projectId) return;

    async function loadGraph() {
      setLoading(true);
      setError(null);

      try {
        const memory =
          await getProjectMemory(projectId);

        setGraph(memory.repositoryGraph);
      } catch (err) {
        setError(
          err.message ||
            "Unable to load repository graph."
        );
      } finally {
        setLoading(false);
      }
    }

    loadGraph();
  }, [projectId]);

  const filteredGraph = useMemo(() => {
    if (!graph) return null;

    if (!search.trim()) return graph;

    const keyword = search.toLowerCase();

    const nodes = graph.nodes.filter((node) =>
      node.name
        ?.toLowerCase()
        .includes(keyword)
    );

    const nodeIds = new Set(
      nodes.map((n) => n.id)
    );

    const edges = graph.edges.filter(
      (edge) =>
        nodeIds.has(edge.source) &&
        nodeIds.has(edge.target)
    );

    return {
      nodes,
      edges,
    };
  }, [graph, search]);

  function selectNode(node) {
    setSelectedNode(node);
  }

  function clearSelection() {
    setSelectedNode(null);
  }

  function resetSearch() {
    setSearch("");
  }

  return {
    graph: filteredGraph,

    loading,

    error,

    selectedNode,

    search,

    setSearch,

    selectNode,

    clearSelection,

    resetSearch,
  };
}