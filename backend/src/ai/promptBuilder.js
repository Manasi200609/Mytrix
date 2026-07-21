/** Builds the compact user prompt sent alongside the shared mentor instructions. */
export function buildMentorPrompt(context, userQuestion) {
  if (typeof userQuestion !== 'string' || userQuestion.trim() === '') {
    throw new TypeError('A non-empty user question is required.');
  }

  return [
    'Repository context (the complete evidence available to you):',
    JSON.stringify(context, null, 2),   // Pretty-printed JSON
    '',
    `Developer question: ${userQuestion.trim()}`,
    '',
    'Answer using only this context. If the context does not establish an answer, say so explicitly.',
  ].join('\n');
}