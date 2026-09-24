import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Activity, Cpu, Radio, AlertTriangle, HeartHandshake, Eye, Flame, MapPin, Zap, Compass, CheckCircle2, ChevronRight, Video, FileText, Phone, Cloud, Menu, X, Info, ExternalLink, RefreshCw, Lock } from 'lucide-react';
import { useAvironStore } from '../store/useAvironStore';

interface PublicLandingViewProps {
  onNavigatePanel: (panel: 'PUBLIC' | 'VICTIM' | 'TEAM' | 'ADMIN') => void;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({ onNavigatePanel }) => {
  const { units } = useAvironStore();
  const activeUnit = units[0];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState<{
    title: string;
    category: string;
    icon: any;
    description: string;
    details: string[];
    specs?: Record<string, string>;
  } | null>(null);

  // Hero Unit Visual Modal
  const [showUnitModal, setShowUnitModal] = useState(false);

  // Detailed Modal Data Generators
  const openCapabilityModal = (title: string, desc: string, icon: any) => {
    setSelectedModal({
      title,
      category: 'AVIRON CAPABILITY SPECIFICATION',
      icon,
      description: desc,
      details: [
        'Integrated into AVIRON Mk-IV Amphibious Reconnaissance hardware chassis.',
        'Low-latency WebSocket telemetry streaming at 60 Hz to Command Center.',
        'Autonomous fail-safe return to base (RTH) upon signal loss or battery threshold (<15%).',
        'Fully synchronized with Supabase PostgreSQL database & Firebase Auth role permissions.',
      ],
      specs: {
        'Processor': 'Raspberry Pi 5 (Quad-core 2.4GHz ARM Cortex-A76)',
        'Sensor Array': 'Dual RTK GPS, 64-channel LIDAR, FLIR Lepton 3.5 Radiometric Thermal',
        'Comms Protocol': 'VHF Radio Mesh + 5G Ultra Wideband + WebSocket Relays',
        'Operating Range': '15.0 km Autonomous Search Corridor',
      },
    });
  };

  const openTechModal = (name: string, desc: string, icon: any) => {
    setSelectedModal({
      title: `${name} Technology Stack`,
      category: 'INFRASTRUCTURE & INTEGRATION',
      icon,
      description: desc,
      details: [
        'Architected for high-concurrency emergency response payloads.',
        'Strict Row Level Security (RLS) policies enforced at database level.',
        'Encrypted end-to-end communication for sensitive location & survivor data.',
      ],
      specs: {
        'Service Layer': name,
        'Security Standard': 'AES-256 / Firebase JWT Authorization',
        'Latency Target': '< 25ms WebSocket Ping',
        'Failover Strategy': 'Automatic local SQLite cache & dual-band mesh fallback',
      },
    });
  };

  const openStepModal = (step: string, title: string, desc: string, icon: any) => {
    setSelectedModal({
      title: `Step ${step}: ${title}`,
      category: 'RESCUE PIPELINE STEP',
      icon,
      description: desc,
      details: [
        'Automatic trigger broadcast to Admin Command & Rescue Team dispatch.',
        'Real-time status updates pushed to Victim mobile interface.',
        'Logged irrevocably in Supabase audit history table for post-mission analytics.',
      ],
    });
  };

  const openFooterModal = (title: string, content: string) => {
    setSelectedModal({
      title,
      category: 'PLATFORM LEGAL & DOCUMENTATION',
      icon: Info,
      description: content,
      details: [
        'AVIRON Rescue System v1.0.0 — Production Build',
        'Designed in accordance with International Search & Rescue Advisory Group (INSARAG) guidelines.',
        'For official emergency dispatch only.',
      ],
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-cyan-500 selection:text-white">
      {/* 1. PUBLIC NAVBAR */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-[41px] z-40 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigatePanel('PUBLIC')}>
            <div className="w-10 h-10 rounded-xl bg-navy-900 text-cyan-400 flex items-center justify-center shadow-md ring-2 ring-cyan-500/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-navy-950">AVIRON</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
                  Rescue Command
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 hidden sm:block">Autonomous Emergency Platform</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-extrabold uppercase tracking-wider text-slate-600">
            <a href="#how-it-works" className="hover:text-cyan-600 transition-colors">How It Works</a>
            <a href="#capabilities" className="hover:text-cyan-600 transition-colors">Capabilities</a>
            <a href="#live-preview" className="hover:text-cyan-600 transition-colors">Live Operations</a>
            <a href="#technology" className="hover:text-cyan-600 transition-colors">Technology</a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigatePanel('TEAM')}
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all"
            >
              Rescue Login
            </button>
            <button
              onClick={() => onNavigatePanel('ADMIN')}
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all"
            >
              Admin Login
            </button>
            <button
              onClick={() => onNavigatePanel('VICTIM')}
              className="px-4 py-2 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all flex items-center space-x-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>REQUEST HELP</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200 mt-3 pt-4 pb-4 space-y-3 bg-white px-2 text-xs font-extrabold"
            >
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                How It Works
              </a>
              <a
                href="#capabilities"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                Capabilities
              </a>
              <a
                href="#live-preview"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                Live Operations
              </a>
              <a
                href="#technology"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                Technology
              </a>
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigatePanel('TEAM');
                  }}
                  className="w-full py-2.5 bg-slate-100 rounded-xl text-slate-800 text-center font-bold"
                >
                  Rescue Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigatePanel('ADMIN');
                  }}
                  className="w-full py-2.5 bg-slate-100 rounded-xl text-slate-800 text-center font-bold"
                >
                  Admin Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 pt-12 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-extrabold tracking-wide"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                <span>NEXT-GEN AUTONOMOUS EMERGENCY RESPONSE</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black text-navy-950 tracking-tight leading-tight"
              >
                AVIRON <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600">
                  Autonomous Intelligence. Rapid Response. Human Assistance.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                An intelligent autonomous rescue platform designed to connect victims, rescue teams and autonomous AVIRON units during emergency situations.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4"
              >
                <button
                  onClick={() => onNavigatePanel('VICTIM')}
                  className="px-6 py-3.5 rounded-2xl text-sm sm:text-base font-extrabold text-white bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-600/30 transition-all flex items-center space-x-2"
                >
                  <HeartHandshake className="w-5 h-5" />
                  <span>REQUEST EMERGENCY ASSISTANCE</span>
                </button>

                <a
                  href="#capabilities"
                  className="px-6 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all flex items-center space-x-2"
                >
                  <span>EXPLORE AVIRON</span>
                  <ArrowRight className="w-4 h-4 text-cyan-600" />
                </a>
              </motion.div>

              <div className="pt-2 flex items-center justify-center lg:justify-start space-x-4 text-xs font-bold text-slate-500">
                <span>Quick Login:</span>
                <button onClick={() => onNavigatePanel('TEAM')} className="text-cyan-700 hover:underline">
                  RESCUE TEAM LOGIN
                </button>
                <span>•</span>
                <button onClick={() => onNavigatePanel('ADMIN')} className="text-indigo-700 hover:underline">
                  ADMIN LOGIN
                </button>
              </div>
            </div>

            {/* Right Interactive Vehicle Graphic Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onClick={() => setShowUnitModal(true)}
                className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl hover:shadow-cyan-500/10 cursor-pointer transition-all group relative overflow-hidden"
              >
                <div className="absolute top-3 right-3 bg-cyan-50 text-cyan-700 border border-cyan-200 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  <span>CLICK TO INSPECT UNIT</span>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-navy-900 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                  <Radio className="w-8 h-8 animate-pulse" />
                </div>

                <h3 className="text-xl font-black text-navy-950">AVIRON-01 Alpha Sentinel</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">AVIRON Mk-IV Amphibious Recon</p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px]">BATTERY</span>
                    <p className="font-bold text-emerald-600">{activeUnit.battery.toFixed(0)}% Charged</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px]">SIGNAL</span>
                    <p className="font-bold text-cyan-600">{activeUnit.signalStrength} dBm (Mesh)</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px]">HARDWARE</span>
                    <p className="font-bold text-amber-600">Raspberry Pi 5</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px]">STATUS</span>
                    <p className="font-bold text-teal-600">{activeUnit.status}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600 group-hover:underline">
                  <span>View Telemetry & Sensor Specs</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold tracking-widest text-cyan-600 uppercase font-mono">Seamless Rescue Pipeline</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2">How AVIRON Works During Emergency</p>
            <p className="text-xs text-slate-500 mt-1">Click any step to inspect operational protocol details</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Emergency', desc: 'Victim submits assistance request or sensors detect disaster.', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-200' },
              { step: '02', title: 'Detection', desc: 'AI algorithm & RTK GPS fix victim coordinates.', icon: Eye, color: 'text-amber-600 bg-amber-50 border-amber-200' },
              { step: '03', title: 'Mission', desc: 'Command center creates mission & assigns rescue team.', icon: Zap, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
              { step: '04', title: 'Deployment', desc: 'Amphibious drone launches autonomous pathfinding.', icon: Radio, color: 'text-teal-600 bg-teal-50 border-teal-200' },
              { step: '05', title: 'Assistance', desc: 'Medical kit drop, two-way comms & thermal triage.', icon: HeartHandshake, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
              { step: '06', title: 'Resolution', desc: 'Victim safe, mission completed & automated report.', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => openStepModal(item.step, item.title, item.desc, item.icon)}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-cyan-400 cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold mb-3 border ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">STEP {item.step}</span>
                  <h3 className="text-sm font-extrabold text-navy-950 mt-1">{item.title}</h3>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">{item.desc}</p>
                </div>
                <span className="text-[10px] font-bold text-cyan-600 pt-3 flex items-center space-x-0.5 group-hover:underline">
                  <span>Inspect</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AVIRON CAPABILITIES */}
      <section id="capabilities" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold tracking-widest text-cyan-600 uppercase font-mono">Core Platform Features</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2">AVIRON Capabilities</p>
            <p className="text-xs text-slate-500 mt-1">Click any card to view detailed specifications</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Autonomous Navigation', desc: 'LIDAR and dual RTK GPS obstacle avoidance along dangerous flood zones.', icon: Compass },
              { title: 'AI Survivor Detection', desc: 'Deep-learning computer vision identifying stranded humans with high precision.', icon: Eye },
              { title: 'Live Monitoring', desc: 'Sub-second WebSocket telemetry and 4K optical/thermal live feed.', icon: Video },
              { title: 'Thermal Detection', desc: 'FLIR radiometric core measuring body heat signatures in low visibility.', icon: Flame },
              { title: 'Emergency Communication', desc: 'VHF radio mesh & web socket relay directly connecting victim to operators.', icon: Radio },
              { title: 'Medical Assistance', desc: 'Vital sensors, triage level assessment and automated medical advisory.', icon: Activity },
              { title: 'Payload Delivery', desc: 'Precision winch drop mechanism for emergency medical supply kits.', icon: Zap },
              { title: 'Real-Time Telemetry', desc: 'Multi-sensor IoT telemetry stream: voltage, battery, speed, gas & altitude.', icon: Cpu },
            ].map((cap, idx) => (
              <div
                key={idx}
                onClick={() => openCapabilityModal(cap.title, cap.desc, cap.icon)}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-400 cursor-pointer transition-all group"
              >
                <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <cap.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-navy-950">{cap.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{cap.desc}</p>
                <span className="text-[10px] font-bold text-cyan-600 pt-3 flex items-center space-x-0.5 group-hover:underline">
                  <span>View Specifications</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LIVE DEMO PREVIEW */}
      <section id="live-preview" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                DEMO SIMULATION PREVIEW
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2">Live Operational Command Preview</h2>
            </div>
            <button
              onClick={() => onNavigatePanel('TEAM')}
              className="px-5 py-2.5 rounded-xl font-bold bg-navy-900 text-cyan-400 hover:bg-navy-950 transition-all flex items-center space-x-2 text-xs shadow-md"
            >
              <span>OPEN LIVE DEMO</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-extrabold text-sm tracking-wide text-cyan-400">MISSION AV-001: FLOOD RESCUE SECTOR 4</span>
              </div>
              <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
                <span>UNIT: {activeUnit.code}</span>
                <span>BATTERY: {activeUnit.battery.toFixed(0)}%</span>
                <span>STATUS: {activeUnit.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-950 rounded-2xl p-4 border border-slate-800 min-h-[280px] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-cyan-400">
                  LAT: {activeUnit.lat.toFixed(4)} | LNG: {activeUnit.lng.toFixed(4)} | SPEED: {activeUnit.speed.toFixed(1)} m/s
                </div>
                <div className="my-auto text-center py-10">
                  <MapPin className="w-12 h-12 text-cyan-400 mx-auto animate-bounce mb-3" />
                  <p className="text-sm font-bold text-slate-300">Live Satellite Vector Map Active</p>
                  <p className="text-xs text-slate-500 mt-1">Simulated Autonomous Path to Victim Location</p>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 border-t border-slate-900 pt-2">
                  <span>Target: Sector 4 Rooftop</span>
                  <span>ETA: 04:32 min</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-extrabold uppercase text-slate-400 font-mono mb-3">Live Telemetry</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="bg-slate-900 p-2.5 rounded-xl">
                      <span className="text-slate-400 text-[10px]">Altitude</span>
                      <p className="text-sm font-bold text-cyan-400">18.5 m</p>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-xl">
                      <span className="text-slate-400 text-[10px]">Signal</span>
                      <p className="text-sm font-bold text-emerald-400">95 dBm</p>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-xl">
                      <span className="text-slate-400 text-[10px]">Temperature</span>
                      <p className="text-sm font-bold text-amber-400">28.4 °C</p>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-xl">
                      <span className="text-slate-400 text-[10px]">Gas Level</span>
                      <p className="text-sm font-bold text-teal-400">0.02 ppm</p>
                    </div>
                  </div>
                </div>

                <div className="bg-rose-950/40 p-4 rounded-2xl border border-rose-800/60 text-xs">
                  <div className="flex items-center space-x-2 text-rose-400 font-extrabold mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>EMERGENCY REQUEST #ER-2026-001</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">Victim: Aarav Kumar (Stranded on rooftop)</p>
                  <p className="text-slate-400 text-[10px] mt-1">Status: AVIRON En Route</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TECHNOLOGY STACK */}
      <section id="technology" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold tracking-widest text-cyan-600 uppercase font-mono">Hardware & Software Stack</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2">Built With Advanced Infrastructure</p>
            <p className="text-xs text-slate-500 mt-1">Click any technology card for architecture details</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
            {[
              { name: 'AI Vision', desc: 'YOLOv8 & FLIR', icon: Eye },
              { name: 'Dual RTK GPS', desc: '±0.03m Fix', icon: MapPin },
              { name: 'Raspberry Pi 5', desc: 'IoT Hardware HAL', icon: Cpu },
              { name: 'IoT Sensors', desc: 'Gas & Thermal', icon: Activity },
              { name: 'Cloudflare R2', desc: 'Media Storage', icon: Cloud },
              { name: 'Supabase DB', desc: 'PostgreSQL & RLS', icon: FileText },
              { name: 'Firebase Auth', desc: 'Identity System', icon: Flame },
            ].map((tech, idx) => (
              <div
                key={idx}
                onClick={() => openTechModal(tech.name, tech.desc, tech.icon)}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-cyan-400 hover:shadow-md cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <tech.icon className="w-5 h-5 text-cyan-600" />
                </div>
                <h4 className="text-xs font-extrabold text-navy-950">{tech.name}</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. EMERGENCY CTA BANNER */}
      <section className="py-16 bg-rose-600 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <AlertTriangle className="w-14 h-14 mx-auto text-rose-200 animate-bounce" />
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Need Emergency Assistance?</h2>
          <p className="text-sm sm:text-base text-rose-100 font-medium max-w-2xl mx-auto">
            If you or someone nearby is stranded during a flood or emergency disaster, use our quick assistance portal to broadcast your location to rescue operators.
          </p>
          <button
            onClick={() => onNavigatePanel('VICTIM')}
            className="px-8 py-4 rounded-2xl text-base sm:text-lg font-black text-rose-950 bg-white hover:bg-rose-50 shadow-2xl transition-all inline-flex items-center space-x-3"
          >
            <HeartHandshake className="w-6 h-6 text-rose-600" />
            <span>REQUEST HELP NOW</span>
          </button>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-navy-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center space-x-2 text-white font-extrabold text-lg">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
                <span>AVIRON</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Autonomous Intelligence. Rapid Response. Human Assistance. An integrated emergency rescue ecosystem connecting victims, rescue teams, and autonomous units.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px] font-mono">Panels</h4>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigatePanel('VICTIM')} className="hover:text-cyan-400 transition-colors">Victim Panel</button></li>
                <li><button onClick={() => onNavigatePanel('TEAM')} className="hover:text-cyan-400 transition-colors">Rescue Team Panel</button></li>
                <li><button onClick={() => onNavigatePanel('ADMIN')} className="hover:text-cyan-400 transition-colors">Admin Panel</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px] font-mono">System Info</h4>
              <ul className="space-y-2">
                <li><button onClick={() => openFooterModal('About AVIRON', 'AVIRON is an autonomous disaster-response platform combining IoT hardware with cloud telemetry.')} className="hover:text-cyan-400 transition-colors">About System</button></li>
                <li><button onClick={() => openFooterModal('Technology Documentation', 'Built on React, Tailwind CSS, Supabase RLS, Firebase Auth, Cloudflare R2 and WebSocket HAL.')} className="hover:text-cyan-400 transition-colors">Documentation</button></li>
                <li><button onClick={() => openFooterModal('Hardware HAL Status', 'Raspberry Pi 5 IoT module active.')} className="hover:text-cyan-400 transition-colors">Hardware Specs</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px] font-mono">Emergency</h4>
              <ul className="space-y-2">
                <li className="text-rose-400 font-extrabold">Hotline: 112 / 108</li>
                <li><button onClick={() => openFooterModal('Contact Command Center', 'Rescue Command HQ, Delhi Disaster Response Cell.')} className="hover:text-cyan-400 transition-colors">Contact HQ</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <p>© 2026 AVIRON Autonomous Rescue Platform. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0 font-bold">
              <button onClick={() => openFooterModal('Privacy Policy', 'Strict Row Level Security (RLS) and encrypted data transmission protect victim locations.')} className="hover:text-slate-300">Privacy Policy</button>
              <button onClick={() => openFooterModal('Terms of Service', 'AVIRON emergency assistance system is operated under official disaster management protocols.')} className="hover:text-slate-300">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      {/* 9. GLOBAL INTERACTIVE MODAL DIALOGUE */}
      <AnimatePresence>
        {selectedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl relative space-y-4 text-slate-900"
            >
              <button
                onClick={() => setSelectedModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center font-bold">
                  {React.createElement(selectedModal.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-600 uppercase">{selectedModal.category}</span>
                  <h3 className="text-lg font-black text-navy-950">{selectedModal.title}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {selectedModal.description}
              </p>

              {selectedModal.details && (
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase">Operational Highlights</h4>
                  {selectedModal.details.map((d, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedModal.specs && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1 text-xs font-mono">
                  <h4 className="text-[10px] font-bold text-cyan-700 uppercase">System Specifications</h4>
                  {Object.entries(selectedModal.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-500">{k}:</span>
                      <span className="font-bold text-navy-950">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setSelectedModal(null)}
                className="w-full py-3 bg-navy-900 hover:bg-navy-950 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                Close Specification
              </button>
            </motion.div>
          </div>
        )}

        {/* Hero Unit Inspection Modal */}
        {showUnitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 text-white rounded-3xl p-6 max-w-lg w-full border border-slate-800 shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => setShowUnitModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">AUTONOMOUS HARDWARE HUD</span>
                  <h3 className="text-lg font-black text-white">{activeUnit.code} Specification</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800"><span className="text-slate-500">Chassis Model</span><p className="font-bold text-cyan-400">{activeUnit.model}</p></div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800"><span className="text-slate-500">HAL Host</span><p className="font-bold text-amber-400">192.168.1.100</p></div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800"><span className="text-slate-500">Battery Level</span><p className="font-bold text-emerald-400">{activeUnit.battery}%</p></div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800"><span className="text-slate-500">Signal Mesh</span><p className="font-bold text-teal-400">95 dBm</p></div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                AVIRON-01 is equipped with dual RTK GPS position lock, FLIR Radiometric thermal core, LIDAR obstacle detours, and a precision winch payload drop mechanism for emergency flood rescue operations.
              </p>

              <div className="pt-2 flex space-x-3">
                <button
                  onClick={() => {
                    setShowUnitModal(false);
                    onNavigatePanel('TEAM');
                  }}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-md"
                >
                  Launch Live Operations Panel →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
