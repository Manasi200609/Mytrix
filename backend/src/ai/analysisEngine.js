import { scoreRepository } from "./scoringEngine.js";
import { buildRepositoryContext } from "./contextBuilder.js";
import { buildAnalysisPrompt } from "./analysisPrompt.js";
import { OpenAIClient } from "./openaiClient.js";
import { systemPrompt } from "./systemPrompt.js";
import { repositoryAnalysisSystemPrompt } from "./systemPrompt.js";

export async function analyzeRepositoryAI(
  knowledgeObject,
  repositoryGraph
) {

  // -----------------------------
  // Deterministic scores
  // -----------------------------

  const scores = scoreRepository(knowledgeObject);

  // -----------------------------
  // Build compact repository context
  // -----------------------------

  const context = buildRepositoryContext(
    knowledgeObject,
    repositoryGraph
  );

  // -----------------------------
  // Build LLM Prompt
  // -----------------------------

  const prompt = buildAnalysisPrompt(
    JSON.stringify(context, null, 2)
  );

  // -----------------------------
  // Ask Groq
  // -----------------------------
const modelClient = new OpenAIClient({
    provider: process.env.AI_PROVIDER,
});

const response = await modelClient.generate({
    model: "gpt-5.6",
    systemPrompt: systemPrompt,
    systemPrompt: repositoryAnalysisSystemPrompt,
    prompt,
});

  let analysis;

  try {

    const match = response.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON found");
    }

    analysis = JSON.parse(match[0]);

  } catch (error) {

    console.error("JSON PARSE FAILED:");
    console.error(error);

    analysis = {
      purpose: "",
      architecture: "",
      strengths: [],
      weaknesses: [],
      risks: []
    };

  }

  // -----------------------------
  // Lightweight grounding check (visibility only — does not block or retry).
  // Flags any claim that doesn't mention at least one real term from the
  // context, so you can see in the logs whether the model is actually citing
  // evidence or falling back to generic filler.
  // -----------------------------

  logGroundingWarnings(analysis, context);

  // -----------------------------
  // Merge Scores + AI Analysis
  // -----------------------------

  return {

    repositoryHealth:
      scores.repositoryHealth,

    knowledgeContinuity:
      scores.knowledgeContinuity,

    architectureComplexity:
      scores.architectureComplexity,

    onboardingTime:
      scores.onboardingTime,

    purpose:
      analysis.purpose,

    architecture:
      analysis.architecture,

    strengths:
      analysis.strengths,

    weaknesses:
      analysis.weaknesses,

    risks:
      analysis.risks

  };

}

function logGroundingWarnings(analysis, context) {
  const evidenceTerms = collectEvidenceTerms(context);

  const checkField = (label, value) => {
    const strings = Array.isArray(value) ? value : [value];
    strings.forEach((text) => {
      if (typeof text !== "string" || !text.trim()) return;
      const isGrounded = evidenceTerms.some((term) =>
        term && text.toLowerCase().includes(term.toLowerCase())
      );
      if (!isGrounded) {
        console.warn(
          `[grounding-check] "${label}" claim has no detectable evidence reference: "${text}"`
        );
      }
    });
  };

  checkField("purpose", analysis.purpose);
  checkField("architecture", analysis.architecture);
  checkField("strengths", analysis.strengths);
  checkField("weaknesses", analysis.weaknesses);
  checkField("risks", analysis.risks);
}

function collectEvidenceTerms(context) {
  return [
    ...(context.entryPoints ?? []),
    ...(context.configurationFiles ?? []),
    ...(context.importantFiles ?? []),
    ...(context.technologies?.languages ?? []),
    ...(context.technologies?.frameworks ?? []),
    ...(context.dependencies ?? []).map((dep) => dep.name),
  ].filter(Boolean);
}