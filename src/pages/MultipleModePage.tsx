import { Link } from 'react-router-dom';

export default function MultipleModePage() {
  return (
    <div className="mode-placeholder">
      <div className="mode-placeholder-inner">
        <p className="mode-placeholder-eyebrow">Coming next</p>
        <h1 className="mode-placeholder-title">Multiple Mode</h1>
        <p className="mode-placeholder-lead">
          Batch generation for many students will land here. For now, use Single Mode to create one
          poster at a time.
        </p>
        <div className="mode-placeholder-actions">
          <Link to="/" className="mode-placeholder-home">
            Back to Home
          </Link>
          <Link to="/single" className="mode-placeholder-single">
            Open Single Mode
          </Link>
        </div>
      </div>
    </div>
  );
}
