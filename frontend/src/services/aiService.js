import api from "./api";

// ======================================
// AI Chat
// ======================================

export const chatWithAI = async (prompt) => {
  const response = await api.post("/ai/chat", {
    prompt,
  });

  return response.data;
};

// ======================================
// Smart Replies
// ======================================

export const getSmartReplies = async (conversation) => {
  const response = await api.post("/ai/smart-replies", {
    conversation,
  });

  return response.data;
};

// ======================================
// Conversation Summary
// ======================================

export const getSummary = async (conversation) => {
  const response = await api.post("/ai/summary", {
    conversation,
  });

  return response.data;
};

// ======================================
// Translate Message
// ======================================

export const translateText = async (text, language) => {
  const response = await api.post("/ai/translate", {
    text,
    language,
  });

  return response.data;
};

// ======================================
// Rewrite Message
// ======================================

export const rewriteText = async (text, tone) => {
  const response = await api.post("/ai/rewrite", {
    text,
    tone,
  });

  return response.data;
};

// ======================================
// Explain Code
// ======================================

export const explainCode = async (code) => {
  const response = await api.post("/ai/explain-code", {
    code,
  });

  return response.data;
};
