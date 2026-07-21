import Card from "../common/Card";
import Badge from "../common/Badge";

export default function LearningSteps({
  steps = [],
}) {
  return (
    <Card>
      <h3 style={{ marginBottom: "20px" }}>
        Learning Roadmap
      </h3>

      {steps.length === 0 ? (
        <p
          style={{
            color: "#6b7280",
          }}
        >
          Ask the AI Mentor to generate a learning roadmap.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
              }}
            >
              <Badge>
                {index + 1}
              </Badge>

              <div>
                <h4
                  style={{
                    margin: 0,
                  }}
                >
                  {step.title}
                </h4>

                <p
                  style={{
                    marginTop: "6px",
                    color: "#6b7280",
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}