/** Builds the final, stable Project Knowledge Object returned by the parser. */
export function buildKnowledgeObject({
  repositoryRoot,
  projectName,
  analysis,
}) {
  // Merge config files and entry points into a single important files list.
  const importantFiles = [
    ...new Set([
      ...analysis.configFiles,
      ...analysis.entryPoints,
    ]),
  ];
  const techStack = [
    ...new Set([
      ...(analysis.languages ?? []),
      ...(analysis.frameworks ?? []),
      ...(analysis.buildTools ?? []),
      ...(analysis.testing ?? []),
      ...(analysis.database ?? []),
      ...(analysis.packageManager ? [analysis.packageManager] : []),
    ]),
  ];

  const architecture = {
    projectStructure: analysis.projectStructure ?? {},
    entryPoints: analysis.entryPoints ?? [],
    configFiles: analysis.configFiles ?? [],
    docker: analysis.docker ?? { present: false, files: [] },
    cicd: analysis.cicd ?? { present: false, provider: null, files: [] },
    importantFiles,
  };

  return {
    metadata: {
      parserVersion: "2.0.0",
      scannedAt: new Date().toISOString(),
      repositoryRoot,
    },

    project: {
      projectName,

      languages: analysis.languages,
      frameworks: analysis.frameworks,
      packageManager: analysis.packageManager,
      buildTools: analysis.buildTools,
      dependencies: analysis.dependencies,
      configFiles: analysis.configFiles,
      entryPoints: analysis.entryPoints,
      projectStructure: analysis.projectStructure,
      environmentVariables: analysis.environmentVariables,
      docker: analysis.docker,
      cicd: analysis.cicd,
      database: analysis.database,
      testing: analysis.testing,
      readme: analysis.readme,
      techStack,
      architecture,

      // Files that are likely to be the most useful for onboarding.
      importantFiles,
    },
  };
}