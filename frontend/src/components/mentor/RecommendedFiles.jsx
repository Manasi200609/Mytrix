import Card from "../common/Card";
import Badge from "../common/Badge";

export default function RecommendedFiles({
  files = [],
}) {
  return (
    <Card>
      <h3 style={{ marginBottom: "20px" }}>
        Recommended Files
      </h3>

      {files.length === 0 ? (
        <p
          style={{
            color: "#6b7280",
          }}
        >
          The AI Mentor will recommend files while answering your questions.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {files.map((file, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  {file.name}
                </div>

                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  {file.reason}
                </div>
              </div>

              <Badge>
                {file.type || "File"}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}