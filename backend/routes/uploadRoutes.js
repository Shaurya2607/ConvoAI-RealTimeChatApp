const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { uploadFile } = require("../controllers/uploadController");

// ======================================
// Upload File
// ======================================

router.post("/", protect, upload.single("file"), uploadFile);

module.exports = router;
