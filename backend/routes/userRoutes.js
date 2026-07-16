const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getAllUsers,
  searchUsers,
  getUserProfile,
  updateProfile,
  updateAvatar,
} = require("../controllers/userController");

// ======================================
// User Routes
// ======================================

// Get all users
router.get("/", protect, getAllUsers);

// Search users
router.get("/search", protect, searchUsers);

// Get user profile
router.get("/:id", protect, getUserProfile);

// Update profile
router.put("/profile", protect, updateProfile);

// Update avatar
router.put("/avatar", protect, updateAvatar);

module.exports = router;
