# AI Email Generator

A full-stack web application that creates context-aware email drafts with subject lines using Google Gemini AI. Built with React, Node.js, Express, and modern CSS.

![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Express%20%7C%20Gemini-blue)

## Features

- **Custom AI Generation**: Creates formatted subject lines and email bodies tailored to recipient, topic, and key points.
- **Tone Customization**: Choose between Professional, Friendly, Formal, Casual, Persuasive, and Urgent tones.
- **One-Click Actions**: Quick copy-to-clipboard for subject and body, or instant regeneration.
- **Responsive Design**: Dark mode UI built with responsive layouts for mobile and desktop screens.
- **Secure Backend**: Gemini API keys are handled server-side and never exposed to the frontend.

## Tech Stack

- **Frontend**: React, Vite, CSS
- **Backend**: Node.js, Express.js
- **AI Model**: Google Generative AI (`@google/generative-ai`)

## Project Structure

```
email_generator/
├── frontend/             # React + Vite frontend UI
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
├── backend/              # Express API server
│   ├── server.js         # API routes & Gemini integration
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Gemini API Key ([Get one from Google AI Studio](https://aistudio.google.com/))

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5050
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Start the server:

```bash
npm start
```
Server runs on `http://localhost:5050`.

### 2. Frontend Setup

Open a separate terminal tab:

```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

## API Reference

### `POST /api/generate-email`

Generates an email subject and body.

**Request Body:**
```json
{
  "topic": "Requesting a 2-day extension for project submission",
  "recipient": "Professor Smith",
  "tone": "Formal",
  "keyPoints": "Had a fever over the weekend, need extra time to finish final testing."
}
```

**Response:**
```json
{
  "subject": "Request for Deadline Extension - [Your Name]",
  "body": "Dear Professor Smith,\n\nI am writing to request a short extension on the project submission..."
}
```

## License

MIT
