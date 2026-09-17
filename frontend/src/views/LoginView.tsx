import React, { useState } from 'react';
import { ShieldCheck, Cpu, ArrowRight, Lock, Mail, User as UserIcon, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { ServiceFactory } from '../services/ServiceFactory';
import { Role } from '../types';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { login } = useAuthStore();
  const [tab, setTab] = useState<'LOGIN' | 'REGISTER' | 'FORGOT'>('LOGIN');

  // Form States
  const [email, setEmail] = useState('operator@aviron.io');
  const [password, setPassword] = useState('aviron2026');
  const [fullName, setFullName] = useState('Sarah Connor');
  const [role, setRole] = useState<Role>('OPERATOR');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const authService = ServiceFactory.getAuthService(false);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await authService.login(email, password);
      if (res.success && res.user && res.token) {
        login(res.token, res.user, false);
        onLoginSuccess();
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await authService.register(email, password, fullName, role);
      if (res.success && res.user && res.token) {
        login(res.token, res.user, false);
        onLoginSuccess();
      } else {
        setErrorMsg(res.error || 'Registration failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await authService.resetPassword(email);
    setLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleDemoLogin = async () => {
    const res = await authService.demoLogin();
    if (res.user && res.token) {
      login(res.token, res.user, true);
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-elevated border border-slate-200 p-7 space-y-5">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-navy-950 text-cyan-400 flex items-center justify-center shadow-md ring-4 ring-cyan-500/20">
            <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h1 className="text-xl font-black tracking-wider text-navy-950">AVIRON</h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            Autonomous Rescue Command Network
          </p>
        </div>

        {/* Quick Demo Access Button (Prominent Bypass) */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1.5">
          <span className="text-[10px] font-black uppercase text-amber-900 tracking-wide block">
            Instant Demo Access (No Credentials Required)
          </span>
          <button
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-sm flex items-center justify-center space-x-2 transition-all"
          >
            <Cpu className="w-4 h-4" />
            <span>ENTER DEMO MODE NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Error / Success Banners */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 text-red-900 text-xs font-bold border border-red-200 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Sub-Tab Switcher */}
        <div className="flex items-center justify-around bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setTab('LOGIN')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${tab === 'LOGIN' ? 'bg-navy-900 text-cyan-400 shadow-xs' : 'text-slate-600 hover:text-navy-950'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('REGISTER')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${tab === 'REGISTER' ? 'bg-navy-900 text-cyan-400 shadow-xs' : 'text-slate-600 hover:text-navy-950'}`}
          >
            Register
          </button>
          <button
            onClick={() => setTab('FORGOT')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${tab === 'FORGOT' ? 'bg-navy-900 text-cyan-400 shadow-xs' : 'text-slate-600 hover:text-navy-950'}`}
          >
            Reset
          </button>
        </div>

        {/* TAB 1: LOGIN FORM */}
        {tab === 'LOGIN' && (
          <form onSubmit={handleStandardLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Firebase Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white font-medium text-navy-950"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white font-medium text-navy-950"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-navy-900 hover:bg-navy-950 text-cyan-400 font-extrabold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all"
            >
              <span>{loading ? 'Authenticating Firebase...' : 'Sign In with Firebase Auth'}</span>
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER FORM */}
        {tab === 'REGISTER' && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Elena Rostova"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white font-medium text-navy-950"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white font-medium text-navy-950"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white font-medium text-navy-950"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Assigned Supabase Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-navy-950"
              >
                <option value="OPERATOR">OPERATOR (Create Missions & Deploy Payloads)</option>
                <option value="MEDICAL_OPERATOR">MEDICAL OPERATOR (Manage Survivor Vitals)</option>
                <option value="ADMIN">ADMIN (Full Hardware & Unit System Control)</option>
                <option value="VIEWER">VIEWER (Read-Only Command Center Access)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all"
            >
              <span>{loading ? 'Creating Profile...' : 'Register Firebase & Supabase Account'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: RESET PASSWORD FORM */}
        {tab === 'FORGOT' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Firebase Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white font-medium text-navy-950"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-navy-900 hover:bg-navy-950 text-cyan-400 font-extrabold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Send Firebase Reset Link</span>
            </button>
          </form>
        )}

        <div className="text-[10px] text-center text-slate-400 pt-1 border-t border-slate-100">
          Firebase Auth • Supabase PostgreSQL (RLS) • Cloudflare R2 Storage
        </div>
      </div>
    </div>
  );
};
