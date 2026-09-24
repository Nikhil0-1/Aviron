import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Cpu, Users, ShieldCheck, AlertTriangle, Radio, Activity, Database, Cloud, Flame, Settings, FileText, CheckCircle2, UserCheck, Plus, Search, Filter, RefreshCw, BarChart2, X, Lock, Eye, Edit3, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useEmergencyStore } from '../store/useEmergencyStore';
import { useTeamStore } from '../store/useTeamStore';
import { useAvironStore } from '../store/useAvironStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { LiveMap } from '../components/map/LiveMap';
import { Role, UnitStatus } from '../types';

interface AdminPanelViewProps {
  onNavigatePanel: (panel: 'PUBLIC' | 'VICTIM' | 'TEAM' | 'ADMIN') => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ onNavigatePanel }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, switchRole } = useAuthStore();
  const { requests, assignTeamAndAviron, updateRequestStatus } = useEmergencyStore();
  const { teams, members, addTeam } = useTeamStore();
  const { units, setMode, mode, raspberryPiConfig, setRaspberryPiConfig } = useAvironStore();
  const { addNotification } = useNotificationStore();

  const getTabFromPath = (path: string) => {
    if (path.includes('/map')) return 'MAP';
    if (path.includes('/users')) return 'USERS';
    if (path.includes('/teams')) return 'TEAMS';
    if (path.includes('/fleet') || path.includes('/aviron')) return 'AVIRON';
    if (path.includes('/emergencies')) return 'EMERGENCIES';
    if (path.includes('/reports')) return 'REPORTS';
    if (path.includes('/settings')) return 'SETTINGS';
    return 'DASHBOARD';
  };

  const activeTab = getTabFromPath(location.pathname);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'DASHBOARD') navigate('/admin');
    else if (tabId === 'MAP') navigate('/admin/map');
    else if (tabId === 'USERS') navigate('/admin/users');
    else if (tabId === 'TEAMS') navigate('/admin/teams');
    else if (tabId === 'AVIRON' || tabId === 'FLEET') navigate('/admin/fleet');
    else if (tabId === 'EMERGENCIES') navigate('/admin/emergencies');
    else if (tabId === 'REPORTS') navigate('/admin/reports');
    else if (tabId === 'SETTINGS') navigate('/admin/settings');
  };

  // Role Access Guard Check
  if (user?.role !== 'ADMIN' && user?.role !== 'VIEWER') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-950 p-8 rounded-3xl border border-rose-800 text-center max-w-md space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-950 text-rose-500 border border-rose-800 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">Admin Access Restricted</h2>
          <p className="text-xs text-slate-400">
            You are logged in as <span className="text-rose-400 font-bold">{user?.name} ({user?.role})</span>. Only administrators can access this system management panel.
          </p>
          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={() => switchRole('ADMIN')}
              className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl"
            >
              Switch Role to System Admin
            </button>
            <button
              onClick={() => onNavigatePanel('TEAM')}
              className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
            >
              Return to Rescue Team Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Users List State
  const [usersList, setUsersList] = useState([
    { id: 'usr-admin-01', name: 'Cmdr. Helena Vance', email: 'admin@aviron.io', role: 'ADMIN' as Role, status: 'ACTIVE', lastActive: '2 min ago', created: '2026-01-15' },
    { id: 'usr-team-lead-01', name: 'Capt. Rahul Sharma', email: 'rahul.sharma@aviron.io', role: 'TEAM_LEADER' as Role, status: 'ACTIVE', lastActive: '5 min ago', created: '2026-02-01' },
    { id: 'usr-operator-01', name: 'Sarah Connor', email: 'operator@aviron.io', role: 'RESCUE_OPERATOR' as Role, status: 'ACTIVE', lastActive: 'Just now', created: '2026-02-10' },
    { id: 'usr-medic-01', name: 'Dr. Amit Patel', email: 'medic@aviron.io', role: 'MEDICAL_OPERATOR' as Role, status: 'ACTIVE', lastActive: '12 min ago', created: '2026-02-15' },
    { id: 'usr-victim-01', name: 'Aarav Kumar', email: 'aarav.kumar@gmail.com', role: 'VICTIM' as Role, status: 'ACTIVE', lastActive: '1 min ago', created: '2026-03-01' },
  ]);

  // Unit Registration Modal state
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [newUnitCode, setNewUnitCode] = useState('AVIRON-05');
  const [newUnitName, setNewUnitName] = useState('Echo Guardian');
  const [newUnitModel, setNewUnitModel] = useState('AVIRON Mk-IV Amphibious Recon');
  const [newUnitPiId, setNewUnitPiId] = useState('RPI-5-DELTA-05');

  // New Team Modal state
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('Team Delta');
  const [newTeamLeader, setNewTeamLeader] = useState('Arjun Nair');

  // Emergency Detail Drawer Modal
  const [selectedEmergency, setSelectedEmergency] = useState<any | null>(null);

  const handleRegisterUnit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUnit = {
      id: `unit-${Date.now()}`,
      code: newUnitCode,
      name: newUnitName,
      model: newUnitModel,
      status: 'STANDBY' as UnitStatus,
      battery: 100,
      lat: 28.6139,
      lng: 77.2090,
      speed: 0,
      heading: 0,
      signalStrength: 98,
      raspberryPiId: newUnitPiId,
      lastSeen: new Date().toISOString(),
    };
    useAvironStore.getState().setUnits([...units, newUnit]);
    setShowAddUnitModal(false);

    addNotification({
      targetRole: 'ADMIN',
      type: 'SYSTEM',
      title: '🤖 NEW AVIRON UNIT REGISTERED',
      message: `Unit ${newUnitCode} registered into fleet roster.`,
    });
  };

  const handleRegisterTeam = (e: React.FormEvent) => {
    e.preventDefault();
    addTeam({
      code: `TEAM-0${teams.length + 1}`,
      name: newTeamName,
      leaderId: `usr-lead-${Date.now()}`,
      leaderName: newTeamLeader,
      status: 'STANDBY',
      memberCount: 3,
    });
    setShowAddTeamModal(false);

    addNotification({
      targetRole: 'ADMIN',
      type: 'SYSTEM',
      title: '🚨 NEW RESCUE TEAM CREATED',
      message: `${newTeamName} created with leader ${newTeamLeader}.`,
    });
  };

  const handleChangeRole = (userId: string, newRole: Role) => {
    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' } : u)));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20">
      {/* Top Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 sticky top-[41px] z-30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-white leading-tight">AVIRON System Admin Panel</h1>
            <p className="text-[11px] font-semibold text-indigo-400 font-mono">Global Command & Control Hub</p>
          </div>
        </div>

        {/* Tab Navigation Bar (Scrollable on mobile) */}
        <div className="hidden sm:flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          {[
            { id: 'DASHBOARD', label: 'Dashboard' },
            { id: 'MAP', label: 'Live Map' },
            { id: 'USERS', label: 'Users' },
            { id: 'TEAMS', label: 'Teams' },
            { id: 'AVIRON', label: 'Fleet' },
            { id: 'EMERGENCIES', label: 'Emergencies' },
            { id: 'REPORTS', label: 'Reports' },
            { id: 'SETTINGS', label: 'Settings' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeTab === t.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* System KPIs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
              <div
                onClick={() => handleTabChange('AVIRON')}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">TOTAL AVIRON</span>
                <p className="text-2xl font-black text-cyan-400 mt-1">12</p>
              </div>
              <div
                onClick={() => handleTabChange('EMERGENCIES')}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">ACTIVE MISSIONS</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">04</p>
              </div>
              <div
                onClick={() => handleTabChange('TEAMS')}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">ACTIVE TEAMS</span>
                <p className="text-2xl font-black text-indigo-400 mt-1">08</p>
              </div>
              <div
                onClick={() => handleTabChange('EMERGENCIES')}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">OPEN EMERGENCIES</span>
                <p className="text-2xl font-black text-rose-400 mt-1">{requests.filter((r) => r.status !== 'RESOLVED').length}</p>
              </div>
              <div
                onClick={() => handleTabChange('REPORTS')}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">SURVIVORS ASSISTED</span>
                <p className="text-2xl font-black text-teal-400 mt-1">124</p>
              </div>
              <div
                onClick={() => handleTabChange('SETTINGS')}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">SYSTEM HEALTH</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">98%</p>
              </div>
            </div>

            {/* Global System Map */}
            <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-mono font-bold text-indigo-400">GLOBAL INCIDENT & FLEET MONITOR</span>
                <button onClick={() => handleTabChange('MAP')} className="text-xs text-indigo-400 font-bold hover:underline">
                  Full Screen Map →
                </button>
              </div>
              <div className="h-[360px] sm:h-[460px] rounded-2xl overflow-hidden border border-slate-800">
                <LiveMap />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE MAP */}
        {activeTab === 'MAP' && (
          <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-indigo-400">ADMIN LIVE VECTOR MAP (ALL LAYERS)</span>
              <div className="hidden sm:flex space-x-2 text-xs font-mono">
                <span className="px-2 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">AVIRON UNITS</span>
                <span className="px-2 py-1 bg-teal-950 text-teal-400 border border-teal-800 rounded">RESCUE TEAMS</span>
                <span className="px-2 py-1 bg-rose-950 text-rose-400 border border-rose-800 rounded">VICTIMS</span>
              </div>
            </div>
            <div className="h-[520px] sm:h-[620px] rounded-2xl overflow-hidden border border-slate-800">
              <LiveMap />
            </div>
          </div>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeTab === 'USERS' && (
          <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">System User Management</h2>
                <p className="text-xs text-slate-400">Manage user accounts, roles and authorizations</p>
              </div>
            </div>

            {/* Responsive Table / Cards Grid */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 font-sans">
                <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Last Active</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-white flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center font-bold text-[11px]">
                          {u.name.charAt(0)}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">{u.email}</td>
                      <td className="p-3 font-bold">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value as Role)}
                          className="bg-slate-900 border border-slate-700 text-indigo-300 font-extrabold rounded px-2 py-1 text-xs focus:outline-none"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="TEAM_LEADER">TEAM LEADER</option>
                          <option value="RESCUE_OPERATOR">RESCUE OPERATOR</option>
                          <option value="MEDICAL_OPERATOR">MEDICAL OPERATOR</option>
                          <option value="VICTIM">VICTIM</option>
                          <option value="VIEWER">VIEWER</option>
                        </select>
                      </td>
                      <td className="p-3 font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{u.lastActive}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-3 py-1 rounded text-xs font-bold ${u.status === 'ACTIVE' ? 'bg-slate-800 hover:bg-slate-700 text-rose-400' : 'bg-emerald-900 hover:bg-emerald-800 text-white'}`}
                        >
                          {u.status === 'ACTIVE' ? 'Disable' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3">
              {usersList.map((u) => (
                <div key={u.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-white">{u.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">{u.status}</span>
                  </div>
                  <div className="text-slate-400 font-mono text-[11px]">{u.email}</div>
                  <div className="flex items-center justify-between pt-1">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u.id, e.target.value as Role)}
                      className="bg-slate-950 border border-slate-700 text-indigo-300 font-bold rounded px-2 py-1 text-xs"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="TEAM_LEADER">TEAM LEADER</option>
                      <option value="RESCUE_OPERATOR">RESCUE OPERATOR</option>
                      <option value="MEDICAL_OPERATOR">MEDICAL OPERATOR</option>
                      <option value="VICTIM">VICTIM</option>
                    </select>
                    <button
                      onClick={() => handleToggleUserStatus(u.id)}
                      className="px-3 py-1 rounded bg-slate-800 text-rose-400 font-bold text-xs"
                    >
                      {u.status === 'ACTIVE' ? 'Disable' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TEAM MANAGEMENT */}
        {activeTab === 'TEAMS' && (
          <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">Rescue Team Roster</h2>
                <p className="text-xs text-slate-400">Configure teams, leadership and operational availability</p>
              </div>
              <button
                onClick={() => setShowAddTeamModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Create Team</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((t) => (
                <div key={t.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono font-bold text-indigo-400">{t.code}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">{t.status}</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white">{t.name}</h3>
                  <p className="text-xs text-slate-400">Leader: <span className="text-slate-200 font-bold">{t.leaderName}</span></p>
                  <p className="text-xs text-slate-400">Members: <span className="text-cyan-400 font-bold">{t.memberCount} Operators</span></p>
                </div>
              ))}
            </div>

            {showAddTeamModal && (
              <form onSubmit={handleRegisterTeam} className="bg-slate-900 p-5 rounded-2xl border border-slate-700 space-y-3 max-w-md">
                <h3 className="text-sm font-bold text-white">Create New Rescue Team</h3>
                <input
                  type="text"
                  placeholder="Team Name (e.g. Team Delta)"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Leader Name"
                  value={newTeamLeader}
                  onChange={(e) => setNewTeamLeader(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  required
                />
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowAddTeamModal(false)} className="px-3 py-1.5 bg-slate-800 text-xs font-bold rounded-lg text-slate-300">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-xs font-bold text-white rounded-lg">Save Team</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 5: AVIRON FLEET MANAGEMENT */}
        {activeTab === 'AVIRON' && (
          <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">AVIRON Fleet Roster</h2>
                <p className="text-xs text-slate-400">Register autonomous units and Raspberry Pi hardware IDs</p>
              </div>
              <button
                onClick={() => setShowAddUnitModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Register Unit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {units.map((u) => (
                <div key={u.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">{u.code}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">{u.status}</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white">{u.name}</h3>
                  <p className="text-[11px] text-slate-400">{u.model}</p>
                  <div className="text-xs font-mono space-y-1 pt-1 border-t border-slate-800">
                    <div className="flex justify-between"><span className="text-slate-500">Battery:</span><span className="text-cyan-400 font-bold">{u.battery}%</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Signal:</span><span className="text-emerald-400 font-bold">{u.signalStrength} dBm</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Raspberry Pi:</span><span className="text-amber-400 text-[10px]">{u.raspberryPiId || 'RPI-5-LIVE'}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {showAddUnitModal && (
              <form onSubmit={handleRegisterUnit} className="bg-slate-900 p-5 rounded-2xl border border-slate-700 space-y-3 max-w-md">
                <h3 className="text-sm font-bold text-white">Register AVIRON Autonomous Unit</h3>
                <input type="text" placeholder="Unit Code (e.g. AVIRON-05)" value={newUnitCode} onChange={(e) => setNewUnitCode(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white" required />
                <input type="text" placeholder="Unit Name" value={newUnitName} onChange={(e) => setNewUnitName(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white" required />
                <input type="text" placeholder="Raspberry Pi Hardware ID" value={newUnitPiId} onChange={(e) => setNewUnitPiId(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white" required />
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowAddUnitModal(false)} className="px-3 py-1.5 bg-slate-800 text-xs font-bold rounded-lg text-slate-300">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-xs font-bold text-white rounded-lg">Save Unit</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 6: EMERGENCY REQUESTS MANAGEMENT */}
        {activeTab === 'EMERGENCIES' && (
          <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">Emergency Assistance Queue</h2>
                <p className="text-xs text-slate-400">Monitor and override emergency status across system</p>
              </div>
            </div>

            {/* Responsive Table / Mobile Cards */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 font-sans">
                <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Victim</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Assigned Team</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-mono font-bold text-cyan-400">{r.requestCode}</td>
                      <td className="p-3 font-bold text-white">{r.victimName}</td>
                      <td className="p-3 text-slate-300 font-bold">{r.type}</td>
                      <td className="p-3 font-bold text-rose-400">{r.priority}</td>
                      <td className="p-3 text-slate-400">{r.locationName}</td>
                      <td className="p-3 text-teal-400 font-bold">{r.assignedTeamName || 'Unassigned'}</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">{r.status}</td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => setSelectedEmergency(r)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded text-[10px]"
                        >
                          View Detail
                        </button>
                        <button
                          onClick={() => assignTeamAndAviron(r.id, 'team-alpha', 'Team Alpha', 'unit-01', 'AVIRON-01')}
                          className="px-2.5 py-1 bg-indigo-900 hover:bg-indigo-800 text-white font-bold rounded text-[10px]"
                        >
                          Assign Team
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Cards */}
            <div className="md:hidden space-y-3">
              {requests.map((r) => (
                <div key={r.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="font-bold text-cyan-400">{r.requestCode}</span>
                    <span className="text-rose-400 font-extrabold">{r.priority}</span>
                  </div>
                  <div className="font-bold text-white">{r.victimName} — {r.type}</div>
                  <div className="text-slate-400">{r.locationName}</div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-emerald-400 font-mono text-[10px]">{r.status}</span>
                    <button
                      onClick={() => assignTeamAndAviron(r.id, 'team-alpha', 'Team Alpha', 'unit-01', 'AVIRON-01')}
                      className="px-3 py-1 bg-indigo-600 text-white font-bold rounded"
                    >
                      Assign Team Alpha
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: ADMIN REPORTING */}
        {activeTab === 'REPORTS' && (
          <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">Mission Performance Reports</h2>
                <p className="text-xs text-slate-400">Post-rescue operational analytics and summaries</p>
              </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <h3 className="font-extrabold text-white text-sm">REPORT #REP-2026-001 — FLOOD RESCUE SECTOR 4</h3>
                  <p className="text-xs text-slate-400">Operator: Capt. Rahul Sharma | Date: {new Date().toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => alert('Exporting PDF Mission Report...')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
                >
                  Export PDF Report
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded-xl"><span className="text-slate-500">Duration</span><p className="text-white font-bold">18 min</p></div>
                <div className="bg-slate-950 p-3 rounded-xl"><span className="text-slate-500">Distance</span><p className="text-white font-bold">2.4 km</p></div>
                <div className="bg-slate-950 p-3 rounded-xl"><span className="text-slate-500">Survivors Rescued</span><p className="text-emerald-400 font-bold">3</p></div>
                <div className="bg-slate-950 p-3 rounded-xl"><span className="text-slate-500">Battery Used</span><p className="text-cyan-400 font-bold">14.2%</p></div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Summary: AVIRON-01 successfully executed autonomous reconnaissance across Sector 4 Flood Plain. Located stranded victim Aarav Kumar on rooftop platform. Dropped REAK-1 medical supply kit and maintained two-way VHF communication until ground team arrival. Mission completed without incident.
              </p>
            </div>
          </div>
        )}

        {/* TAB 8: SYSTEM SETTINGS */}
        {activeTab === 'SETTINGS' && (
          <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 space-y-6 shadow-xl">
            <div>
              <h2 className="text-lg font-black text-white">Infrastructure Settings</h2>
              <p className="text-xs text-slate-400">Configure Raspberry Pi IoT HAL, Cloudflare R2, and Supabase database settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="font-extrabold text-amber-400 text-sm flex items-center space-x-2">
                  <Cpu className="w-4 h-4" />
                  <span>Raspberry Pi Hardware HAL Integration</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400">Hardware Host IP</label>
                    <input
                      type="text"
                      value={raspberryPiConfig.host}
                      onChange={(e) => setRaspberryPiConfig({ host: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">WebSocket Port</label>
                    <input
                      type="number"
                      value={raspberryPiConfig.port}
                      onChange={(e) => setRaspberryPiConfig({ port: parseInt(e.target.value) || 8080 })}
                      className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-300 font-bold">Hardware Connection Mode</span>
                    <button
                      onClick={() => setMode(mode === 'DEMO' ? 'LIVE_HARDWARE' : 'DEMO')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${mode === 'DEMO' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}
                    >
                      {mode}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="font-extrabold text-cyan-400 text-sm flex items-center space-x-2">
                  <Cloud className="w-4 h-4" />
                  <span>Cloud Integrations & Security</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Firebase Auth</span>
                    <span className="text-emerald-400 font-bold">CONNECTED</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Supabase RLS & PostgreSQL</span>
                    <span className="text-emerald-400 font-bold">ACTIVE (ENFORCED)</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Cloudflare R2 Bucket</span>
                    <span className="text-emerald-400 font-bold">CONNECTED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Detail Modal Drawer */}
      {selectedEmergency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 text-white rounded-3xl p-6 max-w-md w-full border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono text-cyan-400 font-bold text-xs">{selectedEmergency.requestCode}</span>
              <button onClick={() => setSelectedEmergency(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <p><span className="text-slate-400">Victim Name:</span> <span className="font-bold text-white">{selectedEmergency.victimName}</span></p>
              <p><span className="text-slate-400">Type:</span> <span className="font-bold text-rose-400">{selectedEmergency.type}</span></p>
              <p><span className="text-slate-400">Location:</span> {selectedEmergency.locationName}</p>
              <p><span className="text-slate-400">Condition:</span> {selectedEmergency.condition}</p>
              <p><span className="text-slate-400">Status:</span> <span className="text-emerald-400 font-bold font-mono">{selectedEmergency.status}</span></p>
            </div>
            <button
              onClick={() => {
                assignTeamAndAviron(selectedEmergency.id, 'team-alpha', 'Team Alpha', 'unit-01', 'AVIRON-01');
                setSelectedEmergency(null);
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white rounded-xl"
            >
              Assign Team Alpha & Deploy AVIRON-01
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
