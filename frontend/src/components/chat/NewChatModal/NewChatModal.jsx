import { useEffect, useState } from "react";

import { searchUsers } from "../../../services/userService";
import { createConversation } from "../../../services/conversationService";

import { useConversation } from "../../../features/chat/context/ConversationContext";

import "./NewChatModal.css";

function NewChatModal({ isOpen, onClose }) {
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    fetchConversations,
    setSelectedConversation,
  } = useConversation();

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const response = await searchUsers(keyword);

        setUsers(response.users);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [keyword, isOpen]);

  const handleCreateConversation = async (userId) => {
    try {
      const response = await createConversation(userId);

      await fetchConversations();

      setSelectedConversation(response.conversation);

      onClose();

    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="new-chat-modal">

        <div className="modal-header">

          <h2>New Chat</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>

        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
          }
        />

        <div className="user-list">

          {loading ? (
            <p>Loading...</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="user-card"
                onClick={() =>
                  handleCreateConversation(user._id)
                }
              >

                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="user-info">

                  <h4>{user.name}</h4>

                  <small>{user.email}</small>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default NewChatModal;