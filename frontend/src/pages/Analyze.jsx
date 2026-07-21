import { useState } from "react";

import RepositoryInput from "../components/analysis/RepositoryInput";
import AnalysisSummary from "../components/analysis/AnalysisSummary";
import ProgressTimeline from "../components/analysis/ProgressTimeline";

export default function Analyze() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="page">

      <div className="dashboard-content">

        <RepositoryInput
          loading={loading}
          setLoading={setLoading}
          onComplete={setAnalysis}
        />

        {analysis && (
          <>
            <AnalysisSummary analysis={analysis} />

            <ProgressTimeline analysis={analysis} />
          </>
        )}

      </div>

    </div>
  );
}