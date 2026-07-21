import { useState } from "react";
import {analyzeRepository,
} from "../services/repositoryApi";

export default function useProjectAnalysis() {
  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] = useState(null);

  const [projectId, setProjectId] = useState(null);

  const [error, setError] = useState(null);

  async function analyze(repoUrl) {
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeRepository(
        repoUrl
      );

      setAnalysis(result);

      if (result.projectId) {
        setProjectId(result.projectId);
      }

      return result;
    } catch (err) {
      setError(
        err.message || "Repository analysis failed."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setAnalysis(null);
    setProjectId(null);
    setError(null);
  }

  return {
    loading,
    analysis,
    projectId,
    error,
    analyze,
    reset,
  };
}