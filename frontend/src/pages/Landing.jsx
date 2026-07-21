import { useState } from "react";
import { useNavigate } from "react-router-dom";

import RepositoryInput from "../components/analysis/RepositoryInput";
import logo from "../assets/logo.png"; // Ensure the logo is imported correctly

import "./Landing.css";

export default function Landing() {

  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);

  const handleAnalysisComplete = (result) => {

    console.log("Analysis Complete:", result);

    setAnalysis(result);

    if (result?.metadata?.projectId) {

      navigate(`/dashboard/${result.metadata.projectId}`);

    }

  };

  return (

    <div className="landing">

      <section className="hero">

        <div className="hero-content">

        <img
  src={logo}
  alt="Mytrix"
  className="landing-logo"
/>

<h1 className="hero-slogan">
  Turn repositories into intelligence
</h1>
<p className="hero-description">
  AI-powered codebase analysis that understands architecture,
  dependencies, and developer intent.
</p>

          <RepositoryInput
            onComplete={handleAnalysisComplete}
          />

          <p className="hero-note">

            Supports any public GitHub repository.

          </p>

          <div className="hero-links">

            <a
              href="https://github.com/facebook/react"
              target="_blank"
              rel="noreferrer"
            >
              facebook/react
            </a>

            <a
              href="https://github.com/vercel/next.js"
              target="_blank"
              rel="noreferrer"
            >
              vercel/next.js
            </a>

            <a
              href="https://github.com/microsoft/vscode"
              target="_blank"
              rel="noreferrer"
            >
              microsoft/vscode
            </a>

          </div>

        </div>

      </section>

    </div>

  );

}