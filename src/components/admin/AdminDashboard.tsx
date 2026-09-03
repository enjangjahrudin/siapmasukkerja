import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Mic, 
  CreditCard, 
  Activity, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Smartphone, 
  RefreshCw, 
  TrendingUp, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  Database,
  BarChart3,
  Flame,
  Volume2,
  FileText,
  Eye,
  Plus
} from 'lucide-react';
import { TargetRole } from '../../types';

interface AdminDashboardProps {
  onSwitchToMobileApp: () => void;
}

interface CandidateData {
  id: string;
  name: string;
  school: string;
  role: TargetRole;
  targetCompany: string;
  kraepelinScore: { panker: number; janker: number; grade: string };
  qcAccuracy: number;
  interviewScore: number;
  overallStatus: 'Lolos Unggul' | 'Lolos Standar' | 'Perlu Latihan';
  lastActive: string;
}

const mockCandidates: CandidateData[] = [
  {
    id: 'SMK-2026-0891',
    name: 'Ahmad Fauzi',
    school: 'SMKN 1 Karawang (Teknik Mesin)',
    role: 'operator',
    targetCompany: 'PT Astra Daihatsu Motor',
    kraepelinScore: { panker: 17.2, janker: 96.5, grade: 'Sangat Baik' },
    qcAccuracy: 94,
    interviewScore: 88,
    overallStatus: 'Lolos Unggul',
    lastActive: '5 menit lalu'
  },
  {
    id: 'SMK-2026-0892',
    name: 'Siti Nurhaliza',
    school: 'SMKN 2 Cikarang (Elektronika Industri)',
    role: 'qc',
    targetCompany: 'PT Epson Indonesia',
    kraepelinScore: { panker: 15.8, janker: 98.0, grade: 'Sangat Baik' },
    qcAccuracy: 98,
    interviewScore: 91,
    overallStatus: 'Lolos Unggul',
    lastActive: '12 menit lalu'
  },
  {
    id: 'SMK-2026-0893',
    name: 'Rian Pratama',
    school: 'SMK Taruna Karya (Teknik Otomotif)',
    role: 'maintenance',
    targetCompany: 'PT Yamaha Motor Mfg',
    kraepelinScore: { panker: 13.4, janker: 89.2, grade: 'Baik' },
    qcAccuracy: 86,
    interviewScore: 79,
    overallStatus: 'Lolos Standar',
    lastActive: '28 menit lalu'
  },
  {
    id: 'SMK-2026-0894',
    name: 'Budi Santoso',
    school: 'SMAN 1 Tambun Selatan (IPA)',
    role: 'logistics',
    targetCompany: 'PT Mayora Indah Tbk',
    kraepelinScore: { panker: 11.2, janker: 82.0, grade: 'Cukup' },
    qcAccuracy: 80,
    interviewScore: 68,
    overallStatus: 'Perlu Latihan',
    lastActive: '1 jam lalu'
  },
  {
    id: 'SMK-2026-0895',
    name: 'Dewi Lestari',
    school: 'SMKN 1 Bekasi (Teknik Kimia Industri)',
    role: 'qc',
    targetCompany: 'PT Denso Indonesia',
    kraepelinScore: { panker: 16.0, janker: 95.0, grade: 'Sangat Baik' },
    qcAccuracy: 92,
    interviewScore: 84,
    overallStatus: 'Lolos Unggul',
    lastActive: '2 jam lalu'
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSwitchToMobileApp }) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'candidates' | 'questions' | 'interview-ai' | 'finance' | 'system'>('overview');
  const [searchCandidate, setSearchCandidate] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedCandidateModal, setSelectedCandidateModal] = useState<CandidateData | null>(null);

  const filteredCandidates = mockCandidates.filter(c => {
    const matchRole = selectedRoleFilter === 'all' || c.role === selectedRoleFilter;
    const matchSearch = c.name.toLowerCase().includes(searchCandidate.toLowerCase()) ||
                        c.school.toLowerCase().includes(searchCandidate.toLowerCase()) ||
                        c.id.toLowerCase().includes(searchCandidate.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Top Admin Global Bar */}
      <header className="h-16 border-b border-slate-800/90 bg-[#0d1322]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        
        {/* Left: Brand & Status Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-sky-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-base shadow-md shadow-brand-500/20">
              SMK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  SMK — Siap Masuk Kerja
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-brand-500/20 text-sky-400 px-2 py-0.5 rounded border border-brand-500/30">
                  Command Center
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Simulasikan Seleksi. Tingkatkan Kesiapan. v2.6
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-medium">Server Status: <strong className="text-emerald-400">Normal (99.98%)</strong></span>
          </div>
        </div>

        {/* Center: Quick Search */}
        <div className="hidden lg:flex items-center relative w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama peserta, ID sesi, asal SMK, atau log..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:bg-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all font-sans"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            ⌘K
          </span>
        </div>

        {/* Right: Switch to User App & Admin Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchToMobileApp}
            className="px-3.5 py-2 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all transform active:scale-95"
            title="Buka tampilan smartphone aplikasi pengguna"
          >
            <Smartphone className="w-4 h-4" />
            <span>Lihat Tampilan HP (User View)</span>
          </button>

          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-slate-200 block leading-tight">Super Admin</span>
              <span className="text-[10px] text-slate-500">Divisi Operasional</span>
            </div>
          </div>
        </div>

      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-800/90 bg-[#0b101d] flex flex-col justify-between p-4 shrink-0 hidden md:flex">
          
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3 block mb-2">
                Monitoring & Operasional
              </span>
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Ringkasan Utama (Overview)', icon: LayoutDashboard, badge: 'Live' },
                  { id: 'candidates', label: 'Data Peserta & Kelulusan', icon: Users, badge: '1,420' },
                  { id: 'questions', label: 'Bank Soal & Parameter Tes', icon: Database, badge: '7 Modul' },
                  { id: 'interview-ai', label: 'Log AI Voice Interview', icon: Mic, badge: 'AI Pro' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = adminTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setAdminTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-brand-600/20 text-sky-300 border border-brand-500/40 shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                          isActive ? 'bg-brand-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3 block mb-2">
                Bisnis & Infrastruktur
              </span>
              <nav className="space-y-1">
                {[
                  { id: 'finance', label: 'Transaksi & Token AI', icon: CreditCard, badge: 'QRIS' },
                  { id: 'system', label: 'AI Latency & Server Health', icon: Activity, badge: '98ms' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = adminTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setAdminTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-brand-600/20 text-sky-300 border border-brand-500/40'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Target Rekrutmen:</span>
              <strong className="text-emerald-400">Astra / Epson</strong>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Total Sesi Hari Ini:</span>
              <strong className="text-sky-300 font-mono">3,892 Sesi</strong>
            </div>
          </div>

        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* TAB 1: OVERVIEW & REAL-TIME OPS */}
          {adminTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Dashboard Operasional & Pemantauan Pengguna
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Data real-time aktivitas pengerjaan tes, psikotes koran, akurasi QC, dan sesi interview AI kandidat SMK / SMA.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Data diperbarui: <strong>Baru saja</strong></span>
                  <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4 Bento KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* KPI 1 */}
                <div className="bg-[#0f172a] border border-slate-800/90 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Total Peserta Terdaftar
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-sky-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-white">12,480</span>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">89% Lulusan SMK Jurusan Mesin/Elektro/Otomotif</span>
                </div>

                {/* KPI 2 */}
                <div className="bg-[#0f172a] border border-slate-800/90 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Sesi Tes Kraepelin / Pauli
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-white">45,190</span>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +28.5%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Rata-rata Kecepatan (Panker): 15.4 baris/kolom</span>
                </div>

                {/* KPI 3 */}
                <div className="bg-[#0f172a] border border-slate-800/90 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Simulasi AI Interview (Voice)
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-purple-300">8,620</span>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +34.1%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Rata-rata Prediksi Diterima: 82.6%</span>
                </div>

                {/* KPI 4 */}
                <div className="bg-[#0f172a] border border-slate-800/90 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Tingkat Kelulusan Passing Grade
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-emerald-400">74.8%</span>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +5.4%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Target Standar Lolos Pabrik Manufaktur</span>
                </div>

              </div>

              {/* Middle Section: Recent Candidates Performance Table */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                <div className="lg:col-span-8 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-white">
                        Aktivitas & Rapor Terkini Peserta
                      </h3>
                      <p className="text-xs text-slate-400">Monitoring langsung hasil tes dan evaluasi psikotes.</p>
                    </div>
                    <button
                      onClick={() => setAdminTab('candidates')}
                      className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1"
                    >
                      <span>Lihat Semua (1,420)</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                          <th className="pb-3 pl-2">Peserta / SMK</th>
                          <th className="pb-3">Target Posisi</th>
                          <th className="pb-3">Kraepelin</th>
                          <th className="pb-3">Akurasi QC</th>
                          <th className="pb-3">AI Interview</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 pr-2 text-right">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {mockCandidates.map((cand) => (
                          <tr key={cand.id} className="hover:bg-slate-850/60 transition-colors">
                            <td className="py-3.5 pl-2">
                              <div className="font-bold text-white text-xs">{cand.name}</div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{cand.school}</div>
                            </td>
                            <td className="py-3.5">
                              <span className="capitalize text-slate-300 font-semibold">{cand.role}</span>
                              <span className="block text-[10px] text-slate-500">{cand.targetCompany}</span>
                            </td>
                            <td className="py-3.5 font-mono">
                              <span className="text-sky-300 font-bold">{cand.kraepelinScore.panker}</span>
                              <span className="text-[10px] text-slate-400 block">{cand.kraepelinScore.janker}% akurat</span>
                            </td>
                            <td className="py-3.5 font-mono">
                              <span className="text-emerald-400 font-bold">{cand.qcAccuracy}%</span>
                            </td>
                            <td className="py-3.5 font-mono">
                              <span className="text-purple-300 font-bold">{cand.interviewScore}%</span>
                            </td>
                            <td className="py-3.5">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                                cand.overallStatus === 'Lolos Unggul'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : cand.overallStatus === 'Lolos Standar'
                                  ? 'bg-blue-500/20 text-sky-400 border border-blue-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}>
                                {cand.overallStatus}
                              </span>
                            </td>
                            <td className="py-3.5 pr-2 text-right">
                              <button
                                onClick={() => setSelectedCandidateModal(cand)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                title="Lihat Rapor Lengkap"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                    <h3 className="text-sm font-extrabold text-white flex items-center justify-between">
                      <span>Distribusi Posisi Sasaran</span>
                      <span className="text-[10px] font-mono text-slate-400">Total 100%</span>
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-300">1. Operator Produksi</span>
                          <span className="text-sky-400 font-mono">48% (5,990)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-sky-500 h-2 rounded-full" style={{ width: '48%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-300">2. Quality Control (QC)</span>
                          <span className="text-emerald-400 font-mono">28% (3,490)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '28%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-300">3. Maintenance / Teknisi</span>
                          <span className="text-amber-400 font-mono">14% (1,740)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '14%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-300">4. Logistik & Warehouse</span>
                          <span className="text-purple-400 font-mono">10% (1,260)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-800/40 rounded-2xl p-5 shadow-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-purple-200">
                        AI Mock Interview Pipeline
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Sistem audio Whisper STT + Google Neural2 TTS Bahasa Indonesia beroperasi dengan akurasi pengenalan dialek <strong>96.8%</strong>.
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-800/30 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Avg Response Latency:</span>
                        <strong className="text-sky-300 font-mono">112 ms</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Token Success Rate:</span>
                        <strong className="text-emerald-400 font-mono">99.4%</strong>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: CANDIDATES MANAGEMENT */}
          {adminTab === 'candidates' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    Basis Data Peserta SMK / SMA
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Daftar seluruh peserta terdaftar, hasil uji psikometrik, dan tracking kesiapan interview kerja.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700">
                    <Download className="w-4 h-4" />
                    <span>Ekspor CSV / Excel</span>
                  </button>
                </div>
              </div>

              {/* Filter bar */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchCandidate}
                    onChange={(e) => setSearchCandidate(e.target.value)}
                    placeholder="Cari berdasarkan nama, SMK, atau ID..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">Filter Posisi:</span>
                  <select
                    value={selectedRoleFilter}
                    onChange={(e) => setSelectedRoleFilter(e.target.value)}
                    className="bg-slate-900 text-xs font-bold text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 outline-none focus:border-brand-500"
                  >
                    <option value="all">Semua Posisi</option>
                    <option value="operator">Operator Produksi</option>
                    <option value="qc">Quality Control (QC)</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="logistics">Logistik</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">ID & Nama Peserta</th>
                      <th className="p-4">Asal Sekolah</th>
                      <th className="p-4">Target Perusahaan</th>
                      <th className="p-4">Kraepelin (Panker)</th>
                      <th className="p-4">QC Akurasi</th>
                      <th className="p-4">AI Interview</th>
                      <th className="p-4">Kelayakan</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 font-medium">
                    {filteredCandidates.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="p-4">
                          <div className="font-mono text-[10px] text-slate-500">{c.id}</div>
                          <div className="font-extrabold text-white text-xs mt-0.5">{c.name}</div>
                        </td>
                        <td className="p-4 text-slate-300">{c.school}</td>
                        <td className="p-4">
                          <span className="font-bold text-slate-200">{c.targetCompany}</span>
                          <span className="block text-[10px] text-sky-400 capitalize">{c.role}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-sky-300">
                          {c.kraepelinScore.panker} <span className="text-[10px] text-slate-400 font-normal">({c.kraepelinScore.grade})</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-400">{c.qcAccuracy}%</td>
                        <td className="p-4 font-mono font-bold text-purple-300">{c.interviewScore}%</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            c.overallStatus === 'Lolos Unggul' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-sky-300'
                          }`}>
                            {c.overallStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedCandidateModal(c)}
                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
                          >
                            Lihat Rapor
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: QUESTIONS & TEST PARAMETERS */}
          {adminTab === 'questions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    Manajemen Bank Soal & Standar Kelulusan
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Konfigurasi parameter waktu Kraepelin, kunci jawaban mekanika Bennett, toleransi QC, dan soal interview AI.
                  </p>
                </div>

                <button className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Tambah Soal Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Tes Kraepelin / Pauli', total: '50 Kolom (Random Matrix)', status: 'Active Engine', desc: 'Algoritma hitung satuan & kalkulasi slope regresi Hankan.' },
                  { name: 'Ketelitian & Barcode QC', total: '150 Pasang Master Kode', status: 'Active Engine', desc: 'Simulasi deteksi 1 karakter beda, nol vs O, barcode parity.' },
                  { name: 'Mekanika Bennett (SVG)', total: '45 Soal Visual Interaktif', status: 'Active Engine', desc: 'Roda gigi beruntun, katrol 2-4 tali, tuas pengungkit 3 titik.' },
                  { name: 'Aritmatika & Deret Pabrik', total: '80 Soal Hitung Cepat', status: 'Active Engine', desc: 'Perbandingan pekerja shift, persen reject, Fibonacci.' },
                  { name: 'Kanvas Wartegg 8 Kotak', total: '8 Stimulus Psikodiagnostik', status: 'Active Guide', desc: 'Rubrik penilaian adaptasi ego, ambisi, logika, dan etika.' },
                  { name: 'AI Voice Interview Prompts', total: '24 Pertanyaan HRD & User', status: 'Active Engine', desc: 'Persona HRD Astra/Epson dengan kalkulator akurasi STAR.' }
                ].map((item, i) => (
                  <div key={i} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                          {item.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white">{item.name}</h4>
                      <span className="text-xs font-mono text-sky-400 block mt-0.5">{item.total}</span>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                      <button className="text-xs text-slate-300 hover:text-white font-bold">
                        Edit Parameter →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AI INTERVIEW LOGS */}
          {adminTab === 'interview-ai' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Log Percakapan & Evaluasi AI Mock Interview
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Inspeksi transkrip audio, deteksi filler words, kepatuhan metode STAR, dan probabilitas diterima kerja.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: 'Ahmad Fauzi (Operator Produksi)',
                    question: 'Ceritakan latar belakang pendidikan dan pengalaman PKL Anda.',
                    transcript: 'Selamat pagi bapak. Nama saya Ahmad Fauzi dari SMK 1 jurusan Teknik Mesin. Saya PKL 6 bulan di line assembly pabrik komponen...',
                    starScore: 90,
                    prob: 88,
                    time: '10 menit lalu'
                  },
                  {
                    name: 'Siti Nurhaliza (QC Inspector)',
                    question: 'Bagaimana jika menemukan produk reject namun bagian produksi mendesak untuk diloloskan?',
                    transcript: 'Saya akan tetap tegas menolak dan menandai label Hold NG sesuai SOP. Kualitas tidak bisa dikompromikan...',
                    starScore: 95,
                    prob: 91,
                    time: '25 menit lalu'
                  }
                ].map((log, idx) => (
                  <div key={idx} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-sky-300">{log.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                          Prediksi: {log.prob}% Lolos
                        </span>
                        <span className="text-[10px] text-slate-500">{log.time}</span>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-slate-300">
                      Pertanyaan AI HRD: "{log.question}"
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 italic">
                      Transkrip Audio Pengguna: "{log.transcript}"
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>Metode STAR: <strong className="text-sky-300">{log.starScore}%</strong></span>
                      <span>Audio STT Confidence: <strong className="text-emerald-400">98.2%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FINANCE & MONETIZATION */}
          {adminTab === 'finance' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Pendapatan & Transaksi Paket Premium
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Monitoring konversi pembayaran QRIS/E-Wallet untuk Paket Tryout Pro & Token AI Voice Interview.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5">
                  <span className="text-[11px] uppercase font-bold text-slate-400">Total Pendapatan Bulan Ini</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-2">Rp 48.950.000</div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Dari 1,240 transaksi aktif</span>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5">
                  <span className="text-[11px] uppercase font-bold text-slate-400">Token AI Interview Terjual</span>
                  <div className="text-2xl font-black text-purple-300 font-mono mt-2">3,480 Token</div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Paket Rp 25.000 (3x sesi wawancara)</span>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5">
                  <span className="text-[11px] uppercase font-bold text-slate-400">Metode Pembayaran Terfavorit</span>
                  <div className="text-xl font-black text-white mt-2">QRIS (GoPay/DANA)</div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Mencakup 78% dari seluruh transaksi</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SYSTEM HEALTH */}
          {adminTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Kesehatan Sistem & Latensi AI
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Metrik teknis backend, performa speech synthesizer, dan utilisasi database.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-sm font-extrabold text-white">AI Services Latency Benchmark</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Whisper STT (Indonesian Voice):</span>
                      <strong className="text-emerald-400 font-mono">145 ms (Optimal)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gemini LLM HRD Evaluator:</span>
                      <strong className="text-sky-400 font-mono">220 ms (Optimal)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Google Neural2 TTS Synthesizer:</span>
                      <strong className="text-emerald-400 font-mono">85 ms (Ultra Fast)</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-sm font-extrabold text-white">Database & Server Load</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">PostgreSQL Connection Pool:</span>
                      <strong className="text-sky-300 font-mono">24 / 100 Connections</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Redis Cache Hit Rate:</span>
                      <strong className="text-emerald-400 font-mono">99.2%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Memory Usage:</span>
                      <strong className="text-slate-300 font-mono">1.2 GB / 8.0 GB</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* CANDIDATE DETAIL MODAL */}
      {selectedCandidateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-sky-400">{selectedCandidateModal.id}</span>
                <h3 className="text-lg font-black text-white mt-0.5">{selectedCandidateModal.name}</h3>
                <p className="text-xs text-slate-400">{selectedCandidateModal.school}</p>
              </div>

              <button
                onClick={() => setSelectedCandidateModal(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Kraepelin Panker</span>
                <div className="text-xl font-black text-sky-400 mt-1 font-mono">{selectedCandidateModal.kraepelinScore.panker}</div>
                <span className="text-[10px] text-slate-500">{selectedCandidateModal.kraepelinScore.janker}% Akurasi</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Akurasi Kode QC</span>
                <div className="text-xl font-black text-emerald-400 mt-1 font-mono">{selectedCandidateModal.qcAccuracy}%</div>
                <span className="text-[10px] text-slate-500">Speed Match 45s</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">AI Interview HRD</span>
                <div className="text-xl font-black text-purple-300 mt-1 font-mono">{selectedCandidateModal.interviewScore}%</div>
                <span className="text-[10px] text-slate-500">Peluang Diterima</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <strong className="text-white block font-bold">Analisis Rekrutmen:</strong>
              <p className="text-slate-300 leading-relaxed">
                Kandidat memiliki stamina ritme kerja sangat stabil pada kolom-kolom akhir tes Kraepelin. Kemampuan komunikasi saat simulasi interview menunjukkan pemahaman SOP yang solid dan komitmen siap shift malam.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedCandidateModal(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Tutup Rapor
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
