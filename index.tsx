
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * GLOBAL ENVIRONMENT SHIM
 * This ensures that the application has access to the API_KEY regardless of 
 * the specific build tool (Vite, Webpack) or deployment platform (Vercel).
 */
const initEnvironment = () => {
  // Ensure process.env exists in the browser
  if (typeof (window as any).process === 'undefined') {
    (window as any).process = { env: {} };
  }
  
  // If process.env.API_KEY is missing, try to recover it from Vite or Window globals
  if (!process.env.API_KEY) {
    // @ts-ignore - Check Vite-specific environment variables
    const viteKey = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_KEY;
    const windowKey = (window as any).VITE_API_KEY || (window as any).API_KEY;
    
    process.env.API_KEY = viteKey || windowKey;
  }
};

initEnvironment();

// Check for API key on boot
const checkEnv = () => {
  if (!process.env.API_KEY) {
    console.warn("AllNoop Warning: No API_KEY detected in environment. AI features will be disabled.");
  } else {
    console.log("AllNoop: API Connection detected.");
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
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 2rem; color: #ef4444; font-family: sans-serif; text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #0f172a;">
          <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">System Error</h1>
          <p style="color: #94a3b8; max-width: 400px;">The application failed to initialize. Please check the browser console for details or ensure your API_KEY is set in Vercel.</p>
        </div>
      `;
    }
  }
}
