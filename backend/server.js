const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Helper function to safely extract JSON from model output
function extractJson(text) {
  if (!text) return null;

  let cleanText = text.trim();

  // Safely extract and parse JSON even if returned inside markdown code blocks
  cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    const parsed = JSON.parse(cleanText);
    if (parsed && typeof parsed === 'object') {
      return {
        subject: parsed.subject || parsed.Subject || '',
        body: parsed.body || parsed.Body || parsed.email || parsed.Email || ''
      };
    }
  } catch (e) {
    // Regex fallback if JSON formatting was slightly off
    const subjectMatch = cleanText.match(/"subject"\s*:\s*"([^"]+)"/i);
    const bodyMatch = cleanText.match(/"body"\s*:\s*"([\s\S]+)"/i);

    if (subjectMatch || bodyMatch) {
      return {
        subject: subjectMatch ? subjectMatch[1] : '',
        body: bodyMatch ? bodyMatch[1] : ''
      };
    }
  }

  return null;
}

app.post('/api/generate-email', async (req, res) => {
  try {
    const { topic, recipient, tone, keyPoints } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Please enter what the email is about.' });
    }

    if (!recipient || typeof recipient !== 'string' || !recipient.trim()) {
      return res.status(400).json({ error: 'Please enter the recipient.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here' || !apiKey.trim()) {
      console.error('Gemini request failed: GEMINI_API_KEY is not set in backend/.env');
      return res.status(500).json({ error: 'Unable to generate the email right now. Please try again.' });
    }

    const prompt = `You are an expert email writer.

Generate a natural, clear and appropriate email using the information provided.

Topic:
${topic.trim()}

Recipient:
${recipient.trim()}

Tone:
${tone ? tone.trim() : 'Professional'}

Key points:
${keyPoints && keyPoints.trim() ? keyPoints.trim() : 'None provided'}

Requirements:
- Write a suitable subject.
- Write a complete email.
- Match the requested tone.
- Keep the email natural.
- Do not invent important information.
- Do not add facts that were not provided.
- Include an appropriate greeting.
- Clearly communicate the purpose of the email.
- Include a polite closing.
- Keep it concise and useful.
- Do not use markdown inside the email body or subject.
- Do not provide explanations outside the email.
- Return only the requested structured result.

Return a JSON object strictly matching this format:
{
  "subject": "Generated subject",
  "body": "Generated email body"
}`;

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    let responseText = '';
    let lastError = null;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Sending request to Gemini model "${modelName}" (Attempt ${attempt}/${maxRetries})...`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        responseText = response.text();
        if (responseText) {
          lastError = null;
          break;
        }
      } catch (err) {
        console.warn(`Attempt ${attempt} failed with error:`, err.message);
        lastError = err;
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    if (lastError && !responseText) {
      throw lastError;
    }

    const extracted = extractJson(responseText);

    if (!extracted || !extracted.subject || !extracted.body) {
      console.error('Gemini returned an unparseable response:', responseText);
      return res.status(500).json({ error: 'Unable to generate the email right now. Please try again.' });
    }

    return res.json({
      subject: extracted.subject.trim(),
      body: extracted.body.trim()
    });

  } catch (error) {
    console.error('Gemini request failed:', error);
    return res.status(500).json({ error: 'Unable to generate the email right now. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
