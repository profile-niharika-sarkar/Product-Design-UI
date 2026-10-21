import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { useApi } from '../lib/useApi';

type Theme = 'system' | 'light' | 'dark';

function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('nexus-theme') as Theme) || 'system',
  );
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    localStorage.setItem('nexus-theme', theme);
  }, [theme]);
  return [theme, setTheme];
}

const NAV = [
  {
    group: 'Operate',
    items: [
      { to: '/', label: 'Overview', end: true },
      { to: '/incidents', label: 'Incidents', count: true },
      { to: '/services', label: 'Services' },
    ],
  },
  {
    group: 'Expand',
    items: [
      { to: '/agents', label: 'Agent studio', tier: 'P1' },
      { to: '/insights', label: 'Insights', tier: 'P2' },
    ],
  },
  { group: 'Govern', items: [{ to: '/control', label: 'Control center' }] },
];

export function AppShell() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useTheme();
  const loc = useLocation();
  const health = useApi(api.health, []);
  const incidents = useApi(api.incidents, [loc.pathname]);
  const openCount =
    incidents.data?.filter((i) => !['mitigated', 'resolved'].includes(i.status)).length ?? 0;

  useEffect(() => setOpen(false), [loc.pathname]);

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
        <NavLink to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            N
          </span>
          Nexus AI
        </NavLink>
        {NAV.map((g) => (
          <div key={g.group}>
            <div className="nav-group">{g.group}</div>
            {g.items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={'end' in it}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span>{it.label}</span>
                {'count' in it && openCount > 0 && (
                  <span className="nav-count" aria-label={`${openCount} open`}>
                    {openCount}
                  </span>
                )}
                {'tier' in it && <span className="nav-tier">{it.tier}</span>}
              </NavLink>
            ))}
          </div>
        ))}
        <div className="sidebar-foot">
          Concept prototype. All data is simulated.
          <button
            className="btn sm ghost"
            style={{ marginTop: 8, paddingLeft: 0 }}
            onClick={() => api.reset().then(() => (window.location.href = '/'))}
          >
            Reset demo data
          </button>
        </div>
      </aside>
      <div className="main">
        <div className="topbar">
          <button
            className="btn sm menu-btn"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            Menu
          </button>
          <div className="search">
            <input
              type="search"
              placeholder="Search services, incidents, runbooks"
              aria-label="Search"
            />
          </div>
          <div className="spacer" />
          {health.data && (
            <span
              className="mode-chip"
              title="Set ANTHROPIC_API_KEY in apps/api/.env to use the live model"
            >
              Copilot: {health.data.copilotMode === 'claude' ? 'live model' : 'scripted'}
            </span>
          )}
          <div className="seg" role="group" aria-label="Theme">
            {(['system', 'light', 'dark'] as Theme[]).map((t) => (
              <button key={t} aria-pressed={theme === t} onClick={() => setTheme(t)}>
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {health.error && (
          <div className="content" style={{ paddingBottom: 0 }}>
            <div className="banner" role="alert" style={{ borderLeftColor: 'var(--crit)' }}>
              The API isn’t reachable. Run <code>npm run dev</code> from the repo root so both the
              API and web app start.
            </div>
          </div>
        )}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
