
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("React error boundary caught error:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  render(): React.ReactNode {
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
