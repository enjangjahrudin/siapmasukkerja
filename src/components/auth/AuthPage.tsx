import React, { useState } from 'react';
import { TargetRole } from '../../types';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Phone
} from 'lucide-react';
import { sounds } from '../../utils/sound-effects';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onSuccessLogin: (user: { name: string; targetRole: TargetRole }) => void;
  onBackToLanding: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onSuccessLogin,
  onBackToLanding
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState<string>('Ahmad Fauzi');
  const [identifier, setIdentifier] = useState<string>('081234567890');
  const [password, setPassword] = useState<string>('******');
  const [selectedRole, setSelectedRole] = useState<TargetRole>('operator');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playCorrect();
    onSuccessLogin({
      name: mode === 'register' && name ? name : 'Ahmad Fauzi',
      targetRole: selectedRole
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between select-none">
      
      {/* Top Header with Back */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/80 sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md">
        <button
          onClick={onBackToLanding}
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-750 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="font-extrabold text-sm text-slate-200">
          {mode === 'login' ? 'Masuk ke SMK — Siap Masuk Kerja' : 'Daftar Akun Baru'}
        </span>

        <div className="w-9" /> {/* balance spacer */}
      </div>

      {/* Form Content */}
      <div className="p-5 flex-1 overflow-y-auto space-y-6">
        
        {/* Toggle Mode */}
        <div className="grid grid-cols-2 p-1 bg-slate-800/80 rounded-2xl border border-slate-700/80">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Title Intro */}
        <div>
          <h2 className="text-xl font-extrabold text-white">
            {mode === 'login' ? 'Selamat Datang Kembali! 👋' : 'Yuk, Mulai Latihan Masuk Kerja 🚀'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' 
              ? 'Simulasikan seleksi dan tingkatkan kesiapan ujian kerja Anda.'
              : '“Kamu sudah SMK. Sekarang, sudah siap masuk kerja? Yuk, latihan dulu.”'}
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase">
              No. WhatsApp / Email
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="08xxxxxxxxxx / email@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase">
                Target Posisi Pekerjaan
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'operator', title: 'Operator Produksi' },
                  { id: 'qc', title: 'QC Inspector' },
                  { id: 'maintenance', title: 'Maintenance' },
                  { id: 'logistics', title: 'Logistik & Gudang' }
                ].map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id as TargetRole)}
                    className={`p-2.5 rounded-xl border text-[11px] font-bold text-left transition-all ${
                      selectedRole === role.id
                        ? 'bg-brand-600/30 border-brand-500 text-sky-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {role.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 py-3.5 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
          >
            <span>{mode === 'login' ? 'Masuk ke Aplikasi' : 'Daftar & Mulai Latihan'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <button
            onClick={() => onSuccessLogin({ name: 'Ahmad Fauzi', targetRole: selectedRole })}
            className="text-xs text-sky-400 font-semibold hover:underline"
          >
            ⚡ Masuk Cepat sebagai Tamu / Demo
          </button>
        </div>

      </div>

    </div>
  );
};
