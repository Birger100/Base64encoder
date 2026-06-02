import React, { useRef, useState } from 'react';

const encodeUtf8ToBase64 = (text) => {
  const bytes = new TextEncoder().encode(text);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
};

const decodeBase64ToUtf8 = (base64) => {
  const normalized = base64.replace(/\s+/g, '');
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
};

const App = () => {
  const [plainText, setPlainText] = useState('');
  const [base64Text, setBase64Text] = useState('');
  const [decodeError, setDecodeError] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const timeoutRef = useRef(null);

  const showCopied = (field) => {
    setCopiedField(field);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopiedField('');
    }, 1200);
  };

  const copyToClipboard = async (value, field) => {
    try {
      await navigator.clipboard.writeText(value);
      showCopied(field);
    } catch (_error) {
      setCopiedField('');
    }
  };

  const handlePlainTextChange = (event) => {
    const value = event.target.value;
    setPlainText(value);
    setBase64Text(encodeUtf8ToBase64(value));
    setDecodeError('');
  };

  const handleBase64Change = (event) => {
    const value = event.target.value;
    setBase64Text(value);

    try {
      const decoded = decodeBase64ToUtf8(value);
      setPlainText(decoded);
      setDecodeError('');
    } catch (_error) {
      setDecodeError('Invalid Base64 code. Please check your input.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.layout}>
        <section style={styles.panel}>
          <div style={styles.headerRow}>
            <label htmlFor="plainText" style={styles.label}>Plain Text</label>
            <button
              type="button"
              style={styles.copyButton}
              onClick={() => copyToClipboard(plainText, 'plain')}
            >
              Copy
            </button>
          </div>
          <textarea
            id="plainText"
            style={styles.textarea}
            value={plainText}
            onChange={handlePlainTextChange}
            onDoubleClick={() => copyToClipboard(plainText, 'plain')}
            placeholder="Type or paste plain text..."
          />
          <div style={styles.feedback}>{copiedField === 'plain' ? 'Copied!' : ''}</div>
        </section>

        <section style={styles.panel}>
          <div style={styles.headerRow}>
            <label htmlFor="base64" style={styles.label}>Base64 Code</label>
            <button
              type="button"
              style={styles.copyButton}
              onClick={() => copyToClipboard(base64Text, 'base64')}
            >
              Copy
            </button>
          </div>
          <textarea
            id="base64"
            style={styles.textarea}
            value={base64Text}
            onChange={handleBase64Change}
            onDoubleClick={() => copyToClipboard(base64Text, 'base64')}
            placeholder="Type or paste Base64..."
          />
          <div style={styles.feedback}>{copiedField === 'base64' ? 'Copied!' : ''}</div>
          {decodeError ? <div style={styles.error}>{decodeError}</div> : null}
        </section>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    margin: 0,
    padding: '1rem',
    boxSizing: 'border-box',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    backgroundColor: '#f6f7f9',
  },
  layout: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  panel: {
    flex: '1 1 420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: 600,
    color: '#1f2937',
  },
  copyButton: {
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    backgroundColor: '#fff',
    padding: '0.35rem 0.75rem',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    minHeight: '280px',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontSize: '0.95rem',
  },
  feedback: {
    minHeight: '1.1rem',
    color: '#059669',
    fontSize: '0.85rem',
  },
  error: {
    color: '#dc2626',
    fontSize: '0.85rem',
  },
};

export default App;
