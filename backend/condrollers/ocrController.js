const { extractFromVision } = require("../utils/googleVisionjs");

exports.processDocument = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded." });
  }

  try {
    const result = await extractFromVision(req.file.buffer);

    console.log("OCR Result:", result);

    res.status(200).json({
      success: true,
      json: result,
    });
  } catch (error) {
    console.log("reached herer...in catch block");
    console.error("OCR Error:", error);
    // Forward the error to the global error handler
    next(
      new Error(
        "OCR extraction failed. The document might be unreadable or corrupt."
      )
    );
  }
};
