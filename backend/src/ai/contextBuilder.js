const MAX_DEPENDENCIES = 50;
const MAX_FILES = 30;
const MAX_README_CHARS = 3000;

/**
 * Produces a compact, evidence-only view of the Project Knowledge Object and
 * Repository Graph. It never accesses the cloned repository or rebuilds data.
 */
export function buildRepositoryContext(knowledgeObject, repositoryGraph) {
  const project = knowledgeObject?.project;
  if (!project?.projectName) {
    throw new TypeError('A Project Knowledge Object with project.projectName is required.');
  }

  const projectNode = repositoryGraph?.nodes?.find((node) => node.type === 'Project');
  const graphNodeTypes = [...new Set((repositoryGraph?.nodes ?? []).map((node) => node.type))].sort();
  const dependencies = mergeDependencies(project.dependencies);

  return {
    metadata: {
      projectName: project.projectName,
      repositoryRoot: knowledgeObject.metadata?.repositoryRoot ?? null,
      parserVersion: knowledgeObject.metadata?.parserVersion ?? null,
      scannedAt: knowledgeObject.metadata?.scannedAt ?? null,
    },
    technologies: {
      languages: project.languages ?? [],
      frameworks: project.frameworks ?? [],
      packageManager: project.packageManager ?? null,
      buildTools: project.buildTools ?? [],
      databases: project.database ?? [],
      testingFrameworks: project.testing ?? [],
    },
    entryPoints: project.entryPoints ?? [],
    configurationFiles: project.configFiles ?? [],
    environmentVariables: project.environmentVariables ?? [],
    readmeExcerpt: (project.readme ?? '').slice(0, MAX_README_CHARS),
    architecture: {
      hasDocker: Boolean(project.docker?.present),
      cicdProvider: project.cicd?.provider ?? null,
      topLevelFolders: Object.keys(project.projectStructure ?? {}),
    },
    dependencies,
    importantFiles: (project.importantFiles ?? []).slice(0, MAX_FILES),
    graph: {
      projectNodeId: projectNode?.id ?? null,
      nodeCount: repositoryGraph?.nodes?.length ?? 0,
      edgeCount: repositoryGraph?.edges?.length ?? 0,
      nodeTypes: graphNodeTypes,
      projectRelationships: getProjectRelationships(repositoryGraph, projectNode?.id),
    },
  };
}

function mergeDependencies(dependencyGroups = {}) {
  const entries = new Map();
  for (const [name, version] of Object.entries(dependencyGroups.dependencies ?? {})) {
    entries.set(name, { name, version, scope: 'production' });
  }
  for (const [name, version] of Object.entries(dependencyGroups.devDependencies ?? {})) {
    const existing = entries.get(name);
    entries.set(name, existing ?? { name, version, scope: 'development' });
  }
  return [...entries.values()].sort((left, right) => left.name.localeCompare(right.name)).slice(0, MAX_DEPENDENCIES);
}

function getProjectRelationships(graph, projectNodeId) {
  if (!projectNodeId) return [];
  const nodeLabels = new Map((graph?.nodes ?? []).map((node) => [node.id, node.label]));
  return (graph?.edges ?? [])
    .filter((edge) => edge.source === projectNodeId)
    .map((edge) => ({ relationship: edge.relationship, target: nodeLabels.get(edge.target) ?? edge.target }));
}
