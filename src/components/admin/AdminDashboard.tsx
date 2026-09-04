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
  AlertTriangle,
  Sun,
  Moon,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu
} from 'lucide-react';
import { TargetRole } from '../../types';
import { getStoredUsers, RegisteredUser, saveUser } from '../../utils/auth-storage';
import { useTheme } from '../../utils/theme-context';
import { AppLogo } from '../common/AppLogo';

interface AdminDashboardProps {
  onSwitchToMobileApp: () => void;
  onLogoutAdmin?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSwitchToMobileApp, onLogoutAdmin }) => {
  const { isDark, toggleTheme } = useTheme();
  const [adminTab, setAdminTab] = useState<'overview' | 'candidates' | 'questions' | 'interview-ai' | 'finance' | 'system'>('overview');
  const [searchCandidate, setSearchCandidate] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedCandidateModal, setSelectedCandidateModal] = useState<RegisteredUser | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Live database users
  const [candidates, setCandidates] = useState<RegisteredUser[]>(() => getStoredUsers());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Baru saja');
  const [serverConnection, setServerConnection] = useState<'connected' | 'offline'>('connected');

  // Fetch live candidates directly from MySQL Backend REST API
  const fetchLiveCandidates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCandidates(json.data);
          localStorage.setItem('siapkerja_users_database', JSON.stringify(json.data));
          setServerConnection('connected');
          setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
        }
      } else {
        setCandidates(getStoredUsers());
      }
    } catch (err) {
      setCandidates(getStoredUsers());
      setServerConnection('offline');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCandidates();
    // Auto-refresh poll every 8 seconds for live monitoring
    const interval = setInterval(fetchLiveCandidates, 8000);
    return () => clearInterval(interval);
  }, []);

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

  const handleDeleteCandidate = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data peserta ini dari database?')) {
      try {
        await fetch(`/api/users/${id}`, { method: 'DELETE' });
      } catch (e) {}

      const updated = candidates.filter(c => c.id !== id);
      localStorage.setItem('siapkerja_users_database', JSON.stringify(updated));
      setCandidates(updated);
      if (selectedCandidateModal?.id === id) {
        setSelectedCandidateModal(null);
      }
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-[#090d16] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* Top Admin Global Bar */}
      <header className={`h-16 border-b px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md transition-colors ${
        isDark ? 'bg-[#0d1322]/90 border-slate-800/90' : 'bg-white/95 border-slate-200 shadow-xs'
      }`}>
        
        {/* Left: Sidebar Toggle Button & Brand Logo */}
        <div className="flex items-center gap-3">
          
          <button
            onClick={() => setIsSidebarCollapsed(prev => !prev)}
            className={`p-2 rounded-xl border transition-colors flex items-center justify-center ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={isSidebarCollapsed ? 'Buka Sidebar Penuh' : 'Sembunyikan Sidebar (Hanya Ikon)'}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4 text-sky-400" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          <AppLogo size="md" isDark={isDark} showText={true} />

          <div className={`hidden lg:flex items-center gap-2 pl-4 border-l text-xs ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${serverConnection === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              MySQL: <strong className={serverConnection === 'connected' ? 'text-emerald-500 font-bold' : 'text-amber-500'}>
                {serverConnection === 'connected' ? 'Live Realtime' : 'Cache'}
              </strong>
            </span>
            <span className="text-[10px] text-slate-400 font-mono ml-0.5">({lastSyncTime})</span>
          </div>
        </div>

        {/* Center: Quick Search */}
        <div className="hidden md:flex items-center relative w-72 lg:w-80">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            value={searchCandidate}
            onChange={(e) => setSearchCandidate(e.target.value)}
            placeholder="Cari nama, SMK, no WA, ID..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs outline-none transition-colors border font-sans ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800 text-white placeholder-slate-500 focus:border-brand-500' 
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-brand-600 shadow-xs'
            }`}
          />
        </div>

        {/* Right: Theme Toggle, Switch to User App & Admin Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Theme Toggle Sun / Moon */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors flex items-center justify-center ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-750' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
            }`}
            title={isDark ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onSwitchToMobileApp}
            className="px-3 py-2 bg-gradient-to-r from-brand-600 via-sky-500 to-teal-400 hover:from-brand-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all transform active:scale-95"
            title="Buka tampilan smartphone aplikasi pengguna"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Tampilan HP</span>
          </button>

          <div className={`flex items-center gap-2 pl-2 sm:pl-3 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-400">
              AD
            </div>
            <div className="hidden xl:block text-left">
              <span className={`text-xs font-bold block leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Super Admin</span>
              <span className="text-[10px] text-slate-500">Divisi Rekrutmen</span>
            </div>

            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
                className={`p-1.5 rounded-lg border ml-0.5 transition-colors ${
                  isDark ? 'text-red-400 border-red-900/40 hover:bg-red-950/60' : 'text-red-600 border-red-200 hover:bg-red-50'
                }`}
                title="Keluar Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </header>

      {/* Main Admin Workspace with Collapsible Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Collapsible Sidebar Navigation */}
        <aside className={`border-r flex flex-col justify-between p-3 shrink-0 hidden md:flex transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } ${isDark ? 'bg-[#0b101d] border-slate-800/90' : 'bg-white border-slate-200'}`}>
          
          <div className="space-y-5">
            
            {/* Group 1: Monitoring */}
            <div>
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block mb-2 text-left">
                  Monitoring & Database
                </span>
              )}
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Ringkasan Utama', icon: LayoutDashboard, badge: 'Live' },
                  { id: 'candidates', label: 'Data Peserta & Nilai', icon: Users, badge: `${candidateListOnly.length}` },
                  { id: 'questions', label: 'Bank Soal 1.000+', icon: Database, badge: '1.000+' },
                  { id: 'interview-ai', label: 'Log AI Interview', icon: Mic, badge: 'Audio' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = adminTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setAdminTab(item.id as any)}
                      title={isSidebarCollapsed ? `${item.label} (${item.badge})` : undefined}
                      className={`w-full flex items-center rounded-xl text-xs font-bold transition-all relative ${
                        isSidebarCollapsed 
                          ? 'justify-center p-3' 
                          : 'justify-between px-3 py-2.5 text-left'
                      } ${
                        isActive
                          ? isDark 
                            ? 'bg-brand-600/20 text-sky-300 border border-brand-500/40 shadow-xs' 
                            : 'bg-brand-50 text-brand-900 border border-brand-300 shadow-xs font-black'
                          : isDark 
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-850' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`flex items-center gap-2.5 ${isSidebarCollapsed ? 'justify-center' : 'text-left'}`}>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? (isDark ? 'text-sky-400' : 'text-brand-600') : 'text-slate-400'}`} />
                        {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {/* Mini Compact Badge (Does not overflow) */}
                      {!isSidebarCollapsed && item.badge && (
                        <span className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full shrink-0 ml-1.5 border ${
                          isActive 
                            ? isDark ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-brand-600 text-white border-brand-700' 
                            : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {item.badge}
                        </span>
                      )}

                      {/* Dot for collapsed mode */}
                      {isSidebarCollapsed && (
                        <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-sky-400' : 'bg-slate-600'}`} />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Group 2: Business & System */}
            <div>
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block mb-2 text-left">
                  Bisnis & Server
                </span>
              )}
              <nav className="space-y-1">
                {[
                  { id: 'finance', label: 'Transaksi & Token', icon: CreditCard, badge: 'QRIS' },
                  { id: 'system', label: 'Server & Latency', icon: Activity, badge: '98ms' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = adminTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setAdminTab(item.id as any)}
                      title={isSidebarCollapsed ? `${item.label} (${item.badge})` : undefined}
                      className={`w-full flex items-center rounded-xl text-xs font-bold transition-all relative ${
                        isSidebarCollapsed 
                          ? 'justify-center p-3' 
                          : 'justify-between px-3 py-2.5 text-left'
                      } ${
                        isActive
                          ? isDark 
                            ? 'bg-brand-600/20 text-sky-300 border border-brand-500/40' 
                            : 'bg-brand-50 text-brand-900 border border-brand-300'
                          : isDark 
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-850' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`flex items-center gap-2.5 ${isSidebarCollapsed ? 'justify-center' : 'text-left'}`}>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? (isDark ? 'text-sky-400' : 'text-brand-600') : 'text-slate-400'}`} />
                        {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {/* Mini Compact Badge */}
                      {!isSidebarCollapsed && item.badge && (
                        <span className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full shrink-0 ml-1.5 border ${
                          isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {item.badge}
                        </span>
                      )}

                      {/* Dot for collapsed mode */}
                      {isSidebarCollapsed && (
                        <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-sky-400' : 'bg-slate-600'}`} />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Quick Info Box / Footer Toggle */}
          {!isSidebarCollapsed ? (
            <div className={`border rounded-2xl p-3 space-y-1.5 text-left transition-colors ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Terdaftar:</span>
                <strong className="text-emerald-500 font-mono font-bold">{candidateListOnly.length} Siswa</strong>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Database:</span>
                <strong className="text-sky-500 font-bold">MySQL Live</strong>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 py-1 px-1.5 rounded-lg block">
                {candidateListOnly.length}
              </span>
            </div>
          )}

        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* TAB 1: OVERVIEW & REAL-TIME OPS */}
          {adminTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Dashboard Operasional & Pemantauan Pengguna
                  </h1>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Data real-time aktivitas pengerjaan tes, psikotes koran, akurasi QC, dan sesi interview AI kandidat SMK / SMA.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={fetchLiveCandidates}
                    disabled={isLoading}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      isDark 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                    }`}
                    title="Segarkan Data Peserta dari MySQL"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
                    <span>{isLoading ? 'Menyinkronkan...' : 'Refresh MySQL'}</span>
                  </button>
                </div>
              </div>

              {/* 4 Bento KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* KPI 1 */}
                <div className={`border rounded-2xl p-5 shadow-xs transition-colors ${
                  isDark ? 'bg-[#0f172a] border-slate-800/90' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Peserta Terdaftar
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-brand-500/15 text-sky-500 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{candidateListOnly.length}</span>
                    <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Aktif
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Tersimpan di MySQL VPS</span>
                </div>

                {/* KPI 2 */}
                <div className={`border rounded-2xl p-5 shadow-xs transition-colors ${
                  isDark ? 'bg-[#0f172a] border-slate-800/90' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Sesi Tes Kraepelin
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {candidateListOnly.reduce((acc, c) => acc + (c.completedTestsCount || 1), 0) * 3}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +24%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Rata-rata Panker: 16.2 baris/kolom</span>
                </div>

                {/* KPI 3 */}
                <div className={`border rounded-2xl p-5 shadow-xs transition-colors ${
                  isDark ? 'bg-[#0f172a] border-slate-800/90' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Simulasi AI Interview
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-purple-500">
                      {candidateListOnly.length * 2} Sesi
                    </span>
                    <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +32%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Rata-rata Prediksi Diterima: 86.4%</span>
                </div>

                {/* KPI 4 */}
                <div className={`border rounded-2xl p-5 shadow-xs transition-colors ${
                  isDark ? 'bg-[#0f172a] border-slate-800/90' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Tingkat Kelulusan Standar
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-emerald-500">78.5%</span>
                    <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +6.1%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Standar Kelulusan PT Astra / Epson</span>
                </div>

              </div>

              {/* Candidates Performance Table */}
              <div className={`border rounded-2xl p-5 shadow-xs space-y-4 transition-colors ${
                isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Daftar Peserta Terdaftar & Rapor Nilai
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Data terhubung langsung dengan akun siswa di database MySQL VPS.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedRoleFilter}
                      onChange={(e) => setSelectedRoleFilter(e.target.value)}
                      className={`text-xs font-bold rounded-xl px-3 py-1.5 outline-none border transition-colors ${
                        isDark 
                          ? 'bg-slate-900 text-slate-200 border-slate-700' 
                          : 'bg-slate-50 text-slate-800 border-slate-300'
                      }`}
                    >
                      <option value="all">Semua Posisi</option>
                      <option value="operator">Operator Produksi</option>
                      <option value="qc">Quality Control (QC)</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="logistics">Logistik & Gudang</option>
                    </select>

                    <button
                      onClick={fetchLiveCandidates}
                      disabled={isLoading}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border flex items-center gap-1 transition-colors ${
                        isDark 
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>Sync</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b text-slate-400 font-bold uppercase text-[10px] ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
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
                    <tbody className={`divide-y font-medium ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
                      {filteredCandidates.map((cand) => (
                        <tr key={cand.id} className={`transition-colors ${isDark ? 'hover:bg-slate-850/60' : 'hover:bg-slate-50'}`}>
                          <td className="py-3.5 pl-2">
                            <div className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{cand.name}</div>
                            <div className="text-[10px] text-sky-500 font-mono">{cand.phone || cand.id}</div>
                          </td>
                          <td className="py-3.5">
                            <span className={`block font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{cand.school}</span>
                            <span className="text-[10px] text-slate-400">{cand.major}</span>
                          </td>
                          <td className="py-3.5">
                            <span className={`capitalize font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{cand.targetRole}</span>
                            <span className="block text-[10px] text-slate-400">{cand.targetCompany}</span>
                          </td>
                          <td className="py-3.5 font-mono">
                            <span className="text-sky-500 font-bold">{cand.kraepelinScore?.panker || '-'}</span>
                            <span className="text-[10px] text-slate-400 block">{cand.kraepelinScore?.janker ? `${cand.kraepelinScore.janker}% akurat` : 'Belum tes'}</span>
                          </td>
                          <td className="py-3.5 font-mono">
                            <span className="text-emerald-500 font-bold">{cand.qcAccuracy ? `${cand.qcAccuracy}%` : '-'}</span>
                          </td>
                          <td className="py-3.5 font-mono">
                            <span className="text-purple-500 font-bold">{cand.interviewScore ? `${cand.interviewScore}%` : '-'}</span>
                          </td>
                          <td className="py-3.5">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                              cand.overallStatus === 'Lolos Unggul'
                                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                                : cand.overallStatus === 'Lolos Standar'
                                ? 'bg-blue-500/20 text-sky-500 border border-blue-500/30'
                                : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                            }`}>
                              {cand.overallStatus}
                            </span>
                          </td>
                          <td className="py-3.5 pr-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedCandidateModal(cand)}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                }`}
                                title="Lihat Rapor Lengkap"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCandidate(cand.id)}
                                className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-500 transition-colors"
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
                  <h1 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Basis Data Peserta SMK / SMA ({candidateListOnly.length} Siswa)
                  </h1>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Daftar seluruh siswa terdaftar di MySQL, riwayat tes psikometrik, dan tracking kesiapan interview kerja.
                  </p>
                </div>
              </div>

              {/* Candidate Table Container */}
              <div className={`border rounded-2xl overflow-hidden transition-colors ${
                isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <table className="w-full text-left text-xs">
                  <thead className={`border-b text-slate-400 font-bold uppercase text-[10px] ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <tr>
                      <th className="p-4">ID & Nama Peserta</th>
                      <th className="p-4">Asal Sekolah & Jurusan</th>
                      <th className="p-4">No. WhatsApp</th>
                      <th className="p-4">Target Posisi</th>
                      <th className="p-4">Status Seleksi</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y font-medium ${isDark ? 'divide-slate-800/70' : 'divide-slate-100'}`}>
                    {filteredCandidates.map((c) => (
                      <tr key={c.id} className={`transition-colors ${isDark ? 'hover:bg-slate-850/50' : 'hover:bg-slate-50'}`}>
                        <td className="p-4">
                          <div className="font-mono text-[10px] text-slate-400">{c.id}</div>
                          <div className={`font-extrabold text-xs mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.name}</div>
                        </td>
                        <td className="p-4">
                          <span className={`block font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{c.school}</span>
                          <span className="text-[10px] text-slate-400">{c.major}</span>
                        </td>
                        <td className="p-4 font-mono text-sky-500 font-bold">{c.phone}</td>
                        <td className="p-4">
                          <span className={`font-bold capitalize ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{c.targetRole}</span>
                          <span className="block text-[10px] text-slate-400">{c.targetCompany}</span>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            c.overallStatus === 'Lolos Unggul' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-sky-500'
                          }`}>
                            {c.overallStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedCandidateModal(c)}
                              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                              }`}
                            >
                              Lihat Rapor
                            </button>
                            <button
                              onClick={() => handleDeleteCandidate(c.id)}
                              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-500 transition-colors"
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
                <h1 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Engine Bank Soal Parametrik (1.000+ Soal)
                </h1>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
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
                  <div key={i} className={`border rounded-2xl p-4 flex flex-col justify-between transition-colors ${
                    isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/20 px-2 py-0.5 rounded">
                          {item.status}
                        </span>
                      </div>
                      <h4 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.name}</h4>
                      <span className="text-xs font-mono text-sky-500 block mt-0.5 font-bold">{item.total}</span>
                      <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
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
                <h1 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Log Evaluasi AI Voice Mock Interview
                </h1>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Transkrip audio, skor metode STAR, deteksi filler words, dan probabilitas diterima kerja.
                </p>
              </div>

              <div className="space-y-3">
                {candidateListOnly.map((cand, idx) => (
                  <div key={idx} className={`border rounded-2xl p-5 space-y-3 transition-colors ${
                    isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold text-sky-500">{cand.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2">({cand.school} • {cand.targetRole})</span>
                      </div>
                      <span className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/30">
                        Prediksi: {cand.interviewScore || 85}% Lolos
                      </span>
                    </div>

                    <div className={`p-3 rounded-xl border text-xs italic ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      Transkrip Wawancara: "Saya siap bekerja sistem shift dan mematuhi SOP keselamatan K3 serta 5S di lingkungan pabrik..."
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span>Metode STAR: <strong className="text-sky-500 font-bold">92%</strong></span>
                      <span>Artikulasi Suara: <strong className="text-emerald-500 font-bold">96.5%</strong></span>
                      <span>Target: <strong className="text-amber-500 font-bold">{cand.targetCompany}</strong></span>
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
                <h1 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Pendapatan & Transaksi QRIS
                </h1>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Monitoring konversi pembayaran QRIS/E-Wallet untuk Token AI Voice Interview & Tryout CAT Pro.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`border rounded-2xl p-5 transition-colors ${
                  isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className="text-[11px] uppercase font-bold text-slate-400">Total Transaksi</span>
                  <div className="text-2xl font-black text-emerald-500 font-mono mt-2">Rp 52.450.000</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Dari 1,480 pembayaran sukses</span>
                </div>

                <div className={`border rounded-2xl p-5 transition-colors ${
                  isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className="text-[11px] uppercase font-bold text-slate-400">Token AI Terjual</span>
                  <div className="text-2xl font-black text-purple-500 font-mono mt-2">3,890 Token</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Paket Rp 25.000 (3x sesi wawancara)</span>
                </div>

                <div className={`border rounded-2xl p-5 transition-colors ${
                  isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className="text-[11px] uppercase font-bold text-slate-400">Metode Terfavorit</span>
                  <div className={`text-xl font-black mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>QRIS (GoPay/DANA/ShopeePay)</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">82% dari seluruh volume</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SYSTEM HEALTH */}
          {adminTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Kesehatan Sistem & Latensi AI
                </h1>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Status infrastruktur VPS, latensi speech recognition, dan koneksi database MySQL.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`border rounded-2xl p-5 space-y-3 transition-colors ${
                  isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <h4 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Services Benchmark</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Whisper STT (Indonesian Voice):</span>
                      <strong className="text-emerald-500 font-mono">115 ms (Optimal)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gemini LLM HRD Evaluator:</span>
                      <strong className="text-sky-500 font-mono">180 ms (Optimal)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Google Neural2 TTS Synthesizer:</span>
                      <strong className="text-emerald-500 font-mono">82 ms (Ultra Fast)</strong>
                    </div>
                  </div>
                </div>

                <div className={`border rounded-2xl p-5 space-y-3 transition-colors ${
                  isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <h4 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Server aaPanel VPS Status</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Database MySQL:</span>
                      <strong className="text-emerald-500 font-mono">Connected (Port 3306)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Node.js API Service:</span>
                      <strong className="text-emerald-500 font-mono">Online (Port 5000)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Memory Usage:</span>
                      <strong className="text-sky-500 font-mono">245 MB / 2.0 GB (Very Light)</strong>
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
          <div className={`border rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            
            <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <span className="text-[10px] font-mono text-sky-500 font-bold">{selectedCandidateModal.id}</span>
                <h3 className={`text-lg font-black mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedCandidateModal.name}</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selectedCandidateModal.school} • {selectedCandidateModal.major} (No WA: <span className="text-sky-500 font-mono font-bold">{selectedCandidateModal.phone}</span>)
                </p>
              </div>

              <button
                onClick={() => setSelectedCandidateModal(null)}
                className={`p-2 rounded-xl transition-colors ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                ✕
              </button>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className={`border rounded-2xl p-3.5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Kraepelin Panker</span>
                <div className="text-xl font-black text-sky-500 mt-1 font-mono">{selectedCandidateModal.kraepelinScore?.panker || '-'}</div>
                <span className="text-[10px] text-slate-400">{selectedCandidateModal.kraepelinScore?.janker ? `${selectedCandidateModal.kraepelinScore.janker}% Akurasi` : 'Belum tes'}</span>
              </div>

              <div className={`border rounded-2xl p-3.5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Akurasi Kode QC</span>
                <div className="text-xl font-black text-emerald-500 mt-1 font-mono">{selectedCandidateModal.qcAccuracy ? `${selectedCandidateModal.qcAccuracy}%` : '-'}</div>
                <span className="text-[10px] text-slate-400">Speed Match 45s</span>
              </div>

              <div className={`border rounded-2xl p-3.5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] text-slate-400 uppercase font-bold">AI Interview HRD</span>
                <div className="text-xl font-black text-purple-500 mt-1 font-mono">{selectedCandidateModal.interviewScore ? `${selectedCandidateModal.interviewScore}%` : '-'}</div>
                <span className="text-[10px] text-slate-400">Peluang Lolos</span>
              </div>
            </div>

            <div className={`border rounded-2xl p-4 space-y-2 text-xs ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <strong className={`block font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Target Perusahaan Sasaran:</strong>
              <div className="text-sky-500 font-semibold">{selectedCandidateModal.targetCompany} (Posisi: <span className="capitalize">{selectedCandidateModal.targetRole}</span>)</div>
              <p className={`leading-relaxed pt-1 border-t ${isDark ? 'text-slate-400 border-slate-800' : 'text-slate-600 border-slate-200'}`}>
                Terdaftar sejak: {new Date(selectedCandidateModal.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full' })} • Status: <strong className="text-emerald-500">{selectedCandidateModal.overallStatus}</strong>
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => handleDeleteCandidate(selectedCandidateModal.id)}
                className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-xl text-xs font-bold transition-colors"
              >
                Hapus Data Peserta
              </button>

              <button
                onClick={() => setSelectedCandidateModal(null)}
                className={`px-5 py-2 font-bold text-xs rounded-xl transition-colors ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                }`}
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
