const {
  generateResponse,
  generateSmartReplies,
  generateSummary,
  translateMessage,
  rewriteMessage,
  explainCode,
} = require("../services/geminiService");

// ======================================
// AI Chat
// ======================================

const chatWithAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const response = await generateResponse(prompt);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Smart Replies
// ======================================

const smartReplies = async (req, res) => {
  try {
    const { conversation } = req.body;

    if (!conversation) {
      return res.status(400).json({
        success: false,
        message: "Conversation is required",
      });
    }

    const replies = await generateSmartReplies(conversation);

    res.status(200).json({
      success: true,
      data: replies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Conversation Summary
// ======================================

const summarizeConversation = async (req, res) => {
  try {
    const { conversation } = req.body;

    if (!conversation) {
      return res.status(400).json({
        success: false,
        message: "Conversation is required",
      });
    }

    const summary = await generateSummary(conversation);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Translate
// ======================================

const translate = async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text || !language) {
      return res.status(400).json({
        success: false,
        message: "Text and language are required",
      });
    }

    const translated = await translateMessage(text, language);

    res.status(200).json({
      success: true,
      data: translated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Rewrite
// ======================================

const rewrite = async (req, res) => {
  try {
    const { text, tone } = req.body;

    if (!text || !tone) {
      return res.status(400).json({
        success: false,
        message: "Text and tone are required",
      });
    }

    const rewritten = await rewriteMessage(text, tone);

    res.status(200).json({
      success: true,
      data: rewritten,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Explain Code
// ======================================

const explain = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code is required",
      });
    }

    const explanation = await explainCode(code);

    res.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    console.error("AI Chat Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  chatWithAI,
  smartReplies,
  summarizeConversation,
  translate,
  rewrite,
  explain,
};
