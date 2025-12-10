const { extractFromVision } = require("../utils/googleVision.js");
const { parseVoterList } = require("../utils/parseVoterList.js");

exports.processDocument = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded." });
  }

  try {
    const ocrText = await extractFromVision(req.file.buffer);

    const structured = parseVoterList(ocrText);

    console.log("OCR Result:", structured);

    res.status(200).json({
      success: true,
      json: structured,
    });
  } catch (error) {
    console.error("OCR Error:", error);
    next(
      new Error(
        "OCR extraction failed. The document might be unreadable or corrupt."
      )
    );
  }
};
