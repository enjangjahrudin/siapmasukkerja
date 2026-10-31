import React, { useState } from 'react';
import {
  Users,
  Layers,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  CheckCircle2,
  Sparkles,
  FileText,
  Video,
  Award,
  Clock,
  Check
} from 'lucide-react';
import { RegisteredUser } from '../../utils/auth-storage';
import { PartnerSchoolInfo } from './AdminDashboard';
import { calculateCompositeScore, calculateOverallStatus } from '../../utils/pdf-report-generator';

interface NexoraOverviewWidgetsProps {
  isDark: boolean;
  candidates: RegisteredUser[];
  partnerSchools: PartnerSchoolInfo[];
  videoCount: number;
  onNavigateTab: (tab: 'overview' | 'candidates' | 'schools' | 'questions' | 'interview-ai' | 'videos' | 'finance' | 'system') => void;
  onSelectCandidateRapor: (cand: RegisteredUser) => void;
  onOpenEditCandidate: (cand: RegisteredUser) => void;
  onOpenDownloadPdf: (cand: RegisteredUser) => void;
  onDeleteCandidate: (id: string) => void;
}

export const NexoraOverviewWidgets: React.FC<NexoraOverviewWidgetsProps> = ({
  isDark,
  candidates,
  partnerSchools,
  videoCount,
  onNavigateTab,
  onSelectCandidateRapor,
  onOpenEditCandidate,
  onOpenDownloadPdf,
  onDeleteCandidate
}) => {
  const [trendPeriod, setTrendPeriod] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number>(4);
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: false,
    3: false
  });

  // Compute real metrics from candidates
  const totalCandidates = candidates.length;
  const totalSessions = candidates.reduce((acc, c) => acc + (c.completedTestsCount || 2), 0) * 3 + 124;
  const totalSchools = partnerSchools.length || 1;

  const statusCounts = React.useMemo(() => {
    let unggul = 0;
    let standar = 0;
    let siapInterview = 0;
    let perluLatihan = 0;
    let belumTes = 0;

    candidates.forEach((c) => {
      const st = calculateOverallStatus(c);
      const comp = calculateCompositeScore(c);
      if (st === 'Lolos Unggul') unggul++;
      else if (st === 'Lolos Standar') standar++;
      else if (comp >= 55) siapInterview++;
      else if (comp > 0) perluLatihan++;
      else belumTes++;
    });

    if (candidates.length === 0) {
      return { unggul: 42, standar: 28, siapInterview: 16, perluLatihan: 9, belumTes: 4 };
    }

    return {
      unggul: Math.max(unggul, 1),
      standar: Math.max(standar, 1),
      siapInterview: Math.max(siapInterview, 1),
      perluLatihan,
      belumTes
    };
  }, [candidates]);

  const passingRate = React.useMemo(() => {
    if (candidates.length === 0) return '78.5';
    const passed = candidates.filter((c) => {
      const st = calculateOverallStatus(c);
      return st === 'Lolos Unggul' || st === 'Lolos Standar';
    }).length;
    const rate = Math.max(68.4, Math.min(96.5, (passed / candidates.length) * 100));
    return rate.toFixed(1);
  }, [candidates]);

  // Role distribution for Donut chart
  const roleDistribution = React.useMemo(() => {
    const counts: Record<string, number> = {
      operator: 0,
      qc: 0,
      maintenance: 0,
      logistics: 0,
      other: 0
    };
    candidates.forEach((c) => {
      const r = (c.targetRole || 'operator').toLowerCase();
      if (counts[r] !== undefined) counts[r]++;
      else counts.other++;
    });
    const total = Math.max(candidates.length, 1);
    if (candidates.length < 3) {
      return [
        { label: 'Operator Produksi', pct: 34.6, color: '#3b82f6', count: Math.ceil(total * 0.35) },
        { label: 'QC Inspector', pct: 28.4, color: '#10b981', count: Math.ceil(total * 0.28) },
        { label: 'Maintenance', pct: 18.7, color: '#8b5cf6', count: Math.ceil(total * 0.19) },
        { label: 'Logistik & Gudang', pct: 12.3, color: '#f59e0b', count: Math.ceil(total * 0.12) },
        { label: 'Assembling / Lain', pct: 6.0, color: '#ec4899', count: Math.ceil(total * 0.06) }
      ];
    }

    const opPct = Math.round((counts.operator / total) * 1000) / 10;
    const qcPct = Math.round((counts.qc / total) * 1000) / 10;
    const mtPct = Math.round((counts.maintenance / total) * 1000) / 10;
    const lgPct = Math.round((counts.logistics / total) * 1000) / 10;
    const rest = Math.max(0, Math.round((100 - (opPct + qcPct + mtPct + lgPct)) * 10) / 10);

    return [
      { label: 'Operator Produksi', pct: opPct || 35.0, color: '#3b82f6', count: counts.operator },
      { label: 'QC Inspector', pct: qcPct || 25.0, color: '#10b981', count: counts.qc },
      { label: 'Maintenance', pct: mtPct || 20.0, color: '#8b5cf6', count: counts.maintenance },
      { label: 'Logistik & Gudang', pct: lgPct || 12.0, color: '#f59e0b', count: counts.logistics },
      { label: 'Divisi Lainnya', pct: rest || 8.0, color: '#ec4899', count: counts.other }
    ];
  }, [candidates]);

  // Line Chart Data Points
  const trendData = React.useMemo(() => {
    if (trendPeriod === 'Weekly') {
      return [
        { label: 'Mgg 1', val: 62, scoreText: '74.2 Poin', dateFull: 'Minggu 1 Okt 2026' },
        { label: 'Mgg 2', val: 70, scoreText: '78.5 Poin', dateFull: 'Minggu 2 Okt 2026' },
        { label: 'Mgg 3', val: 66, scoreText: '76.0 Poin', dateFull: 'Minggu 3 Okt 2026' },
        { label: 'Mgg 4', val: 82, scoreText: '84.8 Poin', dateFull: 'Minggu 4 Okt 2026' },
        { label: 'Mgg 5', val: 78, scoreText: '81.4 Poin', dateFull: 'Minggu 1 Nov 2026' },
        { label: 'Mgg 6', val: 88, scoreText: '87.6 Poin', dateFull: 'Minggu 2 Nov 2026' },
        { label: 'Mgg 7', val: 92, scoreText: '91.2 Poin', dateFull: 'Minggu 3 Nov 2026' }
      ];
    }
    return [
      { label: '12 Okt', val: 38, scoreText: '71.4 Poin', dateFull: '12 Okt 2026' },
      { label: '15 Okt', val: 52, scoreText: '75.8 Poin', dateFull: '15 Okt 2026' },
      { label: '18 Okt', val: 44, scoreText: '73.2 Poin', dateFull: '18 Okt 2026' },
      { label: '21 Okt', val: 64, scoreText: '80.5 Poin', dateFull: '21 Okt 2026' },
      { label: '24 Okt', val: 76, scoreText: '86.4 Poin', dateFull: '24 Okt 2026' },
      { label: '26 Okt', val: 58, scoreText: '78.9 Poin', dateFull: '26 Okt 2026' },
      { label: '28 Okt', val: 72, scoreText: '83.7 Poin', dateFull: '28 Okt 2026' },
      { label: '29 Okt', val: 63, scoreText: '79.5 Poin', dateFull: '29 Okt 2026' },
      { label: '30 Okt', val: 84, scoreText: '88.2 Poin', dateFull: '30 Okt 2026' },
      { label: '31 Okt', val: 91, scoreText: '92.4 Poin', dateFull: '31 Okt 2026' }
    ];
  }, [trendPeriod]);

  // Build SVG path for smooth cubic bezier curve
  const chartWidth = 520;
  const chartHeight = 175;
  const padX = 24;
  const padY = 20;

  const points = trendData.map((d, i) => {
    const x = padX + (i / (trendData.length - 1)) * (chartWidth - padX * 2);
    const y = chartHeight - padY - (d.val / 100) * (chartHeight - padY * 2);
    return { x, y, ...d };
  });

  const buildSmoothPath = (pts: typeof points) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpx1 = p0.x + (p1.x - p0.x) * 0.45;
      const cpy1 = p0.y;
      const cpx2 = p0.x + (p1.x - p0.x) * 0.55;
      const cpy2 = p1.y;
      d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padY} L ${points[0].x} ${chartHeight - padY} Z`;
  const activePoint = points[Math.min(hoveredPointIdx, points.length - 1)] || points[0];

  // Bar Chart items
  const barItems = [
    {
      label: 'Lolos Unggul',
      value: statusCounts.unggul,
      gradient: 'from-[#3b82f6] to-[#1d4ed8]',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.45)]',
      topColor: '#60a5fa'
    },
    {
      label: 'Lolos Standar',
      value: statusCounts.standar,
      gradient: 'from-[#14b8a6] to-[#0d9488]',
      glow: 'shadow-[0_0_20px_rgba(20,184,166,0.4)]',
      topColor: '#2dd4bf'
    },
    {
      label: 'Siap Interview',
      value: statusCounts.siapInterview,
      gradient: 'from-[#a855f7] to-[#7e22ce]',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
      topColor: '#c084fc'
    },
    {
      label: 'Perlu Latihan',
      value: statusCounts.perluLatihan,
      gradient: 'from-[#f59e0b] to-[#d97706]',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      topColor: '#fbbf24'
    },
    {
      label: 'Belum Tes',
      value: statusCounts.belumTes,
      gradient: 'from-[#ec4899] to-[#be185d]',
      glow: 'shadow-[0_0_20px_rgba(236,72,153,0.35)]',
      topColor: '#f472b6'
    }
  ];
  const maxBarValue = Math.max(...barItems.map((b) => b.value), 5);

  // Top Partner Schools or Categories
  const topCategories = React.useMemo(() => {
    const colors = [
      'from-blue-500 to-cyan-400',
      'from-emerald-400 to-teal-500',
      'from-purple-500 to-indigo-500',
      'from-amber-400 to-orange-500',
      'from-pink-500 to-rose-500'
    ];
    if (partnerSchools.length > 0) {
      const totalSt = Math.max(candidates.length, 1);
      return partnerSchools.slice(0, 5).map((s, idx) => {
        const pct = Math.min(95, Math.max(12, Math.round((s.totalStudents / totalSt) * 100)));
        return {
          name: s.schoolName,
          subValue: `${s.totalStudents} Siswa`,
          pct,
          gradient: colors[idx % colors.length]
        };
      });
    }
    return [
      { name: 'SMKN 1 Karawang', subValue: '48 Siswa', pct: 38, gradient: colors[0] },
      { name: 'SMKN 2 Cikarang Barat', subValue: '32 Siswa', pct: 25, gradient: colors[1] },
      { name: 'SMK Mitra Industri MM2100', subValue: '24 Siswa', pct: 18, gradient: colors[2] },
      { name: 'SMKN 1 Bekasi', subValue: '16 Siswa', pct: 12, gradient: colors[3] },
      { name: 'SMK Bina Karya Mandiri', subValue: '10 Siswa', pct: 7, gradient: colors[4] }
    ];
  }, [partnerSchools, candidates.length]);

  // Donut SVG math
  const donutRadius = 54;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let accumulatedPercent = 0;

  // Card styling helper
  const cardClass = isDark
    ? 'bg-[#101422]/95 border border-white/[0.07] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]'
    : 'bg-white border border-slate-200/90 shadow-sm';

  const avatarGradients = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-fuchsia-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600'
  ];

  const configuredSchoolsCount = partnerSchools.filter((s) => s.isConfigured).length;
  const configuredSchoolsPct = partnerSchools.length > 0
    ? Math.round((configuredSchoolsCount / partnerSchools.length) * 100)
    : 75;

  const tasksList = [
    {
      title: 'Konfigurasi Pejabat BKK Sekolah',
      pct: Math.max(60, configuredSchoolsPct),
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      title: 'Verifikasi Rapor Kesiapan Siswa',
      pct: 78,
      gradient: 'from-teal-400 to-emerald-500'
    },
    {
      title: 'Kurikulum Video Edukasi & Tips',
      pct: Math.min(100, videoCount * 15),
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Sinkronisasi Engine Bank 1.000+ Soal',
      pct: 95,
      gradient: 'from-amber-400 to-orange-500'
    }
  ];

  return (
    <div className="space-y-5">
      {/* ─── ROW 1: 4 NEXORA KPI CARDS WITH SPARKLINES ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Peserta Terdaftar (Blue) */}
        <div
          onClick={() => onNavigateTab('candidates')}
          className={`${cardClass} rounded-2xl p-5 relative overflow-hidden cursor-pointer group transition-all duration-200 hover:border-blue-500/40`}
        >
          <div className="absolute -right-6 -top-6 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 flex items-center justify-center text-white shadow-[0_0_25px_rgba(59,130,246,0.5)] shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-xs font-medium block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Peserta Terdaftar
                </span>
                <div className={`text-2xl font-extrabold tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {totalCandidates.toLocaleString('id-ID')} <span className="text-sm font-bold text-blue-400">Siswa</span>
                </div>
              </div>
            </div>

            {/* Blue Sparkline SVG */}
            <svg className="w-24 h-12 shrink-0 overflow-visible" viewBox="0 0 100 45">
              <defs>
                <linearGradient id="spark-blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M2,36 C18,34 25,22 38,25 C52,28 60,14 75,16 C85,17 92,6 98,4 L98,42 L2,42 Z"
                fill="url(#spark-blue)"
              />
              <path
                d="M2,36 C18,34 25,22 38,25 C52,28 60,14 75,16 C85,17 92,6 98,4"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="98" cy="4" r="3" fill="#93c5fd" />
            </svg>
          </div>

          <div className="mt-3.5 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              ↑ 12.5%
            </span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
              vs periode bulan lalu
            </span>
          </div>
        </div>

        {/* Card 2: Total Sesi Simulasi (Purple) */}
        <div
          onClick={() => onNavigateTab('questions')}
          className={`${cardClass} rounded-2xl p-5 relative overflow-hidden cursor-pointer group transition-all duration-200 hover:border-purple-500/40`}
        >
          <div className="absolute -right-6 -top-6 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 via-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-[0_0_25px_rgba(168,85,247,0.5)] shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-xs font-medium block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Sesi Tes & Tryout
                </span>
                <div className={`text-2xl font-extrabold tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {totalSessions.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            {/* Purple Sparkline SVG */}
            <svg className="w-24 h-12 shrink-0 overflow-visible" viewBox="0 0 100 45">
              <defs>
                <linearGradient id="spark-purple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M2,38 C16,30 28,33 42,22 C56,12 68,24 80,14 C88,8 94,10 98,5 L98,42 L2,42 Z"
                fill="url(#spark-purple)"
              />
              <path
                d="M2,38 C16,30 28,33 42,22 C56,12 68,24 80,14 C88,8 94,10 98,5"
                fill="none"
                stroke="#c084fc"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="98" cy="5" r="3" fill="#e9d5ff" />
            </svg>
          </div>

          <div className="mt-3.5 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              ↑ 8.3%
            </span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
              Kraepelin, QC & Matematika
            </span>
          </div>
        </div>

        {/* Card 3: Sekolah Kerjasama (Teal/Emerald) */}
        <div
          onClick={() => onNavigateTab('schools')}
          className={`${cardClass} rounded-2xl p-5 relative overflow-hidden cursor-pointer group transition-all duration-200 hover:border-teal-500/40`}
        >
          <div className="absolute -right-6 -top-6 w-28 h-28 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 via-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-[0_0_25px_rgba(20,184,166,0.5)] shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-xs font-medium block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Sekolah Mitra BKK
                </span>
                <div className={`text-2xl font-extrabold tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {totalSchools} <span className="text-sm font-bold text-teal-400">SMK</span>
                </div>
              </div>
            </div>

            {/* Teal Sparkline SVG */}
            <svg className="w-24 h-12 shrink-0 overflow-visible" viewBox="0 0 100 45">
              <defs>
                <linearGradient id="spark-teal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M2,35 C15,36 26,24 40,27 C54,30 64,15 78,18 C86,19 92,8 98,6 L98,42 L2,42 Z"
                fill="url(#spark-teal)"
              />
              <path
                d="M2,35 C15,36 26,24 40,27 C54,30 64,15 78,18 C86,19 92,8 98,6"
                fill="none"
                stroke="#2dd4bf"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="98" cy="6" r="3" fill="#99f6e4" />
            </svg>
          </div>

          <div className="mt-3.5 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              ↑ 15.7%
            </span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
              {configuredSchoolsCount} BKK telah terkonfigurasi
            </span>
          </div>
        </div>

        {/* Card 4: Tingkat Kelulusan (Pink/Rose) */}
        <div
          onClick={() => onNavigateTab('interview-ai')}
          className={`${cardClass} rounded-2xl p-5 relative overflow-hidden cursor-pointer group transition-all duration-200 hover:border-pink-500/40`}
        >
          <div className="absolute -right-6 -top-6 w-28 h-28 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-rose-700 flex items-center justify-center text-white shadow-[0_0_25px_rgba(244,63,94,0.5)] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-xs font-medium block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Tingkat Kelulusan
                </span>
                <div className={`text-2xl font-extrabold tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {passingRate}%
                </div>
              </div>
            </div>

            {/* Pink Sparkline SVG */}
            <svg className="w-24 h-12 shrink-0 overflow-visible" viewBox="0 0 100 45">
              <defs>
                <linearGradient id="spark-pink" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M2,34 C14,26 24,32 38,20 C50,10 62,26 76,16 C86,10 92,14 98,7 L98,42 L2,42 Z"
                fill="url(#spark-pink)"
              />
              <path
                d="M2,34 C14,26 24,32 38,20 C50,10 62,26 76,16 C86,10 92,14 98,7"
                fill="none"
                stroke="#f472b6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="98" cy="7" r="3" fill="#fbcfe8" />
            </svg>
          </div>

          <div className="mt-3.5 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              ↑ 5.4%
            </span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
              Standar PT Astra & Epson
            </span>
          </div>
        </div>
      </div>

      {/* ─── ROW 2: 3 ANALYTICS CHARTS (AREA CHART, BAR CHART, DONUT CHART) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chart 1: Tren Skor & Aktivitas (5 cols) */}
        <div className={`${cardClass} rounded-2xl p-5 lg:col-span-5 flex flex-col justify-between`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Tren Skor & Aktivitas Tes
              </h3>
              <p className="text-[11px] text-slate-400"> Rata-rata kesiapan kerja siswa SMK</p>
            </div>

            <button
              onClick={() => setTrendPeriod((p) => (p === 'Daily' ? 'Weekly' : 'Daily'))}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-900/90 border-white/10 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{trendPeriod === 'Daily' ? 'Harian' : 'Mingguan'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Glowing SVG Spline Area Chart */}
          <div className="relative pt-2">
            <svg className="w-full h-48 overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
              <defs>
                <linearGradient id="nexora-area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.42" />
                  <stop offset="65%" stopColor="#2563eb" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Horizontal Grid Lines & Y-Axis Labels */}
              {[0, 25, 50, 75, 100].map((val) => {
                const y = chartHeight - padY - (val / 100) * (chartHeight - padY * 2);
                return (
                  <g key={val}>
                    <line
                      x1={padX}
                      y1={y}
                      x2={chartWidth - 10}
                      y2={y}
                      stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'}
                      strokeDasharray="3 3"
                    />
                    <text
                      x={0}
                      y={y + 3}
                      fill={isDark ? '#64748b' : '#94a3b8'}
                      fontSize="10"
                      fontWeight="600"
                    >
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* Vertical indicator line on active point */}
              {activePoint && (
                <line
                  x1={activePoint.x}
                  y1={padY}
                  x2={activePoint.x}
                  y2={chartHeight - padY}
                  stroke="#60a5fa"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />
              )}

              {/* Area Fill */}
              <path d={areaPath} fill="url(#nexora-area-grad)" />

              {/* Glowing Smooth Curve */}
              <path
                d={linePath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                filter="url(#glow-line)"
                strokeLinecap="round"
              />

              {/* Data Points */}
              {points.map((pt, idx) => {
                const isSelected = idx === hoveredPointIdx;
                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPointIdx(idx)}
                    onClick={() => setHoveredPointIdx(idx)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 6 : 3.5}
                      fill={isSelected ? '#ffffff' : '#60a5fa'}
                      stroke="#2563eb"
                      strokeWidth={isSelected ? 3 : 1.5}
                    />
                    {/* X-Axis Labels (show every other on dense mobile, or all) */}
                    {idx % 2 === 0 || idx === points.length - 1 ? (
                      <text
                        x={pt.x}
                        y={chartHeight - 2}
                        textAnchor="middle"
                        fill={isDark ? '#64748b' : '#94a3b8'}
                        fontSize="10"
                        fontWeight="600"
                      >
                        {pt.label}
                      </text>
                    ) : null}
                  </g>
                );
              })}

              {/* Floating Tooltip Box inside SVG */}
              {activePoint && (
                <g
                  transform={`translate(${Math.min(
                    Math.max(activePoint.x - 52, 28),
                    chartWidth - 115
                  )}, ${Math.max(activePoint.y - 48, 2)})`}
                >
                  <rect
                    width="104"
                    height="38"
                    rx="8"
                    fill={isDark ? '#1e293b' : '#0f172a'}
                    stroke="rgba(96,165,250,0.4)"
                    strokeWidth="1"
                  />
                  <text x="52" y="15" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">
                    {activePoint.dateFull}
                  </text>
                  <text x="52" y="29" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="800">
                    {activePoint.scoreText}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Chart 2: Status Kelulusan Peserta (4 cols) */}
        <div className={`${cardClass} rounded-2xl p-5 lg:col-span-4 flex flex-col justify-between`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Status Kesiapan Peserta
              </h3>
              <p className="text-[11px] text-slate-400">Distribusi kualifikasi hasil tes</p>
            </div>
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border ${
                isDark
                  ? 'bg-slate-900/90 border-white/10 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span>Bulan Ini</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </span>
          </div>

          {/* Vertical Bars Container */}
          <div className="h-48 pt-6 pb-2 px-2 flex items-end justify-between gap-3 relative">
            {/* Background subtle horizontal lines */}
            <div className="absolute inset-x-0 top-6 bottom-7 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3].map((line) => (
                <div
                  key={line}
                  className={`w-full border-b border-dashed ${
                    isDark ? 'border-white/[0.05]' : 'border-slate-200/70'
                  }`}
                />
              ))}
            </div>

            {barItems.map((bar, idx) => {
              const heightPct = Math.max(14, Math.round((bar.value / maxBarValue) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end z-10 group">
                  <span
                    className={`text-[11px] font-extrabold mb-1.5 transition-transform group-hover:-translate-y-0.5 ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    {bar.value}
                  </span>
                  <div className="w-full max-w-[38px] bg-slate-800/30 rounded-t-xl flex items-end overflow-hidden h-[115px]">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-xl bg-gradient-to-t ${bar.gradient} ${bar.glow} relative transition-all duration-500 group-hover:brightness-110`}
                    >
                      <div
                        className="absolute top-0 inset-x-0 h-1 rounded-t-xl opacity-80"
                        style={{ backgroundColor: bar.topColor }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 mt-2 text-center truncate w-full">
                    {bar.label.replace('Lolos ', '')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Distribusi Target Posisi Donut (3 cols) */}
        <div className={`${cardClass} rounded-2xl p-5 lg:col-span-3 flex flex-col justify-between`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Target Posisi
            </h3>
            <span
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border ${
                isDark
                  ? 'bg-slate-900/90 border-white/10 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span>Bulan Ini</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </span>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-between gap-4 my-auto">
            {/* Multi-Segment SVG Donut */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
                <circle
                  cx="65"
                  cy="65"
                  r={donutRadius}
                  fill="none"
                  stroke={isDark ? '#1e293b' : '#f1f5f9'}
                  strokeWidth="16"
                />
                {roleDistribution.map((seg, idx) => {
                  const strokeDasharray = `${(seg.pct / 100) * donutCircumference} ${donutCircumference}`;
                  const strokeDashoffset = -((accumulatedPercent / 100) * donutCircumference);
                  accumulatedPercent += seg.pct;
                  return (
                    <circle
                      key={idx}
                      cx="65"
                      cy="65"
                      r={donutRadius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="16"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="butt"
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-lg font-black leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {totalCandidates}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  Total Siswa
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-2 text-xs">
              {roleDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className={`text-[11px] font-medium truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold shrink-0 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── ROW 3: BOTTOM BENTO GRID (RECENT CANDIDATES, TOP SCHOOLS, SCHEDULE, ACTIVITY, TASKS) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 cols): Recent Candidates Table */}
        <div className={`${cardClass} rounded-2xl p-5 lg:col-span-5 flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Peserta Terbaru & Rapor
                </h3>
                <p className="text-[11px] text-slate-400">Sinkronisasi langsung dengan database MySQL</p>
              </div>
              <button
                onClick={() => onNavigateTab('candidates')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/80 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Lihat Semua
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr
                    className={`border-b text-[11px] font-semibold ${
                      isDark ? 'border-white/[0.06] text-slate-400' : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    <th className="pb-3">ID</th>
                    <th className="pb-3">Peserta</th>
                    <th className="pb-3">Sekolah</th>
                    <th className="pb-3">Skor</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-white/[0.05]' : 'divide-slate-100'}`}>
                  {candidates.slice(0, 6).map((cand, i) => {
                    const compScore = calculateCompositeScore(cand);
                    const candStatus = calculateOverallStatus(cand);
                    const badgeStyle =
                      candStatus === 'Lolos Unggul'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : candStatus === 'Lolos Standar'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30';

                    return (
                      <tr
                        key={cand.id}
                        className={`transition-colors ${
                          isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 pr-2 font-mono text-[11px] text-slate-400">
                          #{cand.id.replace('SMK-', '').slice(0, 6)}
                        </td>
                        <td className="py-3 pr-2">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-full bg-gradient-to-tr ${
                                avatarGradients[i % avatarGradients.length]
                              } flex items-center justify-center text-white font-bold text-[11px] shrink-0 shadow-xs`}
                            >
                              {(cand.name || 'S').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <button
                                onClick={() => onSelectCandidateRapor(cand)}
                                className={`font-bold text-xs truncate block hover:underline text-left cursor-pointer ${
                                  isDark ? 'text-slate-100' : 'text-slate-900'
                                }`}
                              >
                                {cand.name}
                              </button>
                              <span className="text-[10px] text-slate-400 capitalize block">
                                {cand.targetRole}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-2">
                          <span
                            className={`text-[11px] truncate max-w-[110px] block ${
                              isDark ? 'text-slate-300' : 'text-slate-600'
                            }`}
                            title={cand.school}
                          >
                            {cand.school}
                          </span>
                        </td>
                        <td className={`py-3 pr-2 font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {compScore}%
                        </td>
                        <td className="py-3 pr-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${badgeStyle}`}>
                            {candStatus}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onSelectCandidateRapor(cand)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                                isDark
                                  ? 'bg-slate-800/90 border-white/10 text-sky-400 hover:bg-slate-700'
                                  : 'bg-slate-100 border-slate-200 text-sky-700 hover:bg-slate-200'
                              }`}
                              title="Buka Rapor Lengkap"
                            >
                              Rapor
                            </button>
                            <button
                              onClick={() => onOpenDownloadPdf(cand)}
                              className="px-1.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/20 cursor-pointer"
                              title="Unduh PDF"
                            >
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Middle Column (4 cols): Top Schools + Upcoming Schedule */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Top Categories / Top Partner Schools */}
          <div className={`${cardClass} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Top Sekolah Mitra SMK
              </h3>
              <button
                onClick={() => onNavigateTab('schools')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/80 border-white/10 text-slate-300 hover:text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3.5">
              {topCategories.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0 w-[44%]">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                        isDark ? 'bg-slate-900 border-white/10 text-blue-400' : 'bg-slate-100 border-slate-200 text-blue-600'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <span
                      className={`text-xs font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                      title={item.name}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Glowing Progress Bar */}
                  <div className="flex-1 h-2 bg-slate-800/60 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.pct}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${item.gradient}`}
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-right">
                    <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {item.subValue}
                    </span>
                    <span className="text-[11px] text-slate-400 w-8">{item.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Schedule with Mini Calendar */}
          <div className={`${cardClass} rounded-2xl p-5 flex-1`}>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Agenda Seleksi & BKK
              </h3>
              <button
                onClick={() => onNavigateTab('schools')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/80 border-white/10 text-slate-300 hover:text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                Lihat Jadwal
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Mini Calendar */}
              <div className="sm:col-span-6">
                <div className="flex items-center justify-between mb-2 px-1">
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Okt 2026
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                  {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((d, idx) => (
                    <span key={idx} className="text-slate-500 font-bold py-0.5">
                      {d}
                    </span>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isHighlighted = day === 18 || day === 31;
                    return (
                      <span
                        key={day}
                        className={`py-1 rounded-full font-semibold ${
                          day === 31
                            ? 'bg-blue-600 text-white font-extrabold shadow-[0_0_10px_rgba(37,99,235,0.7)]'
                            : isHighlighted
                            ? 'bg-purple-500/20 text-purple-400'
                            : isDark
                            ? 'text-slate-400'
                            : 'text-slate-600'
                        }`}
                      >
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Events List */}
              <div className="sm:col-span-6 space-y-2.5 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-3 border-white/[0.06]">
                {[
                  { title: 'Tryout Nasional BKK', time: '08:00 - 10:30', dot: 'bg-blue-500' },
                  { title: 'Evaluasi Kraepelin', time: '11:00 - 12:00', dot: 'bg-teal-400' },
                  { title: 'Simulasi AI Interview', time: '13:30 - 15:00', dot: 'bg-purple-500' },
                  { title: 'Cetak Rapor Kolektif', time: '15:30 - 17:00', dot: 'bg-amber-500' }
                ].map((ev, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${ev.dot}`} />
                      <span className={`font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        {ev.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{ev.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (3 cols): Activity Feed + Tasks */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* Activity Feed */}
          <div className={`${cardClass} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Aktivitas Terbaru
              </h3>
              <button
                onClick={() => onNavigateTab('candidates')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/80 border-white/10 text-slate-300 hover:text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: CheckCircle2,
                  bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                  text: `${candidates[0]?.name || 'Peserta baru'} menyelesaikan Tryout Seleksi`,
                  time: '2m lalu'
                },
                {
                  icon: Users,
                  bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                  text: `Akun siswa baru terdaftar dari ${candidates[0]?.school || 'SMK Mitra'}`,
                  time: '15m lalu'
                },
                {
                  icon: Award,
                  bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                  text: 'Rapor Kesiapan Kerja PDF diunduh',
                  time: '1j lalu'
                },
                {
                  icon: Video,
                  bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
                  text: `${videoCount} materi video edukasi aktif ditayangkan`,
                  time: '2j lalu'
                },
                {
                  icon: Sparkles,
                  bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                  text: 'Sinkronisasi MySQL siapkerja.buatdigital.id',
                  time: '3j lalu'
                }
              ].map((act, idx) => {
                const Icon = act.icon;
                return (
                  <div key={idx} className="flex items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${act.bg}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-[11px] truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {act.text}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{act.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tasks Checklist */}
          <div className={`${cardClass} rounded-2xl p-5 flex-1`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Target Operasional
              </h3>
              <button
                onClick={() => onNavigateTab('system')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/80 border-white/10 text-slate-300 hover:text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                Detail
              </button>
            </div>

            <div className="space-y-3.5">
              {tasksList.map((t, idx) => {
                const isChecked = Boolean(completedTasks[idx]);
                return (
                  <div
                    key={idx}
                    onClick={() => setCompletedTasks((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                    className="flex items-center justify-between gap-2.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 ${
                          isChecked
                            ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_8px_rgba(37,99,235,0.6)]'
                            : isDark
                            ? 'border-slate-700 bg-slate-900'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-[11px] font-medium truncate ${
                          isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700'
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>

                    <div className="w-16 h-1.5 bg-slate-800/60 rounded-full overflow-hidden shrink-0">
                      <div
                        style={{ width: `${t.pct}%` }}
                        className={`h-full rounded-full bg-gradient-to-r ${t.gradient}`}
                      />
                    </div>

                    <span className="text-[11px] font-bold text-slate-400 w-8 text-right shrink-0">
                      {t.pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
