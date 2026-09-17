import React, { useState } from 'react';
import { Play, Pause, RotateCcw, AlertOctagon, XCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ProviderFactory } from '../../services/hardware/ProviderFactory';
import { useAvironStore } from '../../store/useAvironStore';
import { useMissionStore } from '../../store/useMissionStore';

export const QuickControls: React.FC = () => {
  const { mode, selectedUnitId, units } = useAvironStore();
  const { activeMission, updateMissionStatus } = useMissionStore();

  const [confirmModal, setConfirmModal] = useState<'ABORT' | 'EMERGENCY' | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const selectedUnit = units.find((u) => u.id === selectedUnitId) || units[0];
  const provider = ProviderFactory.getProvider(mode);

  const handleCommand = async (cmd: 'START' | 'PAUSED' | 'RESUME' | 'RETURN_BASE' | 'ABORT' | 'EMERGENCY_STOP') => {
    const res = await provider.sendControlCommand(selectedUnit.id, cmd);
    if (res.success) {
      if (cmd === 'START' || cmd === 'RESUME') updateMissionStatus(activeMission?.id || 'm-001', 'IN_PROGRESS');
      if (cmd === 'PAUSED') updateMissionStatus(activeMission?.id || 'm-001', 'PAUSED');
      if (cmd === 'ABORT') updateMissionStatus(activeMission?.id || 'm-001', 'ABORTED');

      setFeedbackMsg(`✓ ${res.message}`);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <h3 className="text-sm font-extrabold text-navy-950 uppercase tracking-wide flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-cyan-600" />
          <span>Mission Execution Controls ({selectedUnit?.code || 'AVIRON-01'})</span>
        </h3>
        {feedbackMsg && (
          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 animate-in fade-in">
            {feedbackMsg}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {/* START */}
        <button
          onClick={() => handleCommand('START')}
          className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-all"
        >
          <Play className="w-4 h-4" />
          <span>START</span>
        </button>

        {/* PAUSE */}
        <button
          onClick={() => handleCommand('PAUSED')}
          className="px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-all"
        >
          <Pause className="w-4 h-4" />
          <span>PAUSE</span>
        </button>

        {/* RESUME */}
        <button
          onClick={() => handleCommand('RESUME')}
          className="px-3 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-all"
        >
          <Play className="w-4 h-4" />
          <span>RESUME</span>
        </button>

        {/* RETURN TO BASE */}
        <button
          onClick={() => handleCommand('RETURN_BASE')}
          className="px-3 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-cyan-400 font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RTH</span>
        </button>

        {/* ABORT */}
        <button
          onClick={() => setConfirmModal('ABORT')}
          className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 flex items-center justify-center space-x-1.5 transition-all"
        >
          <XCircle className="w-4 h-4 text-slate-600" />
          <span>ABORT</span>
        </button>

        {/* EMERGENCY STOP (CRITICAL RED) */}
        <button
          onClick={() => setConfirmModal('EMERGENCY')}
          className="px-3 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-glow-red flex items-center justify-center space-x-1.5 transition-all animate-pulse"
        >
          <AlertOctagon className="w-4 h-4" />
          <span>EMERGENCY STOP</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-elevated border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-red-600 mb-3">
              <AlertOctagon className="w-8 h-8 stroke-[2.5]" />
              <h3 className="text-lg font-black text-navy-950">
                {confirmModal === 'EMERGENCY' ? 'CONFIRM EMERGENCY STOP' : 'CONFIRM MISSION ABORT'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              {confirmModal === 'EMERGENCY'
                ? `Immediate hardware halt requested for ${selectedUnit.code}. Motor power will cut out and position hold hover thrusters will engage.`
                : `Are you sure you want to abort mission ${activeMission?.code || 'AV-001'}? The unit will stop waypoint navigation and hover.`}
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleCommand(confirmModal === 'EMERGENCY' ? 'EMERGENCY_STOP' : 'ABORT');
                  setConfirmModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md"
              >
                Confirm & Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
