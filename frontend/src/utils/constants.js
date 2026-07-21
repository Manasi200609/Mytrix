export const ROUTES = {
  landing: '/',
  analyze: '/analyze',
  dashboard: (projectId) => `/dashboard/${projectId}`,
};

export const ANALYSIS_STATUS = {
  idle: 'idle',
  analyzing: 'analyzing',
  loadingMemory: 'loadingMemory',
  done: 'done',
  error: 'error',
};

export const README_PREVIEW_LENGTH = 400;
export const DEPENDENCY_LIST_LIMIT = 12;
