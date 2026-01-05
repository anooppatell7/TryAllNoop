
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * GLOBAL ENVIRONMENT SHIM
 * Optimized for Vercel/Vite deployments.
 * Maps VITE_API_KEY (Vite standard) to process.env.API_KEY (Gemini SDK standard).
 */
const initEnvironment = () => {
  // 1. Ensure process object exists
  if (typeof (window as any).process === 'undefined') {
    (window as any).process = { env: {} };
  } else if (!(window as any).process.env) {
    (window as any).process.env = {};
  }
  
  // 2. Try to grab the key from various injection points
  // Vite replaces 'import.meta.env.VITE_API_KEY' at build time in Vercel.
  // @ts-ignore
  const viteKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_KEY : undefined;
  const windowKey = (window as any).VITE_API_KEY || (window as any).API_KEY;
  const processKey = process.env.API_KEY || (process.env as any).VITE_API_KEY;

  const detectedKey = viteKey || windowKey || processKey;

  if (detectedKey) {
    process.env.API_KEY = detectedKey;
    // Ensure it's globally available for the SDK
    (window as any).API_KEY = detectedKey;
    console.log("AllNoop: Secure API Connection established.");
  } else {
    console.warn("AllNoop Warning: No API_KEY detected. Check Vercel Environment Variables (VITE_API_KEY).");
  }
};

// Execute shim before anything else
initEnvironment();

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("FATAL: Could not find root element.");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
