import api from "./api";

// ======================================
// Send Message
// ======================================

export const sendMessage = async (conversationId, messageData) => {
  const response = await api.post(`/messages/${conversationId}`, messageData);

  return response.data;
};

// ======================================
// Get Messages
// ======================================

export const getMessages = async (conversationId) => {
  const response = await api.get(`/messages/${conversationId}`);

  return response.data;
};

// ======================================
// Edit Message
// ======================================

export const editMessage = async (messageId, updatedMessage) => {
  const response = await api.put(`/messages/edit/${messageId}`, {
    message: updatedMessage,
  });

  return response.data;
};

// ======================================
// Delete Message
// ======================================

export const deleteMessage = async (messageId) => {
  const response = await api.delete(`/messages/${messageId}`);

  return response.data;
};

// ======================================
// Mark Message as Seen
// ======================================

export const markAsSeen = async (messageId) => {
  const response = await api.put(`/messages/seen/${messageId}`);

  return response.data;
};

// ======================================
// React To Message
// ======================================

export const reactToMessage = async (messageId, emoji) => {
  const response = await api.put(`/messages/react/${messageId}`, {
    emoji,
  });

  return response.data;
};
