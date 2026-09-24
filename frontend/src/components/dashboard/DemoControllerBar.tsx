import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, ShieldCheck, Flame, Database, Cloud, Radio, UserCheck, HeartHandshake, ShieldAlert, Cpu, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
    if (role === 'VICTIM') onNavigatePanel('VICTIM');
    else if (role === 'TEAM_LEADER' || role === 'RESCUE_OPERATOR' || role === 'MEDICAL_OPERATOR') onNavigatePanel('TEAM');
    else if (role === 'ADMIN') onNavigatePanel('ADMIN');
  };

  return (
    <div className="bg-slate-950 text-white border-b border-slate-800 shadow-md px-3 py-1.5 text-xs font-sans sticky top-0 z-50 min-w-0 max-w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Mobile Header Row */}
        <div className="w-full md:w-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 font-black text-sm tracking-tight text-cyan-400">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>AVIRON</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 hidden sm:inline">
              HUD
            </span>
          </div>

          {/* Desktop Panel Buttons */}
          <div className="hidden md:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 space-x-1">
            <button
              onClick={() => onNavigatePanel('PUBLIC')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                currentPanel === 'PUBLIC' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              🌐 Landing
            </button>
            <button
              onClick={() => onNavigatePanel('VICTIM')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                currentPanel === 'VICTIM' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Victim Panel</span>
            </button>
            <button
              onClick={() => onNavigatePanel('TEAM')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                currentPanel === 'TEAM' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Rescue Team</span>
            </button>
            <button
              onClick={() => onNavigatePanel('ADMIN')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                currentPanel === 'ADMIN' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          </div>

          {/* Mobile Menu & Role Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="px-2 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-lg text-[11px] font-bold"
            >
              {user?.role || 'ADMIN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Compact Simulation Bar */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-center bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 space-x-2">
          <div className="flex items-center space-x-1.5">
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
              <span className="font-mono text-[11px]">{simState.isPlaying ? 'PAUSE' : 'RUN'}</span>
            </button>

            <div className="flex items-center space-x-1 font-mono text-[11px] text-slate-300">
              <button
                onClick={() => engine.goToStep(Math.max(0, simState.currentStep - 1))}
                className="p-1 hover:text-cyan-400 text-slate-400 disabled:opacity-40"
                disabled={simState.currentStep === 0}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="bg-slate-950 px-2 py-0.5 rounded text-cyan-300 font-bold border border-slate-800">
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
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
              title="Reset Demo Scenario"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowServices(!showServices)}
              className="hidden sm:inline-flex px-2 py-1 rounded bg-slate-800 text-[10px] font-semibold text-slate-300 border border-slate-700"
            >
              Stack
            </button>
          </div>
        </div>

        {/* Desktop Role Quick Switcher */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={() => setShowServices(!showServices)}
            className="px-2 py-1 rounded bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700 flex items-center space-x-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Services</span>
          </button>

          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center space-x-1 px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-lg font-bold text-xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>{user?.role || 'ADMIN'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu for Panel & Role Selection */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold border-b border-slate-800 pb-1">
            Switch Panel View
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              onClick={() => {
                onNavigatePanel('PUBLIC');
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-xl text-center ${currentPanel === 'PUBLIC' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-200'}`}
            >
              🌐 Landing Page
            </button>
            <button
              onClick={() => {
                onNavigatePanel('VICTIM');
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-xl text-center ${currentPanel === 'VICTIM' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-200'}`}
            >
              🆘 Victim Panel
            </button>
            <button
              onClick={() => {
                onNavigatePanel('TEAM');
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-xl text-center ${currentPanel === 'TEAM' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-200'}`}
            >
              🚁 Rescue Team
            </button>
            <button
              onClick={() => {
                onNavigatePanel('ADMIN');
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-xl text-center ${currentPanel === 'ADMIN' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-200'}`}
            >
              🛡 Admin Panel
            </button>
          </div>
        </div>
      )}

      {/* Role Dropdown */}
      {showRoleDropdown && (
        <div className="absolute right-3 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2 text-xs">
          <div className="font-extrabold text-slate-400 px-2 py-1 text-[10px] uppercase font-mono border-b border-slate-800 mb-1">
            Switch Active Role
          </div>
          {(['ADMIN', 'TEAM_LEADER', 'RESCUE_OPERATOR', 'MEDICAL_OPERATOR', 'VICTIM', 'VIEWER'] as const).map((r) => (
            <button
              key={r}
              onClick={() => handleRoleSelect(r)}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 font-medium flex items-center justify-between"
            >
              <span>{r}</span>
              {user?.role === r && <span className="text-cyan-400 font-bold">✓</span>}
            </button>
          ))}
        </div>
      )}

      {/* Services Health Modal */}
      {showServices && (
        <div className="absolute right-3 mt-2 w-64 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-2xl p-3 z-50 text-xs">
          <div className="font-extrabold text-cyan-400 pb-2 border-b border-slate-800 mb-2">
            AVIRON Stack Integration Status
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between"><span className="flex items-center text-slate-300"><Flame className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Firebase Auth</span><span className="text-emerald-400 font-mono text-[10px]">CONNECTED</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center text-slate-300"><Database className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> Supabase PostgreSQL</span><span className="text-emerald-400 font-mono text-[10px]">ACTIVE (RLS)</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center text-slate-300"><Cloud className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Cloudflare R2</span><span className="text-emerald-400 font-mono text-[10px]">ONLINE</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center text-slate-300"><Radio className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> WebSocket Gateway</span><span className="text-emerald-400 font-mono text-[10px]">LIVE (WS)</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center text-slate-300"><Cpu className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Raspberry Pi HAL</span><span className="text-cyan-400 font-mono text-[10px]">SIMULATED</span></div>
          </div>
        </div>
      )}
    </div>
  );
};
