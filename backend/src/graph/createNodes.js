import { createHash } from 'node:crypto';

const FRAMEWORK_DEPENDENCY_HINTS = {
  React: ['react'],
  'Next.js': ['next', 'react', 'react-dom'],
  Express: ['express'],
  Vue: ['vue'],
  Angular: ['@angular/core'],
  FastAPI: ['fastapi'],
  Django: ['django'],
  Flask: ['flask'],
  'Spring Boot': ['spring-boot-starter'],
  Laravel: ['laravel/framework'],
  'ASP.NET': ['microsoft.aspnetcore'],
  Svelte: ['svelte'],
};

/**
 * Creates graph nodes from a Project Knowledge Object. IDs are deterministic,
 * which makes repeated analyses of the same project easy to compare.
 */
export function createNodes(knowledgeObject) {
  const project = knowledgeObject?.project;
  if (!project?.projectName) {
    throw new TypeError('A Project Knowledge Object with project.projectName is required.');
  }

  const nodes = [];
  const nodeIds = new Map();
  const addNode = (type, label, metadata = {}) => {
    const key = `${type}:${label}`;
    if (nodeIds.has(key)) return nodeIds.get(key);

    const id = createNodeId(type, label);
    nodes.push({ id, type, label, metadata });
    nodeIds.set(key, id);
    return id;
  };

  addNode('Project', project.projectName, {
    repositoryRoot: knowledgeObject.metadata?.repositoryRoot ?? null,
    parserVersion: knowledgeObject.metadata?.parserVersion ?? null,
    scannedAt: knowledgeObject.metadata?.scannedAt ?? null,
  });

  (project.languages ?? []).forEach((label) => addNode('Language', label));
  (project.frameworks ?? []).forEach((label) => addNode('Framework', label, {
    dependencyHints: FRAMEWORK_DEPENDENCY_HINTS[label] ?? [],
  }));

  if (project.packageManager) addNode('PackageManager', project.packageManager);
  (project.buildTools ?? []).forEach((label) => addNode('BuildTool', label));
  (project.database ?? []).forEach((label) => addNode('Database', label));
  (project.testing ?? []).forEach((label) => addNode('TestingFramework', label));
  (project.configFiles ?? []).forEach((label) => addNode('ConfigFile', label));
  (project.entryPoints ?? []).forEach((label) => addNode('EntryPoint', label));
  (project.environmentVariables ?? []).forEach((label) => addNode('EnvironmentVariable', label));

  const dependencyScopes = new Map();
  for (const [name, version] of Object.entries(project.dependencies?.dependencies ?? {})) {
    dependencyScopes.set(name, { version, scope: 'production' });
  }
  for (const [name, version] of Object.entries(project.dependencies?.devDependencies ?? {})) {
    const existing = dependencyScopes.get(name);
    dependencyScopes.set(name, existing
      ? { version: existing.version, scope: 'production and development' }
      : { version, scope: 'development' });
  }
  for (const [label, metadata] of dependencyScopes) addNode('Dependency', label, metadata);

  return { nodes, nodeIds };
}

function createNodeId(type, label) {
  const digest = createHash('sha256').update(`${type}:${label}`).digest('hex').slice(0, 16);
  return `${type.toLowerCase()}-${digest}`;
}
