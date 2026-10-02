import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  badge,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-slate-50/60 rounded-xl border border-dashed border-slate-300">
      <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-500 mb-4">
        {icon}
      </div>
      {badge && (
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
          {badge}
        </span>
      )}
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-4">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};
