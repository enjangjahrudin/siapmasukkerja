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
  Activity,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/sound-effects';
import { useTheme } from '../../utils/theme-context';
import { RegisteredUser } from '../../utils/auth-storage';
import { 
  downloadIndividualStudentReportPdf,
  calculateCompositeScore,
  calculateOverallStatus,
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

  // Background BKK signer from admin configuration (read-only for students)
  const [signerName, setSignerName] = useState<string>('');
  const [signerTitle, setSignerTitle] = useState<string>('Koordinator BKK / Hubinmas');
  const [signerNip, setSignerNip] = useState<string>('');

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
  const hasCompletedTests = Boolean(
    (current.completedTestsCount && current.completedTestsCount > 0) ||
    (current.testHistory && current.testHistory.length > 0) ||
    current.kraepelinScore ||
    (current.qcAccuracy !== undefined && current.qcAccuracy !== null) ||
    (current.mathScore !== undefined && current.mathScore !== null) ||
    (current.interviewScore !== undefined && current.interviewScore !== null) ||
    (current.psychotestScore !== undefined && current.psychotestScore !== null)
  );
  const completedCount = current.completedTestsCount || current.testHistory?.length || 0;
  const compositeScore = calculateCompositeScore(current);
  const calculatedStatus = calculateOverallStatus(current);
  const isLolosUnggul = calculatedStatus === 'Lolos Unggul';
  const isLolosStandar = calculatedStatus === 'Lolos Standar';

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
      await downloadIndividualStudentReportPdf(current, signerInfo);
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
                <span>Tes: <strong className={completedCount > 0 ? "text-emerald-500" : "text-slate-400"}>{completedCount} Modul</strong></span>
              </div>
            </div>

            <div className="text-right border-l pl-3 border-slate-200 dark:border-slate-800 shrink-0">
              <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-md ${
                !hasCompletedTests
                  ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                  : isLolosUnggul 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : isLolosStandar
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {hasCompletedTests ? calculatedStatus : 'Belum Ada Tes'}
              </span>
              <div className="text-lg font-black text-sky-400 mt-0.5">
                {hasCompletedTests ? compositeScore : '-'}{' '}
                <span className="text-[10px] text-slate-400 font-medium">{hasCompletedTests ? '/ 100' : ''}</span>
              </div>
            </div>
          </div>

          {/* 6 Core Competency Score Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-sky-400" />
                <span>6 Dimensi Asesmen Standar Industri</span>
              </h4>
              <span className="text-[10px] text-slate-400">Astra • Toyota • Epson</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* 1. Kraepelin */}
              <div className={`border rounded-2xl p-2.5 space-y-0.5 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[9px] text-slate-400 uppercase font-bold flex justify-between">
                  <span>1. Kraepelin & Pauli</span>
                  <span className="text-sky-400">Ritme Kerja</span>
                </div>
                <div className="text-lg font-black text-sky-400">
                  {current.kraepelinScore?.panker ? (
                    <>
                      {current.kraepelinScore.panker} <span className="text-[9px] font-bold text-slate-400">angk/mnt</span>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Belum Tes</span>
                  )}
                </div>
                <div className="text-[10px] flex justify-between text-slate-300">
                  <span>Ketelitian:</span>
                  <strong className={current.kraepelinScore?.janker ? "text-emerald-400" : "text-slate-500"}>
                    {current.kraepelinScore?.janker ? `${current.kraepelinScore.janker}%` : '-'}
                  </strong>
                </div>
                <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                  Grade: <strong className={current.kraepelinScore?.grade ? "text-emerald-400" : "text-slate-500"}>{current.kraepelinScore?.grade || 'Belum Diuji'}</strong>
                </div>
              </div>

              {/* 2. QC Accuracy */}
              <div className={`border rounded-2xl p-2.5 space-y-0.5 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[9px] text-slate-400 uppercase font-bold flex justify-between">
                  <span>2. Ketelitian QC</span>
                  <span className="text-emerald-400">Speed Match</span>
                </div>
                <div className="text-lg font-black text-emerald-400">
                  {current.qcAccuracy !== undefined && current.qcAccuracy !== null ? (
                    `${current.qcAccuracy}%`
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Belum Tes</span>
                  )}
                </div>
                <div className="text-[10px] flex justify-between text-slate-300">
                  <span>Cacat (NG):</span>
                  <strong className={current.qcAccuracy !== undefined && current.qcAccuracy !== null ? "text-emerald-400" : "text-slate-500"}>
                    {current.qcAccuracy !== undefined && current.qcAccuracy !== null ? (current.qcAccuracy >= 85 ? 'Presisi Tinggi' : 'Standar') : '-'}
                  </strong>
                </div>
                <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                  Standar: <strong className={current.qcAccuracy !== undefined && current.qcAccuracy !== null ? "text-slate-200" : "text-slate-500"}>
                    {current.qcAccuracy !== undefined && current.qcAccuracy !== null ? 'Lolos QC' : 'Belum Diuji'}
                  </strong>
                </div>
              </div>

              {/* 3. Matematika Dasar */}
              <div className={`border rounded-2xl p-2.5 space-y-0.5 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[9px] text-slate-400 uppercase font-bold flex justify-between">
                  <span>3. Matematika Dasar</span>
                  <span className="text-amber-400">Kabataku</span>
                </div>
                <div className="text-lg font-black text-amber-400">
                  {current.mathScore !== undefined && current.mathScore !== null ? (
                    <>
                      {current.mathScore} <span className="text-[9px] font-bold text-slate-400">/ 100</span>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Belum Tes</span>
                  )}
                </div>
                <div className="text-[10px] flex justify-between text-slate-300">
                  <span>Akurasi:</span>
                  <strong className={current.mathScore !== undefined && current.mathScore !== null ? "text-amber-400" : "text-slate-500"}>
                    {current.mathScore !== undefined && current.mathScore !== null ? (current.mathScore >= 75 ? 'Diatas Rata-rata' : 'Standar') : '-'}
                  </strong>
                </div>
                <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                  Status: <strong className={current.mathScore !== undefined && current.mathScore !== null ? "text-slate-200" : "text-slate-500"}>
                    {current.mathScore !== undefined && current.mathScore !== null ? 'Lolos Standar' : 'Belum Diuji'}
                  </strong>
                </div>
              </div>

              {/* 4. Tabel Perkalian Kilat */}
              <div className={`border rounded-2xl p-2.5 space-y-0.5 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[9px] text-slate-400 uppercase font-bold flex justify-between">
                  <span>4. Perkalian Kilat</span>
                  <span className="text-orange-400">120s Speed</span>
                </div>
                <div className="text-lg font-black text-orange-400">
                  {current.multiplicationScore?.accuracy !== undefined && current.multiplicationScore?.accuracy !== null ? (
                    `${current.multiplicationScore.accuracy}%`
                  ) : current.multiplicationScore?.completed ? (
                    `${current.multiplicationScore.completed} Soal`
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Belum Tes</span>
                  )}
                </div>
                <div className="text-[10px] flex justify-between text-slate-300">
                  <span>Benar / Terjawab:</span>
                  <strong className={current.multiplicationScore ? "text-orange-400" : "text-slate-500"}>
                    {current.multiplicationScore ? `${current.multiplicationScore.correct || 0} / ${current.multiplicationScore.completed || 0}` : '-'}
                  </strong>
                </div>
                <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                  Kecepatan: <strong className={current.multiplicationScore ? "text-slate-200" : "text-slate-500"}>
                    {current.multiplicationScore ? ((current.multiplicationScore.completed || 0) >= 30 ? 'Cepat & Tanggap' : 'Standar') : 'Belum Diuji'}
                  </strong>
                </div>
              </div>

              {/* 5. Psikotes & Penalaran */}
              <div className={`border rounded-2xl p-2.5 space-y-0.5 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[9px] text-slate-400 uppercase font-bold flex justify-between">
                  <span>5. Psikotes Logika</span>
                  <span className="text-purple-400">Verbal & SOP</span>
                </div>
                <div className="text-lg font-black text-purple-400">
                  {current.psychotestScore !== undefined && current.psychotestScore !== null ? (
                    <>
                      {current.psychotestScore} <span className="text-[9px] font-bold text-slate-400">/ 100</span>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Belum Tes</span>
                  )}
                </div>
                <div className="text-[10px] flex justify-between text-slate-300">
                  <span>Aturan K3:</span>
                  <strong className={current.psychotestScore !== undefined && current.psychotestScore !== null ? "text-purple-400" : "text-slate-500"}>
                    {current.psychotestScore !== undefined && current.psychotestScore !== null ? (current.psychotestScore >= 75 ? 'Disiplin Tinggi' : 'Standar') : '-'}
                  </strong>
                </div>
                <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                  Standar: <strong className={current.psychotestScore !== undefined && current.psychotestScore !== null ? "text-slate-200" : "text-slate-500"}>
                    {current.psychotestScore !== undefined && current.psychotestScore !== null ? 'Sesuai Standar' : 'Belum Diuji'}
                  </strong>
                </div>
              </div>

              {/* 6. Mekanika Bennett */}
              <div className={`border rounded-2xl p-2.5 space-y-0.5 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[9px] text-slate-400 uppercase font-bold flex justify-between">
                  <span>6. Mekanika Bennett</span>
                  <span className="text-cyan-400">Teknik & Fisika</span>
                </div>
                <div className="text-lg font-black text-cyan-400">
                  {current.mechanicalScore !== undefined && current.mechanicalScore !== null ? (
                    <>
                      {current.mechanicalScore} <span className="text-[9px] font-bold text-slate-400">/ 100</span>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Belum Tes</span>
                  )}
                </div>
                <div className="text-[10px] flex justify-between text-slate-300">
                  <span>Fisika Praktis:</span>
                  <strong className={current.mechanicalScore !== undefined && current.mechanicalScore !== null ? "text-cyan-400" : "text-slate-500"}>
                    {current.mechanicalScore !== undefined && current.mechanicalScore !== null ? (current.mechanicalScore >= 70 ? 'Analisis Baik' : 'Standar') : '-'}
                  </strong>
                </div>
                <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                  Kualifikasi: <strong className={current.mechanicalScore !== undefined && current.mechanicalScore !== null ? "text-slate-200" : "text-slate-500"}>
                    {current.mechanicalScore !== undefined && current.mechanicalScore !== null ? 'Siap Operasi' : 'Belum Diuji'}
                  </strong>
                </div>
              </div>

              {/* Extra: AI Interview if present */}
              {(current.interviewScore !== undefined && current.interviewScore !== null) && (
                <div className={`border rounded-2xl p-2.5 space-y-1 col-span-2 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[9px] text-slate-400 uppercase font-bold flex justify-between">
                    <span>Modul Tambahan: Wawancara AI Recruiter</span>
                    <span className="text-emerald-400">Probabilitas Lolos</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-emerald-400">
                        {current.interviewScore}%
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Keyakinan Asesor
                      </span>
                    </div>
                    <span className="text-[9px] text-emerald-500 font-bold">Teruji STAR</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-center">
                    <div className="py-1 px-0.5 rounded bg-slate-800/60 text-slate-300 truncate">STAR: {current.interviewRubric?.starScore || 85}%</div>
                    <div className="py-1 px-0.5 rounded bg-slate-800/60 text-slate-300 truncate">Vokal: {current.interviewRubric?.vocalScore || 88}%</div>
                    <div className="py-1 px-0.5 rounded bg-slate-800/60 text-slate-300 truncate">Etika: {current.interviewRubric?.ethicsScore || 95}%</div>
                    <div className="py-1 px-0.5 rounded bg-slate-800/60 text-slate-300 truncate">Fit: {current.interviewRubric?.jobFitScore || 85}%</div>
                  </div>
                </div>
              )}
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
            {hasCompletedTests ? (
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {isLolosUnggul ? (
                  <>Kandidat mencapai kualifikasi <strong>Lolos Unggul (Grade A)</strong> dengan skor komposit prima ({compositeScore}/100). Sangat direkomendasikan untuk posisi <strong>{current.targetRole === 'qc' ? 'Quality Control (QC Inspector)' : current.targetRole === 'maintenance' ? 'Maintenance Operator & Teknisi Mesin' : 'Operator Line Perakitan / Assembly'}</strong> di {current.targetCompany || 'perusahaan mitra BKK'}.</>
                ) : isLolosStandar ? (
                  <>Kandidat memenuhi kualifikasi standar industri <strong>Lolos Standar (Grade B)</strong> dengan skor komposit {compositeScore}/100. Memenuhi kriteria seleksi posisi <strong>{current.targetRole === 'qc' ? 'Quality Control (QC Inspector)' : current.targetRole === 'maintenance' ? 'Maintenance Operator & Teknisi Mesin' : 'Operator Line Perakitan / Assembly'}</strong> di {current.targetCompany || 'perusahaan mitra BKK'}.</>
                ) : (
                  <>Kandidat saat ini berstatus <strong>Perlu Latihan (Grade C)</strong> dengan skor komposit {compositeScore}/100 (di bawah ambang batas minimum industri 65.0). Disarankan memperbanyak latihan modul tes psikometrik/ketelitian sebelum diajukan ke rekrutmen perusahaan.</>
                )}
              </p>
            ) : (
              <p className={`text-[11px] leading-relaxed text-slate-400 italic`}>
                Siswa baru mendaftar dan belum menyelesaikan tes. Silakan kerjakan modul uji (Kraepelin, QC, Matematika, Psikotes, atau AI Interview) pada menu Tes untuk menerbitkan analisis kompetensi dan rekomendasi penempatan kerja industri.
              </p>
            )}
          </div>

          {/* Status Validasi Resmi BKK & Platform Asesor (Read-only untuk Siswa) */}
          <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                  Pengesahan Dokumen Resmi
                </span>
                <strong className={`text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  BKK {current.school || 'Sekolah Siswa'} • BuatDigital.id
                </strong>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0 flex items-center gap-1">
              <Check className="w-3 h-3" /> Terverifikasi
            </span>
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
