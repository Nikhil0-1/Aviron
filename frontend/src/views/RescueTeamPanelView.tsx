import React, { useState } from 'react';
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
  const { user } = useAuthStore();
  const { requests, updateRequestStatus, assignTeamAndAviron, setActiveRequestId } = useEmergencyStore();
  const { teams, members, chatMessages, addChatMessage } = useTeamStore();
  const { units, selectedUnitId, updateUnit } = useAvironStore();
  const { addNotification } = useNotificationStore();

  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'QUEUE' | 'LIVE_OPS' | 'MEMBERS' | 'CHAT'>('DASHBOARD');
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
    setActiveTab('LIVE_OPS');
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
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      {/* Top Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 sticky top-[41px] z-30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-white leading-tight">AVIRON Rescue Operator Panel</h1>
            <p className="text-[11px] font-semibold text-teal-400 font-mono">Team Alpha Operations HQ</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'DASHBOARD' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('QUEUE')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'QUEUE' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Queue ({requests.filter((r) => r.status === 'NEW').length})
          </button>
          <button
            onClick={() => setActiveTab('LIVE_OPS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'LIVE_OPS' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Ops
          </button>
          <button
            onClick={() => setActiveTab('MEMBERS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'MEMBERS' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Team Members
          </button>
          <button
            onClick={() => setActiveTab('CHAT')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'CHAT' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Comms Chat
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">ACTIVE INCIDENTS</span>
                <p className="text-2xl font-black text-rose-400 mt-1">{requests.filter((r) => r.status !== 'RESOLVED').length}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">AVIRON UNITS</span>
                <p className="text-2xl font-black text-cyan-400 mt-1">{units.length}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">ASSIGNED MISSIONS</span>
                <p className="text-2xl font-black text-teal-400 mt-1">{requests.filter((r) => r.assignedTeamId === 'team-alpha').length}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">SURVIVORS ASSISTED</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">12</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">TEAM STATUS</span>
                <p className="text-lg font-black text-amber-400 mt-1">ON MISSION</p>
              </div>
            </div>

            {/* Main Interactive Vector Map */}
            <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-mono font-bold text-cyan-400">TACTICAL MAP — OPERATIONAL GRID</span>
                <button onClick={() => setActiveTab('LIVE_OPS')} className="text-xs text-teal-400 font-bold hover:underline">
                  Open Full Ops Controls →
                </button>
              </div>
              <div className="h-[420px] rounded-2xl overflow-hidden border border-slate-800">
                <LiveMap />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MISSION QUEUE */}
        {activeTab === 'QUEUE' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Emergency Mission Queue</h2>
                <p className="text-xs text-slate-400">Respond to incoming victim assistance dispatches</p>
              </div>

              {/* Priority Filters */}
              <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.map((req) => (
                <div key={req.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between shadow-lg">
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

                    <div className="mt-3 space-y-1">
                      <h3 className="text-sm font-extrabold text-white">{req.type} EMERGENCY</h3>
                      <p className="text-xs text-slate-300">{req.locationName}</p>
                      <p className="text-xs text-slate-400 italic pt-1">"{req.description}"</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Status: {req.status}</span>
                    {req.status === 'NEW' ? (
                      <button
                        onClick={() => handleAcceptMission(req.id)}
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>ACCEPT MISSION</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-bold">Assigned ({req.assignedTeamName})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TEAM LIVE OPERATIONS */}
        {activeTab === 'LIVE_OPS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Map & Live Video Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 h-[320px] overflow-hidden flex flex-col">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 mb-2">VECTOR NAVIGATION MAP</span>
                  <div className="flex-1 rounded-xl overflow-hidden">
                    <LiveMap />
                  </div>
                </div>
                <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 h-[320px] overflow-hidden flex flex-col">
                  <span className="text-[11px] font-mono font-bold text-teal-400 mb-2">OPTICAL / FLIR VIDEO FEED</span>
                  <div className="flex-1 rounded-xl overflow-hidden">
                    <LiveVideoFeed />
                  </div>
                </div>
              </div>

              {/* Mission Controls Bar */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold text-amber-400">TACTICAL MISSION CONTROLS</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => simEngine.start()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5"
                  >
                    <Play className="w-4 h-4" />
                    <span>START AUTONOMOUS NAV</span>
                  </button>
                  <button
                    onClick={() => simEngine.pause()}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5"
                  >
                    <Pause className="w-4 h-4" />
                    <span>PAUSE MISSION</span>
                  </button>
                  <button
                    onClick={() => {
                      simEngine.nextStep();
                      addNotification({
                        type: 'PAYLOAD',
                        title: '📦 MEDICAL PAYLOAD DROPPED',
                        message: 'REAK-1 Medical Supply Dropped onto victim rooftop platform.',
                      });
                    }}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5"
                  >
                    <Zap className="w-4 h-4" />
                    <span>DEPLOY MEDICAL PAYLOAD</span>
                  </button>
                  <button
                    onClick={() => {
                      updateRequestStatus('er-001', 'RESOLVED');
                      addNotification({
                        type: 'EMERGENCY',
                        title: '✅ MISSION MARKED RESOLVED',
                        message: 'Emergency #ER-2026-001 marked RESOLVED. AVIRON returning to base.',
                      });
                    }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MARK RESOLVED</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Telemetry & Victim Detail Sidebar */}
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold text-cyan-400">AVIRON-01 TELEMETRY</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-900 p-2.5 rounded-xl"><span className="text-slate-500">Battery</span><p className="font-bold text-cyan-400">{activeUnit.battery.toFixed(1)}%</p></div>
                  <div className="bg-slate-900 p-2.5 rounded-xl"><span className="text-slate-500">Speed</span><p className="font-bold text-emerald-400">{activeUnit.speed.toFixed(1)} m/s</p></div>
                  <div className="bg-slate-900 p-2.5 rounded-xl"><span className="text-slate-500">Signal</span><p className="font-bold text-amber-400">{activeUnit.signalStrength} dBm</p></div>
                  <div className="bg-slate-900 p-2.5 rounded-xl"><span className="text-slate-500">Heading</span><p className="font-bold text-teal-400">{activeUnit.heading.toFixed(0)}°</p></div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <span className="font-mono font-bold text-rose-400">ASSIGNED VICTIM INFO</span>
                <p className="text-slate-200 font-bold">Aarav Kumar (Stranded on rooftop)</p>
                <p className="text-slate-400">Location: Sector 4 Flood Plain</p>
                <p className="text-slate-400">Condition: Cannot move, needs medical kit</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TEAM MEMBERS MANAGEMENT */}
        {activeTab === 'MEMBERS' && (
          <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">Team Alpha Roster Management</h2>
                <p className="text-xs text-slate-400">Leader: Capt. Rahul Sharma | Active Operators: {members.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((mem) => (
                <div key={mem.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-teal-950 border border-teal-500/40 text-teal-400 flex items-center justify-center font-bold">
                      {mem.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white">{mem.name}</h4>
                      <p className="text-[11px] text-slate-400">{mem.role}</p>
                      <p className="text-[10px] font-mono text-cyan-400 mt-0.5">{mem.email}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full border ${
                      mem.status === 'ONLINE'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {mem.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COMMS CHAT */}
        {activeTab === 'CHAT' && (
          <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 flex flex-col h-[520px]">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h3 className="font-black text-white text-sm">Team Comms Network</h3>
                <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px] font-bold">
                  {(['EMERGENCY', 'MISSION', 'TEAM'] as const).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setChatChannel(ch)}
                      className={`px-2.5 py-0.5 rounded transition-all ${
                        chatChannel === ch ? 'bg-teal-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
              {chatMessages
                .filter((m) => m.channel === chatChannel)
                .map((msg) => (
                  <div key={msg.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="font-bold text-teal-400">{msg.senderName} ({msg.senderRole})</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed font-medium">{msg.message}</p>
                  </div>
                ))}
            </div>

            <form onSubmit={handleSendTeamChat} className="pt-3 border-t border-slate-800 flex space-x-2">
              <input
                type="text"
                placeholder={`Type message into ${chatChannel} channel...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
