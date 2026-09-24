import React, { useState } from 'react';
import { DemoControllerBar } from './components/dashboard/DemoControllerBar';
import { MobileNav } from './components/layout/MobileNav';
import { PublicLandingView } from './views/PublicLandingView';
import { VictimPanelView } from './views/VictimPanelView';
import { RescueTeamPanelView } from './views/RescueTeamPanelView';
import { AdminPanelView } from './views/AdminPanelView';
import { useNotificationStore } from './store/useNotificationStore';
import { X, Bell } from 'lucide-react';

export const App: React.FC = () => {
  const [currentPanel, setCurrentPanel] = useState<'PUBLIC' | 'VICTIM' | 'TEAM' | 'ADMIN'>('PUBLIC');
  const { notifications, markAsRead } = useNotificationStore();

  const activeToasts = notifications.filter((n) => !n.isRead).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col">
      {/* Universal Top Demo Controller Bar */}
      <DemoControllerBar currentPanel={currentPanel} onNavigatePanel={setCurrentPanel} />

      {/* Main Panel View Routing */}
      <main className="flex-1">
        {currentPanel === 'PUBLIC' && <PublicLandingView onNavigatePanel={setCurrentPanel} />}
        {currentPanel === 'VICTIM' && <VictimPanelView onNavigatePanel={setCurrentPanel} />}
        {currentPanel === 'TEAM' && <RescueTeamPanelView onNavigatePanel={setCurrentPanel} />}
        {currentPanel === 'ADMIN' && <AdminPanelView onNavigatePanel={setCurrentPanel} />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav currentPanel={currentPanel} onNavigatePanel={setCurrentPanel} />

      {/* Real-Time Cross-Panel Notification Toasts Overlay */}
      <div className="fixed bottom-14 sm:bottom-4 right-4 z-50 space-y-2 max-w-xs sm:max-w-sm pointer-events-auto">
        {activeToasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-slate-950/95 border border-cyan-500/40 text-white p-3.5 rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 flex items-start justify-between space-x-3 text-xs"
          >
            <div className="flex items-start space-x-2">
              <Bell className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <h5 className="font-extrabold text-cyan-300">{toast.title}</h5>
                <p className="text-slate-300 text-[11px] mt-0.5 leading-snug">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => markAsRead(toast.id)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
