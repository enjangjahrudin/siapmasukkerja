import React, { useState, useEffect, useRef } from 'react';
import { TargetRole } from '../../types';
import { 
  User, 
  Target, 
  Award, 
  Flame, 
  ShieldCheck, 
  LogOut, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  Briefcase, 
  Sun,
  Moon,
  Edit3,
  Lock,
  Camera,
  School,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  Loader2,
  Activity,
  Ruler
} from 'lucide-react';
import { sounds } from '../../utils/sound-effects';
import { useTheme } from '../../utils/theme-context';
import { 
  RegisteredUser, 
  getActiveSession, 
  fetchUserProfile,
  updateUserProfile, 
  changeUserPassword 
} from '../../utils/auth-storage';

interface MobileProfileTabProps {
  userName: string;
  targetRole: TargetRole;
  setTargetRole: (role: TargetRole) => void;
  onLogout: () => void;
  onUpdateUser?: (user: RegisteredUser) => void;
}

export const MobileProfileTab: React.FC<MobileProfileTabProps> = ({
  userName,
  targetRole,
  setTargetRole,
  onLogout,
  onUpdateUser
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [currentUserData, setCurrentUserData] = useState<RegisteredUser | null>(() => getActiveSession());
  const activeUser = currentUserData || getActiveSession();

  // Fetch fresh profile from MySQL backend on mount
  useEffect(() => {
    if (activeUser?.id) {
      fetchUserProfile(activeUser.id).then((fresh) => {
        if (fresh) {
          setCurrentUserData(fresh);
          if (onUpdateUser) onUpdateUser(fresh);
        }
      });
    }
  }, []);

  // Modal / Accordion Views
  const [activeModal, setActiveModal] = useState<'none' | 'edit_profile' | 'change_password'>('none');

  // Edit Profile Form State
  const [editName, setEditName] = useState<string>(activeUser?.name || userName);
  const [editSchool, setEditSchool] = useState<string>(activeUser?.school || '');
  const [editMajor, setEditMajor] = useState<string>(activeUser?.major || '');
  const [editGender, setEditGender] = useState<'Laki-laki' | 'Perempuan'>(activeUser?.gender || 'Laki-laki');
  const [editHeight, setEditHeight] = useState<string>(activeUser?.height !== undefined ? String(activeUser.height) : '');
  const [editWeight, setEditWeight] = useState<string>(activeUser?.weight !== undefined ? String(activeUser.weight) : '');
  const [editAddress, setEditAddress] = useState<string>(activeUser?.address || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState<string>(activeUser?.avatarUrl || '');

  // Open Edit Modal with latest synchronized data
  const openEditModal = () => {
    const latest = getActiveSession() || activeUser;
    setEditName(latest?.name || userName);
    setEditSchool(latest?.school || '');
    setEditMajor(latest?.major || '');
    setEditGender(latest?.gender || 'Laki-laki');
    setEditHeight(latest?.height !== undefined && latest?.height !== null ? String(latest.height) : '');
    setEditWeight(latest?.weight !== undefined && latest?.weight !== null ? String(latest.weight) : '');
    setEditAddress(latest?.address || '');
    setEditAvatarUrl(latest?.avatarUrl || '');
    setActiveModal('edit_profile');
    sounds.playClick();
  };

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPass, setShowCurrentPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);

  // Status & Notifications
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate BMI & Physical Factory Standard Fit
  const heightNum = parseFloat(editHeight || String(activeUser?.height || 0));
  const weightNum = parseFloat(editWeight || String(activeUser?.weight || 0));
  let bmiValue: number | null = null;
  let bmiCategory = 'Belum diisi';
  let isFactoryFit = false;

  if (heightNum > 0 && weightNum > 0) {
    const heightInMeters = heightNum / 100;
    bmiValue = parseFloat((weightNum / (heightInMeters * heightInMeters)).toFixed(1));
    if (bmiValue < 18.5) bmiCategory = 'Kurus / Kurang Berat';
    else if (bmiValue <= 24.9) bmiCategory = 'Ideal & Prima (Standar Astra/Toyota)';
    else if (bmiValue <= 29.9) bmiCategory = 'Kelebihan Berat Badan';
    else bmiCategory = 'Obesitas';

    // Industrial physical minimums: usually 160-165cm for operator/QC
    const minHeight = (activeUser?.gender || editGender) === 'Perempuan' ? 155 : 163;
    isFactoryFit = heightNum >= minHeight && bmiValue >= 18.5 && bmiValue <= 26;
  }

  // Handle Photo Upload with Auto-Resizing & High Performance Compression
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setToastMessage({ type: 'error', text: 'Ukuran foto maksimal 5 MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 360;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setEditAvatarUrl(compressedDataUrl);
          sounds.playClick();
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Avatar Presets
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
  ];

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;

    setIsLoading(true);
    setToastMessage(null);

    try {
      const payload: Partial<RegisteredUser> = {
        name: editName.trim() || activeUser.name,
        school: editSchool.trim() || activeUser.school,
        major: editMajor.trim() || activeUser.major,
        gender: editGender,
        height: editHeight ? parseFloat(editHeight) : undefined,
        weight: editWeight ? parseFloat(editWeight) : undefined,
        address: editAddress.trim(),
        avatarUrl: editAvatarUrl || activeUser.avatarUrl
      };

      const res = await updateUserProfile(activeUser.id, payload);
      if (res.success && res.user) {
        sounds.playCelebration();
        setCurrentUserData(res.user);
        if (onUpdateUser) onUpdateUser(res.user);
        setToastMessage({ type: 'success', text: 'Profil berhasil diperbarui dan tersimpan di database!' });
        setTimeout(() => setActiveModal('none'), 800);
      } else {
        sounds.playWrong();
        setToastMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      sounds.playWrong();
      setToastMessage({ type: 'error', text: err.message || 'Gagal menyimpan profil.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Change Password Handler
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;

    if (!currentPassword) {
      setToastMessage({ type: 'error', text: 'Silakan masukkan kata sandi saat ini.' });
      return;
    }
    if (newPassword.length < 6) {
      setToastMessage({ type: 'error', text: 'Kata sandi baru minimal 6 karakter.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToastMessage({ type: 'error', text: 'Konfirmasi kata sandi baru tidak cocok.' });
      return;
    }

    setIsLoading(true);
    setToastMessage(null);

    try {
      const res = await changeUserPassword(activeUser.id, currentPassword, newPassword);
      if (res.success) {
        sounds.playCelebration();
        setToastMessage({ type: 'success', text: 'Kata sandi berhasil diganti! Gunakan sandi baru untuk login berikutnya.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setActiveModal('none'), 1200);
      } else {
        sounds.playWrong();
        setToastMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      sounds.playWrong();
      setToastMessage({ type: 'error', text: err.message || 'Gagal mengubah kata sandi.' });
    } finally {
      setIsLoading(false);
    }
  };

  const displayAvatar = activeUser?.avatarUrl || editAvatarUrl;

  return (
    <div className={`p-4 space-y-4 pb-24 select-none transition-colors ${
      isDark ? 'text-white' : 'text-slate-900'
    }`}>

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 shadow-lg border transition-all ${
          toastMessage.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            : 'bg-red-50 dark:bg-red-950/80 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
        }`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          )}
          <span className="font-semibold leading-tight">{toastMessage.text}</span>
        </div>
      )}
      
      {/* Profile Card Header */}
      <div className={`border rounded-3xl p-5 shadow-xs text-center relative transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Avatar Photo with Edit Button */}
        <div className="relative inline-block mx-auto mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 via-sky-500 to-teal-400 text-slate-950 font-black text-2xl flex items-center justify-center overflow-hidden shadow-lg border-2 border-white dark:border-slate-800">
            {displayAvatar ? (
              <img 
                src={displayAvatar} 
                alt={userName} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>
          <button
            onClick={openEditModal}
            className="absolute -bottom-1 -right-1 p-2 rounded-full bg-brand-600 text-white shadow-md hover:bg-brand-500 transition-all border-2 border-white dark:border-slate-900"
            title="Ubah Foto Profil"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <h2 className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {activeUser?.name || userName}
        </h2>
        
        <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {activeUser?.school ? `${activeUser.school} • ${activeUser.major || 'Teknik'}` : 'Calon Pekerja SMK / SMA'}
        </p>

        {/* Badges: Target Role & Factory Physical Qualification */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
            isDark ? 'bg-sky-950/60 text-sky-300 border-sky-800' : 'bg-brand-50 text-brand-700 border-brand-200'
          }`}>
            <Briefcase className="w-3.5 h-3.5" />
            <span className="capitalize">{targetRole}</span>
          </div>

          {(activeUser?.height || activeUser?.weight) && (
            <div className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              isFactoryFit 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
            }`}>
              <Activity className="w-3 h-3" />
              <span>{activeUser.height}cm / {activeUser.weight}kg ({bmiCategory.split(' ')[0]})</span>
            </div>
          )}
        </div>

        {/* Quick Action: Edit Profile & Change Password Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={openEditModal}
            className="py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Edit Profil</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveModal('change_password');
            }}
            className="py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs"
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Ganti Sandi</span>
          </button>
        </div>

      </div>

      {/* =================================================================== */}
      {/* MODAL 1: EDIT & LENGKAPI PROFIL                                     */}
      {/* =================================================================== */}
      {activeModal === 'edit_profile' && (
        <div className={`border rounded-3xl p-5 shadow-md space-y-4 border-brand-200 dark:border-brand-800 transition-all ${
          isDark ? 'bg-slate-900' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Edit3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Lengkapi & Edit Profil</h3>
            </div>
            <button 
              onClick={() => setActiveModal('none')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
            {/* Foto Profil / Avatar Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                Foto Profil:
              </label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {editAvatarUrl ? (
                    <img src={editAvatarUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Foto Sendiri (Maks 2MB)</span>
                  </button>
                  <p className="text-[10px] text-slate-400">Atau pilih avatar default di bawah:</p>
                </div>
              </div>

              {/* Avatar Preset Grid */}
              <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
                {avatarPresets.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setEditAvatarUrl(url);
                      sounds.playClick();
                    }}
                    className={`w-9 h-9 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      editAvatarUrl === url 
                        ? 'border-brand-500 scale-105 shadow-sm' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nama Lengkap Anda"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Laki-laki', 'Perempuan'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setEditGender(g)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      editGender === g
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {g === 'Laki-laki' ? '👨 Laki-laki' : '👩 Perempuan'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sekolah & Jurusan */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Asal Sekolah
                </label>
                <input
                  type="text"
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  placeholder="SMKN 1 Karawang"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Jurusan
                </label>
                <input
                  type="text"
                  value={editMajor}
                  onChange={(e) => setEditMajor(e.target.value)}
                  placeholder="Teknik Mesin"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Tinggi Badan & Berat Badan (Penting untuk Seleksi Fisik Pabrik) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Tinggi Badan (cm)
                </label>
                <div className="relative">
                  <Ruler className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    value={editHeight}
                    onChange={(e) => setEditHeight(e.target.value)}
                    placeholder="Contoh: 170"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Berat Badan (kg)
                </label>
                <div className="relative">
                  <Activity className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    placeholder="Contoh: 62"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Info BMI / Standar Fisik Industri */}
            {bmiValue && (
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-[11px] flex items-center justify-between">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Indeks Massa Tubuh (BMI):</span>
                  <strong className="text-sky-700 dark:text-sky-300">{bmiValue} — {bmiCategory}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Status Fisik:</span>
                  <span className={`font-bold ${isFactoryFit ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                    {isFactoryFit ? '✓ Lolos Standar' : 'Perlu Penyesuaian'}
                  </span>
                </div>
              </div>
            )}

            {/* Alamat Lengkap */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Alamat Lengkap (Domisili / KTP)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Jl. Raya Industri No. 12, Cikarang Selatan, Kab. Bekasi, Jawa Barat"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Simpan Profil</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: GANTI KATA SANDI                                           */}
      {/* =================================================================== */}
      {activeModal === 'change_password' && (
        <div className={`border rounded-3xl p-5 shadow-md space-y-4 border-amber-200 dark:border-amber-800 transition-all ${
          isDark ? 'bg-slate-900' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Ganti Kata Sandi</h3>
            </div>
            <button 
              onClick={() => setActiveModal('none')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5 text-xs">
            {/* Kata Sandi Lama */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Kata Sandi Saat Ini <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Kata Sandi Baru */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Kata Sandi Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Kata Sandi Baru */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Ulangi Kata Sandi Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi baru"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Ganti Sandi</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================================== */}
      {/* BIODATA DETAIL CARD                                                 */}
      {/* =================================================================== */}
      <div className={`border rounded-3xl p-4 shadow-xs space-y-3 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Biodata Calon Tenaga Kerja:
          </span>
          <button
            onClick={openEditModal}
            className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-bold"
          >
            Ubah
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-slate-400" />
              Asal Sekolah
            </span>
            <strong className="text-slate-800 dark:text-slate-200 text-right">
              {activeUser?.school || 'Belum diisi'}
            </strong>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              Jurusan
            </span>
            <strong className="text-slate-800 dark:text-slate-200 text-right">
              {activeUser?.major || 'Belum diisi'}
            </strong>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Jenis Kelamin
            </span>
            <strong className="text-slate-800 dark:text-slate-200">
              {activeUser?.gender || 'Laki-laki'}
            </strong>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-slate-400" />
              Tinggi / Berat Badan
            </span>
            <strong className="text-slate-800 dark:text-slate-200">
              {activeUser?.height ? `${activeUser.height} cm` : '-'} / {activeUser?.weight ? `${activeUser.weight} kg` : '-'}
            </strong>
          </div>

          <div className="flex items-start justify-between py-1">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Alamat Lengkap
            </span>
            <span className="text-slate-800 dark:text-slate-200 text-right text-[11px] max-w-[60%] line-clamp-2">
              {activeUser?.address || 'Belum diisi'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className={`border rounded-2xl p-3 shadow-xs transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Tes Diikuti</span>
          <strong className={`text-base font-black mt-0.5 block ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {activeUser?.completedTestsCount || 14}x
          </strong>
        </div>
        <div className={`border rounded-2xl p-3 shadow-xs transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Akurasi Rata2</span>
          <strong className="text-base font-black text-emerald-500 mt-0.5 block">
            {activeUser?.qcAccuracy ? `${activeUser.qcAccuracy}%` : '88%'}
          </strong>
        </div>
        <div className={`border rounded-2xl p-3 shadow-xs transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Prediksi Lolos</span>
          <strong className="text-base font-black text-sky-400 mt-0.5 block">
            {activeUser?.interviewScore ? `${activeUser.interviewScore}%` : '91%'}
          </strong>
        </div>
      </div>

      {/* Appearance Theme Selector */}
      <div className={`border rounded-3xl p-4 shadow-xs space-y-2.5 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Tema Tampilan Aplikasi:
        </span>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              if (!isDark) toggleTheme();
              sounds.playClick();
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              isDark 
                ? 'bg-slate-800 border-sky-500 text-sky-300 ring-1 ring-sky-500' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Moon className="w-4 h-4 text-sky-400" />
            <span>Mode Gelap (Dark)</span>
          </button>

          <button
            onClick={() => {
              if (isDark) toggleTheme();
              sounds.playClick();
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              !isDark 
                ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-300 font-black' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Mode Terang (Light)</span>
          </button>
        </div>
      </div>

      {/* Target Setting */}
      <div className={`border rounded-3xl p-4 shadow-xs space-y-3 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Pengaturan Target Posisi:
        </span>
        
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'operator', title: 'Operator Produksi' },
            { id: 'qc', title: 'QC Inspector' },
            { id: 'maintenance', title: 'Maintenance' },
            { id: 'logistics', title: 'Logistik & Gudang' }
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setTargetRole(r.id as TargetRole);
                sounds.playClick();
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                targetRole === r.id
                  ? isDark 
                    ? 'bg-brand-600/30 border-brand-500 text-sky-300 ring-1 ring-brand-500' 
                    : 'bg-brand-50 border-brand-500 text-brand-700 font-black'
                  : isDark 
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {r.title}
            </button>
          ))}
        </div>
      </div>

      {/* Logout Action */}
      <div className="space-y-2 pt-1">
        <button
          onClick={onLogout}
          className={`w-full py-3.5 border font-extrabold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2 ${
            isDark 
              ? 'bg-red-950/40 hover:bg-red-950/80 border-red-900/60 text-red-400' 
              : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-600'
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun (Logout)</span>
        </button>
      </div>

      <div className="text-center text-[10px] text-slate-400 pt-2 leading-relaxed">
        <strong>SMK — Siap Masuk Kerja</strong> v1.0.0<br />
        <em>“Simulasikan Seleksi. Tingkatkan Kesiapan”</em>
      </div>

    </div>
  );
};

