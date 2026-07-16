import { useState } from "react";
import { chatWithAI } from "../../../services/aiService";

import "./AIAssistant.css";

function AIAssistant({ isOpen, onClose }) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleAskAI = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);

      const res = await chatWithAI(prompt);

      setResponse(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-overlay">
      <div className="ai-modal">

        {/* Header */}

        <div className="ai-header">
          <h2>🤖 Gemini AI Assistant</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Input */}

        <textarea
          placeholder="Ask anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          className="ask-btn"
          onClick={handleAskAI}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {/* Response */}

        {response && (
          <div className="ai-response">
            <h4>Response</h4>

            <p>{response}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default AIAssistant;