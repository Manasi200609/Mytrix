// Small combiner for conditional className strings, e.g.
// classNames('card', isActive && 'card--active')
export function classNames(...parts) {
  return parts.filter(Boolean).join(' ');
}

// Used by dashboard components to decide whether a field from the backend
// is worth rendering — treats empty arrays/objects/strings as "not present"
// so cards stay hidden rather than rendering an empty shell.
export function isNonEmpty(value) {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}
