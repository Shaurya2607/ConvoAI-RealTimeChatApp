import { useState } from "react";
import { chatWithAI } from "../../../services/aiService";
import "./AIAssistant.css";

function AIAssistant() {
  const [prompt, setPrompt] = useState("");

  const [response, setResponse] = useState("");

  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Summarize this conversation",
    "Explain the last message",
    "Translate to Hindi",
    "Generate a reply",
  ];

  const handleAskAI = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);

      const res = await chatWithAI(prompt);

      setResponse(res.data);

      setPrompt("");
    } catch (error) {
      console.error(error);

      setResponse("❌ Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="ai-panel">
      <div className="ai-header">
        <h3>🤖 AI Assistant</h3>

        <p>Your personal chat assistant</p>
      </div>

      <div className="ai-suggestions">
        {suggestions.map((item, index) => (
          <button
            key={index}
            className="suggestion-btn"
            onClick={() => setPrompt(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="ai-response">
        <div className="response-card">
          <h4>AI Response</h4>

          {loading ? (
            <p>Thinking...</p>
          ) : response ? (
            <p>{response}</p>
          ) : (
            <p>Your AI response will appear here after you ask a question.</p>
          )}
        </div>
      </div>

      <div className="ai-input">
        <textarea
          rows="4"
          placeholder="Ask anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          className="ask-ai-btn"
          onClick={handleAskAI}
          disabled={loading}
        >
          <i className="bi bi-stars"></i>

          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>
    </aside>
  );
}

export default AIAssistant;