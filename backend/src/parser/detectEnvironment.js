import { readFile } from 'node:fs/promises';

/** Extracts declared environment-variable names from opted-in templates and README. */
export async function detectEnvironmentVariables(fileIndex) {
  const sources = fileIndex.filter(({ fileName }) => ['.env.example', '.env.template', 'readme.md'].includes(fileName.toLowerCase()));
  const names = new Set();
  await Promise.all(sources.map(async (file) => { const content = await readFile(file.absolutePath, 'utf8').catch(() => ''); for (const match of content.matchAll(/(?:^|[\s`])([A-Z][A-Z0-9_]{1,})(?=\s*(?:=|:|\b))/gm)) names.add(match[1]); }));
  return [...names].sort();
}
