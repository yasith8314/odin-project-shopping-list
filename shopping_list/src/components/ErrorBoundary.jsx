import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="state-message error-message"><strong>Something went wrong.</strong><br />Refresh the page to try again.</div>;
    return this.props.children;
  }
}

export default ErrorBoundary;
