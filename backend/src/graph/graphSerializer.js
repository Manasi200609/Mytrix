/** Serializes a graph to consistently formatted JSON. */
export function serializeGraphToJson(graph, spacing = 2) {
  return JSON.stringify(graph, null, spacing);
}

/** Serializes a graph as readable Markdown for people and project documentation. */
export function serializeGraphToMarkdown(graph) {
  const nodes = graph?.nodes ?? [];
  const edges = graph?.edges ?? [];
  const projectName = nodes.find((node) => node.type === 'Project')?.label ?? 'Repository graph';
  const nodeRows = nodes.map((node) => `| ${escapeCell(node.type)} | ${escapeCell(node.label)} | ${escapeCell(JSON.stringify(node.metadata))} |`);
  const edgeRows = edges.map((edge) => {
    const source = nodes.find((node) => node.id === edge.source)?.label ?? edge.source;
    const target = nodes.find((node) => node.id === edge.target)?.label ?? edge.target;
    return `| ${escapeCell(source)} | ${escapeCell(edge.relationship)} | ${escapeCell(target)} |`;
  });

  return [
    `# ${projectName} Knowledge Graph`,
    '', '## Nodes', '', '| Type | Label | Metadata |', '| --- | --- | --- |', ...(nodeRows.length ? nodeRows : ['| — | — | — |']),
    '', '## Relationships', '', '| Source | Relationship | Target |', '| --- | --- | --- |', ...(edgeRows.length ? edgeRows : ['| — | — | — |']),
  ].join('\n');
}

/** Produces compact, deterministic context suitable for a future prompt payload. */
export function serializeGraphToPlainText(graph) {
  const nodesById = new Map((graph?.nodes ?? []).map((node) => [node.id, node]));
  const project = [...nodesById.values()].find((node) => node.type === 'Project');
  const facts = (graph?.edges ?? []).map((edge) => {
    const source = nodesById.get(edge.source)?.label ?? edge.source;
    const target = nodesById.get(edge.target)?.label ?? edge.target;
    return `${source} ${edge.relationship.replaceAll('_', ' ').toLowerCase()} ${target}.`;
  });

  return [
    `Repository knowledge graph${project ? ` for ${project.label}` : ''}.`,
    `Nodes: ${nodesById.size}. Relationships: ${(graph?.edges ?? []).length}.`,
    ...facts,
  ].join('\n');
}

function escapeCell(value) {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
}
