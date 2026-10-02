import React from 'react';
import { LayoutDashboard, FolderGit2, FileText, Layers } from 'lucide-react';
import { PageView } from '../../types/navigation.js';

interface SidebarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  onCloseMobile?: () => void;
}

interface NavItemConfig {
  id: PageView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'documents', label: 'Documents', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onCloseMobile,
}) => {
  const handleItemClick = (view: PageView) => {
    onNavigate(view);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      aria-label="Main Navigation"
      className="flex flex-col h-full bg-white border-r border-slate-200 select-none"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/20">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <span className="font-semibold text-slate-900 text-base tracking-tight block">
            ContextBridge
          </span>
          <span className="text-xs text-slate-500 font-normal">
            Project Continuity
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Workspace
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-brand-600' : 'text-slate-400'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Architecture Phase Badge in Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="rounded-lg bg-white border border-slate-200 p-3 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-800">Phase 1: Foundation</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Core layout & modular architecture initialized.
          </p>
        </div>
      </div>
    </aside>
  );
};
