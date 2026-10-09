# WhatsApp AI Auto-Reply Bot

An AI-powered WhatsApp assistant that auto-replies to every incoming message — in the sender's own language, in the business's own voice, and tuned to sound like a real person texting back, not a canned autoresponder.

## What it does

- Connects to any WhatsApp number via QR code (no official WhatsApp Business API, no approval wait)
- Reads every incoming message and replies automatically using Google Gemini
- Replies match the sender's language (Urdu, Roman Urdu, or English) and stay short — like a real WhatsApp chat, not an email
- Introduces the business by name only on a customer's first message, then drops the name on follow-ups — natural conversation flow instead of a robotic repeat
- Falls back to a safe default reply if the AI call fails or times out, with automatic retries first

## Why this matters for a business

Every message gets an instant, on-brand reply — day or night — without anyone sitting by the phone. The system prompt is fully customizable: point it at any business (customer support, lead qualification, service inquiries, booking requests) just by describing what that business offers.

## Tech stack

- Node.js
- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) — WhatsApp Web automation
- Google Gemini (`gemini-3.5-flash-lite`) — reply generation
- Puppeteer (headless Chrome) under the hood

## Running it

```
npm install
# create a .env file with: GEMINI_API_KEY=your_key_here
node index.js
```

Scan the printed QR code with WhatsApp (Linked Devices → Link a Device) and it's live.

For running on an Android phone via Termux instead of a PC, see [README_Termux.md](README_Termux.md).

## Customizing for a different business

Edit the `SYSTEM_PROMPT` in `index.js` — describe the business, its services, and how it should talk to customers. No other code changes needed.

---

Built by [Muhammad Bilal](https://github.com/abuammr41) — custom AI automation agents for freelance clients.
