function devanagariToArabic(s) {
  if (!s) return s;
  const map = {
    "०": "0",
    "१": "1",
    "२": "2",
    "३": "3",
    "४": "4",
    "५": "5",
    "६": "6",
    "७": "7",
    "८": "8",
    "९": "9",
  };
  return s.replace(/[०-९]/g, (d) => map[d]);
}

function ensureStringInput(input) {
  if (typeof input === "string") return input;
  if (!input) return "";
  if (typeof input.text === "string") return input.text;
  if (
    input.fullTextAnnotation &&
    typeof input.fullTextAnnotation.text === "string"
  ) {
    return input.fullTextAnnotation.text;
  }
  if (
    input.raw &&
    input.raw.fullTextAnnotation &&
    typeof input.raw.fullTextAnnotation.text === "string"
  ) {
    return input.raw.fullTextAnnotation.text;
  }
  if (typeof input === "object") {
    try {
      const json = JSON.stringify(input);
      return json;
    } catch (e) {
      return "";
    }
  }
  return String(input);
}

exports.parseVoterList = function (ocrInput) {
  const text = ensureStringInput(ocrInput);
  if (!text || text.trim().length === 0) {
    throw new TypeError("No OCR text found to parse.");
  }

  const header = {};
  const headerMap = {
    "निवडणूक संस्था": /निवडणूक संस्था[:\s\-–]*([^\n\r]+)/i,
    "निवडणूक विभाग": /निवडणूक विभाग[:\s\-–]*([^\n\r]+)/i,
    "निवडणूक गण": /निवडणूक गण[:\s\-–]*([^\n\r]+)/i,
    "यादी भाग क्रमांक": /यादी\s*भाग\s*क्रम\.?\s*[:\s\-–]*([^\n\r]+)/i,
  };

  for (const key of Object.keys(headerMap)) {
    const m = text.match(headerMap[key]);
    header[key] = m ? m[1].trim() : "";
  }

  const blockRegex =
    /(?:^|\n)\s*(\d{1,2})\s*\n?\s*([A-Za-z0-9\-]{5,})\s+(\d+\/\d+\/\d+)([\s\S]*?)(?=(?:\n\s*\d{1,2}\s*\n)|\n\s*$)/g;

  const altBlockRegex =
    /(?:^|\n)\s*(\d{1,2})\s+([A-Za-z0-9\-]{5,})\s+(\d+\/\d+\/\d+)([\s\S]*?)(?=(?:\n\s*\d{1,2}\s)|\n\s*$)/g;

  const fieldPatterns = {
    name: /मतदार(?:ाचे|ाचे|ाचे)?\s*(?:पूर्ण)?[:\s\-–]*([^\n\r]+)/i,
    relation: /(पतीचे नाव|वडिलांचे नाव)[:\s\-–]*([^\n\r]+)/i,
    house: /घर\s*क्रमांक[:\s\-–]*([^\n\r]+)/i,
    age: /वय[:\s\-–]*([0-9०-९]{1,3})/i,
    gender: /लिंग[:\s\-–]*([^\n\r]+)/i,
  };

  const records = [];
  let m;
  let used = false;
  const useRegex = text.match(blockRegex) ? blockRegex : altBlockRegex;

  while ((m = useRegex.exec(text)) !== null) {
    used = true;
    const serial = m[1] ? m[1].trim() : "";
    const epic = m[2] ? m[2].trim() : "";
    const part = m[3] ? m[3].trim() : "";
    const blockText = m[4] || "";

    const getMatch = (pattern, groupIndex = 1) => {
      const mm = blockText.match(pattern);
      if (!mm) return "NA";
      // relation pattern captures label + value at group 2 sometimes, so handle both
      return (mm[groupIndex] || mm[1]).trim();
    };

    let ageRaw = "NA";
    const ageMatch = blockText.match(fieldPatterns.age);
    if (ageMatch) {
      ageRaw = devanagariToArabic(ageMatch[1]);
    }

    const genderRaw = (blockText.match(fieldPatterns.gender) || [])[1] || "NA";
    // relation may be group 2 if full match returns label and value
    let relationRaw = "NA";
    const relMatch = blockText.match(fieldPatterns.relation);
    if (relMatch) {
      relationRaw = (relMatch[2] || relMatch[1] || "NA").trim();
    }

    const nameRaw = (blockText.match(fieldPatterns.name) || [])[1] || "NA";
    const houseRaw = (blockText.match(fieldPatterns.house) || [])[1] || "NA";

    records.push({
      क्रमांक: serial ? Number(devanagariToArabic(serial)) : null,
      EPIC: epic || "NA",
      भाग: part || "NA",
      "मतदाराचे नाव": nameRaw.trim() || "NA",
      नाते: relationRaw.trim() || "NA",
      "घर क्रमांक": houseRaw.trim() || "NA",
      वय: ageRaw,
      लिंग: genderRaw.trim() || "NA",
    });
  }

  // If splitting by blocks failed (OCR merged everything), attempt a fallback:
  if (!used) {
    // Try to find EPIC occurrences throughout text and create minimal records
    const epicRegex = /([A-Za-z0-9\-]{5,})\s+(\d+\/\d+\/\d+)/g;
    let idx = 0;
    while ((m = epicRegex.exec(text)) !== null) {
      idx++;
      const epic = m[1];
      const part = m[2];
      // take a small window after the match to look for name/age/gender
      const start = m.index;
      const windowText = text.substr(start, 400); // 400 chars window
      const name = (windowText.match(fieldPatterns.name) || [])[1] || "NA";
      const rel = (windowText.match(fieldPatterns.relation) || [])[2] || "NA";
      const house = (windowText.match(fieldPatterns.house) || [])[1] || "NA";
      const ageMatch = windowText.match(fieldPatterns.age);
      const age = ageMatch ? devanagariToArabic(ageMatch[1]) : "NA";
      const gender = (windowText.match(fieldPatterns.gender) || [])[1] || "NA";

      records.push({
        क्रमांक: idx,
        EPIC: epic,
        भाग: part,
        "मतदाराचे नाव": name,
        नाते: rel,
        "घर क्रमांक": house,
        वय: age,
        लिंग: gender,
      });
    }
  }

  return { header, records };
};
