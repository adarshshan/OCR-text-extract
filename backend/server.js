const express = require("express");
const cors = require("cors");
const ocrRoutes = require("./routes/ocrRoutes");
const multer = require("multer");
const { config } = require("dotenv");

config();

console.log("GOOGLE CRED PATH:", process.env.GOOGLE_APPLICATION_CREDENTIALS);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/ocr", ocrRoutes);

// Global error handler for Multer and other unhandled errors
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message);

  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    return res.status(400).json({ success: false, error: err.message });
  }

  if (err) {
    // An unknown error occurred.
    return res.status(500).json({
      success: false,
      error: err.message || "An unexpected error occurred.",
    });
  }

  next();
});

app.listen(5000, () => console.log("Server running on port 5000"));
