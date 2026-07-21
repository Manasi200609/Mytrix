/** Builds a folders-only hierarchy from the shared file index. */
export function detectProjectStructure(fileIndex) {
  const root = {};
  for (const { relativePath } of fileIndex) {
    const folders = relativePath.split('/').slice(0, -1); let cursor = root;
    for (const folder of folders) cursor = cursor[folder] ||= {};
  }
  return root;
}
