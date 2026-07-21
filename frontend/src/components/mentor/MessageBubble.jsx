import Card from "../common/Card";

export default function MessageBubble({
  role,
  content,
}) {
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser
          ? "flex-end"
          : "flex-start",
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          width: "fit-content",
        }}
      >
        <Card
          variant={isUser ? "primary" : "default"}
        >
          <div
            style={{
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            {isUser ? "You" : "AI Mentor"}
          </div>

          <div
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
            }}
          >
            {content}
          </div>
        </Card>
      </div>
    </div>
  );
}