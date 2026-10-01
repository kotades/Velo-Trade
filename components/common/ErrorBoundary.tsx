import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Standard Error Boundary for the Velo-Trade platform.
 * Provides a premium, user-friendly fallback UI in case of runtime crashes.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // TODO: Integrate with remote logging service (e.g., Sentry) in Phase 4
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] px-4 text-center">
          <div className="anim-fade-in relative max-w-md">
            {/* Glow effect */}
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 opacity-20 blur-xl"></div>
            
            <div className="relative rounded-xl border border-white/10 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              <h1 className="velo-text-gradient mb-2 text-2xl font-bold">System Anomaly Detected</h1>
              <p className="mb-8 text-zinc-400">
                A critical runtime error has occurred. Our engineers have been notified, and we are working to stabilize the platform.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={this.handleReset}
                  className="velo-gradient rounded-lg px-6 py-3 font-semibold text-white transition-all hover:scale-105 active:scale-95"
                >
                  Restart Terminal
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="rounded-lg border border-white/10 px-6 py-3 font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Go Back
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-8 text-left">
                  <p className="mb-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">Debug Info</p>
                  <pre className="max-h-32 overflow-auto rounded bg-black/50 p-3 text-xs font-mono text-red-400">
                    {this.state.error.toString()}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
