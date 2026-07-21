import { useEffect, useMemo, useState } from "react";
import {
  getSavedProjects,
  deleteProject,
} from "../services/storageApi";

export default function useSavedProjects() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  async function loadProjects() {
    setLoading(true);
    setError(null);

    try {
      const result = await getSavedProjects();

      setProjects(result.projects || []);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load saved projects."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function removeProject(projectId) {
    try {
      await deleteProject(projectId);

      setProjects((prev) =>
        prev.filter(
          (project) =>
            project.projectId !== projectId
        )
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete project."
      );
    }
  }

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects;

    const keyword = search.toLowerCase();

    return projects.filter((project) =>
      (
        project.repositoryName ||
        project.projectName ||
        ""
      )
        .toLowerCase()
        .includes(keyword)
    );
  }, [projects, search]);

  return {
    loading,

    error,

    projects: filteredProjects,

    search,

    setSearch,

    refresh: loadProjects,

    removeProject,
  };
}