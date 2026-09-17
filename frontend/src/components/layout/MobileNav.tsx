import React from 'react';
import { Home, Send, Radio, Plane, MoreHorizontal, AlertOctagon, RotateCcw, Pause } from 'lucide-react';
import { useAvironStore } from '../../store/useAvironStore';

interface MobileNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onEmergencyStop: () => void;
  onReturnBase: () => void;
  onPause: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onTabChange,
  onEmergencyStop,
  onReturnBase,
  onPause,
}) => {
  const { selectedUnitId, units } = useAvironStore();
  const selectedUnit = units.find((u) => u.id === selectedUnitId) || units[0];

  const mainTabs = [
    { id: 'overview', label: 'Home', icon: Home },
    { id: 'missions', label: 'Missions', icon: Send },
    { id: 'live', label: 'Live', icon: Radio },
    { id: 'fleet', label: 'Fleet', icon: Plane },
    { id: 'settings', label: 'More', icon: MoreHorizontal },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-elevated">
      {/* Sticky Mobile Quick Emergency Controls Bar */}
      <div className="px-3 py-1.5 bg-slate-900 text-white flex items-center justify-between gap-2 text-xs border-b border-slate-800">
        <div className="flex items-center space-x-1.5 font-mono text-[11px] text-cyan-400 font-bold truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{selectedUnit?.code || 'AVIRON-01'}</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={onPause}
            className="px-2 py-1 rounded bg-slate-800 text-slate-200 font-semibold hover:bg-slate-700 flex items-center space-x-1 text-[11px]"
          >
            <Pause className="w-3 h-3 text-amber-400" />
            <span>Pause</span>
          </button>
          <button
            onClick={onReturnBase}
            className="px-2 py-1 rounded bg-slate-800 text-cyan-400 font-semibold hover:bg-slate-700 flex items-center space-x-1 text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RTH</span>
          </button>
          <button
            onClick={onEmergencyStop}
            className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 font-bold text-white shadow-sm flex items-center space-x-1 text-[11px]"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>STOP</span>
          </button>
        </div>
      </div>

      {/* Main Mobile Bottom Navigation Tabs */}
      <nav className="flex items-center justify-around py-2">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center space-y-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive ? 'text-navy-950 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-navy-900 text-cyan-400' : 'text-slate-500'
                }`}
              >
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
