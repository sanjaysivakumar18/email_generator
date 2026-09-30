# AI Email Generator

A web application that generates complete emails from a topic, recipient, tone and optional key points using Gemini.

## Features

- AI-generated email subject and body
- Multiple tone options (Professional, Friendly, Formal, Casual)
- Custom key points
- Copy generated email to clipboard
- Regenerate email with a single click
- Clear form and reset state
- Responsive interface (Desktop two-column layout & Mobile single-column layout)
- Secure backend API avoiding client-side API key exposure

## Tech Stack

- React
- Vite
- Node.js
- Express
- Gemini API

## Project Structure

```
ai-email-generator/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
└── README.md
```

## Setup

### Prerequisites

Ensure Node.js (v18 or higher) and npm are installed on your machine.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

   > **Important:** Never commit your `.env` file or hardcode your API key into git. `backend/.env` is ignored by `.gitignore`.

4. Start the Express backend server:
   ```bash
   node server.js
   ```
   The backend runs on `http://localhost:5050`.

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend runs on `http://localhost:3000`.

---

## API Documentation

### `POST /api/generate-email`

Generates an email subject and body based on provided inputs.

#### Request Body:

```json
{
  "topic": "Requesting two days leave",
  "recipient": "College Professor",
  "tone": "Professional",
  "keyPoints": "I have a family function and will complete the missed work."
}
```

#### Response:

```json
{
  "subject": "Leave Request for Two Days",
  "body": "Dear Professor,\n\nI am writing to formally request two days of leave..."
}
```

---

## Future Improvements

- More email templates
- Additional tone controls
- Saved drafts
- Export options (PDF/TXT)
- Direct email service integration
