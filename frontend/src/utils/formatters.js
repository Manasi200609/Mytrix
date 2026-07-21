// Shortens a full git commit hash to the conventional 7-character short form,
// matching how the citation badges display commit references.
export function formatCommitHash(hash) {
  if (!hash) return '';
  return hash.slice(0, 7);
}

export function formatMinutes(minutes) {
  if (minutes == null) return '';
  return `${minutes} min`;
}

export function truncateText(text, length = 400) {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}
