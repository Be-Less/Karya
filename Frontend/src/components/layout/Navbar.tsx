import React from 'react';
import { useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/projects/') && path !== '/projects') return 'Project Board';
    if (path === '/projects') return 'Projects';
    if (path === '/tasks') return 'Tasks';
    return 'Dashboard';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="h-14 border-b border-zinc-800/80 bg-[#0c0e14]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-zinc-400">Workspace</span>
        <span className="text-zinc-600">/</span>
        <span className="font-semibold text-zinc-200">{getPageTitle()}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] text-zinc-400 font-medium">
          {currentDate}
        </span>
      </div>
    </header>
  );
};
