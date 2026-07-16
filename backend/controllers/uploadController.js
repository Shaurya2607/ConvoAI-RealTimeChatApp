const path = require("path");

// ======================================
// Upload File
// ======================================

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = req.file;

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        fileName: file.originalname,
        fileUrl,
        fileType: file.mimetype,
        fileSize: file.size,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadFile,
};
