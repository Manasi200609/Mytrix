import { Target, Network, ThumbsUp, AlertTriangle } from "lucide-react";

export default function SummaryCards({ data }) {
  const analysis = data?.analysis || {};

  const strengths = analysis.strengths || [
    "Utilizes modular and well-maintained component frameworks",
    "Employs clear separation of concerns across service layers",
    "Scalable database structure optimized for queries"
  ];

  const risks = analysis.risks || [
    "High density of inter-file dependencies may introduce tight coupling",
    "Environment variable security configs require strict validation"
  ];

  return (
    <div className="overview-grid">
      <div className="overview-card">
        <div className="overview-card-head">
          <div className="overview-card-icon overview-card-icon--blue">
            <Target size={18} />
          </div>
          <h3>Project Purpose</h3>
        </div>
        <p>
          {analysis.purpose ||
            "AI-driven architecture analysis platform built to streamline code maintainability, context understanding, and developer onboarding."}
        </p>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <div className="overview-card-icon overview-card-icon--purple">
            <Network size={18} />
          </div>
          <h3>System Architecture</h3>
        </div>
        <p>
          {analysis.architecture ||
            "Modular microservices configuration with a decoupled frontend and scalable backend API pipeline."}
        </p>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <div className="overview-card-icon overview-card-icon--green">
            <ThumbsUp size={18} />
          </div>
          <h3>Repository Strengths</h3>
        </div>
        <div className="overview-tags">
          {strengths.map((item, index) => (
            <span key={index} className="overview-tag overview-tag--green">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <div className="overview-card-icon overview-card-icon--rose">
            <AlertTriangle size={18} />
          </div>
          <h3>Potential Risks</h3>
        </div>
        <div className="overview-tags">
          {risks.map((item, index) => (
            <span key={index} className="overview-tag overview-tag--rose">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}