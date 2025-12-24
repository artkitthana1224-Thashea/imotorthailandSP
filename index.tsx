import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Global error handling for boot-up phase
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif; text-align: center; color: #e11d48; background: #fff; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="background: #fff1f2; padding: 32px; border-radius: 32px; border: 1px solid #fecaca; max-width: 600px; width: 100%;">
          <h1 style="font-weight: 900; letter-spacing: -0.05em; font-size: 32px; color: #9f1239;">SYSTEM_HALT</h1>
          <p style="font-size: 14px; color: #be123c; margin-top: 8px; font-weight: bold;">Application failed to synchronize React instances.</p>
          <div style="background: #000; color: #10b981; padding: 20px; border-radius: 16px; font-size: 11px; text-align: left; overflow: auto; margin-top: 24px; font-family: monospace; line-height: 1.6;">
            <div style="color: #64748b; margin-bottom: 8px;">// Error Details:</div>
            ${message}
            <div style="color: #64748b; margin-top: 16px; margin-bottom: 8px;">// Stack Trace:</div>
            ${error?.stack || 'No stack trace available'}
          </div>
          <button onclick="location.reload()" style="margin-top: 24px; width: 100%; padding: 18px; background: #111827; color: #fff; border: none; border-radius: 16px; font-weight: 900; cursor: pointer; text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px;">Re-initialize System</button>
        </div>
      </div>
    `;
  }
  return false;
};

const init = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Critical Mount Error:", err);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}