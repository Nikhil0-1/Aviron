import React from 'react';
import { Home, AlertTriangle, Activity, MessageSquare, Upload, ShieldAlert, Navigation, Users, Cpu, MapPin, Settings, HeartHandshake } from 'lucide-react';
import { Role } from '../../types';

interface TabItem {
  id: string;
  label: string;
  icon: any;
  panel?: 'PUBLIC' | 'VICTIM' | 'TEAM' | 'ADMIN';
}

interface MobileNavProps {
  currentPanel: 'PUBLIC' | 'VICTIM' | 'TEAM' | 'ADMIN';
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  userRole?: Role;
  onNavigatePanel?: (panel: 'PUBLIC' | 'VICTIM' | 'TEAM' | 'ADMIN') => void;
  onPause?: () => void;
  onReturnBase?: () => void;
  onEmergencyStop?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPanel,
  activeTab = 'HOME',
  onTabChange,
  userRole = 'ADMIN',
  onNavigatePanel,
}) => {
  // Define Role-Specific Bottom Navigation Bar Items
  const getTabs = (): TabItem[] => {
    if (currentPanel === 'VICTIM') {
      return [
        { id: 'HOME', label: 'Home', icon: Home },
        { id: 'WIZARD', label: 'Help', icon: AlertTriangle },
        { id: 'STATUS', label: 'Status', icon: Activity },
        { id: 'CHAT', label: 'Messages', icon: MessageSquare },
        { id: 'MEDIA', label: 'Upload', icon: Upload },
      ];
    } else if (currentPanel === 'TEAM') {
      return [
        { id: 'DASHBOARD', label: 'Dashboard', icon: ShieldAlert },
        { id: 'QUEUE', label: 'Queue', icon: AlertTriangle },
        { id: 'LIVE_OPS', label: 'Live Ops', icon: Navigation },
        { id: 'MEMBERS', label: 'Members', icon: Users },
        { id: 'CHAT', label: 'Messages', icon: MessageSquare },
      ];
    } else if (currentPanel === 'ADMIN') {
      return [
        { id: 'DASHBOARD', label: 'Dashboard', icon: Cpu },
        { id: 'MAP', label: 'Map', icon: MapPin },
        { id: 'USERS', label: 'Users', icon: Users },
        { id: 'AVIRON', label: 'Fleet', icon: Navigation },
        { id: 'EMERGENCIES', label: 'Alerts', icon: AlertTriangle },
        { id: 'SETTINGS', label: 'Settings', icon: Settings },
      ];
    } else {
      return [
        { id: 'PUBLIC', label: 'Landing', icon: Home, panel: 'PUBLIC' },
        { id: 'VICTIM', label: 'Victim', icon: HeartHandshake, panel: 'VICTIM' },
        { id: 'TEAM', label: 'Rescue', icon: ShieldAlert, panel: 'TEAM' },
        { id: 'ADMIN', label: 'Admin', icon: Cpu, panel: 'ADMIN' },
      ];
    }
  };

  const tabs = getTabs();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-white shadow-2xl">
      <nav className="flex items-center justify-around py-2 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (tab.panel && currentPanel === tab.panel);

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.panel && onNavigatePanel) {
                  onNavigatePanel(tab.panel);
                } else if (onTabChange) {
                  onTabChange(tab.id);
                }
              }}
              className={`flex flex-col items-center justify-center space-y-0.5 px-2 py-1 rounded-xl transition-all ${
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
};
