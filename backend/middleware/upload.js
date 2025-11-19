import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `event-${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png) are allowed!"), false);
  }
};

// Init upload with configuration
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
}).single("photo");

// Middleware to handle multer errors
const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        error: "File upload error",
        details: err.message,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        error: "Invalid file type",
        details: err.message,
      });
    }
    next();
  });
};

export default handleUpload;