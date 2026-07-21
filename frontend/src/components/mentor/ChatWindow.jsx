import MessageBubble from "./MessageBubble";
import Card from "../common/Card";

export default function ChatWindow({
  messages = [],
  loading = false,
}) {
  return (
    <Card>
      <div
        style={{
          height: "550px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "10px",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#6b7280",
              marginTop: "120px",
            }}
          >
            <h3>AI Mentor</h3>

            <p>
              Ask anything about your repository.
            </p>

            <p style={{ marginTop: "16px" }}>
              Examples:
            </p>

            <ul
              style={{
                textAlign: "left",
                display: "inline-block",
                marginTop: "10px",
              }}
            >
              <li>Explain the authentication flow</li>
              <li>How does the backend work?</li>
              <li>Where is JWT created?</li>
              <li>Which file should I learn first?</li>
              <li>Explain this project to me.</li>
            </ul>
          </div>
        )}

        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}

        {loading && (
          <MessageBubble
            role="assistant"
            content="Thinking..."
          />
        )}
      </div>
    </Card>
  );
}