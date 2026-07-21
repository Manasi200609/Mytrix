import "./HeroCard.css";
import {
  Activity,
  BrainCircuit,
 ShieldCheck,
  ArrowRight
} from "lucide-react";

export default function HeroCard({ data, onContinue }) {
  const analysis = data?.analysis || {};
  const projectName =
  data?.metadata?.repositoryName ||
  data?.knowledgeObject?.project?.projectName ||
  "Project Memory";

  return (
    <section className="hero-card">

      <div className="hero-left">

        <span className="hero-chip">
          Repository Intelligence
        </span>

        <h1>
          {projectName}
        </h1>

        <p>
          {analysis.purpose ||
            "AI-generated understanding of your repository."}
        </p>

        <button type="button" className="hero-button" onClick={onContinue}>
          Continue Exploration
          <ArrowRight size={18} />
        </button>

      </div>

      <div className="hero-right">

        <div className="hero-metric">

          <Activity size={20} />

          <div>

            <h2>
              {analysis.repositoryHealth || 0}
            </h2>

            <span>
              Repository Health
            </span>

          </div>

        </div>

        <div className="hero-metric">

          <BrainCircuit size={20} />

          <div>

            <h2>
              {analysis.knowledgeContinuity || 0}
            </h2>

            <span>
              Knowledge Continuity
            </span>

          </div>

        </div>

        <div className="hero-metric">

          <ShieldCheck size={20} />

          <div>

            <h2>
              {analysis.architectureComplexity || "—"}
            </h2>

            <span>
              Architecture
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}