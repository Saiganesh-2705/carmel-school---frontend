import { Component } from 'react';
import { RefreshCw } from 'lucide-react';

// If a page ever fails, show a friendly message with a Reload button instead of a blank white screen.
export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('Page error:', error, info?.componentStack); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-navy-800">Something went wrong on this page</h1>
        <p className="mt-2 max-w-md text-sm text-slate-500">Nothing was lost. Please reload the page. If it keeps happening, tell the website team what you clicked just before.</p>
        <button className="btn-primary mt-5" onClick={() => { this.setState({ error: null }); location.reload(); }}><RefreshCw className="h-4 w-4" />Reload page</button>
      </div>
    );
  }
}
