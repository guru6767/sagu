'use client';

import React from 'react';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Fix #7: Top-level React error boundary.
 * Catches unhandled render errors in the component tree and shows a fallback UI
 * instead of a blank/crashed page.
 *
 * Usage: wrap page content in layout.tsx (see updated layout.tsx).
 */
export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Log to your error tracking service here (e.g. Sentry, Datadog)
        console.error('[ErrorBoundary] Unhandled error:', error, info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    background: '#0f0f0f',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    textAlign: 'center',
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#888', marginBottom: '2rem', maxWidth: 480 }}>
                        An unexpected error occurred. The team has been notified.
                        Try refreshing the page.
                    </p>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <pre style={{
                            background: '#1a1a1a',
                            padding: '1rem',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            color: '#ff6b6b',
                            textAlign: 'left',
                            maxWidth: '100%',
                            overflowX: 'auto',
                            marginBottom: '2rem',
                        }}>
                            {this.state.error.toString()}
                        </pre>
                    )}
                    <button
                        onClick={this.handleReset}
                        style={{
                            padding: '0.75rem 2rem',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 600,
                        }}
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
