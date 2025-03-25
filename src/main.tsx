
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'

// Enhanced error tracking
console.log("=== Application bootstrap starting ===");
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Create error boundary component for catching render errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React error boundary caught error:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-900 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Application Error</h1>
          <p className="mb-4">Something went wrong with the application.</p>
          <pre className="bg-white p-4 rounded overflow-auto text-sm">
            {this.state.error?.toString()}
          </pre>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
