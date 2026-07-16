const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");

const onlineUsers = new Map();

const socketHandler = (io) => {
  // ======================================
  // Authentication Middleware
  // ======================================

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication Error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User Not Found"));
      }

      socket.user = user;

      next();
    } catch (error) {
      next(new Error("Authentication Error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`✅ ${socket.user.name} Connected`);

    // ======================================
    // Store Online User
    // ======================================

    onlineUsers.set(socket.user._id.toString(), socket.id);

    await User.findByIdAndUpdate(socket.user._id, {
      isOnline: true,
      lastSeen: new Date(),
    });

    io.emit("onlineUsers", [...onlineUsers.keys()]);

    // ======================================
    // Join Conversation
    // ======================================

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);

      console.log(`${socket.user.name} joined ${conversationId}`);
    });

    // ======================================
    // Leave Conversation
    // ======================================

    socket.on("leaveConversation", (conversationId) => {
      socket.leave(conversationId);
    });

    // ======================================
    // Typing
    // ======================================

    socket.on("typing", (conversationId) => {
      socket.to(conversationId).emit("typing", {
        userId: socket.user._id,
        name: socket.user.name,
      });
    });

    // ======================================
    // Stop Typing
    // ======================================

    socket.on("stopTyping", (conversationId) => {
      socket.to(conversationId).emit("stopTyping", {
        userId: socket.user._id,
      });
    });

    // ======================================
    // Send Message
    // ======================================

    socket.on("sendMessage", async ({ conversationId, messageId }) => {
      try {
        const message = await Message.findById(messageId)
          .populate("sender", "name avatar")
          .populate("receiver", "name avatar")
          .populate("replyTo")
          .populate("reactions.user", "name avatar");

        io.to(conversationId).emit("receiveMessage", message);
      } catch (error) {
        console.error(error);
      }
    });

    // ======================================
    // Read Receipts
    // ======================================

    socket.on("messageSeen", ({ conversationId, messageId }) => {
      io.to(conversationId).emit("messageSeen", {
        messageId,
      });
    });

    // ======================================
    // Emoji Reactions
    // ======================================

    socket.on("messageReaction", ({ conversationId, message }) => {
      io.to(conversationId).emit("messageReaction", message);
    });

    // ======================================
    // Message Edited
    // ======================================

    socket.on("messageEdited", ({ conversationId, message }) => {
      io.to(conversationId).emit("messageEdited", message);
    });

    // ======================================
    // Message Deleted
    // ======================================

    socket.on("messageDeleted", ({ conversationId, messageId }) => {
      io.to(conversationId).emit("messageDeleted", {
        messageId,
      });
    });

    // ======================================
    // Disconnect
    // ======================================

    socket.on("disconnect", async () => {
      console.log(`❌ ${socket.user.name} Disconnected`);

      onlineUsers.delete(socket.user._id.toString());

      await User.findByIdAndUpdate(socket.user._id, {
        isOnline: false,
        lastSeen: new Date(),
      });

      io.emit("onlineUsers", [...onlineUsers.keys()]);
    });
  });
};

module.exports = socketHandler;
