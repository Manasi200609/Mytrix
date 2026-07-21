/** Detects source languages from file extensions in a pre-built file index. */
const LANGUAGE_EXTENSIONS = Object.freeze({
  JavaScript: ['.js', '.jsx', '.mjs', '.cjs'],
  TypeScript: ['.ts', '.tsx', '.mts', '.cts'],
  Python: ['.py'], Java: ['.java'], Go: ['.go'], Rust: ['.rs'],
  'C++': ['.cpp', '.cxx', '.cc', '.hpp', '.hh', '.hxx'],
  'C#': ['.cs'], PHP: ['.php'], Ruby: ['.rb'],
});

export function detectLanguages(fileIndex) {
  const extensions = new Set(fileIndex.map(({ extension }) => extension.toLowerCase()));
  return Object.entries(LANGUAGE_EXTENSIONS)
    .filter(([, candidates]) => candidates.some((extension) => extensions.has(extension)))
    .map(([language]) => language);
}
