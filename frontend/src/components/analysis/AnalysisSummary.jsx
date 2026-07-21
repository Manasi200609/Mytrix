import AnalysisCard from "./AnalysisCard";

export default function AnalysisSummary({ analysis }) {

  if (!analysis) {
    return null;
  }

  return (
    <div className="analysis-summary">

      <AnalysisCard
        title="Repository Purpose"
        icon="target"
        description={analysis.purpose}
      />

      <AnalysisCard
        title="Architecture"
        icon="sitemap"
        description={analysis.architecture}
      />

      <AnalysisCard
        title="Strengths"
        icon="circle-check"
      >
        <ul className="analysis-list">
          {(analysis.strengths || []).map((item, index) => (
            <li key={index}>
              {item}
            </li>
          ))}
        </ul>
      </AnalysisCard>

      <AnalysisCard
        title="Weaknesses"
        icon="alert-triangle"
        color="warning"
      >
        <ul className="analysis-list">
          {(analysis.weaknesses || []).map((item, index) => (
            <li key={index}>
              {item}
            </li>
          ))}
        </ul>
      </AnalysisCard>

      <AnalysisCard
        title="Risks"
        icon="shield-x"
        color="danger"
      >
        <ul className="analysis-list">
          {(analysis.risks || []).map((item, index) => (
            <li key={index}>
              {item}
            </li>
          ))}
        </ul>
      </AnalysisCard>

    </div>
  );
}