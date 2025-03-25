
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'

// Enhanced error tracking
console.log("=== Application bootstrap starting ===");
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  console.log("Root element found, rendering app");
  try {
    const root = createRoot(rootElement);
    root.render(
      <ErrorBoundary>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ErrorBoundary>
    );
    console.log("Render called successfully in main.tsx");
  } catch (error) {
    console.error("Error during initial render:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; background-color: #FEF2F2; color: #7F1D1D; border-radius: 8px;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Render Error</h1>
        <p>Failed to initialize the application.</p>
        <pre style="background-color: white; padding: 12px; margin-top: 12px; overflow: auto;">${error?.toString()}</pre>
        <button 
          style="margin-top: 16px; padding: 8px 16px; background-color: #3B82F6; color: white; border-radius: 4px; cursor: pointer;"
          onclick="window.location.reload()"
        >
          Reload
        </button>
      </div>
    `;
  }
}

console.log("=== Main.tsx execution completed ===");
