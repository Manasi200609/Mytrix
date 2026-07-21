import { createNodes } from './createNodes.js';
import { createEdges } from './createEdges.js';

/**
 * Converts a Project Knowledge Object into a portable repository graph.
 * It performs no filesystem or model work; all evidence comes from Phase 2.
 */
export async function buildGraph(knowledgeObject) {
  const { nodes, nodeIds } = createNodes(knowledgeObject);
  const edges = createEdges(nodes, nodeIds);
  return { nodes, edges };
}
