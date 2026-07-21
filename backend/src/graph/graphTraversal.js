/** Returns every node whose category matches the requested type. */
export function getNodesByType(graph, type) {
  return graph?.nodes?.filter((node) => node.type === type) ?? [];
}

/** Returns nodes adjacent to nodeId. Direction may be 'in', 'out', or 'both'. */
export function getNeighbors(graph, nodeId, direction = 'both') {
  if (!['in', 'out', 'both'].includes(direction)) {
    throw new TypeError("direction must be 'in', 'out', or 'both'.");
  }

  const nodeMap = new Map((graph?.nodes ?? []).map((node) => [node.id, node]));
  const neighborIds = new Set();
  for (const edge of graph?.edges ?? []) {
    if ((direction === 'out' || direction === 'both') && edge.source === nodeId) neighborIds.add(edge.target);
    if ((direction === 'in' || direction === 'both') && edge.target === nodeId) neighborIds.add(edge.source);
  }
  return [...neighborIds].map((id) => nodeMap.get(id)).filter(Boolean);
}

/** Returns the single root Project node, or null for an empty graph. */
export function getProjectNode(graph) {
  return getNodesByType(graph, 'Project')[0] ?? null;
}

/** Finds graph nodes by label, case-insensitively. */
export function findNodeByLabel(graph, label) {
  if (typeof label !== 'string') return [];
  const normalizedLabel = label.trim().toLocaleLowerCase();
  return (graph?.nodes ?? []).filter((node) => node.label.toLocaleLowerCase() === normalizedLabel);
}
