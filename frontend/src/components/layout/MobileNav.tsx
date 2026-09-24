import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MoreHorizontal, X, Home, HeartHandshake, ShieldAlert, Cpu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ADMIN_NAV_ITEMS, TEAM_NAV_ITEMS, VICTIM_NAV_ITEMS, NavItemConfig } from '../../config/navigationConfig';

interface MobileNavProps {
  currentPanel: 'PUBLIC' | 'VICTIM' | 'TEAM' | 'ADMIN';
  activeTab?: string;
  onTabChange?: (tab: any) => void;
  onNavigatePanel?: (panel: 'PUBLIC' | 'VICTIM' | 'TEAM' | 'ADMIN') => void;
  onPause?: () => void;
  onReturnBase?: () => void;
  onEmergencyStop?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPanel }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  const role = user?.role || 'ADMIN';

  // Get items for current panel
  let allNavItems: NavItemConfig[] = [];
  if (currentPanel === 'ADMIN') {
    allNavItems = ADMIN_NAV_ITEMS.filter((i) => i.roles.includes(role) || role === 'ADMIN');
  } else if (currentPanel === 'TEAM') {
    allNavItems = TEAM_NAV_ITEMS.filter((i) => i.roles.includes(role) || role === 'ADMIN');
  } else if (currentPanel === 'VICTIM') {
    allNavItems = VICTIM_NAV_ITEMS.filter((i) => i.roles.includes(role) || role === 'ADMIN');
  }

  // If on public landing page or no nav items found
  if (currentPanel === 'PUBLIC' || allNavItems.length === 0) {
    const publicTabs = [
      { id: 'PUBLIC', label: 'Landing', icon: Home, path: '/' },
      { id: 'VICTIM', label: 'Victim', icon: HeartHandshake, path: '/victim' },
      { id: 'TEAM', label: 'Rescue', icon: ShieldAlert, path: '/team' },
      { id: 'ADMIN', label: 'Admin', icon: Cpu, path: '/admin' },
    ];

    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-white shadow-2xl">
        <nav className="flex items-center justify-around py-2 px-1">
          {publicTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));

            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center justify-center space-y-0.5 px-3 py-1 rounded-xl transition-all ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  const primaryItems = allNavItems.filter((item) => item.mobilePriority === 1);
  const secondaryItems = allNavItems.filter((item) => item.mobilePriority === 2);

  const isSecondaryActive = secondaryItems.some((item) => location.pathname === item.path);

  const handleItemClick = (path: string) => {
    navigate(path);
    setShowMoreDrawer(false);
  };

  return (
    <>
      {/* Mobile Drawer Modal for Secondary / Priority 2 Nav Items */}
      {showMoreDrawer && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <MoreHorizontal className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">More Operational Views</h3>
              </div>
              <button
                onClick={() => setShowMoreDrawer(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.path)}
                    className={`flex items-center space-x-3 p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-400'}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="block text-xs font-extrabold text-white leading-tight">{item.label}</span>
                      {item.category && <span className="text-[9px] font-mono text-slate-500">{item.category}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-white shadow-2xl">
        <nav className="flex items-center justify-around py-2 px-1">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === '/admin' && location.pathname === '/admin') ||
              (item.path === '/team' && location.pathname === '/team') ||
              (item.path === '/victim' && location.pathname === '/victim');

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.path)}
                className={`flex flex-col items-center justify-center space-y-0.5 px-2 py-1 rounded-xl transition-all ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}

          {secondaryItems.length > 0 && (
            <button
              onClick={() => setShowMoreDrawer(true)}
              className={`flex flex-col items-center justify-center space-y-0.5 px-2 py-1 rounded-xl transition-all ${
                isSecondaryActive || showMoreDrawer ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${isSecondaryActive || showMoreDrawer ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}>
                <MoreHorizontal className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight">More</span>
            </button>
          )}
        </nav>
      </div>
    </>
  );
};
