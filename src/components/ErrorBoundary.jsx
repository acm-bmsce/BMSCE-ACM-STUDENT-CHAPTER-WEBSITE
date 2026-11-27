import { Component } from "react";

/**
 * Last line of defence for rendering errors. Shows a designed, safe screen (no stack
 * traces or internals) and offers a real way out: reload, or go home.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("UI error:", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="site">
        <main id="main" className="ph" style={{ minHeight: "100vh", display: "grid", alignItems: "center" }}>
          <div className="wrap" style={{ padding: "96px 20px" }}>
            <p className="lab" style={{ marginBottom: 24 }}>
              <span className="dia" />
              Something went wrong
            </p>
            <h1 className="d1">
              We hit a <span className="blue">snag</span>
            </h1>
            <p className="lede mut" style={{ marginTop: 28 }}>
              This page failed to load properly. Reloading usually fixes it. If it keeps happening, write to acm@bmsce.ac.in.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 32 }}>
              <button type="button" className="btn" onClick={() => window.location.reload()}>
                Reload page <span className="ar">→</span>
              </button>
              <a className="btn o" href="/">
                Back home
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
