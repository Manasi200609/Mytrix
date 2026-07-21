import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../common/Button";
import Card from "../common/Card";

import { analyzeRepository } from "../../services/repositoryApi";

import "./RepositoryInput.css";

export default function RepositoryInput() {

  const navigate = useNavigate();

  const [repoUrl, setRepoUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(e) {

    e.preventDefault();

    setError("");

    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    try {

      setLoading(true);

      const result = await analyzeRepository(repoUrl);

      navigate(`/dashboard/${result.projectId}`);

    }

    catch (err) {

      setError(
        err.message ||
        "Repository analysis failed."
      );

    }

    finally {

      setLoading(false);

    }

  }

  return (

    <Card className="repository-input-card">

      <h2>Analyze a Repository</h2>

      <form onSubmit={handleSubmit}>

        <input

          type="text"

          placeholder="https://github.com/user/repository"

          value={repoUrl}

          onChange={(e) => setRepoUrl(e.target.value)}

          disabled={loading}

        />

        {error && (

          <p className="repository-error">

            {error}

          </p>

        )}

        <Button

          type="submit"

          disabled={loading}

        >

          {loading
            ? "Analyzing Repository..."
            : "Analyze Repository"}

        </Button>

      </form>

    </Card>

  );

}