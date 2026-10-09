require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const GEMINI_MODEL = 'gemini-3.5-flash-lite';

const SYSTEM_PROMPT = `You are the WhatsApp assistant for Muhammad Bilal, a freelance AI automation agent based in Lahore, Pakistan. He directs AI to build and run custom automation tools ("agents") for clients.

Services he offers:
- Data cleaning & entry (messy Excel/CSV cleanup and validation)
- Web scraping (any website into structured Excel/CSV)
- E-commerce analytics (sales reports from order exports)
- Medical billing audit (claim formatting/completeness checks)
- Word to Excel conversion (tables from .docx into Excel)
- B2B lead finding + outreach drafting (Google Maps leads + outreach messages)
- Video content creation (images + captions into Reels/Shorts-style videos)
- Custom automation agents for anything else — if it's not listed, say he can likely build it

Reply style:
- STRICT LIMIT: maximum 1-2 short sentences per reply, like a real person texting on WhatsApp — never write paragraphs or lists.
- STRICT LANGUAGE MATCH: if the person writes in Urdu or Roman Urdu, reply fully in Roman Urdu; if they write in English, reply fully in English. Never mix both in one reply.
- Only mention "Muhammad Bilal" by name in the very first reply of a conversation. After that, just say "I'm his assistant" / "main uska assistant hoon" — never repeat his name again in later replies.
- If someone asks about a service, name it in a few words and ask what they need — don't explain everything at once.
- If someone asks for pricing, say it depends on project size and ask for details — don't invent exact prices.
- Never claim to be a human; if directly asked, say you're his AI assistant handling WhatsApp replies.
- Do not make commitments on deadlines or final pricing — just gather requirements and say Bilal will follow up.`;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateReply(userMessage, isFirstMessage) {
  const contextNote = isFirstMessage
    ? '[This is the first message from this person — you may mention "Muhammad Bilal" by name once.]'
    : '[This is a follow-up message in an ongoing conversation — do NOT mention "Muhammad Bilal" by name, just say "his assistant" if needed.]';
  const promptContent = `${contextNote}\n${userMessage}`;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: promptContent,
        config: { systemInstruction: SYSTEM_PROMPT, maxOutputTokens: 120 },
      });
      const text = response.text?.trim();
      if (text) return text;
    } catch (err) {
      console.error(`Gemini reply generation failed (attempt ${attempt}/${MAX_RETRIES}):`, err.message || err);
    }
    if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS * attempt);
  }
  return "Thanks for your message! I'll get back to you shortly.";
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: process.env.PUPPETEER_EXECUTABLE_PATH ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
  },
});

client.on('qr', (qr) => {
  console.log('Scan this QR code with WhatsApp (Linked Devices > Link a Device):');
  qrcode.generate(qr, { small: true });
  const qrFilePath = path.join(__dirname, 'qr.png');
  QRCode.toFile(qrFilePath, qr, { width: 400 }, (err) => {
    if (err) console.error('Failed to save QR image:', err);
    else console.log('QR code image saved to:', qrFilePath);
  });
});

client.on('ready', () => {
  console.log('WhatsApp Auto-Reply Bot is ready and listening for messages.');
});

const seenChats = new Set();

client.on('message', async (message) => {
  if (message.fromMe) return;
  console.log(`New message from ${message.from}: ${message.body}`);
  const isFirstMessage = !seenChats.has(message.from);
  seenChats.add(message.from);
  const reply = await generateReply(message.body, isFirstMessage);
  console.log(`Replying: ${reply}`);
  await message.reply(reply);
});

client.initialize();
