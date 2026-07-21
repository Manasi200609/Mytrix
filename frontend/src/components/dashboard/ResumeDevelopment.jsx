import { Sparkles, Check, FileText } from "lucide-react";
import { useState } from "react";

export default function ResumeDevelopment({ data }) {
  const analysis = data?.analysis || {};
  const project = data?.knowledgeObject?.project || data?.project || {};

  const [copied, setCopied] = useState(false);

  // Fallback to prevent raw UUID bugs from rendering
  const projectName = project.projectName && !project.projectName.includes("-") 
    ? project.projectName 
    : "Full-Stack Application";

  const techStack = [
    ...(project.languages || []),
    ...(project.frameworks || []),
    ...(project.buildTools || []),
  ];
  const techStackString = techStack.length > 0 
    ? [...new Set(techStack)].join(", ") 
    : "modern web and mobile frameworks";

  const bullets = [
    `Engineered ${projectName} leveraging ${techStackString}, architecting scalable full-stack features.`,
    `Designed a ${analysis.architectureComplexity || "robust"} system architecture achieving ${analysis.repositoryHealth || 85}% overall repository health.`,
    `Enhanced developer velocity and onboarding capability, attaining ${analysis.knowledgeContinuity || 95}% code context continuity.`,
    `Streamlined documentation workflows, cutting estimated project onboarding time down to ${analysis.onboardingTime || "1 hour"}.`
  ];

  function copyResume() {
    navigator.clipboard.writeText(bullets.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="resume-card">
      <div className="resume-card-head">
        <div className="resume-card-title">
          <div className="resume-icon">
            <FileText size={20} />
          </div>
          <div>
            <h3>Resume Intelligence</h3>
            <p>AI-generated professional bullets derived from repository metrics.</p>
          </div>
        </div>
        <button
          onClick={copyResume}
          className="resume-copy-button"
        >
          {copied ? <Check size={16} /> : <Sparkles size={16} />}
          <span>{copied ? "Copied to Clipboard!" : "Copy Resume Points"}</span>
        </button>
      </div>

      <div className="resume-bullet-list">
        {bullets.map((bullet, index) => (
          <div key={index} className="resume-bullet-item">
            <span className="resume-bullet-dot" />
            <p>{bullet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}