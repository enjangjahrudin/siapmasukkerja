import React, { useState, useEffect } from 'react';
import { 
  X, 
  Pencil, 
  Check, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  Award, 
  AlertCircle, 
  KeyRound, 
  Loader2, 
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { RegisteredUser, adminUpdateCandidate } from '../../utils/auth-storage';
import { useTheme } from '../../utils/theme-context';
import { SchoolPicker } from '../common/SchoolPicker';
import { TargetRole } from '../../types';

interface EditCandidateModalProps {
  isOpen: boolean;
  candidate: RegisteredUser | null;
  onClose: () => void;
  onSuccess: (updatedCandidate: RegisteredUser) => void;
  onOpenResetPassword: (candidate: RegisteredUser) => void;
}

export const EditCandidateModal: React.FC<EditCandidateModalProps> = ({
  isOpen,
  candidate,
  onClose,
  onSuccess,
  onOpenResetPassword
}) => {
  const { isDark } = useTheme();

  // Form states
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [npsn, setNpsn] = useState('');
  const [major, setMajor] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [targetRole, setTargetRole] = useState<TargetRole>('operator');
  const [targetCompany, setTargetCompany] = useState('');
  const [overallStatus, setOverallStatus] = useState<'Lolos Unggul' | 'Lolos Standar' | 'Perlu Latihan'>('Perlu Latihan');

  // Bio & physical states
  const [showBioDetails, setShowBioDetails] = useState(false);
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [address, setAddress] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen && candidate) {
      setName(candidate.name || '');
      setSchool(candidate.school || '');
      setNpsn(candidate.npsn || '');
      setMajor(candidate.major || '');
      setPhone(candidate.phone || '');
      setEmail(candidate.email || '');
      setTargetRole(candidate.targetRole || 'operator');
      setTargetCompany(candidate.targetCompany || 'PT Astra Daihatsu / PT Yamaha Motor');
      setOverallStatus(candidate.overallStatus || 'Perlu Latihan');
      setGender(candidate.gender || 'Laki-laki');
      setHeight(candidate.height ? String(candidate.height) : '');
      setWeight(candidate.weight ? String(candidate.weight) : '');
      setAddress(candidate.address || '');
      setShowBioDetails(Boolean(candidate.height || candidate.weight || candidate.address));
      setErrorMsg('');
      setIsLoading(false);
    }
  }, [isOpen, candidate]);

  if (!isOpen || !candidate) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama lengkap siswa wajib diisi.');
      return;
    }
    if (!school.trim()) {
      setErrorMsg('Asal sekolah siswa wajib diisi.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Nomor WhatsApp wajib diisi.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: Partial<RegisteredUser> = {
        name: name.trim(),
        school: school.trim(),
        npsn: npsn.trim() || undefined,
        major: major.trim() || 'Teknik Mesin',
        phone: phone.trim(),
        email: email.trim() || undefined,
        targetRole,
        targetCompany: targetCompany.trim() || 'PT Astra Daihatsu / PT Yamaha Motor',
        overallStatus,
        gender,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        address: address.trim() || undefined
      };

      const res = await adminUpdateCandidate(candidate.id, payload);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res.message || 'Gagal memperbarui data peserta.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem saat menyimpan data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className={`w-full max-w-2xl my-8 rounded-3xl border shadow-2xl overflow-hidden transition-all flex flex-col max-h-[90vh] ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-5 flex items-center justify-between border-b shrink-0 ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-slate-50/90'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Edit Data Peserta</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
                  {candidate.id}
                </span>
                <span className="text-xs font-semibold text-slate-400 truncate max-w-[200px]">
                  {candidate.name}
                </span>
              </div>
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Bagian 1: Identitas & Kontak */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-500" />
              <span>Identitas & Kontak Siswa</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Nama Lengkap */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Muhammad Rizky Pratama"
                  required
                  disabled={isLoading}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* No. WhatsApp */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  No. WhatsApp (Aktif) *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    required
                    disabled={isLoading}
                    className={`w-full pl-8 pr-3 py-2 rounded-xl border text-xs font-semibold transition-all focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* Email Siswa */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Email Siswa (Opsional)
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    disabled={isLoading}
                    className={`w-full pl-8 pr-3 py-2 rounded-xl border text-xs font-semibold transition-all focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bagian 2: Sekolah & Jurusan */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Asal Sekolah & Jurusan (Dapodik SMK)</span>
              </h4>
              {npsn && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  NPSN: {npsn}
                </span>
              )}
            </div>

            {/* SchoolPicker Integrasi Dapodik */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Pilih atau Ganti Sekolah Asal *
              </label>
              <SchoolPicker
                value={school}
                npsn={npsn}
                onChange={(schoolName, schoolNpsn) => {
                  setSchool(schoolName);
                  if (schoolNpsn) {
                    setNpsn(schoolNpsn);
                  }
                }}
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Gunakan pencarian wilayah Dapodik atau klik mode manual jika nama sekolah tidak ditemukan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* NPSN Input (bisa disesuaikan manual) */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  NPSN Sekolah
                </label>
                <input
                  type="text"
                  value={npsn}
                  onChange={(e) => setNpsn(e.target.value)}
                  placeholder="8 Digit NPSN"
                  disabled={isLoading}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-semibold transition-all focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Jurusan / Kompetensi Keahlian */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Jurusan / Kompetensi Keahlian *
                </label>
                <div className="relative">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="Contoh: Teknik Kendaraan Ringan (TKR) / TKJ"
                    required
                    disabled={isLoading}
                    className={`w-full pl-8 pr-3 py-2 rounded-xl border text-xs font-semibold transition-all focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bagian 3: Target Karier & Status Seleksi */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-amber-500" />
              <span>Target Karier & Status Seleksi</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Target Posisi */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Target Posisi Kerja
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as TargetRole)}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition-all focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white' 
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="operator">Operator Produksi</option>
                  <option value="qc">QC Inspector</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="logistics">Logistics</option>
                </select>
              </div>

              {/* Perusahaan Target */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Perusahaan Target
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="Contoh: PT Astra Daihatsu"
                  disabled={isLoading}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold transition-all focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Status Seleksi */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Status Kelulusan / Seleksi
                </label>
                <select
                  value={overallStatus}
                  onChange={(e) => setOverallStatus(e.target.value as any)}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition-all focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                    overallStatus === 'Lolos Unggul'
                      ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                      : overallStatus === 'Lolos Standar'
                        ? 'bg-blue-500/15 text-sky-500 border-sky-500/30'
                        : 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                  }`}
                >
                  <option value="Lolos Unggul">Lolos Unggul</option>
                  <option value="Lolos Standar">Lolos Standar</option>
                  <option value="Perlu Latihan">Perlu Latihan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bagian 4: Collapsible Data Fisik & Alamat */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowBioDetails(!showBioDetails)}
              className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                isDark ? 'bg-slate-800/40 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Data Tambahan: Fisik, Jenis Kelamin & Alamat</span>
              </div>
              {showBioDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showBioDetails && (
              <div className="mt-3 p-3.5 rounded-2xl border space-y-3 animate-in fade-in duration-200 border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Jenis Kelamin
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Tinggi Badan (cm)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Contoh: 168"
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Berat Badan (kg)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Contoh: 60"
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Alamat domisili peserta..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bagian 5: Keamanan & Reset Kata Sandi */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-500 shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-extrabold text-xs text-indigo-500 dark:text-indigo-400">
                  Keamanan Akun Peserta
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Siswa lupa kata sandi atau butuh akses masuk baru?
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenResetPassword(candidate);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs shadow-indigo-600/20"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Reset Kata Sandi</span>
            </button>
          </div>

          {/* Form Actions */}
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
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
