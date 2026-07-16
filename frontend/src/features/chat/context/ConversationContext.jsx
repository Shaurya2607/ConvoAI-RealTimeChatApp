import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getConversations,
} from "../../../services/conversationService";

import {
  getMessages,
  sendMessage,
  markAsSeen,
  editMessage,
  deleteMessage,
  reactToMessage,
} from "../../../services/messageService";

import { useSocket } from "./SocketContext";
import { useAuth } from "../../auth/context/AuthContext";

const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const { socket } = useSocket();
  const { isAuthenticated, user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================
  // Fetch Conversations
  // ==========================

  const fetchConversations = async () => {
    try {
      setLoading(true);

      const response = await getConversations();

      setConversations(response.conversations);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Fetch Messages
  // ==========================

  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;

    try {
      setLoading(true);

      const response = await getMessages(conversationId);

      setMessages(response.data);

      // Automatically mark unread messages as seen
      response.data.forEach(async (msg) => {
        if (
          msg.sender._id !== user._id &&
          !msg.seen
        ) {
          await markAsSeen(msg._id);

          socket?.emit("messageSeen", {
            conversationId,
            messageId: msg._id,
          });
        }
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Send Message
  // ==========================

  const sendNewMessage = async (
    conversationId,
    messageData
  ) => {
    try {
      const response = await sendMessage(
        conversationId,
        messageData
      );

      setMessages((prev) => [...prev, response.data]);

      socket?.emit("sendMessage", response.data);

      fetchConversations();

      return response.data;

    } catch (error) {
      console.error(error);
    }
  };

  // ==========================
  // Edit Message
  // ==========================

  const updateMessage = async (
    messageId,
    message
  ) => {
    try {
      const response = await editMessage(
        messageId,
        message
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? response.data
            : msg
        )
      );

      return response.data;

    } catch (error) {
      console.error(error);
    }
  };

  // ==========================
  // Delete Message
  // ==========================

  const removeMessage = async (
    messageId
  ) => {
    try {
      await deleteMessage(messageId);

      setMessages((prev) =>
        prev.filter(
          (msg) => msg._id !== messageId
        )
      );

    } catch (error) {
      console.error(error);
    }
  };

  // ==========================
  // React To Message
  // ==========================

  const reactMessage = async (
    messageId,
    emoji
  ) => {
    try {
      const response = await reactToMessage(
        messageId,
        emoji
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? response.data
            : msg
        )
      );

    } catch (error) {
      console.error(error);
    }
  };

  // ==========================
  // Initial Conversations
  // ==========================

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    } else {
      setConversations([]);
      setSelectedConversation(null);
      setMessages([]);
    }
  }, [isAuthenticated]);

  // ==========================
  // Conversation Change
  // ==========================

  useEffect(() => {
    if (!selectedConversation) return;

    fetchMessages(selectedConversation._id);

    socket?.emit(
      "joinConversation",
      selectedConversation._id
    );

    return () => {
      socket?.emit(
        "leaveConversation",
        selectedConversation._id
      );
    };

  }, [selectedConversation]);

  // ==========================
// Socket Events
// ==========================

useEffect(() => {
  if (!socket) return;

  // --------------------------
  // Receive New Message
  // --------------------------

  const handleReceiveMessage = (message) => {
    setMessages((prev) => [...prev, message]);

    fetchConversations();
  };

  // --------------------------
  // Read Receipt
  // --------------------------

  const handleMessageSeen = ({ messageId }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId
          ? {
              ...msg,
              seen: true,
            }
          : msg
      )
    );
  };

  // --------------------------
  // Edited Message
  // --------------------------

  const handleMessageEdited = (updatedMessage) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === updatedMessage._id
          ? updatedMessage
          : msg
      )
    );
  };

  // --------------------------
  // Deleted Message
  // --------------------------

  const handleMessageDeleted = ({ messageId }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId
          ? {
              ...msg,
              isDeleted: true,
            }
          : msg
      )
    );
  };

  // --------------------------
  // Emoji Reaction
  // --------------------------

  const handleMessageReaction = (updatedMessage) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === updatedMessage._id
          ? updatedMessage
          : msg
      )
    );
  };

  socket.on("receiveMessage", handleReceiveMessage);
  socket.on("messageSeen", handleMessageSeen);
  socket.on("messageEdited", handleMessageEdited);
  socket.on("messageDeleted", handleMessageDeleted);
  socket.on("messageReaction", handleMessageReaction);

  return () => {
    socket.off("receiveMessage", handleReceiveMessage);
    socket.off("messageSeen", handleMessageSeen);
    socket.off("messageEdited", handleMessageEdited);
    socket.off("messageDeleted", handleMessageDeleted);
    socket.off("messageReaction", handleMessageReaction);
  };
}, [socket]);

  return (
    <ConversationContext.Provider
      value={{
        loading,

        conversations,
        setConversations,

        selectedConversation,
        setSelectedConversation,

        messages,
        setMessages,

        fetchConversations,
        fetchMessages,

        sendNewMessage,

        updateMessage,

        removeMessage,

        reactMessage,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () =>
  useContext(ConversationContext);