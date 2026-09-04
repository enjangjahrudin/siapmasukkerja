import React, { useState, useEffect } from 'react';
import { TargetRole } from '../../types';
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Phone, 
  Mail,
  Building2, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  Sun,
  Moon,
  Eye,
  EyeOff,
  KeyRound,
  RotateCcw,
  Send,
  Loader2
} from 'lucide-react';
import { sounds } from '../../utils/sound-effects';
import { 
  loginUser, 
  requestRegistrationOtp, 
  verifyRegistrationOtp, 
  requestForgotPasswordOtp, 
  confirmPasswordReset,
  RegisteredUser 
} from '../../utils/auth-storage';
import { useTheme } from '../../utils/theme-context';

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
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>(initialMode);
  const [authStep, setAuthStep] = useState<'form' | 'verify_register_otp' | 'verify_reset_otp'>('form');
  const { isDark, toggleTheme } = useTheme();
  
  // Registration Form fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [school, setSchool] = useState<string>('');
  const [major, setMajor] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [targetRole, setTargetRole] = useState<TargetRole>('operator');

  // Forgot Password fields
  const [forgotIdentifier, setForgotIdentifier] = useState<string>('');
  const [resetEmail, setResetEmail] = useState<string>('');
  const [maskedEmail, setMaskedEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  // OTP inputs & timers
  const [otpCode, setOtpCode] = useState<string>('');
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Feedback messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Login remember me state
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('siapkerja_remember_login'));
  });

  // Autofill remembered login
  useEffect(() => {
    const saved = localStorage.getItem('siapkerja_remember_login');
    if (saved) {
      setPhone(saved);
    }
  }, []);

  // Resend OTP countdown effect
  useEffect(() => {
    let timer: any;
    if (resendCountdown > 0) {
      timer = setInterval(() => setResendCountdown(prev => prev - 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCountdown]);

  // --------------------------------------------------------------------------
  // STEP 1: SUBMIT REGISTRATION -> SEND OTP TO EMAIL
  // --------------------------------------------------------------------------
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Silakan masukkan nama lengkap Anda.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Alamat email tidak valid. Pastikan format email sudah benar.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Silakan masukkan nomor WhatsApp yang valid.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestRegistrationOtp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        school: school.trim() || 'SMK Buat Digital',
        major: major.trim() || 'Teknik Mesin',
        password,
        targetRole
      });

      if (res.success) {
        sounds.playClick();
        setSuccessMessage(res.message);
        setAuthStep('verify_register_otp');
        setResendCountdown(60);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengirim kode verifikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // STEP 2: VERIFY REGISTRATION OTP & LOGIN
  // --------------------------------------------------------------------------
  const handleVerifyRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (otpCode.trim().length < 6) {
      setErrorMessage('Masukkan 6-digit kode verifikasi yang dikirim ke email Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyRegistrationOtp(email.trim().toLowerCase(), otpCode.trim());
      if (res.success && res.user) {
        sounds.playCelebration();
        onSuccessLogin(res.user);
      } else {
        sounds.playWrong();
        setErrorMessage(res.message || 'Kode verifikasi salah atau sudah kadaluarsa.');
      }
    } catch (err: any) {
      sounds.playWrong();
      setErrorMessage(err.message || 'Gagal memverifikasi kode.');
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // STEP 3: LOGIN SUBMIT
  // --------------------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!phone.trim()) {
      setErrorMessage('Silakan masukkan nomor WhatsApp, Email, atau ID Pengguna Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginUser(phone, password);
      if (result.success && result.user) {
        if (rememberMe) {
          localStorage.setItem('siapkerja_remember_login', phone.trim());
        } else {
          localStorage.removeItem('siapkerja_remember_login');
        }
        sounds.playCorrect();
        onSuccessLogin(result.user);
      } else {
        sounds.playWrong();
        setErrorMessage(result.message || 'Nomor WhatsApp / Email atau kata sandi tidak sesuai.');
      }
    } catch (err: any) {
      sounds.playWrong();
      setErrorMessage(err.message || 'Gagal masuk ke akun.');
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // STEP 4: FORGOT PASSWORD REQUEST OTP
  // --------------------------------------------------------------------------
  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!forgotIdentifier.trim()) {
      setErrorMessage('Masukkan alamat email atau nomor WhatsApp akun terdaftar Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestForgotPasswordOtp(forgotIdentifier.trim());
      if (res.success) {
        sounds.playClick();
        setResetEmail(res.email || forgotIdentifier);
        setMaskedEmail(res.maskedEmail || res.email || forgotIdentifier);
        setSuccessMessage(res.message);
        setAuthStep('verify_reset_otp');
        setResendCountdown(60);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Akun tidak ditemukan.');
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // STEP 5: CONFIRM RESET PASSWORD
  // --------------------------------------------------------------------------
  const handleResetPasswordConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (otpCode.trim().length < 6) {
      setErrorMessage('Masukkan 6-digit kode reset dari email.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Kata sandi baru minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await confirmPasswordReset(resetEmail, otpCode.trim(), newPassword);
      if (res.success) {
        sounds.playCorrect();
        setSuccessMessage('Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.');
        setMode('login');
        setAuthStep('form');
        setPassword('');
        setOtpCode('');
      } else {
        sounds.playWrong();
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      sounds.playWrong();
      setErrorMessage(err.message || 'Gagal mereset kata sandi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP trigger
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    setErrorMessage(null);
    if (authStep === 'verify_register_otp') {
      await handleRegisterSubmit({ preventDefault: () => {} } as any);
    } else if (authStep === 'verify_reset_otp') {
      await handleForgotPasswordRequest({ preventDefault: () => {} } as any);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between select-none transition-colors duration-200 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Header */}
      <div className={`p-4 flex items-center justify-between border-b sticky top-0 z-20 backdrop-blur-md transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        <button
          onClick={() => {
            if (authStep !== 'form') {
              setAuthStep('form');
              setErrorMessage(null);
              setSuccessMessage(null);
            } else if (mode === 'forgot_password') {
              setMode('login');
              setErrorMessage(null);
            } else {
              onBackToLanding();
            }
          }}
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'text-slate-400 hover:text-white bg-slate-800' : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className={`font-extrabold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          {authStep === 'verify_register_otp' 
            ? 'Verifikasi Email Pendaftaran' 
            : authStep === 'verify_reset_otp' 
            ? 'Verifikasi Reset Kata Sandi' 
            : mode === 'forgot_password'
            ? 'Lupa Kata Sandi'
            : mode === 'login' 
            ? 'Masuk ke Akun Anda' 
            : 'Registrasi Akun Calon Pekerja'}
        </span>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-colors flex items-center justify-center ${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-750' 
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
          }`}
          title={isDark ? 'Mode Terang' : 'Mode Gelap'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 p-4 sm:p-6 max-w-md mx-auto w-full flex flex-col justify-center my-auto space-y-4">
        
        {/* Mode Switcher Tabs (Only on normal form) */}
        {authStep === 'form' && mode !== 'forgot_password' && (
          <div className={`p-1 rounded-2xl flex border shadow-xs ${
            isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-200/70 border-slate-300/60'
          }`}>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-brand-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daftar Akun Baru
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-brand-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sudah Punya Akun (Masuk)
            </button>
          </div>
        )}

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-2xl text-xs text-red-700 dark:text-red-300 flex items-start gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{successMessage}</span>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 1: REGISTRATION EMAIL OTP VERIFICATION SCREEN                */}
        {/* ================================================================= */}
        {authStep === 'verify_register_otp' && (
          <form onSubmit={handleVerifyRegisterOtp} className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto border border-brand-200 dark:border-brand-800 shadow-sm">
              <Mail className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Verifikasi Alamat Email Anda ✉️
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Kami telah mengirimkan 6-digit kode verifikasi ke alamat email:
              </p>
              <div className="inline-block mt-1 font-bold text-xs text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800 font-mono">
                {email}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-xs space-y-3">
              <label className="block text-[11px] font-bold uppercase text-slate-500 text-left">
                Masukkan 6-Digit Kode OTP:
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className="w-full text-center py-3 text-2xl font-black font-mono tracking-widest rounded-xl border border-brand-300 dark:border-brand-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-[10px] text-slate-400 text-left">
                *Cek juga folder Spam/Promotions jika email belum terlihat di kotak masuk utama.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Verifikasi & Masuk Dashboard</span>
            </button>

            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <button
                type="button"
                onClick={() => setAuthStep('form')}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold"
              >
                ← Ganti Email
              </button>

              <button
                type="button"
                disabled={resendCountdown > 0 || isLoading}
                onClick={handleResendOtp}
                className="text-brand-600 dark:text-brand-400 hover:underline font-bold disabled:opacity-40"
              >
                {resendCountdown > 0 ? `Kirim Ulang (${resendCountdown}s)` : 'Kirim Ulang Kode'}
              </button>
            </div>
          </form>
        )}

        {/* ================================================================= */}
        {/* VIEW 2: FORGOT PASSWORD OTP & NEW PASSWORD SCREEN                 */}
        {/* ================================================================= */}
        {authStep === 'verify_reset_otp' && (
          <form onSubmit={handleResetPasswordConfirm} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Buat Kata Sandi Baru 🔒
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Masukkan kode verifikasi yang telah dikirim ke <strong>{maskedEmail}</strong> dan ketikkan kata sandi baru.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase mb-1 text-slate-700 dark:text-slate-300">
                  Kode Verifikasi (6-Digit OTP) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  className="w-full text-center py-2.5 text-xl font-bold font-mono tracking-widest rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase mb-1 text-slate-700 dark:text-slate-300">
                  Kata Sandi Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Simpan Kata Sandi Baru</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                disabled={resendCountdown > 0 || isLoading}
                onClick={handleResendOtp}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-bold disabled:opacity-40"
              >
                {resendCountdown > 0 ? `Kirim Ulang Kode (${resendCountdown}s)` : 'Belum terima kode? Kirim Ulang'}
              </button>
            </div>
          </form>
        )}

        {/* ================================================================= */}
        {/* VIEW 3: FORGOT PASSWORD REQUEST FORM                              */}
        {/* ================================================================= */}
        {authStep === 'form' && mode === 'forgot_password' && (
          <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Lupa Kata Sandi? 🔑
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Masukkan alamat email atau nomor WhatsApp terdaftar Anda untuk menerima kode reset kata sandi.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase mb-1.5 text-slate-700 dark:text-slate-300">
                Alamat Email / No. WhatsApp
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder="nama@email.com atau 08xxxxxxxxxx"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Kirim Kode Reset ke Email</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold"
              >
                ← Kembali ke Halaman Masuk
              </button>
            </div>
          </form>
        )}

        {/* ================================================================= */}
        {/* VIEW 4: REGISTRATION FORM WITH EMAIL                              */}
        {/* ================================================================= */}
        {authStep === 'form' && mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="space-y-0.5">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Yuk, Mulai Persiapan Kerjamu! 🚀
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lengkapi data diri untuk verifikasi akun dan memantau kesiapan kerja Anda.
              </p>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-slate-700 dark:text-slate-300">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-xs"
                />
              </div>
            </div>

            {/* Alamat Email (Baru) */}
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-slate-700 dark:text-slate-300">
                Alamat Email Aktif <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com (Untuk kirim kode verifikasi)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-xs"
                />
              </div>
            </div>

            {/* Sekolah & Jurusan */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold mb-1 uppercase text-slate-700 dark:text-slate-300">
                  Asal Sekolah
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="SMK Buat Digital"
                  className="w-full px-3 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold mb-1 uppercase text-slate-700 dark:text-slate-300">
                  Jurusan
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="Teknik Mesin / RPL"
                  className="w-full px-3 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-xs"
                />
              </div>
            </div>

            {/* No WhatsApp */}
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-slate-700 dark:text-slate-300">
                No. WhatsApp / HP <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-xs"
                />
              </div>
            </div>

            {/* Kata Sandi */}
            <div>
              <label className="block text-[11px] font-bold mb-1 uppercase text-slate-700 dark:text-slate-300">
                Kata Sandi (Password) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                  title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Target Posisi */}
            <div>
              <label className="block text-[11px] font-bold mb-1.5 uppercase text-slate-700 dark:text-slate-300">
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
                        ? isDark 
                          ? 'bg-brand-600/30 border-brand-500 text-sky-300 ring-1 ring-brand-500' 
                          : 'bg-sky-100 border-brand-600 text-brand-900 ring-2 ring-brand-300 font-black'
                        : isDark 
                          ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3.5 bg-gradient-to-r from-brand-600 via-sky-500 to-teal-400 hover:from-brand-500 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Kirim Kode Verifikasi ke Email</span>
            </button>
          </form>
        )}

        {/* ================================================================= */}
        {/* VIEW 5: LOGIN FORM (WITH FORGOT PASSWORD LINK)                    */}
        {/* ================================================================= */}
        {authStep === 'form' && mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-0.5">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Selamat Datang Kembali! 👋
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Masukkan nomor WhatsApp / Email dan kata sandi yang telah terdaftar.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold mb-1.5 uppercase text-slate-700 dark:text-slate-300">
                No. WhatsApp / Email / ID
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx / email / admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot_password');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Lupa Kata Sandi?
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata sandi akun Anda"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700"
                  title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Fitur Ingat Saya (Remember Me) */}
            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300 font-bold">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 accent-brand-600 cursor-pointer"
                />
                <span>Ingat Saya di Perangkat Ini</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>{isLoading ? 'Memverifikasi Akun...' : 'Masuk ke Akun Saya'}</span>
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
