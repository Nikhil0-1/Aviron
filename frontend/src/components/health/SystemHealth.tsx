import React from 'react';
import { Activity, Cpu, Radio, Camera, Compass, Flame, Wifi, Battery, CheckCircle2 } from 'lucide-react';

export const SystemHealth: React.FC = () => {
  const components = [
    { name: 'Raspberry Pi 4 Gateway', type: 'Hardware', status: 'ONLINE', details: 'CPU Temp: 42°C | RAM: 1.2GB/4GB', icon: Cpu },
    { name: 'Dual RTK GPS Module', type: 'Navigation', status: 'ONLINE', details: 'Satellites: 14 | Lock: RTK FIX (0.03m)', icon: Compass },
    { name: 'HD RGB Optical Sensor', type: 'Camera', status: 'ONLINE', details: '1080p @ 60fps Stream Active', icon: Camera },
    { name: 'FLIR Thermal Camera', type: 'Camera', status: 'ONLINE', details: '640x512 Radiometric Core Active', icon: Flame },
    { name: 'LIDAR Obstacle Scanner', type: 'Sensor', status: 'ONLINE', details: '360° Scanning @ 20Hz', icon: Activity },
    { name: 'Long-Range Mesh Telemetry', type: 'Network', status: 'ONLINE', details: 'Latency: 16ms | RSSI: -64 dBm', icon: Radio },
    { name: 'BMS Battery Management', type: 'Hardware', status: 'ONLINE', details: 'Cell Temp: 28°C | Health: 98%', icon: Battery },
    { name: 'Encrypted Radio Bridge', type: 'Network', status: 'ONLINE', details: 'Dual-band VHF Active', icon: Wifi },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-base font-extrabold text-navy-950 uppercase tracking-wide flex items-center space-x-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <span>AVIRON System Component Health</span>
          </h3>
          <p className="text-xs text-slate-500">Subsystem Diagnostics & Hardware Status</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-900 border border-teal-200 flex items-center space-x-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>98% Overall Health</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {components.map((comp, idx) => {
          const Icon = comp.icon;
          return (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-navy-900 shadow-xs">
                  <Icon className="w-4 h-4 text-cyan-600" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  {comp.status}
                </span>
              </div>
              <div className="font-extrabold text-navy-950">{comp.name}</div>
              <p className="text-[11px] text-slate-500 font-mono">{comp.details}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
