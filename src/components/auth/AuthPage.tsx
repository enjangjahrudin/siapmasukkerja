import React, { useState } from 'react';
import { TargetRole } from '../../types';
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Phone, 
  Building2, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { sounds } from '../../utils/sound-effects';
import { registerNewCandidate, loginUser, RegisteredUser } from '../../utils/auth-storage';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onSuccessLogin: (user: RegisteredUser) => void;
  onBackToLanding: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'register',
  onSuccessLogin,
  onBackToLanding
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Form fields
  const [name, setName] = useState<string>('');
  const [school, setSchool] = useState<string>('');
  const [major, setMajor] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [targetRole, setTargetRole] = useState<TargetRole>('operator');

  // Error feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Silakan masukkan nama lengkap Anda.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Silakan masukkan nomor WhatsApp Anda.');
      return;
    }
    if (phone.trim().length < 8) {
      setErrorMessage('Nomor WhatsApp tidak valid.');
      return;
    }

    try {
      const newUser = registerNewCandidate({
        name: name.trim(),
        phone: phone.trim(),
        school: school.trim() || 'SMK Negeri 1',
        major: major.trim() || 'Teknik Mesin',
        password: password || '123456',
        targetRole
      });

      sounds.playCelebration();
      onSuccessLogin(newUser);
    } catch (err: any) {
      setErrorMessage('Terjadi kendala saat registrasi: ' + (err.message || 'Silakan coba lagi.'));
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!phone.trim()) {
      setErrorMessage('Silakan masukkan nomor WhatsApp / ID Anda.');
      return;
    }

    const result = loginUser(phone, password);
    if (result.success && result.user) {
      sounds.playCorrect();
      onSuccessLogin(result.user);
    } else {
      sounds.playWrong();
      setErrorMessage(result.message || 'Nomor WhatsApp atau kata sandi salah.');
    }
  };

  const handleQuickDemoCandidate = () => {
    const result = loginUser('081234567891', 'password123');
    if (result.success && result.user) {
      sounds.playCorrect();
      onSuccessLogin(result.user);
    }
  };

  const handleQuickAdminLogin = () => {
    const result = loginUser('admin', 'admin');
    if (result.success && result.user) {
      sounds.playCelebration();
      onSuccessLogin(result.user);
    }
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
          {mode === 'login' ? 'Masuk ke Akun Anda' : 'Registrasi Akun Calon Pekerja'}
        </span>

        <div className="w-9" />
      </div>

      {/* Form Content Area */}
      <div className="p-5 flex-1 overflow-y-auto space-y-5">
        
        {/* Toggle Mode */}
        <div className="grid grid-cols-2 p-1 bg-slate-800/80 rounded-2xl border border-slate-700/80">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daftar Akun Baru
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sudah Punya Akun (Masuk)
          </button>
        </div>

        {/* Title Intro */}
        <div>
          <h2 className="text-xl font-extrabold text-white">
            {mode === 'register' ? 'Yuk, Mulai Persiapan Kerjamu! 🚀' : 'Selamat Datang Kembali! 👋'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'register' 
              ? 'Lengkapi data diri untuk memantau nilai latihan dan grafik kesiapan seleksi kerja Anda.'
              : 'Masukkan nomor WhatsApp dan kata sandi yang telah terdaftar.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center gap-2 text-xs text-red-200 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* REGISTRATION FORM */}
        {mode === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            
            {/* Nama Lengkap */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase">
                Nama Lengkap <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            {/* Asal Sekolah & Jurusan */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase">
                  Asal Sekolah
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="SMKN 1 Karawang"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase">
                  Jurusan
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="Teknik Mesin / RPL"
                  className="w-full px-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            {/* No WhatsApp */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase">
                No. WhatsApp / HP <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            {/* Kata Sandi */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase">
                Kata Sandi (Password) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            {/* Target Posisi */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase">
                Target Posisi Kerja Sasaran:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'operator', title: 'Operator Produksi' },
                  { id: 'qc', title: 'QC Inspector' },
                  { id: 'maintenance', title: 'Maintenance' },
                  { id: 'logistics', title: 'Logistik & Gudang' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setTargetRole(r.id as TargetRole)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      targetRole === r.id
                        ? 'bg-brand-600/30 border-brand-500 text-sky-300 ring-1 ring-brand-500'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-3.5 bg-gradient-to-r from-brand-600 via-sky-500 to-teal-400 hover:from-brand-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <span>Daftar & Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase">
                No. WhatsApp / ID Pengguna
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx atau admin"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none"
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
                  placeholder="Kata sandi akun Anda"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <span>Masuk ke Akun Saya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Demo Access (For Test / Evaluation) */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Akses Cepat Pengujian:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoCandidate}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span>Demo Siswa (Ahmad)</span>
            </button>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Login Super Admin</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
