import { useState } from "react";
import { Send } from "lucide-react";
import "./ChatInput.css";

export default function ChatInput({
  onSend,
  loading = false,
}) {
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const text = message.trim();

    if (!text || loading) return;

    onSend(text);
    setMessage("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mentor-input-container"
    >
      <input
        type="text"
        className="mentor-input"
        placeholder="Ask about architecture, APIs, authentication..."
        value={message}
        disabled={loading}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        type="submit"
        className="mentor-send"
        disabled={!message.trim() || loading}
      >
        <Send size={18} />
      </button>
    </form>
  );
}