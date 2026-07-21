import { readFile } from 'node:fs/promises';

const README_PRIORITY = ['readme.md', 'readme.mdx', 'readme.rst', 'readme.txt', 'readme'];
const MAX_README_CHARACTERS = 25000;

/**
 * Loads README content with stable selection priority.
 * Prefers root README files, then any nested README if root is absent.
 */
export async function detectReadme(fileIndex) {
  const candidates = fileIndex
    .filter(({ fileName }) => /^readme(?:$|\.[^.]+$)/i.test(fileName))
    .sort((a, b) => compareReadmeCandidates(a.relativePath, b.relativePath));

  const selected = candidates[0];
  if (!selected) {
    return '';
  }

  const content = await readFile(selected.absolutePath, 'utf8');
  return content.slice(0, MAX_README_CHARACTERS);
}

function compareReadmeCandidates(pathA, pathB) {
  const rootDepthA = getDepth(pathA);
  const rootDepthB = getDepth(pathB);

  if (rootDepthA !== rootDepthB) {
    return rootDepthA - rootDepthB;
  }

  const priorityA = getPriority(pathA);
  const priorityB = getPriority(pathB);

  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  return pathA.localeCompare(pathB);
}

function getDepth(relativePath) {
  return relativePath.split('/').length - 1;
}

function getPriority(relativePath) {
  const segments = relativePath.split('/');
  const fileName = segments[segments.length - 1].toLowerCase();
  const index = README_PRIORITY.indexOf(fileName);
  return index === -1 ? README_PRIORITY.length : index;
}
