import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Activity, Cpu, Radio, AlertTriangle, HeartHandshake, Eye, Flame, MapPin, Zap, Compass, CheckCircle2, ChevronRight, Video, FileText, Phone, Cloud } from 'lucide-react';
import { useAvironStore } from '../store/useAvironStore';

interface PublicLandingViewProps {
  onNavigatePanel: (panel: 'PUBLIC' | 'VICTIM' | 'TEAM' | 'ADMIN') => void;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({ onNavigatePanel }) => {
  const { units } = useAvironStore();
  const activeUnit = units[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-cyan-500 selection:text-white">
      {/* 1. PUBLIC NAVBAR */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-[41px] z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-navy-900 text-cyan-400 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-navy-950">AVIRON</span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Rescue Platform
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-cyan-600 transition-colors">How It Works</a>
            <a href="#capabilities" className="hover:text-cyan-600 transition-colors">Capabilities</a>
            <a href="#live-preview" className="hover:text-cyan-600 transition-colors">Live Operations</a>
            <a href="#technology" className="hover:text-cyan-600 transition-colors">Technology</a>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigatePanel('TEAM')}
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all"
            >
              Rescue Team Login
            </button>
            <button
              onClick={() => onNavigatePanel('ADMIN')}
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all"
            >
              Admin Login
            </button>
            <button
              onClick={() => onNavigatePanel('VICTIM')}
              className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all flex items-center space-x-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>REQUEST HELP</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 pt-16 pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
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
              className="text-4xl sm:text-6xl font-black text-navy-950 tracking-tight leading-tight"
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
              className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed"
            >
              An intelligent autonomous rescue platform designed to connect victims, rescue teams and autonomous AVIRON units during emergency situations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-4 flex flex-wrap items-center justify-center gap-4"
            >
              <button
                onClick={() => onNavigatePanel('VICTIM')}
                className="px-6 py-3.5 rounded-2xl text-base font-extrabold text-white bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-600/30 transition-all flex items-center space-x-2"
              >
                <HeartHandshake className="w-5 h-5" />
                <span>REQUEST EMERGENCY ASSISTANCE</span>
              </button>

              <a
                href="#capabilities"
                className="px-6 py-3.5 rounded-2xl text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all flex items-center space-x-2"
              >
                <span>EXPLORE AVIRON</span>
                <ArrowRight className="w-4 h-4 text-cyan-600" />
              </a>
            </motion.div>

            <div className="pt-6 flex items-center justify-center space-x-4 text-xs font-bold text-slate-500">
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
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-cyan-600 uppercase">Seamless Rescue Pipeline</h2>
            <p className="text-3xl font-extrabold text-navy-950 mt-2">How AVIRON Works During Emergency</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Emergency', desc: 'Victim submits assistance request or sensors detect disaster.', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-200' },
              { step: '02', title: 'Detection', desc: 'AI algorithm & RTK GPS fix victim coordinates.', icon: Eye, color: 'text-amber-600 bg-amber-50 border-amber-200' },
              { step: '03', title: 'Mission', desc: 'Command center creates mission & assigns rescue team.', icon: Zap, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
              { step: '04', title: 'AVIRON Deploy', desc: 'Amphibious drone launches autonomous pathfinding.', icon: Radio, color: 'text-teal-600 bg-teal-50 border-teal-200' },
              { step: '05', title: 'Assistance', desc: 'Medical kit drop, two-way comms & thermal triage.', icon: HeartHandshake, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
              { step: '06', title: 'Resolution', desc: 'Victim safe, mission completed & automated report.', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 hover:border-cyan-300 transition-all shadow-sm flex flex-col justify-between">
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold mb-4 border ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">STEP {item.step}</span>
                  <h3 className="text-base font-extrabold text-navy-950 mt-1">{item.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AVIRON CAPABILITIES */}
      <section id="capabilities" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-cyan-600 uppercase">Core Platform Features</h2>
            <p className="text-3xl font-extrabold text-navy-950 mt-2">AVIRON Capabilities</p>
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
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center mb-4">
                  <cap.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-navy-950">{cap.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LIVE OPERATIONS PREVIEW */}
      <section id="live-preview" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                DEMO SIMULATION PREVIEW
              </span>
              <h2 className="text-3xl font-extrabold text-navy-950 mt-3">Live Operational Command Preview</h2>
            </div>
            <button
              onClick={() => onNavigatePanel('TEAM')}
              className="px-5 py-2.5 rounded-xl font-bold bg-navy-900 text-cyan-400 hover:bg-navy-950 transition-all flex items-center space-x-2 text-xs"
            >
              <span>Launch Rescue Team Interface</span>
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
              <div className="lg:col-span-2 bg-slate-950 rounded-2xl p-4 border border-slate-800 min-h-[300px] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-cyan-400">
                  LAT: {activeUnit.lat.toFixed(4)} | LNG: {activeUnit.lng.toFixed(4)} | SPEED: {activeUnit.speed.toFixed(1)} m/s
                </div>
                <div className="my-auto text-center py-12">
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
      <section id="technology" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-cyan-600 uppercase">Hardware & Software Stack</h2>
            <p className="text-3xl font-extrabold text-navy-950 mt-2">Built With Advanced Infrastructure</p>
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
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-cyan-400 transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-3">
                  <tech.icon className="w-5 h-5 text-cyan-600" />
                </div>
                <h4 className="text-xs font-extrabold text-navy-950">{tech.name}</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-1">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. EMERGENCY CTA BANNER */}
      <section className="py-20 bg-rose-600 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <AlertTriangle className="w-16 h-16 mx-auto text-rose-200 animate-bounce" />
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Need Emergency Assistance?</h2>
          <p className="text-lg text-rose-100 font-medium max-w-2xl mx-auto">
            If you or someone nearby is stranded during a flood or emergency disaster, use our quick assistance portal to broadcast your location to rescue operators.
          </p>
          <button
            onClick={() => onNavigatePanel('VICTIM')}
            className="px-8 py-4 rounded-2xl text-lg font-black text-rose-950 bg-white hover:bg-rose-50 shadow-2xl transition-all inline-flex items-center space-x-3"
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
            <div className="col-span-2">
              <div className="flex items-center space-x-2 text-white font-extrabold text-lg mb-3">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
                <span>AVIRON</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Autonomous Intelligence. Rapid Response. Human Assistance. An integrated emergency rescue ecosystem connecting victims, rescue teams, and autonomous units.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Panels</h4>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigatePanel('VICTIM')} className="hover:text-cyan-400">Victim Panel</button></li>
                <li><button onClick={() => onNavigatePanel('TEAM')} className="hover:text-cyan-400">Rescue Team Panel</button></li>
                <li><button onClick={() => onNavigatePanel('ADMIN')} className="hover:text-cyan-400">Admin Panel</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Technology</h4>
              <ul className="space-y-2">
                <li><span>Raspberry Pi HAL</span></li>
                <li><span>Cloudflare R2</span></li>
                <li><span>Supabase Database</span></li>
                <li><span>Firebase Auth</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Emergency</h4>
              <ul className="space-y-2">
                <li className="text-rose-400 font-bold">24/7 Hotline: 112</li>
                <li><span>Rescue Command HQ</span></li>
                <li><span>Delhi Disaster Cell</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <p>© 2026 AVIRON Autonomous Rescue Platform. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <span className="hover:text-slate-400">Privacy Policy</span>
              <span className="hover:text-slate-400">Terms of Service</span>
              <span className="hover:text-slate-400">Documentation</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
