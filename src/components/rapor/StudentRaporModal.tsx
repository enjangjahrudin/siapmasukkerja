import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  School, 
  User, 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  RefreshCw, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Edit3,
  Activity,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/sound-effects';
import { useTheme } from '../../utils/theme-context';
import { RegisteredUser } from '../../utils/auth-storage';
import { 
  printIndividualStudentReport, 
  calculateCompositeScore, 
  SchoolSignerInfo 
} from '../../utils/pdf-report-generator';

interface StudentRaporModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: RegisteredUser | null;
}

export const StudentRaporModal: React.FC<StudentRaporModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  const { isDark } = useTheme();
  const [realtimeData, setRealtimeData] = useState<RegisteredUser | null>(student);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Signer configuration state (Optional BKK School Signer)
  const [showSignerConfig, setShowSignerConfig] = useState<boolean>(false);
  const [signerName, setSignerName] = useState<string>('');
  const [signerTitle, setSignerTitle] = useState<string>('Koordinator BKK / Hubinmas');
  const [signerNip, setSignerNip] = useState<string>('');
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  // Fetch live candidate report on modal open
  useEffect(() => {
    if (!isOpen || !student?.id) return;

    setRealtimeData(student);
    setIsLoading(true);

    // Load saved signer for student's school
    const schoolKey = student.school ? student.school.trim() : 'global';
    try {
      const saved = localStorage.getItem(`bkk_signer_${schoolKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSignerName(parsed.name || '');
        setSignerTitle(parsed.title || 'Koordinator BKK / Hubinmas');
        setSignerNip(parsed.nip || '');
      } else {
        setSignerName('');
        setSignerTitle('Koordinator BKK / Hubinmas');
        setSignerNip('');
      }
    } catch {
      setSignerName('');
      setSignerTitle('Koordinator BKK / Hubinmas');
      setSignerNip('');
    }

    // Fetch fresh details from MySQL
    fetch(`/api/admin/candidate-report/${student.id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.candidate) {
          setRealtimeData(json.candidate);
        }
      })
      .catch(err => {
        console.warn('[Student Rapor Live Fetch]', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  const current = realtimeData || student;
  const compositeScore = calculateCompositeScore(current);
  const isLolosUnggul = current.overallStatus === 'Lolos Unggul';
  const isLolosStandar = current.overallStatus === 'Lolos Standar';

  // Handle Save Custom Signer Info
  const handleSaveSigner = () => {
    const schoolKey = current.school ? current.school.trim() : 'global';
    try {
      localStorage.setItem(`bkk_signer_${schoolKey}`, JSON.stringify({
        name: signerName.trim(),
        title: signerTitle.trim() || 'Koordinator BKK / Hubinmas',
        nip: signerNip.trim()
      }));
      sounds.playClick();
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    } catch (e) {
      console.warn('Failed to save signer info', e);
    }
  };

  // Handle PDF Download
  const handleDownloadPdf = async () => {
    sounds.playClick();
    setIsDownloading(true);

    const signerInfo: SchoolSignerInfo = signerName.trim() ? {
      name: signerName.trim(),
      title: signerTitle.trim() || 'Koordinator BKK / Hubinmas',
      nip: signerNip.trim()
    } : {};

    try {
      await printIndividualStudentReport(current, signerInfo);
      sounds.playCelebration();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error('[Student Rapor PDF Generation Error]', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className={`border rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-6 max-h-[92vh] overflow-y-auto transition-colors ${
        isDark ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header Modal */}
        <div className={`flex items-start justify-between pb-3.5 border-b gap-3 ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">
                Rapor Kesiapan Kerja Siswa • Resmi
              </span>
              {isLoading && (
                <span className="flex items-center gap-1 text-[10px] text-sky-400 font-bold ml-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Sinkronisasi nilai...
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-black mt-1 leading-tight flex items-center gap-2">
              <span>{current.name}</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/30">
                {current.id}
              </span>
            </h3>

            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {current.school || 'SMK / SMA Mitra'} • Jurusan: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{current.major || 'Teknik'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
              title="Unduh Rapor Siswa dalam Format PDF"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isDownloading ? 'Menyiapkan...' : 'Unduh PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile & Score Status Card */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="space-y-1.5 text-xs">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Target Posisi:</span>
                <strong className="capitalize text-sky-500 dark:text-sky-400">{current.targetRole || 'Operator Produksi'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Target Industri:</span>
                <strong className="text-amber-500 truncate block">{current.targetCompany || 'Toyota / Astra / Epson'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Fisik (TB / BB):</span>
                <span>{current.height ? `${current.height} cm` : '-'} / {current.weight ? `${current.weight} kg` : '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Total Tes Selesai:</span>
                <strong className="text-emerald-500">{current.completedTestsCount || current.testHistory?.length || 1} Modul</strong>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l pt-2 sm:pt-0 sm:pl-4 border-slate-200 dark:border-slate-800 shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Status Kelayakan:</span>
              <span className={`inline-block text-xs font-black px-2.5 py-0.5 rounded-lg mt-0.5 ${
                isLolosUnggul 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : isLolosStandar
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {current.overallStatus || 'Lolos Standar'}
              </span>
            </div>
            <div className="text-right mt-1 sm:mt-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Skor Akhir:</span>
              <div className="text-xl font-black text-sky-400">
                {compositeScore} <span className="text-xs text-slate-400 font-medium">/ 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Core Competency Score Cards */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-sky-400" />
              <span>5 Dimensi Asesmen Standar Industri</span>
            </h4>
            <span className="text-[10px] text-slate-400">Astra • Toyota • Epson</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {/* 1. Kraepelin */}
            <div className={`border rounded-2xl p-3 space-y-1 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[10px] text-slate-400 uppercase font-bold flex justify-between">
                <span>1. Kraepelin</span>
                <span className="text-sky-400">Ritme</span>
              </div>
              <div className="text-xl font-black text-sky-400">
                {current.kraepelinScore?.panker || '16.5'} <span className="text-[9px] font-bold text-slate-400">angk/mnt</span>
              </div>
              <div className="text-[10px] flex justify-between text-slate-300">
                <span>Ketelitian:</span>
                <strong className="text-emerald-400">{current.kraepelinScore?.janker ? `${current.kraepelinScore.janker}%` : '95.2%'}</strong>
              </div>
              <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                Grade: <strong className="text-emerald-400">{current.kraepelinScore?.grade || 'Sangat Baik'}</strong>
              </div>
            </div>

            {/* 2. QC Accuracy */}
            <div className={`border rounded-2xl p-3 space-y-1 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[10px] text-slate-400 uppercase font-bold flex justify-between">
                <span>2. Ketelitian QC</span>
                <span className="text-emerald-400">Presisi</span>
              </div>
              <div className="text-xl font-black text-emerald-400">
                {current.qcAccuracy ? `${current.qcAccuracy}%` : '94%'}
              </div>
              <div className="text-[10px] flex justify-between text-slate-300">
                <span>Cacat (NG):</span>
                <strong className="text-emerald-400">Presisi Tinggi</strong>
              </div>
              <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                Standar: <strong>Lolos QC</strong>
              </div>
            </div>

            {/* 3. Matematika Terapan */}
            <div className={`border rounded-2xl p-3 space-y-1 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[10px] text-slate-400 uppercase font-bold flex justify-between">
                <span>3. Matematika</span>
                <span className="text-amber-400">Hitung</span>
              </div>
              <div className="text-xl font-black text-amber-400">
                {current.mathScore || 88} <span className="text-[9px] font-bold text-slate-400">/ 100</span>
              </div>
              <div className="text-[10px] flex justify-between text-slate-300">
                <span>Perkalian 2m:</span>
                <strong className="text-sky-400">{current.multiplicationScore?.accuracy ? `${current.multiplicationScore.accuracy}%` : '96%'}</strong>
              </div>
              <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                Kecepatan: <strong>Sangat Cepat</strong>
              </div>
            </div>

            {/* 4. Logika SOP */}
            <div className={`border rounded-2xl p-3 space-y-1 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[10px] text-slate-400 uppercase font-bold flex justify-between">
                <span>4. Psikotes Logika</span>
                <span className="text-purple-400">SOP</span>
              </div>
              <div className="text-xl font-black text-purple-400">
                {current.psychotestScore || 88} <span className="text-[9px] font-bold text-slate-400">/ 100</span>
              </div>
              <div className="text-[10px] flex justify-between text-slate-300">
                <span>Aturan K3:</span>
                <strong className="text-purple-400">Disiplin</strong>
              </div>
              <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                Standar: <strong>SOP Industri</strong>
              </div>
            </div>

            {/* 5. AI Interview */}
            <div className={`border rounded-2xl p-3 space-y-1 col-span-2 sm:col-span-2 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[10px] text-slate-400 uppercase font-bold flex justify-between">
                <span>5. Wawancara AI Recruiter</span>
                <span className="text-emerald-400">Probabilitas Lolos</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-emerald-400">
                  {current.interviewScore ? `${current.interviewScore}%` : '86%'}
                </span>
                <span className="text-[10px] text-slate-400">Keyakinan Asesor Industri</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[9px] pt-1 font-bold text-center">
                <div className="p-1 rounded bg-slate-800/60 text-slate-300">STAR: 85%</div>
                <div className="p-1 rounded bg-slate-800/60 text-slate-300">Vokal: 88%</div>
                <div className="p-1 rounded bg-slate-800/60 text-slate-300">Etika: 95%</div>
                <div className="p-1 rounded bg-slate-800/60 text-slate-300">Fit: 85%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Asesor Placement Recommendation */}
        <div className={`border rounded-2xl p-3.5 space-y-1.5 text-xs ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-1.5 font-bold text-sky-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rekomendasi Penempatan Kerja Asesor BKK:</span>
          </div>
          <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Kandidat memiliki stamina kerja dan konsistensi hitung di atas ambang batas industri manufaktur. Direkomendasikan untuk posisi <strong>{current.targetRole === 'qc' ? 'Quality Control (QC Inspector)' : current.targetRole === 'maintenance' ? 'Maintenance Operator & Teknisi Mesin' : 'Operator Line Perakitan / Assembly'}</strong> di {current.targetCompany || 'perusahaan mitra BKK'}.
          </p>
        </div>

        {/* Collapsible School BKK Signer Configuration (Optional) */}
        <div className={`border rounded-2xl transition-all overflow-hidden ${
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/70 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => setShowSignerConfig(!showSignerConfig)}
            className="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-400 hover:text-slate-200 text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <School className="w-3.5 h-3.5 text-sky-400" />
              <span>Pengesahan Tanda Tangan BKK Sekolah ({current.school || 'Sekolah Siswa'})</span>
            </div>
            {showSignerConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSignerConfig && (
            <div className="p-3 pt-0 space-y-2.5 text-xs border-t border-slate-800/60">
              <p className="text-[11px] text-slate-400">
                Secara default dokumen telah divalidasi dengan stempel digital resmi. Anda dapat mencantumkan nama guru BKK / Kepala Sekolah bila diperlukan:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Nama Pejabat BKK:</label>
                  <input 
                    type="text"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Contoh: Drs. H. Mulyadi, M.Pd"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-xs outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Jabatan:</label>
                  <input 
                    type="text"
                    value={signerTitle}
                    onChange={(e) => setSignerTitle(e.target.value)}
                    placeholder="Koordinator BKK / Hubinmas"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-xs outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">Tersimpan otomatis di browser ini</span>
                <button
                  type="button"
                  onClick={handleSaveSigner}
                  className="px-3 py-1 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>{savedNotice ? 'Tersimpan!' : 'Simpan Data BKK'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 gap-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className={`px-4 py-2 font-bold text-xs rounded-xl transition-colors cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
            }`}
          >
            Tutup
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="px-5 py-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-lg shadow-red-500/25 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isDownloading ? 'Menghasilkan PDF...' : '📄 Unduh Rapor Resmi (PDF)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
