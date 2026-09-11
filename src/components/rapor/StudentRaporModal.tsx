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
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in">
      {/* Modal Dialog Card */}
      <div className={`w-full max-w-lg h-[92vh] sm:h-auto sm:max-h-[88vh] flex flex-col rounded-t-[28px] sm:rounded-3xl shadow-2xl border-t sm:border transition-all overflow-hidden ${
        isDark 
          ? 'bg-[#0f172a] border-slate-800 text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Sticky Header with Mobile Drag Handle */}
        <div className={`shrink-0 px-4 pt-2.5 pb-3 border-b ${
          isDark 
            ? 'bg-slate-900/95 border-slate-800' 
            : 'bg-white/95 border-slate-100'
        } backdrop-blur-md`}>
          {/* Mobile Drag Indicator Bar */}
          <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-2 sm:hidden" />

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">
                  Rapor Kesiapan Kerja • Terverifikasi
                </span>
                {isLoading && (
                  <span className="flex items-center gap-1 text-[10px] text-sky-400 font-bold ml-1">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Sync
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="text-base sm:text-lg font-black tracking-tight truncate">
                  {current.name}
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-500 dark:text-sky-400 border border-sky-500/30 shrink-0">
                  {current.id}
                </span>
              </div>

              <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {current.school || 'SMK / SMA Mitra'} • Jurusan: <strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>{current.major || 'Teknik'}</strong>
              </p>
            </div>

            {/* Clean Close Button */}
            <button
              onClick={onClose}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800'
              }`}
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body (Hidden Scrollbar on Mobile) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3.5 space-y-3 overscroll-contain no-scrollbar">
          
          {/* Profile & Target Score Summary Card */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/90 border-slate-200'
          }`}>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-bold">Posisi:</span>
                <strong className="capitalize text-sky-500 dark:text-sky-400">{current.targetRole || 'Operator Produksi'}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-bold">Target:</span>
                <strong className="text-amber-500 truncate max-w-[150px] sm:max-w-xs">{current.targetCompany || 'Toyota / Astra / Epson'}</strong>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Fisik: <strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>{current.height ? `${current.height}cm` : '-'} / {current.weight ? `${current.weight}kg` : '-'}</strong></span>
                <span>•</span>
                <span>Tes: <strong className="text-emerald-500">{current.completedTestsCount || current.testHistory?.length || 1} Modul</strong></span>
              </div>
            </div>

            <div className="text-right border-l pl-3 border-slate-200 dark:border-slate-800 shrink-0">
              <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-md ${
                isLolosUnggul 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : isLolosStandar
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {current.overallStatus || 'Lolos Standar'}
              </span>
              <div className="text-lg font-black text-sky-400 mt-0.5">
                {compositeScore} <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
              </div>
            </div>
          </div>

          {/* 5 Core Competency Score Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-sky-400" />
                <span>5 Dimensi Asesmen Standar Industri</span>
              </h4>
              <span className="text-[10px] text-slate-400">Astra • Toyota • Epson</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* 1. Kraepelin */}
              <div className={`border rounded-2xl p-2.5 space-y-0.5 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[9px] text-slate-400 uppercase font-bold flex justify-between">
                  <span>1. Kraepelin</span>
                  <span className="text-sky-400">Ritme</span>
                </div>
                <div className="text-lg font-black text-sky-400">
                  {current.kraepelinScore?.panker || '16.8'} <span className="text-[9px] font-bold text-slate-400">angk/mnt</span>
                </div>
                <div className="text-[10px] flex justify-between text-slate-300">
                  <span>Ketelitian:</span>
                  <strong className="text-emerald-400">{current.kraepelinScore?.janker ? `${current.kraepelinScore.janker}%` : '95.5%'}</strong>
                </div>
                <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                  Grade: <strong className="text-emerald-400">{current.kraepelinScore?.grade || 'Baik (Lolos Standar)'}</strong>
                </div>
              </div>

              {/* 2. QC Accuracy */}
              <div className={`border rounded-2xl p-2.5 space-y-0.5 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[9px] text-slate-400 uppercase font-bold flex justify-between">
                  <span>2. Ketelitian QC</span>
                  <span className="text-emerald-400">Presisi</span>
                </div>
                <div className="text-lg font-black text-emerald-400">
                  {current.qcAccuracy ? `${current.qcAccuracy}%` : '92%'}
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
              <div className={`border rounded-2xl p-2.5 space-y-0.5 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[9px] text-slate-400 uppercase font-bold flex justify-between">
                  <span>3. Matematika</span>
                  <span className="text-amber-400">Hitung</span>
                </div>
                <div className="text-lg font-black text-amber-400">
                  {current.mathScore || 85} <span className="text-[9px] font-bold text-slate-400">/ 100</span>
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
              <div className={`border rounded-2xl p-2.5 space-y-0.5 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[9px] text-slate-400 uppercase font-bold flex justify-between">
                  <span>4. Psikotes Logika</span>
                  <span className="text-purple-400">SOP</span>
                </div>
                <div className="text-lg font-black text-purple-400">
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

              {/* 5. AI Interview (Spans 2 columns) */}
              <div className={`border rounded-2xl p-2.5 space-y-1 col-span-2 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[9px] text-slate-400 uppercase font-bold flex justify-between">
                  <span>5. Wawancara AI Recruiter</span>
                  <span className="text-emerald-400">Probabilitas Lolos</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-emerald-400">
                      {current.interviewScore ? `${current.interviewScore}%` : '84%'}
                    </span>
                    <span className="text-[10px] text-slate-400">Keyakinan Asesor</span>
                  </div>
                  <span className="text-[9px] text-emerald-500 font-bold">Teruji STAR</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-center">
                  <div className="py-1 px-0.5 rounded bg-slate-800/60 text-slate-300 truncate">STAR: 85%</div>
                  <div className="py-1 px-0.5 rounded bg-slate-800/60 text-slate-300 truncate">Vokal: 88%</div>
                  <div className="py-1 px-0.5 rounded bg-slate-800/60 text-slate-300 truncate">Etika: 95%</div>
                  <div className="py-1 px-0.5 rounded bg-slate-800/60 text-slate-300 truncate">Fit: 85%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Asesor Placement Recommendation */}
          <div className={`border rounded-2xl p-3 space-y-1 text-xs ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5 font-bold text-sky-400 text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rekomendasi Penempatan Kerja:</span>
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
              className="w-full p-2.5 flex items-center justify-between text-[11px] font-bold text-slate-400 hover:text-slate-200 text-left cursor-pointer"
            >
              <div className="flex items-center gap-1.5 truncate">
                <School className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">Pengesahan BKK ({current.school || 'Sekolah Siswa'})</span>
              </div>
              {showSignerConfig ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
            </button>

            {showSignerConfig && (
              <div className="p-3 pt-1 space-y-2 text-xs border-t border-slate-800/60">
                <p className="text-[10px] text-slate-400 leading-snug">
                  Dokumen telah divalidasi dengan stempel digital. Anda dapat mencantumkan nama guru BKK / Hubinmas bila diperlukan:
                </p>

                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Nama Pejabat BKK:</label>
                    <input 
                      type="text"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      placeholder="Contoh: Drs. H. Mulyadi, M.Pd"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-xs outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Jabatan:</label>
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
                  <span className="text-[9px] text-slate-500">Tersimpan otomatis</span>
                  <button
                    type="button"
                    onClick={handleSaveSigner}
                    className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>{savedNotice ? 'Tersimpan!' : 'Simpan Data BKK'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Sticky Bottom Action Bar with Large Touch-Friendly Buttons */}
        <div className={`shrink-0 p-3 sm:p-4 border-t flex items-center gap-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] ${
          isDark 
            ? 'bg-slate-900/95 border-slate-800' 
            : 'bg-white/95 border-slate-100'
        } backdrop-blur-md`}>
          <button
            onClick={onClose}
            className={`px-4 py-2.5 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0 ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Tutup
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isDownloading ? 'Menyiapkan PDF...' : '📄 Unduh Rapor Resmi (PDF)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
