import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, ShieldCheck, Flame, Database, Cloud, Radio, UserCheck, HeartHandshake, ShieldAlert, Cpu } from 'lucide-react';
import { DemoSimulationEngine } from '../../services/simulation/DemoSimulationEngine';
import { useAuthStore } from '../../store/useAuthStore';
import { Role } from '../../types';

interface DemoControllerBarProps {
  currentPanel: 'PUBLIC' | 'VICTIM' | 'TEAM' | 'ADMIN';
  onNavigatePanel: (panel: 'PUBLIC' | 'VICTIM' | 'TEAM' | 'ADMIN') => void;
}

export const DemoControllerBar: React.FC<DemoControllerBarProps> = ({ currentPanel, onNavigatePanel }) => {
  const engine = DemoSimulationEngine.getInstance();
  const [simState, setSimState] = useState<any>(engine.getState());
  const { user, switchRole } = useAuthStore();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showServices, setShowServices] = useState(false);

  React.useEffect(() => {
    const unsubscribe = engine.subscribe((state) => {
      setSimState(state);
    });
    return () => unsubscribe();
  }, [engine]);

  const handlePlayPause = () => {
    if (simState.isPlaying) {
      engine.pause();
    } else {
      engine.start();
    }
  };

  const handleNextStep = () => {
    engine.nextStep();
  };

  const handleReset = () => {
    engine.reset();
  };

  const handleRoleSelect = (role: Role) => {
    switchRole(role);
    setShowRoleDropdown(false);
    if (role === 'VICTIM') onNavigatePanel('VICTIM');
    else if (role === 'TEAM_LEADER' || role === 'RESCUE_OPERATOR' || role === 'MEDICAL_OPERATOR') onNavigatePanel('TEAM');
    else if (role === 'ADMIN') onNavigatePanel('ADMIN');
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 shadow-md px-3 py-2 text-xs font-sans sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Brand + Multi-Panel Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1.5 font-extrabold text-sm tracking-tight text-cyan-400">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>AVIRON</span>
          </div>

          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => onNavigatePanel('PUBLIC')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                currentPanel === 'PUBLIC'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <span>🌐 Landing</span>
            </button>

            <button
              onClick={() => onNavigatePanel('VICTIM')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                currentPanel === 'VICTIM'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Victim Panel</span>
            </button>

            <button
              onClick={() => onNavigatePanel('TEAM')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                currentPanel === 'TEAM'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Rescue Team</span>
            </button>

            <button
              onClick={() => onNavigatePanel('ADMIN')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                currentPanel === 'ADMIN'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>

        {/* Center: Live Demo Simulation Controls */}
        <div className="flex items-center bg-slate-950/80 px-3 py-1 rounded-xl border border-cyan-500/30 space-x-2">
          <span className="hidden lg:inline-block text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 font-mono">
            DEMO SIMULATION
          </span>

          <button
            onClick={handlePlayPause}
            className={`p-1.5 rounded-lg font-bold flex items-center space-x-1 transition-all ${
              simState.isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
            }`}
            title={simState.isPlaying ? 'Pause Simulation' : 'Start Flood Rescue Scenario'}
          >
            {simState.isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden sm:inline font-mono">{simState.isPlaying ? 'PAUSE' : 'RUN DEMO'}</span>
          </button>

          <div className="flex items-center space-x-1 font-mono text-[11px] text-slate-300">
            <button
              onClick={() => engine.goToStep(Math.max(0, simState.currentStep - 1))}
              className="p-1 hover:text-cyan-400 text-slate-400 disabled:opacity-40"
              disabled={simState.currentStep === 0}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-300 font-bold">
              Step {simState.currentStep + 1}/{engine.scenarioEvents.length}
            </span>

            <button
              onClick={handleNextStep}
              className="p-1 hover:text-cyan-400 text-slate-400 disabled:opacity-40"
              disabled={simState.currentStep === engine.scenarioEvents.length - 1}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
            title="Reset Demo Scenario"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Role Quick Switcher & Services Health */}
        <div className="flex items-center space-x-2">
          {/* Services Modal Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowServices(!showServices)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 border border-slate-700 flex items-center space-x-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden sm:inline">Backend Stack</span>
            </button>

            {showServices && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-2xl p-3 z-50 text-xs">
                <div className="font-extrabold text-cyan-400 pb-2 border-b border-slate-800 mb-2">
                  AVIRON Infrastructure Stack
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-slate-300"><Flame className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Firebase Auth</span>
                    <span className="text-emerald-400 font-mono text-[10px]">CONNECTED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-slate-300"><Database className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> Supabase PostgreSQL</span>
                    <span className="text-emerald-400 font-mono text-[10px]">ACTIVE (RLS)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-slate-300"><Cloud className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Cloudflare R2</span>
                    <span className="text-emerald-400 font-mono text-[10px]">ONLINE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-slate-300"><Radio className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> WebSocket Gateway</span>
                    <span className="text-emerald-400 font-mono text-[10px]">LIVE (WS)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-slate-300"><Cpu className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Raspberry Pi HAL</span>
                    <span className="text-cyan-400 font-mono text-[10px]">SIMULATED</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded-lg font-bold hover:bg-cyan-900 transition-all text-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{user?.role || 'ADMIN'}</span>
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2 text-xs">
                <div className="font-extrabold text-slate-400 px-2 py-1 text-[10px] uppercase font-mono border-b border-slate-800 mb-1">
                  Switch Active Role
                </div>
                <button
                  onClick={() => handleRoleSelect('ADMIN')}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white font-medium flex items-center justify-between"
                >
                  <span>🛡️ System Admin</span>
                  {user?.role === 'ADMIN' && <span className="text-cyan-400 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => handleRoleSelect('TEAM_LEADER')}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white font-medium flex items-center justify-between"
                >
                  <span>🚨 Team Leader</span>
                  {user?.role === 'TEAM_LEADER' && <span className="text-cyan-400 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => handleRoleSelect('RESCUE_OPERATOR')}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white font-medium flex items-center justify-between"
                >
                  <span>🚁 Rescue Operator</span>
                  {(user?.role === 'RESCUE_OPERATOR' || user?.role === 'OPERATOR') && <span className="text-cyan-400 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => handleRoleSelect('MEDICAL_OPERATOR')}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white font-medium flex items-center justify-between"
                >
                  <span>🩺 Medical Operator</span>
                  {user?.role === 'MEDICAL_OPERATOR' && <span className="text-cyan-400 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => handleRoleSelect('VICTIM')}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white font-medium flex items-center justify-between"
                >
                  <span>🆘 Victim / Survivor</span>
                  {user?.role === 'VICTIM' && <span className="text-cyan-400 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => handleRoleSelect('VIEWER')}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 hover:text-white font-medium flex items-center justify-between"
                >
                  <span>👁️ Viewer (Read-only)</span>
                  {user?.role === 'VIEWER' && <span className="text-cyan-400 font-bold">✓</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
