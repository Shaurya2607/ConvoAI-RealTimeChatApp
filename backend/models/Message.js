const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Conversation
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    // Sender
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Receiver (optional but useful)
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Message Text
    message: {
      type: String,
      trim: true,
      default: "",
    },

    // Message Type
    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio", "document"],
      default: "text",
    },

    // Uploaded File URL
    fileUrl: {
      type: String,
      default: "",
    },

    // Original File Name
    fileName: {
      type: String,
      default: "",
    },

    // Reply Feature
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    // ===========================
    // Read Receipts
    // ===========================

    seen: {
      type: Boolean,
      default: false,
    },

    seenAt: {
      type: Date,
      default: null,
    },

    // ===========================
    // Message Reactions
    // ===========================

    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        emoji: {
          type: String,
        },
      },
    ],

    // ===========================
    // Edit Message
    // ===========================

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    // ===========================
    // Delete Message
    // ===========================

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Message", messageSchema);
