import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Custom fallback UI when an error is caught
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="error-message">
    <h2>Oops! Something went wrong.</h2>
    <p>{error.message}</p>
    <button onClick={resetErrorBoundary}>Try Again</button>
  </div>
);

// The functional component that wraps the children with ErrorBoundary
const ErrorBoundaryWrapper = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
