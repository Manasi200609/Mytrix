import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ChatWindow from "../components/mentor/ChatWindow";
import ChatInput from "../components/mentor/ChatInput";
import LearningSteps from "../components/mentor/LearningSteps";
import RecommendedFiles from "../components/mentor/RecommendedFiles";
import Spinner from "../components/common/Spinner";
import ErrorState from "../components/common/ErrorState";

import { askMentor } from "../services/mentorApi";
import { getProjectMemory } from "../services/repositoryApi";

export default function Mentor() {
  const { projectId } = useParams();

  // The mentor endpoint needs the full knowledgeObject + repositoryGraph on
  // every request, not just a projectId — fetch it once on mount, the same
  // data Dashboard/KnowledgeGraph already pull from this endpoint.
  const [projectData, setProjectData] = useState(null);
  const [loadError, setLoadError] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI Project Mentor. Ask me anything about this repository.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProjectMemory(projectId)
      .then((res) => { if (!cancelled) setProjectData(res); })
      .catch((err) => { if (!cancelled) setLoadError(err.message || "Failed to load project."); });
    return () => { cancelled = true; };
  }, [projectId]);

  async function handleSend(message) {
    if (!message.trim() || !projectData) return;

    const updatedMessages = [...messages, { role: "user", content: message }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await askMentor({
        knowledgeObject: projectData.knowledgeObject,
        repositoryGraph: projectData.repositoryGraph,
        question: message,
      });

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: response?.explanation || response?.summary || "I couldn't generate an answer." },
      ]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Something went wrong while contacting the AI Mentor." },
      ]);
    }

    setLoading(false);
  }

  if (loadError) return <ErrorState message={loadError} onRetry={() => window.location.reload()} />;
  if (!projectData) return <div className="page page--centered"><Spinner /></div>;

  return (
    <div className="dashboard-content">
      <ChatWindow messages={messages} loading={loading} />
      <ChatInput onSend={handleSend} disabled={loading || !projectData} />

      <div className="dashboard-grid-secondary">
        <LearningSteps data={projectData.analysis} />
        <RecommendedFiles data={projectData.analysis} />
      </div>
    </div>
  );
}