const { GoogleGenAI } = require("@google/genai");

// ======================================
// Initialize Gemini
// ======================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ======================================
// Generate AI Response
// ======================================

const generateResponse = async (prompt) => {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      if (error.status === 503 || error.message?.includes("high demand")) {
        console.log(`Retry ${attempt}/3...`);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        continue;
      }

      throw error;
    }
  }

  throw new Error(
    "Gemini is currently busy. Please try again in a few moments.",
  );
};

// ======================================
// Smart Replies
// ======================================

const generateSmartReplies = async (conversation) => {
  return generateResponse(`
Generate exactly 3 short natural replies.

Conversation:

${conversation}

Return ONLY the replies.
`);
};

// ======================================
// Conversation Summary
// ======================================

const generateSummary = async (conversation) => {
  return generateResponse(`
Summarize the following conversation into concise bullet points.

Conversation:

${conversation}
`);
};

// ======================================
// Translate
// ======================================

const translateMessage = async (text, language) => {
  return generateResponse(`
Translate the following text into ${language}.

Return ONLY the translated text.

${text}
`);
};

// ======================================
// Rewrite
// ======================================

const rewriteMessage = async (text, tone) => {
  return generateResponse(`
Rewrite the following message in a ${tone} tone.

Return ONLY the rewritten message.

${text}
`);
};

// ======================================
// Explain Code
// ======================================

const explainCode = async (code) => {
  return generateResponse(`
You are an expert software engineer.

Explain the following code.

Include:

1. Purpose
2. Logic
3. Time Complexity
4. Space Complexity
5. Possible Improvements

Code:

${code}
`);
};

module.exports = {
  generateResponse,
  generateSmartReplies,
  generateSummary,
  translateMessage,
  rewriteMessage,
  explainCode,
};
