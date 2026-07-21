import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import RepositoryGraph from "../components/graph/RepositoryGraph";
import GraphToolbar from "../components/graph/GraphToolbar";
import GraphLegend from "../components/graph/GraphLegend";
import NodeInspector from "../components/graph/NodeInspector";

import Spinner from "../components/common/Spinner";
import ErrorState from "../components/common/ErrorState";

import { getProjectMemory } from "../services/repositoryApi";

export default function KnowledgeGraph() {

  const { projectId } = useParams();

  const [graph, setGraph] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    async function loadGraph() {

      try {

        setLoading(true);

        const response = await getProjectMemory(projectId);

        console.log("GRAPH RESPONSE:", response);

        setGraph(response.repositoryGraph);

      } catch (err) {

        console.error(err);

        setError("Unable to load repository graph.");

      } finally {

        setLoading(false);

      }

    }

    if (projectId) {

      loadGraph();

    }

  }, [projectId]);

  if (loading) {

    return <Spinner />;

  }

  if (error) {

    return <ErrorState message={error} />;

  }

  return (

    <div className="dashboard-content">

      <GraphToolbar />

      <RepositoryGraph
        graph={graph}
        onNodeSelect={setSelectedNode}
      />

      <GraphLegend />

      <NodeInspector
        node={selectedNode}
      />

    </div>

  );

}