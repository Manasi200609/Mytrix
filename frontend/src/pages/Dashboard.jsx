import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Blocks,
  BookOpenText,
  BrainCircuit,
  FolderTree,
  Layers3,
  Package,
} from "lucide-react";

import HeroCard from "../components/dashboard/HeroCard";
import SummaryCards from "../components/dashboard/SummaryCards";
import StatisticsPanel from "../components/dashboard/StatisticsPanel";
import ResumeDevelopment from "../components/dashboard/ResumeDevelopment";

import DependencyTable from "../components/repository/DependencyTable";
import ReadmeViewer from "../components/repository/ReadmeViewer";
import TechStack from "../components/repository/TechStack";
import EnvironmentVariableList from "../components/repository/EnvironmentVariableList";
import ProjectStructureTree from "../components/repository/ProjectStructureTree";

import Modal from "../components/modals/Modal";

import Spinner from "../components/common/Spinner";
import ErrorState from "../components/common/ErrorState";

import { getProjectMemory } from "../services/repositoryApi";
import "./Dashboard.css";

export default function Dashboard() {

  const { projectId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeExplorer, setActiveExplorer] = useState(null);
  const overviewRef = useRef(null);

  const explorerItems = useMemo(
    () => [
      {
        id: "dependencies",
        title: "Dependencies",
        description: "View all packages and versions",
        icon: Package,
      },
      {
        id: "readme",
        title: "README",
        description: "Open generated documentation",
        icon: BookOpenText,
      },
      {
        id: "tech-stack",
        title: "Tech Stack",
        description: "Frameworks & technologies",
        icon: Layers3,
      },
      {
        id: "architecture",
        title: "Architecture",
        description: "Explore system architecture",
        icon: FolderTree,
      },
      {
        id: "environment",
        title: "Environment",
        description: "Environment variables",
        icon: Blocks,
      },
      {
        id: "developer-memory",
        title: "Developer Memory",
        description: "AI generated repository memory",
        icon: BrainCircuit,
      },
    ],
    []
  );

  useEffect(() => {

    async function loadProject() {

      try {

        setLoading(true);

        const response = await getProjectMemory(projectId);

        setData(response);

      } catch (err) {

        console.error(err);

        setError("Unable to load project.");

      } finally {

        setLoading(false);

      }

    }

    if (projectId) {

      loadProject();

    }

  }, [projectId]);

  if (loading) {

    return <Spinner />;

  }

  if (error) {

    return <ErrorState message={error} />;

  }

  if (!data) {

    return <ErrorState message="No data available." />;

  }

  const analysis = data?.analysis || {};
  const project = data?.knowledgeObject?.project || {};
  const modalTitle =
    explorerItems.find((item) => item.id === activeExplorer)?.title || "";

  function handleContinueExploration() {
    overviewRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function renderExplorerContent() {
    if (activeExplorer === "dependencies") {
      return <DependencyTable data={data} />;
    }

    if (activeExplorer === "readme") {
      return <ReadmeViewer data={data} />;
    }

    if (activeExplorer === "tech-stack") {
      return <TechStack data={data} />;
    }

    if (activeExplorer === "architecture") {
      return (
        <div className="explorer-modal-layout">
          <ProjectStructureTree data={data} />
          <div className="explorer-detail-card">
            <h4>Entry Points</h4>
            {project.entryPoints?.length ? (
              <ul className="explorer-list">
                {project.entryPoints.map((entryPoint) => (
                  <li key={entryPoint}>{entryPoint}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">No entry points detected.</p>
            )}
          </div>
          <div className="explorer-detail-card">
            <h4>Configuration Files</h4>
            {project.configFiles?.length ? (
              <ul className="explorer-list">
                {project.configFiles.map((configFile) => (
                  <li key={configFile}>{configFile}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">No key configuration files detected.</p>
            )}
          </div>
        </div>
      );
    }

    if (activeExplorer === "environment") {
      return <EnvironmentVariableList data={data} />;
    }

    if (activeExplorer === "developer-memory") {
      return (
        <div className="explorer-modal-layout">
          <div className="explorer-detail-card">
            <h4>Project Purpose</h4>
            <p>{analysis.purpose || "No summary generated yet."}</p>
          </div>
          <div className="explorer-detail-card">
            <h4>Architecture Notes</h4>
            <p>{analysis.architecture || "No architecture notes generated yet."}</p>
          </div>
          <div className="explorer-detail-card">
            <h4>Strengths</h4>
            {analysis.strengths?.length ? (
              <ul className="explorer-list">
                {analysis.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">No strengths generated.</p>
            )}
          </div>
          <div className="explorer-detail-card">
            <h4>Risks</h4>
            {analysis.risks?.length ? (
              <ul className="explorer-list">
                {analysis.risks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">No risks generated.</p>
            )}
          </div>
          <div className="explorer-detail-card">
            <h4>Important Files</h4>
            {project.importantFiles?.length ? (
              <ul className="explorer-list">
                {project.importantFiles.map((filePath) => (
                  <li key={filePath}>{filePath}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">No key files were identified yet.</p>
            )}
          </div>
        </div>
      );
    }

    return null;
  }

  return (

<div className="dashboard-content">
 
    <HeroCard data={data} onContinue={handleContinueExploration} />
 
    <div className="dashboard-section" ref={overviewRef}>
 
        <h2 className="section-title">
            Repository Overview
        </h2>

        <SummaryCards data={data} />

        <StatisticsPanel data={data} />

    </div>

    <div className="dashboard-section">

        <h2 className="section-title">
            Repository Explorer
        </h2>

        <div className="explorer-grid">
          {explorerItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                className="explorer-card"
                onClick={() => { console.log('clicked', item.id); setActiveExplorer(item.id); }}
              >
                <div className="explorer-icon">
                  <Icon size={18} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </button>
            );
          })}
        </div>
 
    </div>
 
    <div className="dashboard-section">
      <ResumeDevelopment data={data} />
    </div>

    <Modal
      isOpen={Boolean(activeExplorer)}
      onClose={() => setActiveExplorer(null)}
      title={modalTitle}
    >
      {renderExplorerContent()}
    </Modal>
 
</div>

);
}