import { useState } from "react";
import { askMentor } from "../services/mentorApi";

export default function useMentor(projectId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(question) {
    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await askMentor(
        projectId,
        question
      );

      const assistantMessage = {
        role: "assistant",
        content:
          response.answer ||
          "No response received.",
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);

      return response;
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "An error occurred while contacting the AI Mentor.",
        },
      ]);

      throw error;
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
  }

  return {
    messages,
    loading,
    sendMessage,
    clearChat,
  };
}