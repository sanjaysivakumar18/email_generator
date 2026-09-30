import React, { useState } from 'react';

export default function App() {
  const [topic, setTopic] = useState('');
  const [recipient, setRecipient] = useState('');
  const [tone, setTone] = useState('Professional');
  const [keyPoints, setKeyPoints] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateEmailRequest = async (topicValue, recipientValue, toneValue, keyPointsValue) => {
    setError('');

    if (!topicValue.trim()) {
      setError('Please enter what the email is about.');
      return;
    }

    if (!recipientValue.trim()) {
      setError('Please enter the recipient.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5050/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: topicValue,
          recipient: recipientValue,
          tone: toneValue,
          keyPoints: keyPointsValue
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to generate the email right now. Please try again.');
      }

      setGeneratedEmail({
        subject: data.subject,
        body: data.body
      });
    } catch (err) {
      console.error('Frontend error:', err);
      setError('Unable to generate the email right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateEmailRequest(topic, recipient, tone, keyPoints);
  };

  const handleRegenerate = () => {
    generateEmailRequest(topic, recipient, tone, keyPoints);
  };

  const handleCopy = async () => {
    if (!generatedEmail) return;

    const fullContent = `Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`;

    try {
      await navigator.clipboard.writeText(fullContent);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleClear = () => {
    setTopic('');
    setRecipient('');
    setTone('Professional');
    setKeyPoints('');
    setGeneratedEmail(null);
    setError('');
    setCopied(false);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Email Generator</h1>
        <p>Create clear, professional emails in seconds.</p>
      </header>

      <main className="main-grid">
        <form className="card" onSubmit={handleSubmit} noValidate>
          {error && <div className="error-banner" role="alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="topic">What is the email about?</label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Requesting two days leave"
              rows={3}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="recipient">Who is this email for?</label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="College Professor"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tone">Tone</label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              disabled={loading}
            >
              <option value="Professional">Professional</option>
              <option value="Friendly">Friendly</option>
              <option value="Formal">Formal</option>
              <option value="Casual">Casual</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="keyPoints">Key points (optional)</label>
            <textarea
              id="keyPoints"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder="Mention the reason and that I will complete the missed work."
              rows={3}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Email'}
          </button>
        </form>

        <section className="card output-card" aria-live="polite">
          {!generatedEmail ? (
            <div className="empty-state">
              <p>Your generated email will appear here.</p>
            </div>
          ) : (
            <div className="result-container">
              <div className="subject-block">
                <div className="subject-label">Subject</div>
                <div className="subject-content">{generatedEmail.subject}</div>
              </div>

              <div className="body-block">
                <div className="body-content">{generatedEmail.body}</div>
              </div>

              <div className="actions-row">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCopy}
                >
                  {copied ? 'Copied!' : 'Copy Email'}
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleRegenerate}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Regenerate'}
                </button>

                <button
                  type="button"
                  className="btn-danger-link"
                  onClick={handleClear}
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>Created by Sanjay</p>
      </footer>
    </div>
  );
}
