import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FolderOpen,
  CheckCircle,
  LogOut,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderOpen },
    { to: '/tasks', label: 'Tasks', icon: CheckCircle },
  ];

  return (
    <aside className="w-60 bg-[#10121a] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div className="flex flex-col">
        {/* Workspace Brand Header */}
        <div className="h-14 px-5 flex items-center gap-2.5 border-b border-zinc-800/60">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-200">
            <span className="font-bold text-sm tracking-tight">K</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-zinc-100 leading-tight">
              Karya
            </span>
            <span className="text-[10px] text-zinc-400 leading-tight">
              Personal Workspace
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4">
          <div className="px-2 pb-1.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            Overview
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-800/90 text-zinc-100 shadow-sm border border-zinc-700/50'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 opacity-75" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Account & Session Footnote */}
      <div className="p-3 border-t border-zinc-800/60">
        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-zinc-700 text-zinc-200 flex items-center justify-center text-xs font-semibold shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-zinc-200 truncate">
                {user?.name || 'My Account'}
              </div>
              <div className="text-[10px] text-zinc-400 truncate">
                {user?.email || 'Logged in'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
