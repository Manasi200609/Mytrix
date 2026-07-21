import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SearchBar from "../components/common/SearchBar";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import Badge from "../components/common/Badge";

import { getSavedProjects } from "../services/storageApi";

export default function SavedProjects() {

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadProjects() {

      try {

        const response = await getSavedProjects();

        console.log(response);

        const list = response || [];

        setProjects(list);

        setFilteredProjects(list);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    }

    loadProjects();

  }, []);

  function handleSearch(value) {

    if (!value.trim()) {

      setFilteredProjects(projects);

      return;

    }

    const filtered = projects.filter(project =>
      project.repository
        ?.toLowerCase()
        .includes(value.toLowerCase())
    );

    setFilteredProjects(filtered);

  }

  if (loading) {

    return <Spinner />;

  }

  return (

    <div className="dashboard-content">

      <SearchBar
        placeholder="Search repositories..."
        onSearch={handleSearch}
      />

      {filteredProjects.length === 0 ? (

        <EmptyState
          title="No Saved Projects"
          description="Analyze your first repository to see it here."
        />

      ) : (

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(340px,1fr))",
            gap: "22px"
          }}
        >

          {filteredProjects.map(project => (

            <div
              key={project.projectId}
              className="card"
            >

              <h3
                style={{
                  marginBottom: "10px"
                }}
              >
                {project.repository}
              </h3>

              <p
                className="muted"
                style={{
                  marginBottom: "18px"
                }}
              >
                {project.branch}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "20px"
                }}
              >

                <Badge type="success">
                  Health {project.analysis?.repositoryHealth ?? "--"}%
                </Badge>

                <Badge type="primary">
                  Knowledge {project.analysis?.knowledgeContinuity ?? "--"}%
                </Badge>

                <Badge type="warning">
                  {project.analysis?.architectureComplexity ?? "Unknown"}
                </Badge>

              </div>

              <p
                className="muted"
                style={{
                  marginBottom: "20px"
                }}
              >
                ⏱ Onboarding Time:{" "}
                {project.analysis?.onboardingTime ?? "--"}
              </p>

              <Link
                to={`/dashboard/${project.projectId}`}
                style={{
                  display: "inline-block",
                  background: "#f5a623",
                  color: "#111",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 600
                }}
              >
                Open Dashboard →
              </Link>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}