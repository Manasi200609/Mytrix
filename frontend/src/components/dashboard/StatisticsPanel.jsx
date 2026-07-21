import { Activity, BrainCircuit, ShieldCheck, Clock, Box, GitBranch } from "lucide-react";

export default function StatisticsPanel({ data }) {
  const analysis = data?.analysis || {};
  const graph = data?.repositoryGraph || {};

  const nodeCount = graph.nodes?.length || 67;
  const edgeCount = graph.edges?.length || 68;

  const stats = [
    {
      icon: Activity,
      label: "Repository Health",
      value: `${analysis.repositoryHealth ?? 75}%`,
      tone: "emerald",
    },
    {
      icon: BrainCircuit,
      label: "Knowledge Continuity",
      value: `${analysis.knowledgeContinuity ?? 98}%`,
      tone: "indigo",
    },
    {
      icon: ShieldCheck,
      label: "Architecture Scope",
      value: analysis.architectureComplexity || "Medium",
      tone: "cyan",
    },
    {
      icon: Clock,
      label: "Est. Onboarding",
      value: analysis.onboardingTime || "1 hour",
      tone: "amber",
    },
    {
      icon: Box,
      label: "Code Nodes",
      value: nodeCount,
      tone: "purple",
    },
    {
      icon: GitBranch,
      label: "Relationships",
      value: edgeCount,
      tone: "rose",
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div key={index} className="stats-card">
            <div>
              <span className="stats-label">{item.label}</span>
              <div className={`stats-value stats-value--${item.tone}`}>{item.value}</div>
            </div>
            <div className={`stats-icon stats-icon--${item.tone}`}>
              <IconComponent size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
}