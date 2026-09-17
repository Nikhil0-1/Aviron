import React, { useState } from 'react';
import { Camera, Eye, Flame, Maximize2, RefreshCw, Zap, ShieldAlert } from 'lucide-react';

export const LiveVideoFeed: React.FC = () => {
  const [viewMode, setViewMode] = useState<'RGB' | 'THERMAL' | 'SPLIT'>('SPLIT');
  const [isRecording, setIsRecording] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-4 flex flex-col h-full">
      {/* Feed Header & Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>LIVE CAM 01</span>
          </div>
          <span className="text-xs font-bold text-navy-950 hidden sm:inline">
            AVIRON Dual Vision Optical Payload
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setViewMode('RGB')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'RGB' ? 'bg-navy-900 text-cyan-400 shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            RGB
          </button>
          <button
            onClick={() => setViewMode('THERMAL')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'THERMAL' ? 'bg-navy-900 text-cyan-400 shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            FLIR Thermal
          </button>
          <button
            onClick={() => setViewMode('SPLIT')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'SPLIT' ? 'bg-navy-900 text-cyan-400 shadow-xs' : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            Split
          </button>
        </div>
      </div>

      {/* Simulated Feed Viewport */}
      <div className="relative flex-1 min-h-[260px] my-3 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center">
        {/* Background Visualizer Layer */}
        {viewMode === 'THERMAL' ? (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-amber-700 opacity-90">
            {/* Thermal Radiometric Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800">
            {/* Flood simulation camera noise & grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
          </div>
        )}

        {/* Bounding Box AI Detection Overlay */}
        <div className="absolute w-44 h-48 border-2 border-cyan-400 rounded-lg shadow-glow-cyan flex flex-col justify-between p-2 pointer-events-none transform translate-x-2 -translate-y-2 animate-pulse">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold bg-navy-950/90 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/40">
            <span>HUMAN DETECTED</span>
            <span>94.2%</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono font-bold bg-amber-950/90 text-amber-400 px-2 py-0.5 rounded border border-amber-500/40">
            <span className="flex items-center space-x-1">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>HOTSPOT</span>
            </span>
            <span>36.9°C</span>
          </div>
        </div>

        {/* Top Watermark Tag */}
        <div className="absolute top-2 left-2 bg-navy-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700 text-[10px] font-mono font-bold text-slate-300">
          <span>SIMULATED VIDEO STREAM</span>
        </div>

        {/* Telemetry OSD Overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-navy-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
          <div>
            <span className="text-cyan-400 font-bold">POS:</span> 28.6152N, 77.2120E
          </div>
          <div>
            <span className="text-teal-400 font-bold">ALT:</span> 18.5m | <span className="text-amber-400 font-bold">FPS:</span> 60
          </div>
        </div>
      </div>

      {/* Feed Bottom Status & Snapshot Bar */}
      <div className="flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-cyan-600" />
          <span className="font-semibold text-navy-950">AI Inference Active (Edge Pi TPU)</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => alert('Snapshot captured and saved to mission logs!')}
            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs flex items-center space-x-1 transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Snapshot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
