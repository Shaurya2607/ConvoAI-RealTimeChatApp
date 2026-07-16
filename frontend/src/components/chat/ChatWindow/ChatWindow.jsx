import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useConversation } from "../../../features/chat/context/ConversationContext";
import { useSocket } from "../../../features/chat/context/SocketContext";
import { useAuth } from "../../../features/auth/context/AuthContext";
import { uploadFile } from "../../../services/uploadService";

import "./ChatWindow.css";

function ChatWindow() {
  const { selectedConversation, messages, sendNewMessage } = useConversation();

  const { socket, typingUser, isUserOnline } = useSocket();

  const { user } = useAuth();

  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // ===============================
  // Auto Scroll
  // ===============================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ===============================
  // Send Message
  // ===============================

  const handleSend = async () => {
    if (!message.trim()) return;

    if (!selectedConversation) return;

    await sendNewMessage(selectedConversation._id, {
      message: message.trim(),
      messageType: "text",
    });

    setMessage("");

    socket?.emit("stopTyping", selectedConversation._id);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      const response = await uploadFile(file);

      const fileData = response.data;

      let messageType = "document";

      if (file.type.startsWith("image/")) {
        messageType = "image";
      } else if (file.type.startsWith("video/")) {
        messageType = "video";
      } else if (file.type.startsWith("audio/")) {
        messageType = "audio";
      }

      await sendNewMessage(selectedConversation._id, {
        message: fileData.fileName,
        messageType,
        fileUrl: fileData.fileUrl,
        fileName: fileData.fileName,
      });
    } catch (error) {
      console.error(error);
      alert("File upload failed.");
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  // ===============================
  // Typing
  // ===============================

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!selectedConversation || !socket) return;

    socket.emit("typing", selectedConversation._id);

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", selectedConversation._id);
    }, 1000);
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  // ===============================
  // No Conversation Selected
  // ===============================

  if (!selectedConversation) {
    return (
      <div className="chat-window empty-chat">
        <div className="empty-chat-content">
          <i className="bi bi-chat-dots"></i>

          <h2>Select a Conversation</h2>

          <p>Choose a conversation from the sidebar to start chatting.</p>
        </div>
      </div>
    );
  }

  // ===============================
  // Get Other User
  // ===============================

  const otherUser = selectedConversation.participants.find(
    (participant) => participant._id !== user._id,
  );

  return (
    <div className="chat-window">
      {/* ================= Header ================= */}

      <div className="chat-header">
        <div className="chat-user">
          <div className="chat-avatar">
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

          <div>
            <h4>{otherUser?.name}</h4>

            <small>
              {isUserOnline(otherUser?._id)
                ? "🟢 Online"
                : otherUser?.lastSeen
                  ? `Last seen ${new Date(
                      otherUser.lastSeen,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Offline"}
            </small>
          </div>
        </div>

        <div className="chat-actions">
          <button>
            <i className="bi bi-telephone"></i>
          </button>

          <button>
            <i className="bi bi-camera-video"></i>
          </button>

          <div className="menu-wrapper">
            <button onClick={() => setShowMenu(!showMenu)}>
              <i className="bi bi-three-dots-vertical"></i>
            </button>

            {showMenu && (
              <div className="chat-menu">
                <button onClick={() => alert("Profile feature coming soon")}>
                  👤 View Profile
                </button>

                <button onClick={() => alert("Clear Chat feature coming soon")}>
                  🗑️ Clear Chat
                </button>

                <button
                  onClick={() =>
                    alert("Delete Conversation feature coming soon")
                  }
                >
                  ❌ Delete Conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= Messages ================= */}

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={msg.sender._id === user._id ? "message own" : "message"}
          >
            <div className="message-bubble">
              {/* Reply Preview */}

              {msg.replyTo && (
                <div className="reply-preview">
                  <small>Replying to</small>

                  <p>{msg.replyTo.message}</p>
                </div>
              )}

              {/* Deleted Message */}

              {msg.isDeleted ? (
                <p className="deleted-message">
                  <i className="bi bi-trash"></i> This message was deleted
                </p>
              ) : (
                <>
                  {/* Message */}

                  <p>{msg.message}</p>

                  {/* File */}

                  {msg.fileUrl && (
                    <>
                      {msg.messageType === "image" ? (
                        <img
                          src={msg.fileUrl}
                          alt={msg.fileName}
                          className="chat-image"
                        />
                      ) : (
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="file-link"
                        >
                          📎 {msg.fileName}
                        </a>
                      )}
                    </>
                  )}

                  {/* Emoji Reactions */}

                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="reaction-container">
                      {msg.reactions.map((reaction, index) => (
                        <span key={index}>{reaction.emoji}</span>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Footer */}

              <div className="message-footer">
                {msg.isEdited && <small className="edited-label">Edited</small>}

                <span className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {/* Read Receipt */}

                {msg.sender._id === user._id && (
                  <span className="message-status">
                    {msg.seen ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* ================= Typing Indicator ================= */}

      {typingUser && typingUser.userId !== user._id && (
        <div className="typing-indicator">{typingUser.name} is typing...</div>
      )}

      {/* ================= Input ================= */}

      <div className="chat-input">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />

        <button
          className="icon-button"
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
        >
          {uploading ? (
            <i className="bi bi-arrow-repeat"></i>
          ) : (
            <i className="bi bi-paperclip"></i>
          )}
        </button>

        <div className="emoji-wrapper">
          <button
            className="icon-button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <i className="bi bi-emoji-smile"></i>
          </button>

          {showEmojiPicker && (
            <div className="emoji-picker">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={320}
                height={400}
              />
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={handleTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button className="icon-button">
          <i className="bi bi-mic-fill"></i>
        </button>

        <button className="send-button" onClick={handleSend}>
          <i className="bi bi-send-fill"></i>
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
