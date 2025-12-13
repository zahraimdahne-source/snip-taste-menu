import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-snip-bg p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-snip-orange"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-display font-bold text-snip-black mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 font-body mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="text-left mb-6 bg-gray-100 p-4 rounded">
                <summary className="cursor-pointer font-bold text-sm text-gray-700 mb-2">
                  Error Details
                </summary>
                <pre className="text-xs text-red-600 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-snip-orange text-white px-6 py-3 rounded-lg font-display font-bold hover:bg-snip-black transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    // @ts-expect-error - props exists on React.Component but TypeScript config has issues
    return this.props.children;
  }
}

export default ErrorBoundary;
