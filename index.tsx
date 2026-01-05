
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Catch errors during the initial boot sequence
window.onerror = (msg, url, line, col, error) => {
  console.error("AllNoop Runtime Error:", msg, error);
  return false;
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("FATAL: Could not find root element to mount AllNoop.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (e) {
    console.error("AllNoop Render Crash:", e);
    rootElement.innerHTML = `
      <div style="padding: 2rem; color: #ef4444; font-family: sans-serif; text-align: center;">
        <h1 style="font-size: 1.5rem; font-weight: bold;">Application Error</h1>
        <p>Check the console (F12) for detailed error information.</p>
        <p style="font-size: 0.8rem; color: #6b7280;">Likely cause: Missing API_KEY environment variable.</p>
      </div>
    `;
  }
}
