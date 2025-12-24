import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Global error handling for boot-up phase
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif; text-align: center; color: #e11d48;">
        <h1 style="font-weight: 900; letter-spacing: -0.05em;">BOOT_ERROR</h1>
        <p style="font-size: 14px; opacity: 0.7;">Application failed to start.</p>
        <pre style="background: #fff1f2; padding: 20px; border-radius: 12px; font-size: 11px; text-align: left; overflow: auto; margin-top: 20px;">${message}\n${error?.stack || ''}</pre>
        <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: #111827; color: #fff; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Retry Connection</button>
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
    console.error("Mount error:", err);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}