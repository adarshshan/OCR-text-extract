const express = require("express");
const cors = require("cors");
const ocrRoutes = require("./routes/ocrRoutes");
const multer = require("multer");
const { config } = require("dotenv");

config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/testing", (req, res) => {
  res.json("App is working");
});
app.use("/api/ocr", ocrRoutes);

app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: err.message });
  }

  if (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "An unexpected error occurred.",
    });
  }

  next();
});

app.listen(5000, () => console.log("Server running on port 5000"));
