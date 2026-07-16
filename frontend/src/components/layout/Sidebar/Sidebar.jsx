import { useState } from "react";

import { useConversation } from "../../../features/chat/context/ConversationContext";
import { useAuth } from "../../../features/auth/context/AuthContext";

import NewChatModal from "../../chat/NewChatModal/NewChatModal";

import "./Sidebar.css";

function Sidebar({ onOpenAI }) {
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    loading,
  } = useConversation();

  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);

  const getOtherUser = (conversation) => {
    return conversation.participants.find(
      (participant) => participant._id !== user._id,
    );
  };

  return (
    <>
      <aside className="sidebar">
        {/* Header */}

        <div className="sidebar-header">
          <h3>Chats</h3>

          <button className="new-chat-btn" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg"></i>
            New Chat
          </button>

          <button className="ai-chat-btn" onClick={onOpenAI}>
            <i className="bi bi-robot"></i>
            AI Assistant
          </button>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="sidebar-loading">Loading...</div>
        ) : (
          <div className="conversation-list">
            {conversations.length === 0 ? (
              <div className="empty-conversation">No Conversations Yet</div>
            ) : (
              conversations.map((conversation) => {
                const otherUser = getOtherUser(conversation);

                return (
                  <div
                    key={conversation._id}
                    className={`conversation-card ${
                      selectedConversation?._id === conversation._id
                        ? "active"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="conversation-avatar">
                      {otherUser?.avatar ? (
                        <img
                          src={otherUser.avatar}
                          alt={otherUser.name}
                          className="avatar-image"
                        />
                      ) : (
                        otherUser?.name?.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="conversation-content">
                      <div className="conversation-top">
                        <h4>{otherUser?.name}</h4>

                        <span
                          className={`status-dot ${
                            otherUser?.isOnline ? "online" : "offline"
                          }`}
                        ></span>
                      </div>

                      <p className="conversation-preview">
                        {conversation.lastMessage
                          ? conversation.lastMessage.message
                          : "Start chatting..."}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </aside>

      <NewChatModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

export default Sidebar;
