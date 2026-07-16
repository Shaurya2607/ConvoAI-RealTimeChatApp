const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======================================
// Create Upload Directories
// ======================================

const folders = [
  "uploads/images",
  "uploads/videos",
  "uploads/audio",
  "uploads/documents",
];

folders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// ======================================
// Storage Configuration
// ======================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
      cb(null, "uploads/images");
    } else if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) {
      cb(null, "uploads/videos");
    } else if ([".mp3", ".wav", ".ogg", ".m4a"].includes(ext)) {
      cb(null, "uploads/audio");
    } else {
      cb(null, "uploads/documents");
    }
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// ======================================
// File Filter
// ======================================

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".mp3",
  ".wav",
  ".ogg",
  ".m4a",
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type. Please upload an image, video, audio, or document.",
      ),
      false,
    );
  }
};

// ======================================
// Upload Middleware
// ======================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});

module.exports = upload;
