import React from 'react';
import { Eye, Flame, MapPin, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import { DemoSimulationEngine } from '../../services/simulation/DemoSimulationEngine';

export const AIDetectionCenter: React.FC = () => {
  const engine = DemoSimulationEngine.getInstance();
  const detections = engine.getState().detections;

  const latestHumanDet = detections.find((d) => d.type === 'HUMAN') || {
    id: 'det-01',
    type: 'HUMAN',
    confidence: 94.2,
    lat: 28.6152,
    lng: 77.2120,
    isConfirmed: true,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center font-bold">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-navy-950 uppercase tracking-wide">
              AI Survivor Detection Center
            </h3>
            <p className="text-[11px] text-slate-500">Multimodal Neural Vision Inference Engine</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          SIMULATED AI RESULT
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Detection Card Summary */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detection Status</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Confirmed Match</span>
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-navy-950">Human Detected</span>
            <span className="text-sm font-extrabold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
              {latestHumanDet.confidence}% Confidence
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">People Count</span>
              <span className="font-extrabold text-navy-900 text-base">1 Verified</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Hotspot Temp</span>
              <span className="font-extrabold text-amber-700 text-base flex items-center">
                <Flame className="w-3.5 h-3.5 mr-1" /> 36.9°C
              </span>
            </div>
          </div>

          {/* Sensor Confirmation Checklist */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
            <div className="flex items-center justify-between text-slate-700 font-semibold">
              <span>RGB Optical Camera (1080p)</span>
              <span className="text-emerald-600 font-bold">✓ Matched</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 font-semibold">
              <span>FLIR Radiometric Thermal</span>
              <span className="text-emerald-600 font-bold">✓ Confirmed</span>
            </div>
          </div>
        </div>

        {/* Location Coordinates & Map Pin */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              GPS Coordinates
            </span>
            <div className="flex items-center space-x-2 font-mono text-base font-bold text-navy-950 bg-white p-2.5 rounded-lg border border-slate-200">
              <MapPin className="w-5 h-5 text-red-600 shrink-0" />
              <span>
                {latestHumanDet.lat.toFixed(6)}, {latestHumanDet.lng.toFixed(6)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200 text-xs text-cyan-950">
            <div className="font-bold flex items-center space-x-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-cyan-700" />
              <span>Target Verification Complete</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Location locked for emergency medical payload release. Coordinate stream synced with ground dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
