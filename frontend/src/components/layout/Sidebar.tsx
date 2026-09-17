import React from 'react';
import {
  LayoutDashboard,
  Radio,
  Send,
  Plane,
  Eye,
  HeartPulse,
  MessageSquare,
  Activity,
  AlertTriangle,
  FileText,
  Activity as HealthIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live', label: 'Live Operations', icon: Radio },
    { id: 'missions', label: 'Missions', icon: Send },
    { id: 'fleet', label: 'Fleet Manager', icon: Plane },
    { id: 'detection', label: 'AI Detection', icon: Eye },
    { id: 'medical', label: 'Medical Assistance', icon: HeartPulse },
    { id: 'comms', label: 'Communications', icon: MessageSquare },
    { id: 'telemetry', label: 'Telemetry HUD', icon: Activity },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'health', label: 'System Health', icon: HealthIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-200 z-30 shadow-subtle ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <div className="flex items-center justify-between p-3 border-b border-slate-100">
        {!collapsed && (
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Command Menu
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors mx-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-navy-900 text-cyan-400 shadow-sm shadow-navy-900/20 ring-1 ring-cyan-400/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={item.label}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom Emergency System Status Card */}
      {!collapsed && (
        <div className="p-3 m-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center justify-between font-bold text-navy-950 mb-1">
            <span>AVIRON Gateway</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Sensors: Ready | RTK Lock: Active
          </p>
        </div>
      )}
    </aside>
  );
};
