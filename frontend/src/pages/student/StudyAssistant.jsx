import { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
} from "lucide-react";

import api from "../../services/api";

export default function StudyAssistant() {
  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function askAssistant(event) {
    event.preventDefault();

    const text = question.trim();

    if (!text || loading) return;

    setQuestion("");
    setError("");

    setMessages((previous) => [
      ...previous,
      {
        role: "student",
        content: text,
      },
    ]);

    setLoading(true);

    try {
      const response = await api.post(
        "/ai/ask",
        {
          question: text,
        }
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            response.data?.answer ||
            response.data?.response ||
            "No answer received.",
        },
      ]);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "The AI assistant could not answer right now."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="role-panel role-ai-panel">
      <div className="role-panel-heading">
        <div>
          <span className="role-eyebrow">
            STUDY SUPPORT
          </span>

          <h2>
            Study Assistant
          </h2>
        </div>

        <Sparkles size={20} />
      </div>

      <p className="role-ai-disclosure">
        Ask questions about your courses,
        marks, attendance, timetable,
        assignments, exams, Python, AI,
        ML and other study topics.
      </p>

      <div
        className="role-ai-chat"
        aria-live="polite"
      >
        {!messages.length && (
          <p className="role-ai-empty">
            <Bot size={18} />

            Ask me something like:
            <br />

            "Explain neural networks."
          </p>
        )}

        {messages.map(
          (message, index) => (
            <p
              key={index}
              className={`role-ai-message is-${message.role}`}
            >
              {message.content}
            </p>
          )
        )}

        {loading && (
          <p className="role-ai-pending">
            Thinking...
          </p>
        )}

        {error && (
          <p
            className="role-feedback is-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      <form
        className="role-ai-form"
        onSubmit={askAssistant}
      >
        <input
          type="text"
          maxLength={2000}
          placeholder="Ask your study assistant..."
          value={question}
          onChange={(event) =>
            setQuestion(
              event.target.value
            )
          }
          disabled={loading}
        />

        <button
          type="submit"
          className="role-submit"
          disabled={
            loading ||
            !question.trim()
          }
          aria-label="Send question"
        >
          <Send size={16} />
        </button>
      </form>
    </section>
  );
}