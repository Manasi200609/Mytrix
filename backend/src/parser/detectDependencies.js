import { readFile } from 'node:fs/promises';

/** Reads only dependency manifests found by the shared index. */
export async function detectDependencies(fileIndex) {
  const result = { dependencies: {}, devDependencies: {} };
  const manifests = fileIndex.filter(({ fileName }) => ['package.json', 'requirements.txt', 'cargo.toml', 'pom.xml', 'build.gradle', 'build.gradle.kts'].includes(fileName.toLowerCase()));
  await Promise.all(manifests.map(async (file) => {
    const content = await readFile(file.absolutePath, 'utf8').catch(() => '');
    const name = file.fileName.toLowerCase();
    if (name === 'package.json') parsePackageJson(content, result);
    else if (name === 'requirements.txt') parseRequirements(content, result.dependencies);
    else if (name === 'cargo.toml') parseCargo(content, result);
    else if (name === 'pom.xml') parseMaven(content, result.dependencies);
    else parseGradle(content, result);
  }));
  return result;
}

function parsePackageJson(content, result) { try { const json = JSON.parse(content); Object.assign(result.dependencies, json.dependencies); Object.assign(result.devDependencies, json.devDependencies); } catch {} }
function parseRequirements(content, target) { content.split(/\r?\n/).forEach((line) => { const match = line.trim().match(/^([\w.-]+)(?:\s*(?:===|==|>=|<=|~=|!=)\s*([^\s;]+))?/); if (match && !line.startsWith('#')) target[match[1]] = match[2] || '*'; }); }
function parseCargo(content, result) { const dev = /^\s*\[dev-dependencies\]/m.test(content); let section = 'dependencies'; content.split(/\r?\n/).forEach((line) => { if (/^\s*\[dev-dependencies\]/.test(line)) section = 'devDependencies'; else if (/^\s*\[dependencies\]/.test(line)) section = 'dependencies'; else { const match = line.match(/^\s*([\w-]+)\s*=\s*["{]([^",}]*)/); if (match) result[section][match[1]] = match[2] || '*'; } }); }
function parseMaven(content, target) { for (const block of content.matchAll(/<dependency>([\s\S]*?)<\/dependency>/g)) { const artifact = block[1].match(/<artifactId>\s*([^<]+)\s*<\/artifactId>/)?.[1]; const version = block[1].match(/<version>\s*([^<]+)\s*<\/version>/)?.[1] || '*'; if (artifact) target[artifact] = version; } }
function parseGradle(content, result) { for (const match of content.matchAll(/\b(implementation|api|compileOnly|runtimeOnly|testImplementation|testRuntimeOnly)\s*[('" ]+([^:'"\s]+):([^:'"\s]+):?([^'"\s)]*)/g)) { const target = match[1].startsWith('test') ? result.devDependencies : result.dependencies; target[match[3]] = match[4] || '*'; } }

export function detectPackageManager(fileIndex) {
  const files = new Set(fileIndex.map(({ fileName }) => fileName.toLowerCase()));
  if (files.has('pnpm-lock.yaml')) return 'pnpm'; if (files.has('yarn.lock')) return 'yarn'; if (files.has('package-lock.json') || files.has('npm-shrinkwrap.json')) return 'npm';
  if (files.has('poetry.lock') || files.has('pyproject.toml')) return 'poetry'; if (files.has('requirements.txt') || files.has('pipfile')) return 'pip';
  if (files.has('cargo.lock') || files.has('cargo.toml')) return 'cargo'; if (files.has('pom.xml')) return 'maven'; if (files.has('build.gradle') || files.has('build.gradle.kts')) return 'gradle'; return null;
}

/** Identifies database and test libraries from already-parsed manifest names. */
export function detectDependencyTechnologies(fileIndex, dependencyNames) {
  const names = new Set(dependencyNames.map((name) => name.toLowerCase()));
  const files = new Set(fileIndex.map(({ fileName }) => fileName.toLowerCase()));
  const database = [
    ['MongoDB', ['mongodb', 'mongoose'], ['mongod.conf']], ['PostgreSQL', ['pg', 'postgres', 'postgresql'], ['postgresql.conf']],
    ['MySQL', ['mysql', 'mysql2'], ['my.cnf', 'my.ini']], ['Redis', ['redis', 'ioredis'], ['redis.conf']],
    ['SQLite', ['sqlite', 'sqlite3', 'better-sqlite3'], ['sqlite.db', 'database.sqlite']],
  ].filter(([, packages, configs]) => packages.some((pkg) => names.has(pkg)) || configs.some((file) => files.has(file))).map(([name]) => name);
  const testing = [['Jest', ['jest']], ['Vitest', ['vitest']], ['Cypress', ['cypress']], ['Playwright', ['playwright', '@playwright/test']]]
    .filter(([, packages]) => packages.some((pkg) => names.has(pkg))).map(([name]) => name);
  return { database, testing };
}
