import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert, ArrowLeft, UserCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { AVIRON_FULL_NAME } from '../config/navigationConfig';

export const AccessDeniedView: React.FC = () => {
  const navigate = useNavigate();
  const { user, switchRole } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-rose-800 text-center max-w-md w-full space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-950 text-rose-500 border border-rose-800 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-widest">
            AUTHENTICATION & AUTHORIZATION SECURITY GUARD
          </span>
          <h2 className="text-xl font-black text-white mt-1">Access Restricted</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            You are currently signed in as <span className="text-rose-400 font-bold">{user?.name} ({user?.role})</span>. You do not have permission to view this section.
          </p>
        </div>

        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-[11px] text-slate-400 text-left font-mono space-y-1">
          <p><span className="text-slate-500">Platform:</span> {AVIRON_FULL_NAME}</p>
          <p><span className="text-slate-500">Security Engine:</span> Supabase RLS + Firebase Auth JWT</p>
        </div>

        <div className="pt-2 flex flex-col space-y-2">
          <button
            onClick={() => {
              switchRole('ADMIN');
              navigate('/admin');
            }}
            className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md"
          >
            <UserCheck className="w-4 h-4" />
            <span>Switch Role to Admin (Demo Mode)</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
