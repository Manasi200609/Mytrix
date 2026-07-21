/**
 * Validates and normalizes a public GitHub repository URL.
 * Only canonical HTTPS github.com owner/repository URLs are accepted.
 *
 * @param {string} repoUrl
 * @returns {string | null} A normalized clone URL, or null when invalid.
 */
export function validateGithubUrl(repoUrl) {
  if (typeof repoUrl !== 'string' || repoUrl.trim() === '') {
    return null;
  }

  try {
    const parsedUrl = new URL(repoUrl.trim());

    if (
      parsedUrl.protocol !== 'https:' ||
      parsedUrl.hostname.toLowerCase() !== 'github.com' ||
      parsedUrl.port ||
      parsedUrl.username ||
      parsedUrl.password ||
      parsedUrl.search ||
      parsedUrl.hash
    ) {
      return null;
    }

    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    if (pathParts.length !== 2) {
      return null;
    }

    const [owner, repositoryWithSuffix] = pathParts;
    const repository = repositoryWithSuffix.replace(/\.git$/i, '');

    // These patterns cover GitHub account and repository naming rules while
    // preventing paths such as /owner/repository/issues from being accepted.
    if (
      !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$|^[A-Za-z0-9]$/.test(owner) ||
      !/^[A-Za-z0-9_.-]+$/.test(repository) ||
      repository === ''
    ) {
      return null;
    }

    return `https://github.com/${owner}/${repository}.git`;
  } catch {
    return null;
  }
}
