
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Check for API key on boot
const checkEnv = () => {
  let hasKey = false;
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      hasKey = true;
    }
  } catch(e) {}
  
  if (!hasKey && !(window as any).API_KEY && !(window as any).VITE_API_KEY) {
    console.warn("AllNoop Warning: No API_KEY detected in environment. AI features will be disabled.");
  }
};

checkEnv();

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
      <div style="padding: 2rem; color: #ef4444; font-family: sans-serif; text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #0f172a;">
        <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">System Error</h1>
        <p style="color: #94a3b8; max-width: 400px;">The application failed to initialize. Please check the browser console for details or contact your systems administrator.</p>
      </div>
    `;
  }
}
