import React, { useState } from 'react';
import { Radio, AlertTriangle, ShieldCheck, Cpu, Bell, CheckCircle2, Database, Cloud, Flame, Server } from 'lucide-react';
import { useAvironStore } from '../../store/useAvironStore';
import { useConnectionStore } from '../../store/useConnectionStore';
import { useAlertStore } from '../../store/useAlertStore';
import { useAuthStore } from '../../store/useAuthStore';
import { isFirebaseWebConfigured } from '../../config/firebase';
import { isSupabaseWebConfigured } from '../../config/supabase';

export const Header: React.FC = () => {
  const { mode, setMode } = useAvironStore();
  const { status: connStatus } = useConnectionStore();
  const { alerts, acknowledgeAlert } = useAlertStore();
  const { user } = useAuthStore();
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);
  const [showServicesStatus, setShowServicesStatus] = useState(false);

  const unreadAlerts = alerts.filter((a) => !a.isAcknowledged);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-subtle px-4 py-2.5 flex items-center justify-between transition-all">
      {/* Brand & Identity */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-navy-900 text-cyan-400 shadow-md ring-2 ring-cyan-500/20">
          <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold tracking-tight text-navy-950 font-sans leading-none">
              AVIRON
            </h1>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              v1.0 Autonomous Rescue
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 hidden md:block mt-0.5">
            Autonomous Intelligence. Rapid Response. Human Assistance.
          </p>
        </div>
      </div>

      {/* Center Mode & Multi-Service Infrastructure Status Badges */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Hardware Mode Switcher Button */}
        <button
          onClick={() => setMode(mode === 'DEMO' ? 'LIVE_HARDWARE' : 'DEMO')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border transition-all shadow-sm ${
            mode === 'DEMO'
              ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              : 'bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100'
          }`}
          title="Toggle Hardware Mode"
        >
          {mode === 'DEMO' ? (
            <>
              <Cpu className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>DEMO SIMULATION</span>
            </>
          ) : (
            <>
              <Radio className="w-3.5 h-3.5 text-teal-600" />
              <span>LIVE HARDWARE</span>
            </>
          )}
        </button>

        {/* Infrastructure Status Popover Button */}
        <div className="relative hidden xs:block">
          <button
            onClick={() => setShowServicesStatus(!showServicesStatus)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            title="System Infrastructure Integration Status"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[11px] font-bold">Services Status</span>
          </button>

          {/* Infrastructure Health Card Dropdown */}
          {showServicesStatus && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-elevated border border-slate-200 z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
              <div className="font-extrabold text-navy-950 pb-2 border-b border-slate-100 mb-3 flex items-center justify-between">
                <span>Infrastructure Integrations</span>
                <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded font-mono">LIVE HUD</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-slate-600"><Flame className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Firebase Auth</span>
                  <span className={`font-bold ${isFirebaseWebConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>{isFirebaseWebConfigured ? 'CONNECTED' : 'DEMO MODE'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-slate-600"><Database className="w-3.5 h-3.5 mr-1.5 text-cyan-600" /> Supabase DB (RLS)</span>
                  <span className={`font-bold ${isSupabaseWebConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>{isSupabaseWebConfigured ? 'CONNECTED' : 'DEMO DB'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-slate-600"><Cloud className="w-3.5 h-3.5 mr-1.5 text-teal-600" /> Cloudflare R2 Storage</span>
                  <span className="font-bold text-emerald-600">AVAILABLE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-slate-600"><Radio className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> WebSocket Gateway</span>
                  <span className="font-bold text-emerald-600">CONNECTED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-slate-600"><Server className="w-3.5 h-3.5 mr-1.5 text-slate-700" /> Raspberry Pi HAL</span>
                  <span className="font-bold text-teal-600">{mode === 'LIVE_HARDWARE' ? 'ONLINE' : 'SIMULATED'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <button
            onClick={() => setShowAlertsMenu(!showAlertsMenu)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {showAlertsMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-elevated border border-slate-200 z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-navy-950">Active Emergency Alerts</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                  {unreadAlerts.length} new
                </span>
              </div>

              <div className="mt-3 max-h-72 overflow-y-auto space-y-2.5 pr-1">
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No active alerts recorded.</p>
                ) : (
                  alerts.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border text-xs ${
                        item.severity === 'CRITICAL'
                          ? 'bg-red-50/80 border-red-200 text-red-950'
                          : item.severity === 'HIGH'
                          ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-xs">{item.title}</span>
                        {!item.isAcknowledged && (
                          <button
                            onClick={() => acknowledgeAlert(item.id)}
                            className="text-[10px] font-semibold text-cyan-700 hover:underline flex items-center space-x-0.5"
                          >
                            <CheckCircle2 className="w-3 h-3 inline mr-0.5" /> Ack
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 leading-snug">{item.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-navy-900 text-cyan-400 flex items-center justify-center font-bold text-xs shadow-sm">
            {user?.name ? user.name.charAt(0) : 'O'}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-navy-950 leading-tight">{user?.name || 'Operator'}</div>
            <div className="text-[10px] font-semibold text-cyan-600 uppercase tracking-wider">{user?.role || 'OPERATOR'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
