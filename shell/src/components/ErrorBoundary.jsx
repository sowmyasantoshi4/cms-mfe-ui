import React, { useEffect } from 'react';

const ErrorBoundary = ({ children, setHasError }) => {
    useEffect(() => {
        const errorHandler = (error) => {
            console.error('Error in Microfrontend:', error);
            setHasError(true);
        };

        // You can add global error handlers if needed
        window.addEventListener('error', errorHandler);

        return () => {
            window.removeEventListener('error', errorHandler);
        };
    }, [setHasError]);

    return children;
};

export default ErrorBoundary;
