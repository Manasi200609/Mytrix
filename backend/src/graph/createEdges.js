import { createHash } from 'node:crypto';

/** Creates semantic relationships between already-created graph nodes. */
export function createEdges(nodes, nodeIds) {
  const project = nodes.find((node) => node.type === 'Project');
  if (!project) throw new TypeError('A Project node is required before edges can be created.');

  const edges = [];
  const addEdge = (source, target, relationship) => {
    if (!source || !target) return;
    edges.push({
      id: createEdgeId(source, target, relationship),
      source,
      target,
      relationship,
    });
  };

  const projectRelationships = {
    Language: 'USES', Framework: 'USES', PackageManager: 'USES_PACKAGE_MANAGER',
    BuildTool: 'USES_BUILD_TOOL', Dependency: 'USES_DEPENDENCY', Database: 'USES',
    TestingFramework: 'USES_TESTING_FRAMEWORK', ConfigFile: 'HAS_CONFIG',
    EntryPoint: 'HAS_ENTRYPOINT', EnvironmentVariable: 'USES_ENVIRONMENT_VARIABLE',
  };

  for (const node of nodes) {
    if (node.id !== project.id && projectRelationships[node.type]) {
      addEdge(project.id, node.id, projectRelationships[node.type]);
    }
  }

  for (const framework of nodes.filter((node) => node.type === 'Framework')) {
    for (const dependencyName of framework.metadata.dependencyHints ?? []) {
      addEdge(framework.id, nodeIds.get(`Dependency:${dependencyName}`), 'DEPENDS_ON');
    }
  }

  return edges;
}

function createEdgeId(source, target, relationship) {
  return `edge-${createHash('sha256').update(`${source}:${relationship}:${target}`).digest('hex').slice(0, 16)}`;
}
