import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { readdir } from 'node:fs/promises';

const REPOSITORIES_DIRECTORY = path.resolve(process.cwd(), 'data', 'repositories');

/** Returns the validated, isolated storage directory for one repository analysis. */
export function getRepositoryDirectory(projectId) {
  const safeProjectId = validateProjectId(projectId);
  return path.join(REPOSITORIES_DIRECTORY, safeProjectId);
}

/** Returns a validated file path within one repository's storage directory. */
export function getRepositoryFilePath(projectId, fileName) {
  return path.join(getRepositoryDirectory(projectId), fileName);
}

/** Saves the durable metadata record for a repository analysis. */
export async function saveRepositoryMetadata(projectId, metadata) {
  await writeJsonFileSafely(getRepositoryFilePath(projectId, 'metadata.json'), metadata);
}

/** Loads repository metadata, returning null when the analysis has not been saved. */
export async function loadRepositoryMetadata(projectId) {
  return readJsonFileOrNull(getRepositoryFilePath(projectId, 'metadata.json'));
}

/** Atomically replaces a JSON file after fully writing a temporary sibling file. */
export async function writeJsonFileSafely(filePath, value) {
  const directory = path.dirname(filePath);
  const temporaryPath = path.join(directory, `.${path.basename(filePath)}.${randomUUID()}.tmp`);

  await mkdir(directory, { recursive: true });
  try {
    await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    await rename(temporaryPath, filePath);
  } catch (error) {
    throw new Error(`Unable to save repository data at ${filePath}.`, { cause: error });
  }
}

/** Reads JSON without treating an absent cache file as an error. */
export async function readJsonFileOrNull(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    if (error instanceof SyntaxError) {
      throw new Error(`Stored repository data at ${filePath} is invalid JSON.`, { cause: error });
    }
    throw new Error(`Unable to read repository data at ${filePath}.`, { cause: error });
  }
}

function validateProjectId(projectId) {
  if (typeof projectId !== 'string' || !/^[A-Za-z0-9_-]+$/.test(projectId)) {
    throw new TypeError('projectId must contain only letters, numbers, hyphens, or underscores.');
  }
  return projectId;
}
export async function listRepositoryIds() {
  try {
    const entries = await readdir(REPOSITORIES_DIRECTORY, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw new Error('Unable to list stored repositories.', { cause: error });
  }
}