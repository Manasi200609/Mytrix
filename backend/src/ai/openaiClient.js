import OpenAI from 'openai';

/**
 * Thin adapter around the official OpenAI Node SDK. Prompt construction and
 * response formatting deliberately remain outside this transport layer.
 *
 * IMPORTANT: this now supports two providers explicitly, because reusing one
 * Groq-pointed client for a "gpt-5.6" model name was silently wrong — Groq
 * does not serve that model. Pass provider: 'openai' to actually reach
 * OpenAI's real API for GPT-5.6, or leave it as 'groq' for fast/cheap dev
 * iteration. Before submitting, anything that needs to demonstrate real
 * GPT-5.6 usage MUST use provider: 'openai'.
 */
export class OpenAIClient {
  #client;

  constructor({
    provider = process.env.AI_PROVIDER || "openai",
    apiKey,
    timeout = 30_000,
  } = {}) {
    const isOpenAI = provider === 'openai';

    const resolvedApiKey = apiKey ?? (isOpenAI ? process.env.OPENAI_API_KEY : process.env.GROQ_API_KEY);

    if (!resolvedApiKey) {
      const error = new Error(
        isOpenAI
          ? 'OPENAI_API_KEY is not configured on the server.'
          : 'GROQ_API_KEY is not configured on the server.'
      );
      error.code = isOpenAI ? 'OPENAI_API_KEY_MISSING' : 'GROQ_API_KEY_MISSING';
      throw error;
    }

    this.#client = new OpenAI({
      apiKey: resolvedApiKey,
      // Real OpenAI needs no baseURL override — only Groq does, since it's
      // an OpenAI-compatible endpoint, not OpenAI itself.
      ...(isOpenAI ? {} : { baseURL: 'https://api.groq.com/openai/v1' }),
      timeout,
      maxRetries: 0,
    });
  }

  /** Sends prepared mentor instructions and prompt text to the Responses API. */
  async generate({ model, systemPrompt, prompt }) {
    const response = await this.#client.responses.create({
      model,
      instructions: systemPrompt,
      input: prompt,
      // Phase 5 is stateless: do not retain a conversation for follow-up turns.
      store: false,
    });

    if (typeof response.output_text !== 'string') {
      throw new Error('The OpenAI Responses API returned no text output.');
    }

    return response.output_text;
  }
}

// ----------------------------------------------------
// Convenience wrapper — dev-time, fast, cheap, Groq-backed.
// Keep using this for iteration while you're debugging prompts.
// ----------------------------------------------------

export async function askGroq(
  prompt,
  systemPrompt = 'You are an expert software architect.',
  model = 'llama-3.3-70b-versatile'
) {
  const client = new OpenAIClient({ provider: 'groq' });

  return client.generate({
    model,
    systemPrompt,
    prompt,
  });
}

// ----------------------------------------------------
// Real GPT-5.6 wrapper — use this for whatever you submit, since judging
// explicitly requires demonstrated GPT-5.6 usage. Requires OPENAI_API_KEY
// to be set in your .env.
// ----------------------------------------------------

export async function askGpt56(
  prompt,
  systemPrompt = 'You are an expert software architect.'
) {
  const client = new OpenAIClient({ provider: 'openai' });

  return client.generate({
    model: 'gpt-5.6',
    systemPrompt,
    prompt,
  });
}