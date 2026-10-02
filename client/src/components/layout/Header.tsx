import React from 'react';
import { Menu, Server, Database, RefreshCw } from 'lucide-react';
import { PageView } from '../../types/navigation.js';
import { Badge } from '../common/Badge.js';
import { HealthResponse } from '../../services/api.js';

interface HeaderProps {
  currentView: PageView;
  onOpenMobileMenu: () => void;
  health: HealthResponse | null;
  healthLoading: boolean;
  onRefreshHealth: () => void;
}

const VIEW_TITLES: Record<PageView, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Platform Overview',
    subtitle: 'System architecture, service status, and project continuity health',
  },
  projects: {
    title: 'Projects',
    subtitle: 'Manage codebases and continuity boundaries',
  },
  documents: {
    title: 'Documents & Knowledge',
    subtitle: 'Repository of architecture notes, RFCs, and decision records',
  },
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onOpenMobileMenu,
  health,
  healthLoading,
  onRefreshHealth,
}) => {
  const currentInfo = VIEW_TITLES[currentView];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* Mobile menu hamburger button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open mobile menu"
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* View Breadcrumb / Title */}
        <div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight leading-tight">
            {currentInfo.title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Backend API & Database Connection Status */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">API:</span>
          {healthLoading ? (
            <Badge variant="neutral">Checking...</Badge>
          ) : health && (health.status === 'ok' || health.status === 'degraded') ? (
            <Badge variant="success">Online (:5000)</Badge>
          ) : (
            <Badge variant="warning">Offline</Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 hidden md:inline">MongoDB:</span>
          {healthLoading ? (
            <Badge variant="neutral">Checking...</Badge>
          ) : health?.database?.connected ? (
            <Badge variant="success">Connected</Badge>
          ) : (
            <Badge variant="warning">Disconnected</Badge>
          )}
        </div>

        {/* Real Functional Refresh Health Button */}
        <button
          type="button"
          onClick={onRefreshHealth}
          disabled={healthLoading}
          aria-label="Check API and Database health"
          title="Refresh Backend and Database Health Check"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${healthLoading ? 'animate-spin' : ''}`}
          />
        </button>
      </div>
    </header>
  );
};
