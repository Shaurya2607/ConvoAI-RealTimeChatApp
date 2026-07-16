const Conversation = require("../models/Conversation");
const User = require("../models/User");

// ======================================
// Create or Get Conversation
// ======================================

const createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot chat with yourself",
      });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: {
        $all: [req.user.id, receiverId],
        $size: 2,
      },
    })
      .populate("participants", "name email avatar isOnline")
      .populate("lastMessage");

    if (conversation) {
      return res.status(200).json({
        success: true,
        conversation,
      });
    }

    conversation = await Conversation.create({
      participants: [req.user.id, receiverId],
    });

    conversation = await Conversation.findById(conversation._id)
      .populate("participants", "name email avatar isOnline")
      .populate("lastMessage");

    res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get User Conversations
// ======================================

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate("participants", "name email avatar isOnline lastSeen")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Single Conversation
// ======================================

const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate("participants", "name email avatar isOnline lastSeen")
      .populate("lastMessage");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createConversation,
  getConversations,
  getConversationById,
};
