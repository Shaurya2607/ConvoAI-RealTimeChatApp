const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createConversation,
  getConversations,
  getConversationById,
} = require("../controllers/conversationController");

// ======================================
// Conversation Routes
// ======================================

// Create Conversation
router.post("/", protect, createConversation);

// Get All Conversations
router.get("/", protect, getConversations);

// Get Single Conversation
router.get("/:id", protect, getConversationById);

module.exports = router;
