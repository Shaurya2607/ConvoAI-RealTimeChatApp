const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// ======================================
// Send Message
// ======================================

const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const {
      message,
      messageType = "text",
      fileUrl = "",
      fileName = "",
      receiver = null,
      replyTo = null,
    } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const newMessage = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      receiver,
      message,
      messageType,
      fileUrl,
      fileName,
      replyTo,
    });

    conversation.lastMessage = newMessage._id;
    await conversation.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar")
      .populate("replyTo")
      .populate("reactions.user", "name avatar");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Messages
// ======================================

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversation: conversationId,
      isDeleted: false,
    })
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
      .populate("replyTo")
      .populate("reactions.user", "name avatar")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Edit Message
// ======================================

const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const { message } = req.body;

    const existingMessage = await Message.findById(messageId);

    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (existingMessage.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    existingMessage.message = message;
    existingMessage.isEdited = true;
    existingMessage.editedAt = new Date();

    await existingMessage.save();

    const updatedMessage = await Message.findById(messageId)
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
      .populate("replyTo")
      .populate("reactions.user", "name avatar");

    res.status(200).json({
      success: true,
      message: "Message updated successfully",
      data: updatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Message
// ======================================

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const existingMessage = await Message.findById(messageId);

    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (existingMessage.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    existingMessage.isDeleted = true;
    existingMessage.deletedAt = new Date();

    await existingMessage.save();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Mark Message As Seen
// ======================================

const markAsSeen = async (req, res) => {
  try {
    const { messageId } = req.params;

    const existingMessage = await Message.findById(messageId);

    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (!existingMessage.seen) {
      existingMessage.seen = true;
      existingMessage.seenAt = new Date();

      await existingMessage.save();
    }

    const updatedMessage = await Message.findById(messageId)
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar");

    res.status(200).json({
      success: true,
      message: "Message marked as seen",
      data: updatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// React To Message
// ======================================

const reactToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const { emoji } = req.body;

    const existingMessage = await Message.findById(messageId);

    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const existingReaction = existingMessage.reactions.find(
      (reaction) => reaction.user.toString() === req.user.id,
    );

    if (existingReaction) {
      existingReaction.emoji = emoji;
    } else {
      existingMessage.reactions.push({
        user: req.user.id,
        emoji,
      });
    }

    await existingMessage.save();

    const updatedMessage = await Message.findById(messageId)
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
      .populate("replyTo")
      .populate("reactions.user", "name avatar");

    res.status(200).json({
      success: true,
      message: "Reaction updated",
      data: updatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  markAsSeen,
  reactToMessage,
};
