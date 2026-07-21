/** Finds convention-based application entry files without reading directories. */
const ENTRYPOINTS = new Set(['index.js', 'index.ts', 'index.jsx', 'index.tsx', 'main.js', 'main.ts', 'main.jsx', 'main.tsx', 'app.js', 'app.ts', 'server.js', 'server.ts']);

export function detectEntrypoints(fileIndex) {
  return fileIndex.filter(({ fileName }) => ENTRYPOINTS.has(fileName.toLowerCase()))
    .map(({ relativePath }) => relativePath);
}
