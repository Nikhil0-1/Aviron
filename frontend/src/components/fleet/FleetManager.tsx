import React, { useState } from 'react';
import { Plane, Battery, Signal, Radio, Cpu, Filter, Eye, ChevronRight, X } from 'lucide-react';
import { useAvironStore } from '../../store/useAvironStore';
import { AvironUnit, UnitStatus } from '../../types';

export const FleetManager: React.FC = () => {
  const { units, selectedUnitId, setSelectedUnitId } = useAvironStore();
  const [filter, setFilter] = useState<'ALL' | UnitStatus>('ALL');
  const [detailModalUnit, setDetailModalUnit] = useState<AvironUnit | null>(null);

  const filteredUnits = filter === 'ALL' ? units : units.filter((u) => u.status === filter);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
      {/* Header & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-4">
        <div>
          <h3 className="text-base font-extrabold text-navy-950 uppercase tracking-wide flex items-center space-x-2">
            <Plane className="w-5 h-5 text-cyan-600" />
            <span>AVIRON Fleet Command Manager</span>
          </h3>
          <p className="text-xs text-slate-500">Autonomous Unit Status & Telemetry Readiness</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto">
          {(['ALL', 'ACTIVE', 'STANDBY', 'CHARGING', 'OFFLINE'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === st ? 'bg-navy-900 text-cyan-400 shadow-xs' : 'text-slate-600 hover:text-navy-950'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of AVIRON Unit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredUnits.map((unit) => {
          const isSelected = selectedUnitId === unit.id;
          const statusBg =
            unit.status === 'ACTIVE'
              ? 'bg-emerald-100 text-emerald-800'
              : unit.status === 'STANDBY'
              ? 'bg-cyan-100 text-cyan-800'
              : unit.status === 'CHARGING'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-200 text-slate-700';

          return (
            <div
              key={unit.id}
              onClick={() => setSelectedUnitId(unit.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-cyan-50/40 border-cyan-400 ring-2 ring-cyan-500/20 shadow-card'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-subtle'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-navy-950 text-base">{unit.code}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBg}`}>
                  {unit.status}
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium mb-3">{unit.name}</p>

              <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center text-[11px]">
                    <Battery className="w-3.5 h-3.5 mr-1 text-teal-600" /> Battery
                  </span>
                  <span className="font-bold text-navy-900 font-mono">{unit.battery}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center text-[11px]">
                    <Signal className="w-3.5 h-3.5 mr-1 text-cyan-600" /> Signal
                  </span>
                  <span className="font-bold text-navy-900 font-mono">{unit.signalStrength}%</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailModalUnit(unit);
                  }}
                  className="text-[11px] font-bold text-cyan-700 hover:underline flex items-center"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> Diagnostics
                </button>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {detailModalUnit && (
        <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-elevated border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-black text-navy-950">{detailModalUnit.code} Specification</h3>
                <p className="text-xs text-slate-500">{detailModalUnit.model}</p>
              </div>
              <button
                onClick={() => setDetailModalUnit(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono">
                <div>Status: <span className="font-bold text-navy-900">{detailModalUnit.status}</span></div>
                <div>Battery: <span className="font-bold text-teal-700">{detailModalUnit.battery}%</span></div>
                <div>IP Host: <span className="font-bold text-navy-900">{detailModalUnit.ipAddress || '192.168.1.100'}</span></div>
                <div>Signal: <span className="font-bold text-cyan-700">{detailModalUnit.signalStrength}%</span></div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-navy-950 block mb-1">Onboard Gateway Sensors</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                  <li>Dual RTK GPS Module (0.03m precision lock)</li>
                  <li>HD Optical RGB Camera (1080p @ 60fps)</li>
                  <li>FLIR Radiometric Thermal Core (640x512)</li>
                  <li>360° LIDAR Obstacle Avoidance Scanner</li>
                  <li>Winch Drop Servo System</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setDetailModalUnit(null)}
                className="px-4 py-2 bg-navy-900 text-cyan-400 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
