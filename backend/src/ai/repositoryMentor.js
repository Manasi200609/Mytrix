import { buildRepositoryContext } from './contextBuilder.js';
import { buildMentorPrompt } from './promptBuilder.js';
import { formatMentorResponse } from './responseFormatter.js';
import { systemPrompt } from './systemPrompt.js';

/**
 * Coordinates context curation, prompt creation, model execution, and response
 * formatting. The injected client keeps provider/network concerns outside the
 * analysis and graph layers.
 */
export async function repositoryMentor({
  knowledgeObject,
  repositoryGraph,
  userQuestion,
  modelClient,
  model = "gpt-5.6",
}) {
  if (typeof modelClient?.generate !== 'function') {
    throw new TypeError('modelClient.generate({ model, systemPrompt, prompt }) is required.');
  }

  const context = buildRepositoryContext(knowledgeObject, repositoryGraph);
  const prompt = buildMentorPrompt(context, userQuestion);
  const modelOutput = await modelClient.generate({
    model,
    systemPrompt: systemPrompt,
    prompt,
  });

  return formatMentorResponse(modelOutput);
}
