export function buildAnalysisPrompt(context) {
  return `
You are an expert Software Architect analyzing a real, specific repository.

Analyze the repository using ONLY the supplied context below. Do not use outside
knowledge about frameworks or common patterns unless it is directly tied to something
present in this context.

GROUNDING RULE (critical):
Every sentence in "purpose", "architecture", and every entry in "strengths",
"weaknesses", and "risks" MUST explicitly name at least one real, specific item taken
verbatim from the context — a file path (from entryPoints, configurationFiles, or
importantFiles), a dependency name, a framework name, a language, or a phrase quoted
from the README excerpt. Do not write a generic statement that could describe any
project using a similar tech stack. If you cannot tie a claim to something specific in
the context, omit that claim rather than write it vaguely.

BAD (generic, no grounding — do not do this):
"Utilizes a popular and well-maintained tech stack"
"Employs a robust backend framework for handling server-side logic"

GOOD (grounded — do this):
"Built on Express (see package.json dependencies) with entry point server.js handling
routing"
"No test files detected in importantFiles — testingFrameworks is empty, so regression
risk on changes is unverified"

Return ONLY valid JSON. No markdown fences, no commentary outside the JSON.

Format:

{
  "purpose":"",
  "architecture":"",
  "strengths":[
      "",
      "",
      ""
  ],
  "weaknesses":[
      "",
      "",
      ""
  ],
  "risks":[
      "",
      "",
      ""
  ]
}

Repository Context

${context}
`;
}