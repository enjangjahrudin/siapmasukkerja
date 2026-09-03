import React, { useState, useEffect } from 'react';
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
  Clock, 
  Download, 
  Smartphone, 
  RefreshCw, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Database,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { TargetRole } from '../../types';
import { getStoredUsers, RegisteredUser, saveUser } from '../../utils/auth-storage';

interface AdminDashboardProps {
  onSwitchToMobileApp: () => void;
  onLogoutAdmin?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSwitchToMobileApp, onLogoutAdmin }) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'candidates' | 'questions' | 'interview-ai' | 'finance' | 'system'>('overview');
  const [searchCandidate, setSearchCandidate] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedCandidateModal, setSelectedCandidateModal] = useState<RegisteredUser | null>(null);

  // Live database users
  const [candidates, setCandidates] = useState<RegisteredUser[]>(() => getStoredUsers());

  const refreshCandidates = () => {
    setCandidates(getStoredUsers());
  };

  useEffect(() => {
    refreshCandidates();
  }, [adminTab]);

  const candidateListOnly = candidates.filter(c => !c.isAdmin);

  const filteredCandidates = candidateListOnly.filter(c => {
    const matchRole = selectedRoleFilter === 'all' || c.targetRole === selectedRoleFilter;
    const matchSearch = (c.name || '').toLowerCase().includes(searchCandidate.toLowerCase()) ||
                        (c.school || '').toLowerCase().includes(searchCandidate.toLowerCase()) ||
                        (c.major || '').toLowerCase().includes(searchCandidate.toLowerCase()) ||
                        (c.phone || '').toLowerCase().includes(searchCandidate.toLowerCase()) ||
                        (c.id || '').toLowerCase().includes(searchCandidate.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleDeleteCandidate = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data peserta ini?')) {
      const updated = candidates.filter(c => c.id !== id);
      localStorage.setItem('siapkerja_users_database', JSON.stringify(updated));
      setCandidates(updated);
      if (selectedCandidateModal?.id === id) {
        setSelectedCandidateModal(null);
      }
    }
  };

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
                Database Terhubung Live • v2.8
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-medium">Server Status: <strong className="text-emerald-400">Terkoneksi Realtime</strong></span>
          </div>
        </div>

        {/* Center: Quick Search */}
        <div className="hidden lg:flex items-center relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchCandidate}
            onChange={(e) => setSearchCandidate(e.target.value)}
            placeholder="Cari nama, SMK, no WA, atau ID peserta..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:bg-slate-900 focus:border-brand-500 outline-none transition-all font-sans"
          />
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
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-400">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-slate-200 block leading-tight">Super Admin</span>
              <span className="text-[10px] text-slate-500">Divisi Rekrutmen</span>
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
                Monitoring & Database Peserta
              </span>
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Ringkasan Utama (Overview)', icon: LayoutDashboard, badge: 'Live' },
                  { id: 'candidates', label: 'Data Peserta & Kelulusan', icon: Users, badge: `${candidateListOnly.length} Siswa` },
                  { id: 'questions', label: 'Bank Soal & Parameter Tes', icon: Database, badge: '1.000+' },
                  { id: 'interview-ai', label: 'Log AI Voice Interview', icon: Mic, badge: 'Audio STT' },
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
                Bisnis & Sistem
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
              <span className="text-slate-400">Total Terdaftar:</span>
              <strong className="text-emerald-400 font-mono">{candidateListOnly.length} Siswa</strong>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Mode Sinkronisasi:</span>
              <strong className="text-sky-300">Otomatis Live</strong>
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
                  <span className="text-xs text-slate-400 font-mono">Data Terkoneksi: <strong>Live Database</strong></span>
                  <button 
                    onClick={refreshCandidates}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                    title="Segarkan Data Peserta"
                  >
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
                      Peserta Terdaftar
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-sky-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-white">{candidateListOnly.length}</span>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Aktif
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Tersinkronisasi dari registrasi pengguna</span>
                </div>

                {/* KPI 2 */}
                <div className="bg-[#0f172a] border border-slate-800/90 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Sesi Tes Kraepelin
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-white">
                      {candidateListOnly.reduce((acc, c) => acc + (c.completedTestsCount || 1), 0) * 3}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +24%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Rata-rata Panker: 16.2 baris/kolom</span>
                </div>

                {/* KPI 3 */}
                <div className="bg-[#0f172a] border border-slate-800/90 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Simulasi AI Interview
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-purple-300">
                      {candidateListOnly.length * 2} Sesi
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +32%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Rata-rata Prediksi Diterima: 86.4%</span>
                </div>

                {/* KPI 4 */}
                <div className="bg-[#0f172a] border border-slate-800/90 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Tingkat Kelulusan Standar
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-emerald-400">78.5%</span>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +6.1%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Standar Kelulusan PT Astra / Epson</span>
                </div>

              </div>

              {/* Candidates Performance Table */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      Daftar Peserta Terdaftar & Rapor Nilai
                    </h3>
                    <p className="text-xs text-slate-400">Data terhubung langsung dengan akun siswa yang mendaftar.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedRoleFilter}
                      onChange={(e) => setSelectedRoleFilter(e.target.value)}
                      className="bg-slate-900 text-xs font-bold text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 outline-none"
                    >
                      <option value="all">Semua Posisi</option>
                      <option value="operator">Operator Produksi</option>
                      <option value="qc">Quality Control (QC)</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="logistics">Logistik & Gudang</option>
                    </select>

                    <button
                      onClick={refreshCandidates}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="pb-3 pl-2">Peserta & Kontak</th>
                        <th className="pb-3">Asal Sekolah & Jurusan</th>
                        <th className="pb-3">Target Posisi</th>
                        <th className="pb-3">Kraepelin</th>
                        <th className="pb-3">Akurasi QC</th>
                        <th className="pb-3">AI Interview</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 pr-2 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {filteredCandidates.map((cand) => (
                        <tr key={cand.id} className="hover:bg-slate-850/60 transition-colors">
                          <td className="py-3.5 pl-2">
                            <div className="font-bold text-white text-xs">{cand.name}</div>
                            <div className="text-[10px] text-sky-400 font-mono">{cand.phone || cand.id}</div>
                          </td>
                          <td className="py-3.5">
                            <span className="text-slate-200 block">{cand.school}</span>
                            <span className="text-[10px] text-slate-400">{cand.major}</span>
                          </td>
                          <td className="py-3.5">
                            <span className="capitalize text-slate-300 font-semibold">{cand.targetRole}</span>
                            <span className="block text-[10px] text-slate-500">{cand.targetCompany}</span>
                          </td>
                          <td className="py-3.5 font-mono">
                            <span className="text-sky-300 font-bold">{cand.kraepelinScore?.panker || '-'}</span>
                            <span className="text-[10px] text-slate-400 block">{cand.kraepelinScore?.janker ? `${cand.kraepelinScore.janker}% akurat` : 'Belum tes'}</span>
                          </td>
                          <td className="py-3.5 font-mono">
                            <span className="text-emerald-400 font-bold">{cand.qcAccuracy ? `${cand.qcAccuracy}%` : '-'}</span>
                          </td>
                          <td className="py-3.5 font-mono">
                            <span className="text-purple-300 font-bold">{cand.interviewScore ? `${cand.interviewScore}%` : '-'}</span>
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
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedCandidateModal(cand)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                title="Lihat Rapor Lengkap"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCandidate(cand.id)}
                                className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 transition-colors"
                                title="Hapus Peserta"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CANDIDATES MANAGEMENT FULL */}
          {adminTab === 'candidates' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    Basis Data Peserta SMK / SMA ({candidateListOnly.length} Siswa)
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Daftar seluruh siswa terdaftar, riwayat tes psikometrik, dan tracking kesiapan interview kerja.
                  </p>
                </div>
              </div>

              {/* Candidate Table Container */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">ID & Nama Peserta</th>
                      <th className="p-4">Asal Sekolah & Jurusan</th>
                      <th className="p-4">No. WhatsApp</th>
                      <th className="p-4">Target Posisi</th>
                      <th className="p-4">Status Seleksi</th>
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
                        <td className="p-4">
                          <span className="text-slate-200 block">{c.school}</span>
                          <span className="text-[10px] text-slate-400">{c.major}</span>
                        </td>
                        <td className="p-4 font-mono text-sky-300">{c.phone}</td>
                        <td className="p-4">
                          <span className="font-bold text-slate-200 capitalize">{c.targetRole}</span>
                          <span className="block text-[10px] text-slate-400">{c.targetCompany}</span>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            c.overallStatus === 'Lolos Unggul' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-sky-300'
                          }`}>
                            {c.overallStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedCandidateModal(c)}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
                            >
                              Lihat Rapor
                            </button>
                            <button
                              onClick={() => handleDeleteCandidate(c.id)}
                              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: QUESTIONS PARAMETERS */}
          {adminTab === 'questions' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Engine Bank Soal Parametrik (1.000+ Soal)
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Seluruh modul latihan menggunakan generator dinamis yang mengacak angka dan skenario secara otomatis.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Tes Kraepelin & Pauli', total: 'Random Matrix (32 Baris/Kolom)', status: 'Active Engine', desc: 'Penjumlahan satuan otomatis dan kalkulasi slope regresi Hankan.' },
                  { name: 'Matematika Dasar & Konversi', total: '16 Pola Parametrik (1.000+ Variasi)', status: 'Active Engine', desc: 'Kabataku, pecahan, persen diskon, beban shift, dan konversi satuan m/ton/liter/lusin.' },
                  { name: 'Tabel Perkalian 2 Menit', total: '100 Soal Berurutan (1x1 s/d 10x10)', status: 'Active Engine', desc: 'Kecepatan hitung mental non-stop dengan peta matriks visual.' },
                  { name: 'Psikotes Penalaran & Logika', total: 'Bank Kosakata Industri & Silogisme', status: 'Active Engine', desc: 'Sinonim, antonim, analogi alat ukur, dan deduksi SOP keselamatan.' },
                  { name: 'Ketelitian & Barcode QC', total: '150 Pasang Master Kode', status: 'Active Engine', desc: 'Speed match 45 detik mendeteksi anomali cacat reject (NG).' },
                  { name: 'Mekanika Bennett (SVG)', total: 'Diagram Interaktif Visual', status: 'Active Engine', desc: 'Roda gigi beruntun, katrol majemuk, dan tuas pengungkit.' }
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
                  Log Evaluasi AI Voice Mock Interview
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Transkrip audio, skor metode STAR, deteksi filler words, dan probabilitas diterima kerja.
                </p>
              </div>

              <div className="space-y-3">
                {candidateListOnly.map((cand, idx) => (
                  <div key={idx} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold text-sky-300">{cand.name}</span>
                        <span className="text-[10px] text-slate-500 ml-2">({cand.school} • {cand.targetRole})</span>
                      </div>
                      <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/30">
                        Prediksi: {cand.interviewScore || 85}% Lolos
                      </span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 italic">
                      Transkrip Wawancara: "Saya siap bekerja sistem shift dan mematuhi SOP keselamatan K3 serta 5S di lingkungan pabrik..."
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span>Metode STAR: <strong className="text-sky-300">92%</strong></span>
                      <span>Artikulasi Suara: <strong className="text-emerald-400">96.5%</strong></span>
                      <span>Target: <strong className="text-amber-300">{cand.targetCompany}</strong></span>
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
                  Pendapatan & Transaksi QRIS
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Monitoring konversi pembayaran QRIS/E-Wallet untuk Token AI Voice Interview & Tryout CAT Pro.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5">
                  <span className="text-[11px] uppercase font-bold text-slate-400">Total Transaksi</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-2">Rp 52.450.000</div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Dari 1,480 pembayaran sukses</span>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5">
                  <span className="text-[11px] uppercase font-bold text-slate-400">Token AI Terjual</span>
                  <div className="text-2xl font-black text-purple-300 font-mono mt-2">3,890 Token</div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Paket Rp 25.000 (3x sesi wawancara)</span>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5">
                  <span className="text-[11px] uppercase font-bold text-slate-400">Metode Terfavorit</span>
                  <div className="text-xl font-black text-white mt-2">QRIS (GoPay/DANA/ShopeePay)</div>
                  <span className="text-[10px] text-slate-500 mt-1 block">82% dari seluruh volume</span>
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
                  Status infrastruktur VPS, latensi speech recognition, dan koneksi database.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-sm font-extrabold text-white">AI Services Benchmark</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Whisper STT (Indonesian Voice):</span>
                      <strong className="text-emerald-400 font-mono">115 ms (Optimal)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gemini LLM HRD Evaluator:</span>
                      <strong className="text-sky-400 font-mono">180 ms (Optimal)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Google Neural2 TTS Synthesizer:</span>
                      <strong className="text-emerald-400 font-mono">82 ms (Ultra Fast)</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-sm font-extrabold text-white">Server aaPanel VPS Status</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nginx Web Server:</span>
                      <strong className="text-emerald-400 font-mono">Running (Pure Static)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">HTTPS SSL (Let's Encrypt):</span>
                      <strong className="text-emerald-400 font-mono">Active (TLS 1.3)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Memory Usage:</span>
                      <strong className="text-sky-300 font-mono">245 MB / 2.0 GB (Very Light)</strong>
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
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-sky-400">{selectedCandidateModal.id}</span>
                <h3 className="text-lg font-black text-white mt-0.5">{selectedCandidateModal.name}</h3>
                <p className="text-xs text-slate-400">
                  {selectedCandidateModal.school} • {selectedCandidateModal.major} (No WA: <span className="text-sky-300 font-mono">{selectedCandidateModal.phone}</span>)
                </p>
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
                <div className="text-xl font-black text-sky-400 mt-1 font-mono">{selectedCandidateModal.kraepelinScore?.panker || '-'}</div>
                <span className="text-[10px] text-slate-500">{selectedCandidateModal.kraepelinScore?.janker ? `${selectedCandidateModal.kraepelinScore.janker}% Akurasi` : 'Belum tes'}</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Akurasi Kode QC</span>
                <div className="text-xl font-black text-emerald-400 mt-1 font-mono">{selectedCandidateModal.qcAccuracy ? `${selectedCandidateModal.qcAccuracy}%` : '-'}</div>
                <span className="text-[10px] text-slate-500">Speed Match 45s</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">AI Interview HRD</span>
                <div className="text-xl font-black text-purple-300 mt-1 font-mono">{selectedCandidateModal.interviewScore ? `${selectedCandidateModal.interviewScore}%` : '-'}</div>
                <span className="text-[10px] text-slate-500">Peluang Lolos</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <strong className="text-white block font-bold">Target Perusahaan Sasaran:</strong>
              <div className="text-sky-300 font-semibold">{selectedCandidateModal.targetCompany} (Posisi: <span className="capitalize">{selectedCandidateModal.targetRole}</span>)</div>
              <p className="text-slate-400 leading-relaxed pt-1 border-t border-slate-800">
                Terdaftar sejak: {new Date(selectedCandidateModal.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full' })} • Status: <strong className="text-emerald-400">{selectedCandidateModal.overallStatus}</strong>
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => handleDeleteCandidate(selectedCandidateModal.id)}
                className="px-4 py-2 bg-red-950 text-red-400 hover:bg-red-900 rounded-xl text-xs font-bold transition-colors"
              >
                Hapus Data Peserta
              </button>

              <button
                onClick={() => setSelectedCandidateModal(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors"
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
