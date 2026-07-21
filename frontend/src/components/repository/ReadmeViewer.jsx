import Card from "../common/Card";

export default function ReadmeViewer({ data }) {

  const readme =
    data?.knowledgeObject?.project?.readme || "";

  return (

    <Card>

      <div className="card-heading">
        <i className="ti ti-book"></i>
        <span>README Preview</span>
      </div>

      {readme ? (

        <pre
          className="readme-preview"
        >
          {readme}
        </pre>

      ) : (

        <p className="muted">
          No README found in this repository.
        </p>

      )}

    </Card>

  );

}