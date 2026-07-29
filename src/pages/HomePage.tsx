import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applyUiTheme, initialUiTheme, type UiTheme } from '../lib/uiTheme';

export default function HomePage() {
  const [uiTheme, setUiTheme] = useState<UiTheme>(initialUiTheme);

  useEffect(() => {
    applyUiTheme(uiTheme);
  }, [uiTheme]);

  return (
    <div className="home">
      <div className="home-atmosphere" aria-hidden="true" />

      <header className="home-top">
        <div className="theme-toggle compact" role="group" aria-label="Color mode">
          <button
            type="button"
            className={`theme-toggle-option${uiTheme === 'light' ? ' active' : ''}`}
            aria-label="Light mode"
            aria-pressed={uiTheme === 'light'}
            onClick={() => setUiTheme('light')}
          >
            Light
          </button>
          <button
            type="button"
            className={`theme-toggle-option${uiTheme === 'dark' ? ' active' : ''}`}
            aria-label="Dark mode"
            aria-pressed={uiTheme === 'dark'}
            onClick={() => setUiTheme('dark')}
          >
            Dark
          </button>
        </div>
      </header>

      <main className="home-main">
        <p className="home-brand">Poster Gen</p>
        <h1 className="home-title">Result Poster Generator</h1>
        <p className="home-lead">Choose how you want to create print-ready result posters.</p>

        <div className="home-modes" role="navigation" aria-label="Modes">
          <Link to="/single" className="home-mode home-mode-single">
            <span className="home-mode-label">Single Mode</span>
            <span className="home-mode-desc">One student, one poster</span>
          </Link>
          <Link to="/multiple" className="home-mode home-mode-multiple">
            <span className="home-mode-label">Multiple Mode</span>
            <span className="home-mode-desc">2–8 people, Race-style poster</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
