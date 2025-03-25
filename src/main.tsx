
import { createRoot } from 'react-dom/client'
import React from 'react'; // Make sure React is imported
import App from './App.tsx'
import './index.css'

// Immediate logging for debugging
console.log("Application initializing in main.tsx");

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  console.log("Root element found, rendering app");
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

console.log("Render called in main.tsx");
