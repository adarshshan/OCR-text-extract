const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient({
  // This automatically loads GOOGLE_APPLICATION_CREDENTIALS from your .env
});

exports.extractFromVision = async (buffer) => {
  try {
    const [result] = await client.textDetection(buffer);

    if (!result || !result.fullTextAnnotation) {
      return { text: "", pages: [] };
    }

    const fullText = result.fullTextAnnotation.text;

    return {
      text: fullText,
      raw: result,
    };
  } catch (error) {
    console.error("Google Vision OCR Error:", error);
    throw new Error("Google Vision failed");
  }
};
