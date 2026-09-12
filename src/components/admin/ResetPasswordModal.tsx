import React, { useState, useEffect } from 'react';
import { 
  X, 
  KeyRound, 
  Lock, 
  Check, 
  Copy, 
  ExternalLink, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { RegisteredUser, adminResetCandidatePassword } from '../../utils/auth-storage';
import { useTheme } from '../../utils/theme-context';

interface ResetPasswordModalProps {
  isOpen: boolean;
  candidate: RegisteredUser | null;
  onClose: () => void;
  onSuccess?: (candidateId: string, newPassword: string) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  candidate,
  onClose,
  onSuccess
}) => {
  const { isDark } = useTheme();
  
  const [resetType, setResetType] = useState<'default' | 'custom'>('default');
  const [customPassword, setCustomPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState<{ newPassword: string; message: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setResetType('default');
      setCustomPassword('');
      setShowPassword(false);
      setIsLoading(false);
      setErrorMsg('');
      setSuccessResult(null);
      setIsCopied(false);
    }
  }, [isOpen, candidate]);

  if (!isOpen || !candidate) return null;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetPassword = resetType === 'default' ? '123456' : customPassword.trim();
    if (resetType === 'custom') {
      if (!targetPassword) {
        setErrorMsg('Silakan masukkan kata sandi baru.');
        return;
      }
      if (targetPassword.length < 6) {
        setErrorMsg('Kata sandi baru minimal harus 6 karakter.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await adminResetCandidatePassword(candidate.id, targetPassword);
      if (res.success && res.newPassword) {
        setSuccessResult({
          newPassword: res.newPassword,
          message: res.message
        });
        if (onSuccess) {
          onSuccess(candidate.id, res.newPassword);
        }
      } else {
        setErrorMsg(res.message || 'Gagal mereset kata sandi peserta.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem saat mereset kata sandi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPassword = () => {
    if (!successResult) return;
    navigator.clipboard.writeText(successResult.newPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Convert phone to 62xxx for WhatsApp Web/App
  const formatPhoneForWa = (phone: string): string => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.substring(1);
    }
    return clean;
  };

  const handleSendToWhatsApp = () => {
    if (!successResult || !candidate.phone) return;
    const cleanPhone = formatPhoneForWa(candidate.phone);
    const textMsg = 
`Halo *${candidate.name}*,

Kata sandi akun *Siap Masuk Kerja* Anda telah berhasil direset oleh Admin.
Berikut rincian akun login Anda:

👤 *Nama:* ${candidate.name}
🆔 *ID Peserta:* ${candidate.id}
📱 *No. WhatsApp:* ${candidate.phone}
🔑 *Kata Sandi Baru:* *${successResult.newPassword}*

Silakan login kembali melalui:
https://siapmasukkerja.com

Mohon simpan kata sandi ini dengan baik. Selamat berlatih!`;

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textMsg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-5 flex items-center justify-between border-b ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-slate-50/90'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Reset Kata Sandi Peserta</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {candidate.name} ({candidate.id})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Candidate Quick Info Card */}
          <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
            isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Asal Sekolah:</span>
              <span className="font-bold truncate max-w-[200px]">{candidate.school}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">No. WhatsApp:</span>
              <span className="font-bold text-sky-500">{candidate.phone}</span>
            </div>
            {candidate.email && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Email:</span>
                <span className="font-bold truncate max-w-[200px]">{candidate.email}</span>
              </div>
            )}
          </div>

          {/* Success State */}
          {successResult ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="font-medium">{successResult.message}</p>
              </div>

              {/* Highlight New Password Box */}
              <div className={`p-4 rounded-2xl border text-center space-y-2 ${
                isDark ? 'bg-slate-800 border-indigo-500/30' : 'bg-indigo-50/50 border-indigo-200'
              }`}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Kata Sandi Baru Siswa
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black font-mono tracking-widest text-indigo-500 dark:text-indigo-400 select-all">
                    {successResult.newPassword}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                      isCopied 
                        ? 'bg-emerald-500 text-white border-emerald-600' 
                        : isDark 
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600' 
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                    title="Salin Kata Sandi"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Kirim Kata Sandi ke WhatsApp Siswa</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            /* Form Reset State */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-800'
              }`}>
                <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
                <p className="leading-relaxed">
                  Admin dapat mereset kata sandi peserta tanpa perlu mengetahui kata sandi lama. Akun siswa akan langsung dapat login menggunakan kata sandi baru.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Mode Pilihan Kata Sandi */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-400">
                  Opsi Kata Sandi Baru
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResetType('default')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      resetType === 'default'
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 ring-2 ring-indigo-500/30 font-extrabold'
                        : isDark
                          ? 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Default (123456)</span>
                      {resetType === 'default' && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Standar mudah diingat</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResetType('custom')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      resetType === 'custom'
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 ring-2 ring-indigo-500/30 font-extrabold'
                        : isDark
                          ? 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Kustom Baru</span>
                      {resetType === 'custom' && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Tentukan password sendiri</p>
                  </button>
                </div>
              </div>

              {/* Input Custom Password */}
              {resetType === 'custom' && (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <label className="block text-xs font-bold text-slate-400">
                    Ketik Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      placeholder="Minimal 6 karakter..."
                      required
                      minLength={6}
                      disabled={isLoading}
                      className={`w-full pl-3 pr-10 py-2.5 rounded-xl border text-xs font-semibold outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
                        isDark 
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                          : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Mereset...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-white" />
                      <span>Reset Kata Sandi Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
