/** Converts a model response into the stable Repository Mentor response contract. */
export function formatMentorResponse(modelOutput) {
  const rawAnswer = extractText(modelOutput).trim();
  const parsed = parseJsonAnswer(rawAnswer);

  if (parsed) {
    return {
      summary: toText(parsed.summary),
      explanation: toText(parsed.explanation),
      recommendedFiles: toStringArray(parsed.recommendedFiles),
      nextLearningSteps: toStringArray(parsed.nextLearningSteps),
      rawAnswer,
    };
  }

  // Keep an answer useful even if a provider disregards the JSON instruction.
  return {
    summary: firstSentence(rawAnswer),
    explanation: rawAnswer,
    recommendedFiles: [],
    nextLearningSteps: [],
    rawAnswer,
  };
}

function extractText(output) {
  if (typeof output === 'string') return output;
  if (typeof output?.output_text === 'string') return output.output_text;
  if (typeof output?.text === 'string') return output.text;
  throw new TypeError('The model client must return text or an object containing output_text.');
}

function parseJsonAnswer(rawAnswer) {
  try {
    return JSON.parse(rawAnswer.replace(/^```json\s*|\s*```$/gi, ''));
  } catch {
    return null;
  }
}

function toText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function toStringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean) : [];
}

function firstSentence(value) {
  return value.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || value;
}
