import React from 'react';
import { ShieldCheck, Printer, Download, FileText, CheckCircle2, Clock, MapPin, Battery } from 'lucide-react';
import { useMissionStore } from '../../store/useMissionStore';
import { useAvironStore } from '../../store/useAvironStore';

export const MissionReportView: React.FC = () => {
  const { activeMission } = useMissionStore();
  const { units } = useAvironStore();
  const unit = units[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 md:p-8 max-w-4xl mx-auto print:shadow-none print:border-none print:m-0">
      {/* Top Action Buttons (Hidden when printing) */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 print:hidden">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-navy-900" />
          <h2 className="text-base font-extrabold text-navy-950 uppercase tracking-wide">
            Official Mission Rescue Report
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-950 text-cyan-400 font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Official Report Document Header */}
      <div className="mt-6 border-b-2 border-navy-950 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-navy-950 text-cyan-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wider text-navy-950">AVIRON</h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Autonomous Rescue Command Network
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-600">
            <div className="font-extrabold text-navy-950 text-sm">OFFICIAL EMERGENCY REPORT</div>
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Ref: {activeMission?.code || 'AV-001'}-RPT</div>
          </div>
        </div>
      </div>

      {/* Document Content Grid */}
      <div className="py-6 space-y-6 text-xs text-slate-800">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 font-sans">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Mission ID</span>
            <span className="font-mono font-bold text-navy-950 text-sm">{activeMission?.code || 'AV-001'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Assigned Unit</span>
            <span className="font-bold text-navy-950">{unit.code} ({unit.name})</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Command Operator</span>
            <span className="font-bold text-navy-950">Sarah Connor (Operator)</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Status</span>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px] inline-block">
              SUCCESSFUL
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h3 className="font-bold text-navy-950 uppercase text-xs mb-2 tracking-wider">
            Operational Summary Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Flight Duration</span>
              <span className="text-base font-black text-navy-950">34 min 12 sec</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Distance Traversed</span>
              <span className="text-base font-black text-navy-950">6.8 km</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Survivors Localized</span>
              <span className="text-base font-black text-red-600">1 Verified</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Battery Depletion</span>
              <span className="text-base font-black text-teal-700">26.0% (74.0% Rem.)</span>
            </div>
          </div>
        </div>

        {/* Detailed Narrative */}
        <div>
          <h3 className="font-bold text-navy-950 uppercase text-xs mb-2 tracking-wider">
            Executive Mission Narrative
          </h3>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-slate-700 leading-relaxed font-sans text-xs">
            <p>
              AVIRON-01 launched from Base Station at 10:00:00 under operator authorization for Mission AV-001 (Flood Rescue & Survivor Extraction). Autonomous waypoint navigation was locked via dual RTK GPS with 14 satellites.
            </p>
            <p>
              At 10:04:15, onboard LIDAR obstacle avoidance identified submerged debris and power line hazards, executing an autonomous detour (+45m altitude buffer).
            </p>
            <p>
              At 10:11:30, AI neural vision and FLIR radiometric thermal core confirmed human presence on a stranded elevated structure (36.9°C body heat signature). SURVIVOR #001 was logged.
            </p>
            <p>
              VHF Emergency radio beacon was established and REAK-1 Emergency Aid Kit was dropped via precision winch release. Mission completed successfully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
