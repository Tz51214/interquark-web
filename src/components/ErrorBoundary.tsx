import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Catches any rendering error anywhere in the component tree below it
// and shows a fallback UI instead of a blank white screen. This is a
// safety net — it doesn't fix bugs, but it stops one broken component
// from taking down the entire site for every visitor.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
          <span className="mb-3 font-mono text-sm text-signal">Something went wrong</span>
          <h1 className="mb-4 font-display text-2xl font-bold text-ink">
            This page hit an error.
          </h1>
          <p className="mb-8 max-w-md font-body text-sm text-slate-500">
            Please try refreshing the page. If the problem continues, contact us.
          </p>
          <button
            onClick={() => window.location.assign("/")}
            className="rounded-lg bg-signal px-4 py-2.5 font-body text-sm font-semibold text-white hover:bg-signal-dark"
          >
            Back to homepage
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
