const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  chatWithAI,
  smartReplies,
  summarizeConversation,
  translate,
  rewrite,
  explain,
} = require("../controllers/aiController");

// ======================================
// AI Chat
// ======================================

router.post("/chat", protect, chatWithAI);

// ======================================
// Smart Replies
// ======================================

router.post("/smart-replies", protect, smartReplies);

// ======================================
// Conversation Summary
// ======================================

router.post("/summary", protect, summarizeConversation);

// ======================================
// Translate Message
// ======================================

router.post("/translate", protect, translate);

// ======================================
// Rewrite Message
// ======================================

router.post("/rewrite", protect, rewrite);

// ======================================
// Explain Code
// ======================================

router.post("/explain-code", protect, explain);

module.exports = router;
