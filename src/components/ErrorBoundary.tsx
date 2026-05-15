import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Top-level safety net. Renders a minimal recovery screen instead of a
 * blank page when something throws during render. Logs the error to the
 * console so it can be diagnosed via DevTools.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[kozai] render error:", error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0E0E10",
          color: "#F5F2EC",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          padding: "10vh 6vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "1.25rem",
        }}
      >
        <div
          style={{
            fontFamily:
              "ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace",
            fontSize: 10,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(245,242,236,0.55)",
          }}
        >
          ↘ Something went wrong
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}
        >
          The site hit an unexpected error.
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: "62ch",
            fontSize: 15,
            lineHeight: 1.6,
            color: "rgba(245,242,236,0.7)",
          }}
        >
          The page failed to render. Refresh to try again — and if it keeps
          happening, open the browser console (⌥⌘I) for the full trace.
        </p>
        <pre
          style={{
            margin: "0.75rem 0 0",
            padding: "0.75rem 1rem",
            border: "1px solid rgba(245,242,236,0.12)",
            background: "rgba(0,0,0,0.35)",
            fontFamily:
              "ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace",
            fontSize: 12,
            color: "#E84F1B",
            overflowX: "auto",
            maxWidth: "100%",
          }}
        >
          {error.message}
        </pre>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              background: "#F5F2EC",
              color: "#0E0E10",
              border: "1px solid #F5F2EC",
              padding: "10px 18px",
              fontFamily:
                "ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Reload ↘
          </button>
          <a
            href="/"
            style={{
              padding: "10px 18px",
              border: "1px solid rgba(245,242,236,0.25)",
              color: "rgba(245,242,236,0.85)",
              fontFamily:
                "ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Back home →
          </a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
