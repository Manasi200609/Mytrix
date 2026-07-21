import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import simpleGit from 'simple-git';

export class CloneRepositoryError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = 'CloneRepositoryError';
  }
}

/**
 * Clones a repository into uploads/<projectId>. Failed attempts are removed so
 * no incomplete repository is ever left available to later requests.
 *
 * @param {{ repoUrl: string, projectId: string, uploadsDirectory: string }} options
 * @returns {Promise<string>} The relative clone destination.
 */
export async function cloneRepository({ repoUrl, projectId, uploadsDirectory }) {
  const destination = path.join(uploadsDirectory, projectId);
  const git = simpleGit({
    timeout: {
      block: 300000,
    },
  });

  try {
    // Ensure the parent directory exists before Git starts the clone.
    await mkdir(uploadsDirectory, { recursive: true });
    await rm(destination, { recursive: true, force: true });
    await git.clone(repoUrl, destination, ['--depth', '1', '--single-branch', '--no-tags']);
    return path.posix.join('uploads', projectId);
  } catch (error) {
    try {
      await rm(destination, { recursive: true, force: true });
    } catch (cleanupError) {
      throw new CloneRepositoryError('Repository clone failed and cleanup could not complete.', cleanupError);
    }
    throw new CloneRepositoryError(getCloneErrorMessage(error), error);
  }
}

function getCloneErrorMessage(error) {
  const output = [error?.message, error?.stderr, error?.stdout]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (output.includes('not a git repository') || output.includes('repository not found')) {
    return 'Repository not found. Check that the GitHub URL is correct and public.';
  }

  if (output.includes('authentication failed') || output.includes('could not read username')) {
    return 'This repository is private or requires authentication. Please provide a public repository.';
  }

  if (output.includes('timed out') || output.includes('timeout')) {
    return 'Cloning the repository timed out after 5 minutes.';
  }

  if (output.includes('enoent') || output.includes('git: command not found')) {
    return 'Git is not installed or is not available on the server PATH.';
  }

  if (
    output.includes('could not resolve host') ||
    output.includes('failed to connect') ||
    output.includes('network is unreachable') ||
    output.includes('connection timed out')
  ) {
    return 'Network failure while connecting to GitHub. Please try again.';
  }

  return 'Unable to clone the repository. Please verify the URL and try again.';
}
