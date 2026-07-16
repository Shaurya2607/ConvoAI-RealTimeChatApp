import api from "./api";

// ======================================
// Create Conversation
// ======================================

export const createConversation = async (receiverId) => {
  const response = await api.post("/conversations", {
    receiverId,
  });

  return response.data;
};

// ======================================
// Get All Conversations
// ======================================

export const getConversations = async () => {
  const response = await api.get("/conversations");

  return response.data;
};

// ======================================
// Get Single Conversation
// ======================================

export const getConversationById = async (conversationId) => {
  const response = await api.get(`/conversations/${conversationId}`);

  return response.data;
};
