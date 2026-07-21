import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { detectLanguages } from './detectLanguages.js';
import { detectFrameworks, detectBuildTools } from './detectFramework.js';
import { detectEntrypoints } from './detectEntrypoints.js';
import { detectDependencies, detectPackageManager, detectDependencyTechnologies } from './detectDependencies.js';
import { detectConfigs, detectDocker, detectCicd } from './detectConfigs.js';
import { detectEnvironmentVariables } from './detectEnvironment.js';
import { detectProjectStructure } from './detectProjectStructure.js';
import { detectReadme } from './detectReadme.js';
import { buildKnowledgeObject } from './buildKnowledgeObject.js';

const IGNORED_DIRECTORIES = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', 'uploads', '.next', 'out', 'target', 'vendor']);

/** Traverses a repository once, then runs every detector against the resulting index. */
export async function parseRepository(repositoryPath, repositoryName) {
  const repositoryRoot = path.resolve(repositoryPath);

  // Walk the repository ONLY ONCE
  const fileIndex = await buildFileIndex(repositoryRoot);

  // Dependencies are needed by some later detectors
  const dependencies = await detectDependencies(fileIndex);

  const dependencyNames = [
    ...Object.keys(dependencies.dependencies),
    ...Object.keys(dependencies.devDependencies),
  ];

  // Run all independent detectors in parallel
  const [
  languages,
  frameworks,
  packageManager,
  buildTools,
  configFiles,
  entryPoints,
  projectStructure,
  environmentVariables,
  docker,
  cicd,
  technologies,
  readme,
] = await Promise.all([
  detectLanguages(fileIndex),
  detectFrameworks(fileIndex, dependencyNames),
  detectPackageManager(fileIndex),
  detectBuildTools(fileIndex, dependencyNames),
  detectConfigs(fileIndex),
  detectEntrypoints(fileIndex),
  detectProjectStructure(fileIndex),
  detectEnvironmentVariables(fileIndex),
  detectDocker(fileIndex),
  detectCicd(fileIndex),
  detectDependencyTechnologies(fileIndex, dependencyNames),
  detectReadme(fileIndex),
]);

  const analysis = {
    languages,
    frameworks,
    packageManager,
    buildTools,
    dependencies,
    configFiles,
    entryPoints,
    projectStructure,
    environmentVariables,
    docker,
    cicd,
    readme,
    ...technologies,
  };

  return buildKnowledgeObject({
    repositoryRoot,
    projectName: repositoryName,
    analysis,
});
}

async function buildFileIndex(root) {
  const fileindex = [];
  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) { if (!IGNORED_DIRECTORIES.has(entry.name.toLowerCase())) await visit(absolutePath); }
      else if (entry.isFile()) { const relativePath = path.relative(root, absolutePath).split(path.sep).join('/'); fileindex.push({ relativePath, absolutePath, fileName: entry.name, extension: path.extname(entry.name), size: (await stat(absolutePath)).size }); }
    }
  }
  await visit(root); return fileindex;
}
