export function scoreRepository(knowledgeObject) {
  const project = knowledgeObject.project;

  let repositoryHealth = 100;
  let knowledgeContinuity = 100;

  // ----------------------------
  // Repository Health
  // ----------------------------

  if (!project.testing?.length) repositoryHealth -= 15;

  if (!project.cicd?.present) repositoryHealth -= 10;

  if (!project.docker?.present) repositoryHealth -= 5;

  if (!project.environmentVariables?.length) repositoryHealth -= 5;

  const dependencyCount =
    Object.keys(project.dependencies?.dependencies || {}).length +
    Object.keys(project.dependencies?.devDependencies || {}).length;

  if (dependencyCount > 100) repositoryHealth -= 10;

  if (!project.frameworks?.length) repositoryHealth -= 5;

  // ----------------------------
  // Knowledge Continuity
  // ----------------------------

  if (!project.entryPoints?.length) knowledgeContinuity -= 15;

  if (!project.configFiles?.length) knowledgeContinuity -= 10;

  if (!project.languages?.length) knowledgeContinuity -= 15;

  if (!project.projectStructure) knowledgeContinuity -= 20;

  // ----------------------------
  // Complexity
  // ----------------------------

  let architectureComplexity = "Low";

  if (
    project.frameworks.length >= 2 ||
    dependencyCount > 40
  ) {
    architectureComplexity = "Medium";
  }

  if (
    project.frameworks.length >= 4 ||
    dependencyCount > 90
  ) {
    architectureComplexity = "High";
  }

  // ----------------------------
  // Onboarding Time
  // ----------------------------

  let onboardingTime = "30 minutes";

  if (dependencyCount > 20)
    onboardingTime = "1 hour";

  if (dependencyCount > 50)
    onboardingTime = "2 hours";

  if (dependencyCount > 90)
    onboardingTime = "4+ hours";

  return {
    repositoryHealth: Math.max(repositoryHealth, 0),
    knowledgeContinuity: Math.max(knowledgeContinuity, 0),
    architectureComplexity,
    onboardingTime
  };
}