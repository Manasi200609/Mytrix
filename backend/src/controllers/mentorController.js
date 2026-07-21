import { OpenAIClient } from '../ai/openaiClient.js';
import { repositoryMentor } from '../ai/repositoryMentor.js';

/** Handles POST /api/mentor and delegates repository guidance to Phase 4. */
export async function mentorRepository(req, res) {
  const { knowledgeObject, repositoryGraph, question } = req.body ?? {};
  const validationMessage = validateRequest(knowledgeObject, repositoryGraph, question);

  if (validationMessage) {
    return res.status(400).json({ success: false, message: validationMessage });
  }

  try {
  const modelClient = new OpenAIClient({
    provider: process.env.AI_PROVIDER,
});
    const mentorResponse = await repositoryMentor({
      knowledgeObject,
      repositoryGraph,
      userQuestion: question,
      modelClient,
    });

    return res.status(200).json({ success: true, ...mentorResponse });
  } catch (error) {
  console.error("========== MENTOR ERROR ==========");
  console.error(error);
  console.error("==================================");
    const { status, message } = getMentorErrorResponse(error);
    return res.status(status).json({ success: false, message });
  }
}

function validateRequest(knowledgeObject, repositoryGraph, question) {
  if (!knowledgeObject || typeof knowledgeObject !== 'object') {
    return 'knowledgeObject is required and must be an object.';
  }
  if (!repositoryGraph || !Array.isArray(repositoryGraph.nodes) || !Array.isArray(repositoryGraph.edges)) {
    return 'repositoryGraph is required and must contain nodes and edges arrays.';
  }
  if (typeof question !== 'string' || question.trim() === '') {
    return 'question is required and must be a non-empty string.';
  }
  return null;
}

function getMentorErrorResponse(error) {
  if (error?.code === 'OPENAI_API_KEY_MISSING') {
    return { status: 500, message: 'The AI mentor is not configured. Set OPENAI_API_KEY on the server.' };
  }

  const errorName = error?.name ?? '';
  const statusCode = error?.status ?? error?.statusCode;
  if (errorName === 'APIConnectionTimeoutError' || error?.code === 'ETIMEDOUT') {
    return { status: 502, message: 'The AI mentor request timed out. Please try again.' };
  }
  if (errorName === 'RateLimitError' || statusCode === 429) {
    return { status: 502, message: 'The AI mentor is temporarily rate limited. Please try again shortly.' };
  }
  if (errorName === 'APIConnectionError' || (typeof statusCode === 'number' && statusCode >= 500)) {
    return { status: 502, message: 'The AI mentor service is currently unavailable. Please try again.' };
  }
  if (typeof statusCode === 'number') {
    return { status: 502, message: 'The AI mentor service could not process this request.' };
  }
  return { status: 500, message: 'An unexpected error occurred while preparing the AI mentor response.' };
}
