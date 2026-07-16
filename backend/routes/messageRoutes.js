const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  markAsSeen,
  reactToMessage,
} = require("../controllers/messageController");

// ======================================
// Message Routes
// ======================================

// Get all messages of a conversation
router.get("/:conversationId", protect, getMessages);

// Send a message
router.post("/:conversationId", protect, sendMessage);

// Edit a message
router.put("/edit/:messageId", protect, editMessage);

// Delete a message
router.delete("/:messageId", protect, deleteMessage);

// Mark message as seen
router.put("/seen/:messageId", protect, markAsSeen);

// React to a message
router.put("/react/:messageId", protect, reactToMessage);

module.exports = router;
