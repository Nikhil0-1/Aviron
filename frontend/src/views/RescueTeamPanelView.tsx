import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, Play, Pause, RotateCcw, Send, CheckCircle2, AlertTriangle, Radio, Navigation, Users, MessageSquare, Video, Activity, MapPin, Eye, Zap, Flame } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useEmergencyStore } from '../store/useEmergencyStore';
import { useTeamStore } from '../store/useTeamStore';
import { useAvironStore } from '../store/useAvironStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { DemoSimulationEngine } from '../services/simulation/DemoSimulationEngine';
import { LiveMap } from '../components/map/LiveMap';
import { LiveVideoFeed } from '../components/dashboard/LiveVideoFeed';

interface RescueTeamPanelViewProps {
  onNavigatePanel: (panel: 'PUBLIC' | 'VICTIM' | 'TEAM' | 'ADMIN') => void;
}

export const RescueTeamPanelView: React.FC<RescueTeamPanelViewProps> = ({ onNavigatePanel }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { requests, updateRequestStatus, assignTeamAndAviron, setActiveRequestId } = useEmergencyStore();
  const { teams, members, chatMessages, addChatMessage } = useTeamStore();
  const { units, selectedUnitId, updateUnit } = useAvironStore();
  const { addNotification } = useNotificationStore();

  const getTabFromPath = (path: string) => {
    if (path.includes('/missions') || path.includes('/queue')) return 'QUEUE';
    if (path.includes('/live')) return 'LIVE_OPS';
    if (path.includes('/members')) return 'MEMBERS';
    if (path.includes('/chat')) return 'CHAT';
    return 'DASHBOARD';
  };

  const activeTab = getTabFromPath(location.pathname);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'DASHBOARD') navigate('/team');
    else if (tabId === 'QUEUE' || tabId === 'MISSIONS') navigate('/team/missions');
    else if (tabId === 'LIVE_OPS' || tabId === 'LIVE') navigate('/team/live');
    else if (tabId === 'MEMBERS') navigate('/team/members');
    else if (tabId === 'CHAT') navigate('/team/chat');
  };

  const [queueFilter, setQueueFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [chatChannel, setChatChannel] = useState<'MISSION' | 'TEAM' | 'EMERGENCY'>('EMERGENCY');
  const [chatInput, setChatInput] = useState('');

  const activeUnit = units.find((u) => u.id === selectedUnitId) || units[0];
  const simEngine = DemoSimulationEngine.getInstance();

  const handleAcceptMission = (reqId: string) => {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;

    assignTeamAndAviron(reqId, 'team-alpha', 'Team Alpha (Rapid Recon)', activeUnit.id, activeUnit.code);
    updateRequestStatus(reqId, 'AVIRON_DEPLOYED');
    setActiveRequestId(reqId);

    addNotification({
      targetRole: 'VICTIM',
      type: 'MISSION',
      title: '🚨 RESCUE TEAM ASSIGNED',
      message: `Team Alpha accepted Emergency #${req.requestCode}. ${activeUnit.code} deployed.`,
    });

    addNotification({
      targetRole: 'ADMIN',
      type: 'MISSION',
      title: '⚡ TEAM ALPHA DISPATCHED',
      message: `Capt. Rahul accepted mission for ${req.requestCode}.`,
    });

    simEngine.start();
    handleTabChange('LIVE_OPS');
  };

  const handleSendTeamChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    addChatMessage({
      teamId: 'team-alpha',
      channel: chatChannel,
      senderId: user?.id || 'usr-operator-01',
      senderName: user?.name || 'Sarah Connor',
      senderRole: user?.role || 'RESCUE_OPERATOR',
      message: chatInput,
    });

    setChatInput('');
  };

  const filteredRequests = requests.filter((r) => {
    if (queueFilter === 'ALL') return true;
    return r.priority === queueFilter;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 max-w-full pb-20 bg-slate-900 text-slate-100 font-sans">
      {/* Responsive Panel Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 sm:py-3.5 relative z-30 min-w-0 max-w-full flex-shrink-0">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-between min-w-0">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-black text-white truncate leading-tight">AVIRON Rescue Panel</h1>
                <p className="text-xs font-semibold text-teal-400 font-mono truncate">Team Alpha HQ Operational Unit</p>
              </div>
            </div>

            <button
              onClick={() => handleTabChange('LIVE_OPS')}
              className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md shrink-0 flex items-center space-x-1.5 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>LIVE OPS</span>
            </button>
          </div>

          {/* Scrollable Tab Bar */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold overflow-x-auto no-scrollbar max-w-full min-w-0 flex-nowrap">
            <button
              onClick={() => handleTabChange('DASHBOARD')}
              className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'DASHBOARD' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleTabChange('QUEUE')}
              className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'QUEUE' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Queue ({requests.filter((r) => r.status === 'NEW').length})
            </button>
            <button
              onClick={() => handleTabChange('LIVE_OPS')}
              className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'LIVE_OPS' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Ops
            </button>
            <button
              onClick={() => handleTabChange('MEMBERS')}
              className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'MEMBERS' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Roster
            </button>
            <button
              onClick={() => handleTabChange('CHAT')}
              className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'CHAT' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Comms
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 min-w-0 flex-1">
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6 min-w-0">
            {/* System KPIs Grid (2 cols mobile, 3 cols tablet/laptop, 4 cols desktop, 5 cols large screen) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5 min-w-0 overflow-visible">
              <div
                onClick={() => handleTabChange('QUEUE')}
                className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all hover:scale-[1.02] min-w-0 min-h-[110px] flex flex-col justify-between overflow-visible shadow-md"
              >
                <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block truncate">ACTIVE INCIDENTS</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <p className="text-2xl sm:text-3xl font-black text-rose-400 leading-none">{requests.filter((r) => r.status !== 'RESOLVED').length}</p>
                  <span className="text-[10px] font-mono text-rose-400/80 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900/60">DISPATCH</span>
                </div>
              </div>

              <div
                onClick={() => handleTabChange('LIVE_OPS')}
                className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-[1.02] min-w-0 min-h-[110px] flex flex-col justify-between overflow-visible shadow-md"
              >
                <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block truncate">AVIRON UNITS</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <p className="text-2xl sm:text-3xl font-black text-cyan-400 leading-none">{units.length}</p>
                  <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900/60">READY</span>
                </div>
              </div>

              <div
                onClick={() => handleTabChange('QUEUE')}
                className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all hover:scale-[1.02] min-w-0 min-h-[110px] flex flex-col justify-between overflow-visible shadow-md"
              >
                <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block truncate">ASSIGNED MISSIONS</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <p className="text-2xl sm:text-3xl font-black text-teal-400 leading-none">{requests.filter((r) => r.assignedTeamId === 'team-alpha').length}</p>
                  <span className="text-[10px] font-mono text-teal-400/80 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-900/60">ACTIVE</span>
                </div>
              </div>

              <div
                onClick={() => handleTabChange('DASHBOARD')}
                className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.02] min-w-0 min-h-[110px] flex flex-col justify-between overflow-visible shadow-md"
              >
                <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block truncate">SURVIVORS ASSISTED</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <p className="text-2xl sm:text-3xl font-black text-emerald-400 leading-none">12</p>
                  <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60">RESCUED</span>
                </div>
              </div>

              <div
                onClick={() => handleTabChange('MEMBERS')}
                className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:scale-[1.02] min-w-0 min-h-[110px] flex flex-col justify-between overflow-visible shadow-md"
              >
                <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block truncate">TEAM STATUS</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <p className="text-xl sm:text-2xl font-black text-amber-400 leading-none">ON MISSION</p>
                  <span className="text-[10px] font-mono text-amber-400/80 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/60">ALPHA</span>
                </div>
              </div>
            </div>

            {/* Main Tactical Vector Map */}
            <div className="bg-slate-950 rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-xl min-w-0 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 min-w-0">
                <span className="text-xs font-mono font-bold text-cyan-400 truncate">TACTICAL MAP DISPLAY</span>
                <button onClick={() => handleTabChange('LIVE_OPS')} className="text-xs text-teal-400 font-bold hover:underline shrink-0">
                  Full Controls →
                </button>
              </div>
              <div className="h-[360px] sm:h-[440px] lg:h-[480px] xl:h-[540px] rounded-2xl overflow-hidden border border-slate-800 w-full min-w-0">
                <LiveMap />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MISSION QUEUE */}
        {activeTab === 'QUEUE' && (
          <div className="space-y-4 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
              <div>
                <h2 className="text-lg font-black text-white">Emergency Queue</h2>
                <p className="text-xs text-slate-400">Respond to incoming emergency dispatches</p>
              </div>

              {/* Priority Filters */}
              <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold overflow-x-auto no-scrollbar max-w-full">
                {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setQueueFilter(p)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      queueFilter === p ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 min-w-0">
              {filteredRequests.map((req) => (
                <div key={req.id} className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between shadow-lg min-w-0">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-mono font-bold text-cyan-400">{req.requestCode}</span>
                      <span
                        className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded ${
                          req.priority === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {req.priority}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-extrabold text-white truncate">{req.type} EMERGENCY</h3>
                      <p className="text-xs text-slate-300 truncate">{req.locationName}</p>
                      <p className="text-xs text-slate-400 italic pt-1 line-clamp-2">"{req.description}"</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-400 truncate">Status: {req.status}</span>
                    {req.status === 'NEW' ? (
                      <button
                        onClick={() => handleAcceptMission(req.id)}
                        className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1 shrink-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ACCEPT</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-bold shrink-0">Assigned</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TEAM LIVE OPERATIONS */}
        {activeTab === 'LIVE_OPS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-w-0">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
              {/* Map & Live Video Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 min-w-0">
                <div className="bg-slate-950 rounded-2xl p-2.5 sm:p-3 border border-slate-800 h-[280px] sm:h-[340px] overflow-hidden flex flex-col min-w-0">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 mb-1.5 truncate">VECTOR NAVIGATION MAP</span>
                  <div className="flex-1 rounded-xl overflow-hidden min-w-0">
                    <LiveMap />
                  </div>
                </div>
                <div className="bg-slate-950 rounded-2xl p-2.5 sm:p-3 border border-slate-800 h-[280px] sm:h-[340px] overflow-hidden flex flex-col min-w-0">
                  <span className="text-[10px] font-mono font-bold text-teal-400 mb-1.5 truncate">OPTICAL / FLIR STREAM</span>
                  <div className="flex-1 rounded-xl overflow-hidden min-w-0">
                    <LiveVideoFeed />
                  </div>
                </div>
              </div>

              {/* Mission Controls Bar */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 min-w-0">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">Mission Controls</span>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => simEngine.start()}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center space-x-1"
                  >
                    <Play className="w-3.5 h-3.5 shrink-0" />
                    <span>START NAV</span>
                  </button>
                  <button
                    onClick={() => simEngine.pause()}
                    className="py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl flex items-center justify-center space-x-1"
                  >
                    <Pause className="w-3.5 h-3.5 shrink-0" />
                    <span>PAUSE</span>
                  </button>
                  <button
                    onClick={() => {
                      simEngine.nextStep();
                      addNotification({
                        type: 'PAYLOAD',
                        title: '📦 MEDICAL PAYLOAD DROPPED',
                        message: 'REAK-1 Medical Supply Kit dropped onto rooftop platform.',
                      });
                    }}
                    className="py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl flex items-center justify-center space-x-1 col-span-2 sm:col-auto"
                  >
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span>DROP PAYLOAD</span>
                  </button>
                  <button
                    onClick={() => {
                      updateRequestStatus('er-001', 'RESOLVED');
                      addNotification({
                        type: 'EMERGENCY',
                        title: '✅ MISSION RESOLVED',
                        message: 'Incident marked RESOLVED.',
                      });
                    }}
                    className="py-2.5 px-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl flex items-center justify-center space-x-1 col-span-2 sm:col-auto"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>MARK RESOLVED</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Telemetry & Victim Info Sidebar */}
            <div className="space-y-4 min-w-0">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 min-w-0">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">AVIRON Telemetry</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-900 p-2 rounded-xl"><span className="text-slate-500 text-[10px]">Battery</span><p className="font-bold text-cyan-400">{activeUnit.battery.toFixed(1)}%</p></div>
                  <div className="bg-slate-900 p-2 rounded-xl"><span className="text-slate-500 text-[10px]">Speed</span><p className="font-bold text-emerald-400">{activeUnit.speed.toFixed(1)} m/s</p></div>
                  <div className="bg-slate-900 p-2 rounded-xl"><span className="text-slate-500 text-[10px]">Signal</span><p className="font-bold text-amber-400">{activeUnit.signalStrength} dBm</p></div>
                  <div className="bg-slate-900 p-2 rounded-xl"><span className="text-slate-500 text-[10px]">Heading</span><p className="font-bold text-teal-400">{activeUnit.heading.toFixed(0)}°</p></div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5 text-xs min-w-0">
                <span className="font-mono font-bold text-rose-400 uppercase">Assigned Victim</span>
                <p className="text-slate-200 font-bold truncate">Aarav Kumar (Rooftop Stranded)</p>
                <p className="text-slate-400 text-[11px] truncate">Sector 4 Flood Plain</p>
                <p className="text-slate-400 text-[11px]">Condition: Cannot move, needs medical kit</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MEMBERS */}
        {activeTab === 'MEMBERS' && (
          <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 space-y-4 min-w-0 shadow-xl">
            <h2 className="text-base sm:text-lg font-black text-white">Team Roster Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-w-0">
              {members.map((mem) => (
                <div key={mem.id} className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs min-w-0">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-teal-950 border border-teal-500/40 text-teal-400 flex items-center justify-center font-bold shrink-0">
                      {mem.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-white truncate">{mem.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{mem.role}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
                    {mem.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COMMS CHAT */}
        {activeTab === 'CHAT' && (
          <div className="bg-slate-950 rounded-3xl p-4 sm:p-5 border border-slate-800 flex flex-col h-[480px] min-w-0 shadow-xl">
            <div className="pb-2.5 border-b border-slate-800 flex items-center justify-between min-w-0">
              <h3 className="font-black text-white text-xs sm:text-sm truncate">Team Comms Network</h3>
              <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[10px] font-bold shrink-0">
                {(['EMERGENCY', 'MISSION', 'TEAM'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setChatChannel(ch)}
                    className={`px-2 py-0.5 rounded transition-all ${
                      chatChannel === ch ? 'bg-teal-500 text-slate-950' : 'text-slate-400'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1 text-xs min-w-0">
              {chatMessages
                .filter((m) => m.channel === chatChannel)
                .map((msg) => (
                  <div key={msg.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="font-bold text-teal-400 truncate">{msg.senderName} ({msg.senderRole})</span>
                      <span className="shrink-0">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-200 leading-snug font-medium break-words">{msg.message}</p>
                  </div>
                ))}
            </div>

            <form onSubmit={handleSendTeamChat} className="pt-2 border-t border-slate-800 flex space-x-2">
              <input
                type="text"
                placeholder={`Type into ${chatChannel}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-0"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
