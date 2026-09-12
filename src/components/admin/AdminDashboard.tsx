import React, { useState, useEffect, useMemo } from 'react';
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
  EyeOff,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Video,
  Play,
  Edit3,
  ExternalLink,
  Film,
  Check,
  X,
  KeyRound,
  Lock,
  Tag,
  Upload,
  Monitor,
  Loader2,
  FileVideo,
  Building2,
  GraduationCap,
  Printer,
  FileText,
  Award
} from 'lucide-react';
import { TargetRole } from '../../types';
import { getStoredUsers, RegisteredUser, saveUser, changeUserPassword } from '../../utils/auth-storage';
import { 
  printIndividualStudentReport, 
  printCollectiveSchoolReport, 
  calculateCompositeScore,
  SchoolSignerInfo
} from '../../utils/pdf-report-generator';
import { 
  EducationVideo, 
  VideoCategory,
  defaultVideoCategories,
  getStoredCategories,
  saveStoredCategories,
  addStoredCategory,
  getStoredVideos, 
  saveStoredVideos, 
  addStoredVideo, 
  updateStoredVideo, 
  deleteStoredVideo, 
  extractYoutubeId,
  fetchLiveVideos,
  uploadVideoFile
} from '../../data/education-videos';
import { useTheme } from '../../utils/theme-context';
import { AppLogo } from '../common/AppLogo';

interface AdminDashboardProps {
  onSwitchToMobileApp: () => void;
  onLogoutAdmin?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSwitchToMobileApp, onLogoutAdmin }) => {
  const { isDark, toggleTheme } = useTheme();
  const [adminTab, setAdminTab] = useState<'overview' | 'candidates' | 'questions' | 'interview-ai' | 'videos' | 'finance' | 'system'>('overview');
  const [searchCandidate, setSearchCandidate] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');
  const [selectedCandidateModal, setSelectedCandidateModal] = useState<RegisteredUser | null>(null);
  const [realtimeCandidateData, setRealtimeCandidateData] = useState<RegisteredUser | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // PDF Signer / Pengesahan Modal State
  const [signerModalOpen, setSignerModalOpen] = useState<boolean>(false);
  const [signerTarget, setSignerTarget] = useState<{
    type: 'individual' | 'collective';
    student?: RegisteredUser;
    schoolName: string;
    students?: RegisteredUser[];
  } | null>(null);
  const [signerName, setSignerName] = useState<string>('');
  const [signerTitle, setSignerTitle] = useState<string>('Koordinator BKK / Hubinmas');
  const [signerNip, setSignerNip] = useState<string>('');
  const [saveSignerPreference, setSaveSignerPreference] = useState<boolean>(true);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  // Video CMS State
  const [videoList, setVideoList] = useState<EducationVideo[]>(() => getStoredVideos());
  const [categoryList, setCategoryList] = useState<VideoCategory[]>(() => getStoredCategories());
  const [videoSearch, setVideoSearch] = useState<string>('');
  const [videoCatFilter, setVideoCatFilter] = useState<string>('all');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState<boolean>(false);
  const [editingVideo, setEditingVideo] = useState<EducationVideo | null>(null);
  const [previewPlayingVideo, setPreviewPlayingVideo] = useState<EducationVideo | null>(null);

  // Custom Category State in Form
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [customCategoryName, setCustomCategoryName] = useState<string>('');

  // Super Admin Change Password State
  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState<boolean>(false);
  const [adminOldPassword, setAdminOldPassword] = useState<string>('');
  const [adminNewPassword, setAdminNewPassword] = useState<string>('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState<string>('');
  const [showOldPass, setShowOldPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const [adminPassStatus, setAdminPassStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

  // Video Form State
  const [videoForm, setVideoForm] = useState<{
    id: string;
    title: string;
    description: string;
    category: string;
    duration: string;
    sourceType: 'youtube' | 'upload';
    youtubeInput: string;
    videoUrl: string;
    orientation: 'landscape' | 'portrait';
    speaker: string;
    speakerRole: string;
    viewsCount: string;
    badge: string;
    isFeatured: boolean;
    keyTakeawaysText: string;
  }>({
    id: '',
    title: '',
    description: '',
    category: 'kraepelin',
    duration: '10:00',
    sourceType: 'youtube',
    youtubeInput: '',
    videoUrl: '',
    orientation: 'landscape',
    speaker: '',
    speakerRole: '',
    viewsCount: '1.5 rb',
    badge: 'Baru',
    isFeatured: false,
    keyTakeawaysText: ''
  });
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [uploadVideoError, setUploadVideoError] = useState<string>('');

  // Fetch live videos and listen to category changes
  const refreshVideos = async () => {
    const list = await fetchLiveVideos();
    if (list && list.length > 0) setVideoList(list);
    setCategoryList(getStoredCategories());
  };

  useEffect(() => {
    refreshVideos();
    const handleCatUpdate = (e: any) => {
      if (e.detail) setCategoryList(e.detail);
      else setCategoryList(getStoredCategories());
    };
    window.addEventListener('siapkerja_categories_updated', handleCatUpdate);
    return () => window.removeEventListener('siapkerja_categories_updated', handleCatUpdate);
  }, []);

  const openAddVideoModal = () => {
    setEditingVideo(null);
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setIsUploadingVideo(false);
    setUploadVideoError('');
    setVideoForm({
      id: `vid-${Date.now()}`,
      title: '',
      description: '',
      category: categoryList[0]?.id || 'kraepelin',
      duration: '10:00',
      sourceType: 'youtube',
      youtubeInput: '',
      videoUrl: '',
      orientation: 'landscape',
      speaker: '',
      speakerRole: 'Praktisi Rekrutmen',
      viewsCount: '1.2 rb',
      badge: 'Baru',
      isFeatured: false,
      keyTakeawaysText: ''
    });
    setIsAddEditModalOpen(true);
  };

  const openEditVideoModal = (video: EducationVideo) => {
    setEditingVideo(video);
    const isExistingCat = categoryList.some(c => c.id === video.category);
    if (!isExistingCat && video.category) {
      // Add it to category list
      const label = video.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      addStoredCategory({ id: video.category, label });
    }
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setIsUploadingVideo(false);
    setUploadVideoError('');
    setVideoForm({
      id: video.id,
      title: video.title,
      description: video.description,
      category: video.category,
      duration: video.duration,
      sourceType: video.sourceType || (video.videoUrl ? 'upload' : 'youtube'),
      youtubeInput: video.youtubeId || '',
      videoUrl: video.videoUrl || '',
      orientation: video.orientation || 'landscape',
      speaker: video.speaker,
      speakerRole: video.speakerRole,
      viewsCount: video.viewsCount,
      badge: video.badge || '',
      isFeatured: Boolean(video.isFeatured),
      keyTakeawaysText: (video.keyTakeaways || []).join('\n')
    });
    setIsAddEditModalOpen(true);
  };

  const handleVideoFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setUploadVideoError('Format file tidak didukung. Silakan pilih file video (MP4, WebM, MOV, dll).');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setUploadVideoError('Ukuran video terlalu besar (maksimal 100 MB).');
      return;
    }

    setIsUploadingVideo(true);
    setUploadVideoError('');

    // Pre-detect orientation and duration
    try {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = URL.createObjectURL(file);
      tempVideo.onloadedmetadata = () => {
        window.URL.revokeObjectURL(tempVideo.src);
        const w = tempVideo.videoWidth;
        const h = tempVideo.videoHeight;
        const isPortrait = h > w;
        const autoOrientation = isPortrait ? 'portrait' : 'landscape';
        
        const totalSecs = Math.round(tempVideo.duration || 0);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        const autoDuration = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;

        setVideoForm(prev => ({
          ...prev,
          orientation: autoOrientation,
          duration: autoDuration !== '00:00' ? autoDuration : prev.duration
        }));
      };
    } catch (err) {
      console.warn('Video metadata detection failed', err);
    }

    const result = await uploadVideoFile(file);
    setIsUploadingVideo(false);

    if (result.success && result.videoUrl) {
      setVideoForm(prev => ({
        ...prev,
        videoUrl: result.videoUrl || '',
        title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ')
      }));
    } else {
      setUploadVideoError(result.message || 'Gagal mengunggah file video.');
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let ytId = '';
    if (videoForm.sourceType === 'youtube') {
      ytId = extractYoutubeId(videoForm.youtubeInput);
      if (!ytId) {
        alert('Silakan masukkan link YouTube atau Video ID yang valid.');
        return;
      }
    } else {
      if (!videoForm.videoUrl) {
        alert('Silakan pilih dan tunggu hingga file video selesai diunggah.');
        return;
      }
    }

    let finalCategory = videoForm.category;

    // If custom category was entered
    if (isCustomCategory && customCategoryName.trim()) {
      const cleanLabel = customCategoryName.trim();
      const slugId = cleanLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      finalCategory = slugId || `cat-${Date.now()}`;
      const updatedCats = addStoredCategory({ id: finalCategory, label: cleanLabel });
      setCategoryList(updatedCats);
    }

    const takeaways = videoForm.keyTakeawaysText
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    const newVideo: EducationVideo = {
      id: videoForm.id || `vid-${Date.now()}`,
      title: videoForm.title,
      description: videoForm.description,
      category: finalCategory,
      duration: videoForm.duration || '10:00',
      sourceType: videoForm.sourceType,
      youtubeId: videoForm.sourceType === 'youtube' ? ytId : undefined,
      videoUrl: videoForm.sourceType === 'upload' ? videoForm.videoUrl : undefined,
      orientation: videoForm.orientation,
      thumbnailUrl: videoForm.sourceType === 'youtube'
        ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      speaker: videoForm.speaker,
      speakerRole: videoForm.speakerRole,
      viewsCount: videoForm.viewsCount || '1.0 rb',
      badge: videoForm.badge || undefined,
      isFeatured: videoForm.isFeatured,
      keyTakeaways: takeaways
    };

    if (editingVideo) {
      const updated = await updateStoredVideo(newVideo);
      setVideoList(updated);
    } else {
      const updated = await addStoredVideo(newVideo);
      setVideoList(updated);
    }

    setIsAddEditModalOpen(false);
  };

  // Handle Admin Password Change
  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminOldPassword) {
      setAdminPassStatus({ type: 'error', message: 'Masukkan kata sandi lama/saat ini.' });
      return;
    }
    if (adminNewPassword.length < 6) {
      setAdminPassStatus({ type: 'error', message: 'Kata sandi baru minimal 6 karakter.' });
      return;
    }
    if (adminNewPassword !== adminConfirmPassword) {
      setAdminPassStatus({ type: 'error', message: 'Konfirmasi kata sandi baru tidak cocok.' });
      return;
    }

    setAdminPassStatus({ type: 'loading', message: 'Menyimpan kata sandi baru ke MySQL...' });
    const result = await changeUserPassword('SMK-ADMIN-001', adminOldPassword, adminNewPassword);
    
    if (result.success) {
      setAdminPassStatus({ type: 'success', message: 'Kata sandi Super Admin berhasil diperbarui!' });
      setTimeout(() => {
        setIsAdminPasswordModalOpen(false);
        setAdminOldPassword('');
        setAdminNewPassword('');
        setAdminConfirmPassword('');
        setAdminPassStatus({ type: 'idle', message: '' });
      }, 1500);
    } else {
      setAdminPassStatus({ type: 'error', message: result.message || 'Gagal mengubah kata sandi.' });
    }
  };

  const handleDeleteVideo = async (id: string, title: string) => {
    if (window.confirm(`Yakin ingin menghapus video "${title}"?`)) {
      const updated = await deleteStoredVideo(id);
      setVideoList(updated);
      if (previewPlayingVideo?.id === id) {
        setPreviewPlayingVideo(null);
      }
    }
  };

  const toggleFeaturedStatus = async (video: EducationVideo) => {
    const updatedVideo: EducationVideo = {
      ...video,
      isFeatured: !video.isFeatured
    };
    const updated = await updateStoredVideo(updatedVideo);
    setVideoList(updated);
  };

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

  // Extract unique sorted list of schools
  const schoolList = useMemo(() => {
    const schools = Array.from(new Set(candidateListOnly.map(c => c.school).filter(Boolean)));
    return schools.sort((a, b) => a.localeCompare(b));
  }, [candidateListOnly]);

  const filteredCandidates = candidateListOnly.filter(c => {
    const matchSchool = selectedSchoolFilter === 'all' || c.school === selectedSchoolFilter;
    const matchRole = selectedRoleFilter === 'all' || c.targetRole === selectedRoleFilter;
    const matchSearch = (c.name || '').toLowerCase().includes(searchCandidate.toLowerCase()) ||
                        (c.school || '').toLowerCase().includes(searchCandidate.toLowerCase()) ||
                        (c.major || '').toLowerCase().includes(searchCandidate.toLowerCase()) ||
                        (c.phone || '').toLowerCase().includes(searchCandidate.toLowerCase()) ||
                        (c.id || '').toLowerCase().includes(searchCandidate.toLowerCase());
    return matchSchool && matchRole && matchSearch;
  });

  // Realtime Candidate Report Fetcher
  const handleOpenRaporModal = async (candidate: RegisteredUser) => {
    setSelectedCandidateModal(candidate);
    setRealtimeCandidateData(candidate);
    setIsLoadingReport(true);
    try {
      const res = await fetch(`/api/admin/candidate-report/${candidate.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.candidate) {
          setRealtimeCandidateData(json.candidate);
        }
      }
    } catch (e) {
      console.warn('[Rapor Realtime Sync Exception]', e);
    } finally {
      setIsLoadingReport(false);
    }
  };

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

  const openSignerModal = (target: {
    type: 'individual' | 'collective';
    student?: RegisteredUser;
    schoolName: string;
    students?: RegisteredUser[];
  }) => {
    setSignerTarget(target);
    const schoolKey = target.schoolName && target.schoolName !== 'all' ? target.schoolName : 'global';
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
    setSignerModalOpen(true);
  };

  const handleConfirmDownloadPdf = async (useManualBlank: boolean = false) => {
    if (!signerTarget) return;

    const schoolKey = signerTarget.schoolName && signerTarget.schoolName !== 'all' ? signerTarget.schoolName : 'global';
    const signerInfo: SchoolSignerInfo = useManualBlank ? {} : {
      name: signerName.trim(),
      title: signerTitle.trim() || 'Koordinator BKK / Hubinmas',
      nip: signerNip.trim()
    };

    if (!useManualBlank && saveSignerPreference && signerName.trim()) {
      try {
        localStorage.setItem(`bkk_signer_${schoolKey}`, JSON.stringify({
          name: signerName.trim(),
          title: signerTitle.trim() || 'Koordinator BKK / Hubinmas',
          nip: signerNip.trim()
        }));
      } catch (e) {
        console.warn('Failed to save signer info to localStorage', e);
      }
    }

    setIsDownloadingPdf(true);
    try {
      if (signerTarget.type === 'collective') {
        await printCollectiveSchoolReport(signerTarget.schoolName, signerTarget.students || [], signerInfo);
      } else if (signerTarget.student) {
        await printIndividualStudentReport(signerTarget.student, signerInfo);
      }
      setSignerModalOpen(false);
    } catch (err) {
      console.error('Error downloading PDF report:', err);
    } finally {
      setIsDownloadingPdf(false);
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
            <span className="text-[10px] text-slate-400 font-semibold ml-0.5">({lastSyncTime})</span>
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

            <button
              onClick={() => {
                setAdminOldPassword('');
                setAdminNewPassword('');
                setAdminConfirmPassword('');
                setAdminPassStatus({ type: 'idle', message: '' });
                setIsAdminPasswordModalOpen(true);
              }}
              className={`p-1.5 px-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isDark 
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25' 
                  : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 shadow-xs'
              }`}
              title="Ganti Kata Sandi Super Admin"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline text-[11px]">Ganti Sandi</span>
            </button>

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
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ml-1.5 border ${
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

            {/* Group 2: Edukasi & Konten */}
            <div>
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block mb-2 text-left">
                  Konten Edukasi
                </span>
              )}
              <nav className="space-y-1">
                {[
                  { id: 'videos', label: 'Video Edukasi', icon: Video, badge: `${videoList.length}` },
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
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs' 
                            : 'bg-amber-50 text-amber-900 border border-amber-300 shadow-xs font-black'
                          : isDark 
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-850' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`flex items-center gap-2.5 ${isSidebarCollapsed ? 'justify-center' : 'text-left'}`}>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? (isDark ? 'text-amber-400' : 'text-amber-600') : 'text-slate-400'}`} />
                        {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isSidebarCollapsed && item.badge && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ml-1.5 border ${
                          isActive 
                            ? isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-amber-600 text-white border-amber-700' 
                            : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {item.badge}
                        </span>
                      )}

                      {isSidebarCollapsed && (
                        <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-amber-400' : 'bg-slate-600'}`} />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Group 3: Business & System */}
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
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ml-1.5 border ${
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
                <strong className="text-emerald-500 font-bold">{candidateListOnly.length} Siswa</strong>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Video Edukasi:</span>
                <strong className="text-amber-500 font-bold">{videoList.length} Materi</strong>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Database:</span>
                <strong className="text-sky-500 font-bold">MySQL Live</strong>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 py-1 px-1.5 rounded-lg block">
                {candidateListOnly.length}
              </span>
            </div>
          )}

        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
          
          {/* Mobile Top Tab Navigation Bar (Visible only on smartphones) */}
          <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shrink-0">
            {[
              { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
              { id: 'candidates', label: `Peserta (${candidateListOnly.length})`, icon: Users },
              { id: 'videos', label: `Video (${videoList.length})`, icon: Video },
              { id: 'questions', label: 'Bank Soal', icon: Database },
              { id: 'interview-ai', label: 'AI Interview', icon: Mic },
              { id: 'finance', label: 'Keuangan', icon: CreditCard },
              { id: 'system', label: 'Server', icon: Activity },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-xs'
                      : isDark
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          
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
                    <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{candidateListOnly.length}</span>
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
                    <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
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
                    <span className="text-2xl font-black text-purple-500">
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
                    <span className="text-2xl font-black text-emerald-500">78.5%</span>
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
                            <div className="text-[10px] text-sky-500 font-semibold">{cand.phone || cand.id}</div>
                          </td>
                          <td className="py-3.5">
                            <span className={`block font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{cand.school}</span>
                            <span className="text-[10px] text-slate-400">{cand.major}</span>
                          </td>
                          <td className="py-3.5">
                            <span className={`capitalize font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{cand.targetRole}</span>
                            <span className="block text-[10px] text-slate-400">{cand.targetCompany}</span>
                          </td>
                          <td className="py-3.5">
                            <span className="text-sky-500 font-bold">{cand.kraepelinScore?.panker || '-'}</span>
                            <span className="text-[10px] text-slate-400 block">{cand.kraepelinScore?.janker ? `${cand.kraepelinScore.janker}% akurat` : 'Belum tes'}</span>
                          </td>
                          <td className="py-3.5">
                            <span className="text-emerald-500 font-bold">{cand.qcAccuracy ? `${cand.qcAccuracy}%` : '-'}</span>
                          </td>
                          <td className="py-3.5">
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
              {/* Header Title & Collective Download Button */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Basis Data Peserta SMK / SMA
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-500/20 text-sky-500 border border-sky-500/30">
                      {filteredCandidates.length} {filteredCandidates.length !== candidateListOnly.length ? `dari ${candidateListOnly.length} ` : ''}Siswa
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Daftar seluruh siswa terdaftar di MySQL, riwayat tes psikometrik, dan tracking kesiapan interview kerja.
                  </p>
                </div>

                {/* Tombol Unduh Laporan Kegiatan Seleksi Kolektif PDF */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openSignerModal({
                      type: 'collective',
                      schoolName: selectedSchoolFilter,
                      students: filteredCandidates
                    })}
                    disabled={filteredCandidates.length === 0}
                    className="px-4 py-2.5 bg-gradient-to-r from-sky-600 via-sky-500 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-lg shadow-sky-500/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                    title="Unduh Laporan Rekapitulasi Kegiatan Seleksi (PDF)"
                  >
                    <FileText className="w-4 h-4 text-white" />
                    <span>
                      {selectedSchoolFilter === 'all' 
                        ? '📄 Unduh Laporan Rekapitulasi Kolektif (PDF)' 
                        : `📄 Unduh Laporan Seleksi [${selectedSchoolFilter}] (PDF)`}
                    </span>
                    <Download className="w-3.5 h-3.5 opacity-80 ml-0.5" />
                  </button>
                </div>
              </div>

              {/* Filter Toolbar */}
              <div className={`p-3.5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${
                isDark ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  
                  {/* Filter Asal Sekolah */}
                  <div className="flex items-center gap-1.5 min-w-[220px]">
                    <div className="relative w-full">
                      <Building2 className="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={selectedSchoolFilter}
                        onChange={(e) => setSelectedSchoolFilter(e.target.value)}
                        className={`w-full pl-9 pr-8 py-2 text-xs font-bold rounded-xl border outline-none appearance-none cursor-pointer ${
                          isDark 
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-sky-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
                        }`}
                      >
                        <option value="all">🏫 Semua Asal Sekolah ({candidateListOnly.length} Siswa)</option>
                        {schoolList.map(sch => {
                          const count = candidateListOnly.filter(c => c.school === sch).length;
                          return (
                            <option key={sch} value={sch}>
                              {sch} ({count} Siswa)
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Filter Target Posisi */}
                  <div className="flex items-center gap-1.5 min-w-[150px]">
                    <div className="relative w-full">
                      <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={selectedRoleFilter}
                        onChange={(e) => setSelectedRoleFilter(e.target.value)}
                        className={`w-full pl-8 pr-7 py-2 text-xs font-bold rounded-xl border outline-none appearance-none cursor-pointer ${
                          isDark 
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-sky-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
                        }`}
                      >
                        <option value="all">Semua Posisi</option>
                        <option value="operator">Operator</option>
                        <option value="qc">QC Inspector</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="logistics">Logistics</option>
                      </select>
                    </div>
                  </div>

                  {/* Pencarian Cepat */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchCandidate}
                      onChange={(e) => setSearchCandidate(e.target.value)}
                      placeholder="Cari nama, NIS, no WA, jurusan..."
                      className={`w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-xl border outline-none ${
                        isDark 
                          ? 'bg-slate-900 border-slate-700 text-white focus:border-sky-500 placeholder-slate-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500 placeholder-slate-400'
                      }`}
                    />
                  </div>

                </div>

                {/* Active Filter Indicators & Reset */}
                {(selectedSchoolFilter !== 'all' || selectedRoleFilter !== 'all' || searchCandidate) && (
                  <div className="flex items-center gap-2 self-end lg:self-center">
                    <span className="text-[11px] font-bold text-sky-400">
                      Filter aktif
                    </span>
                    <button
                      onClick={() => {
                        setSelectedSchoolFilter('all');
                        setSelectedRoleFilter('all');
                        setSearchCandidate('');
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>
                )}
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
                      <th className="p-4 text-right">Aksi & Rapor</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y font-medium ${isDark ? 'divide-slate-800/70' : 'divide-slate-100'}`}>
                    {filteredCandidates.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <GraduationCap className="w-10 h-10 mx-auto text-slate-500 mb-2 opacity-50" />
                          <p className="font-bold text-sm">Tidak ada peserta yang cocok dengan filter.</p>
                          <p className="text-xs text-slate-500 mt-1">Coba ubah pilihan sekolah atau kata kunci pencarian Anda.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredCandidates.map((c) => (
                        <tr key={c.id} className={`transition-colors ${isDark ? 'hover:bg-slate-850/50' : 'hover:bg-slate-50'}`}>
                          <td className="p-4">
                            <div className="text-[10px] text-slate-400 font-semibold">{c.id}</div>
                            <div className={`font-extrabold text-xs mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.name}</div>
                          </td>
                          <td className="p-4">
                            <span className={`block font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{c.school}</span>
                            <span className="text-[10px] text-slate-400">{c.major}</span>
                          </td>
                          <td className="p-4 text-sky-500 font-bold">{c.phone}</td>
                          <td className="p-4">
                            <span className={`font-bold capitalize ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{c.targetRole}</span>
                            <span className="block text-[10px] text-slate-400">{c.targetCompany}</span>
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                              c.overallStatus === 'Lolos Unggul' 
                                ? 'bg-emerald-500/20 text-emerald-500' 
                                : c.overallStatus === 'Lolos Standar'
                                  ? 'bg-blue-500/20 text-sky-500'
                                  : 'bg-amber-500/20 text-amber-500'
                            }`}>
                              {c.overallStatus}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Tombol Lihat Rapor Realtime */}
                              <button
                                onClick={() => handleOpenRaporModal(c)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                                }`}
                                title="Lihat Rapor Realtime & Analisis Nilai Lengkap"
                              >
                                <Eye className="w-3.5 h-3.5 text-sky-400" />
                                <span>Lihat Rapor</span>
                              </button>

                              {/* Tombol Download PDF Langsung */}
                              <button
                                onClick={() => openSignerModal({
                                  type: 'individual',
                                  student: c,
                                  schoolName: c.school
                                })}
                                className="px-2 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors flex items-center gap-1 font-bold text-xs cursor-pointer"
                                title="Unduh Rapor Siswa Berupa Dokumen PDF Resmi"
                              >
                                <Download className="w-3.5 h-3.5 text-red-500" />
                                <span>PDF</span>
                              </button>

                              {/* Tombol Hapus */}
                              <button
                                onClick={() => handleDeleteCandidate(c.id)}
                                className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-500 transition-colors cursor-pointer"
                                title="Hapus Data Peserta dari Database"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
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
                      <span className="text-xs text-sky-500 block mt-0.5 font-bold">{item.total}</span>
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
                      <span className="text-xs font-black text-emerald-500 bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/30">
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

          {/* TAB: MANAJEMEN VIDEO EDUKASI (CMS) */}
          {adminTab === 'videos' && (
            <div className="space-y-6">
              
              {/* Header CMS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      CMS Kurikulum Video
                    </span>
                  </div>
                  <h1 className={`text-xl sm:text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Manajemen Kumpulan Video Edukasi
                  </h1>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Kelola materi tutorial video seleksi (Kraepelin, Psikotes, Interview HRD, Budaya 5S, Fisik) yang tampil di aplikasi siswa.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshVideos}
                    className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
                    }`}
                    title="Segarkan Video"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>

                  <button
                    onClick={openAddVideoModal}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all transform active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Video Baru</span>
                  </button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className={`border rounded-2xl p-4 transition-colors ${
                  isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400">Total Video</span>
                  <div className="text-xl sm:text-2xl font-black text-amber-500 mt-1">{videoList.length} Video</div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Aktif di aplikasi</span>
                </div>

                <div className={`border rounded-2xl p-4 transition-colors ${
                  isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400">Video Unggulan</span>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
                    {videoList.filter(v => v.isFeatured).length} Video
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Banner Beranda</span>
                </div>

                <div className={`border rounded-2xl p-4 transition-colors ${
                  isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400">Kategori Materi</span>
                  <div className="text-xl sm:text-2xl font-black text-sky-500 mt-1">5 Modul</div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Kraepelin, Psikotes, dll</span>
                </div>

                <div className={`border rounded-2xl p-4 transition-colors ${
                  isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400">Total Penonton</span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-500 mt-1">190+ rb</div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Akumulasi tayangan</span>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {[
                    { id: 'all', label: 'Semua Video' },
                    ...categoryList.map(c => ({ id: c.id, label: c.label }))
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setVideoCatFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        videoCatFilter === tab.id
                          ? 'bg-amber-500 text-white shadow-xs'
                          : isDark
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={videoSearch}
                    onChange={(e) => setVideoSearch(e.target.value)}
                    placeholder="Cari video / pemateri..."
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none transition-all ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-amber-500 shadow-xs'
                    }`}
                  />
                </div>

              </div>

              {/* Video List Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {videoList
                  .filter(vid => {
                    const matchCat = videoCatFilter === 'all' || vid.category === videoCatFilter;
                    const matchSearch = (vid.title || '').toLowerCase().includes(videoSearch.toLowerCase()) ||
                                        (vid.description || '').toLowerCase().includes(videoSearch.toLowerCase()) ||
                                        (vid.speaker || '').toLowerCase().includes(videoSearch.toLowerCase());
                    return matchCat && matchSearch;
                  })
                  .map((video) => (
                    <div
                      key={video.id}
                      className={`border rounded-2xl overflow-hidden flex flex-col justify-between transition-all ${
                        isDark ? 'bg-[#0f172a] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      {/* Thumbnail & Badges */}
                      <div className={`relative w-full bg-slate-900 overflow-hidden group ${video.orientation === 'portrait' ? 'aspect-[4/5] sm:aspect-video' : 'aspect-video'}`}>
                        {video.sourceType === 'upload' && video.videoUrl ? (
                          <div className="w-full h-full bg-slate-950 flex items-center justify-center relative">
                            <video
                              src={video.videoUrl}
                              preload="metadata"
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                          </div>
                        ) : (
                          <img
                            src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          />
                        )}

                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setPreviewPlayingVideo(video)}
                            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all transform active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Preview Video</span>
                          </button>
                        </div>

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 max-w-[80%]">
                          {video.sourceType === 'upload' ? (
                            video.videoUrl?.startsWith('blob:') ? (
                              <span className="bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1 animate-pulse">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                <span>Perlu Upload Ulang</span>
                              </span>
                            ) : (
                              <span className="bg-sky-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                                <Upload className="w-2.5 h-2.5" />
                                <span>File Upload</span>
                              </span>
                            )
                          ) : (
                            <span className="bg-slate-900/90 backdrop-blur-xs text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-700">
                              YT: {video.youtubeId}
                            </span>
                          )}

                          {video.orientation === 'portrait' ? (
                            <span className="bg-purple-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                              <Smartphone className="w-2.5 h-2.5" />
                              <span>Vertikal 9:16</span>
                            </span>
                          ) : (
                            <span className="bg-slate-800/80 text-slate-300 font-bold text-[9px] px-1.5 py-0.5 rounded hidden sm:inline-flex items-center gap-0.5">
                              <Monitor className="w-2.5 h-2.5" />
                              <span>16:9</span>
                            </span>
                          )}

                          {video.badge && (
                            <span className="bg-amber-500 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded shadow-xs">
                              {video.badge}
                            </span>
                          )}
                        </div>

                        {/* Star / Featured Toggle Button */}
                        <button
                          onClick={() => toggleFeaturedStatus(video)}
                          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-all ${
                            video.isFeatured
                              ? 'bg-amber-500 text-white shadow-md'
                              : 'bg-black/60 text-slate-300 hover:text-white'
                          }`}
                          title={video.isFeatured ? 'Video Unggulan (Klik untuk lepas)' : 'Jadikan Video Unggulan'}
                        >
                          ★
                        </button>

                        {/* Duration */}
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[10px] font-bold rounded">
                          {video.duration}
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-semibold uppercase tracking-wider text-amber-500">
                              {video.category}
                            </span>
                            <span>{video.viewsCount} tayangan</span>
                          </div>

                          <h3 className={`text-sm font-extrabold leading-snug line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {video.title}
                          </h3>

                          <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {video.description}
                          </p>

                          <div className="pt-1 text-[11px] font-semibold text-slate-400">
                            Narasumber: <strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>{video.speaker}</strong>
                            {video.speakerRole && <span className="text-[10px] block text-slate-500">{video.speakerRole}</span>}
                          </div>
                        </div>

                        {/* Action Buttons Footer */}
                        <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
                          isDark ? 'border-slate-800' : 'border-slate-100'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setPreviewPlayingVideo(video)}
                              className={`p-1.5 rounded-lg border text-xs font-bold transition-colors flex items-center gap-1 ${
                                isDark ? 'bg-slate-800 border-slate-700 text-sky-400 hover:bg-slate-750' : 'bg-slate-100 border-slate-200 text-sky-700 hover:bg-slate-200'
                              }`}
                              title="Tonton Video"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span className="text-[11px]">Tonton</span>
                            </button>

                            {video.sourceType === 'youtube' && video.youtubeId ? (
                              <a
                                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                target="_blank"
                                rel="noreferrer"
                                className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center justify-center ${
                                  isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                                }`}
                                title="Buka di YouTube Web"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : video.videoUrl ? (
                              <a
                                href={video.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center justify-center ${
                                  isDark ? 'bg-slate-800 border-slate-700 text-sky-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-sky-600 hover:text-slate-900'
                                }`}
                                title="Buka File Video Langsung"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEditVideoModal(video)}
                              className={`p-1.5 rounded-lg border text-xs font-bold transition-colors flex items-center gap-1 ${
                                isDark ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-750' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                              }`}
                              title="Edit Detail Video"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteVideo(video.id, video.title)}
                              className={`p-1.5 rounded-lg border text-xs font-bold transition-colors flex items-center justify-center ${
                                isDark ? 'bg-red-950/40 border-red-900/40 text-red-400 hover:bg-red-900/60' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                              }`}
                              title="Hapus Video"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
              </div>

              {/* Empty state if search returns nothing */}
              {videoList.filter(vid => {
                const matchCat = videoCatFilter === 'all' || vid.category === videoCatFilter;
                const matchSearch = (vid.title || '').toLowerCase().includes(videoSearch.toLowerCase()) ||
                                    (vid.description || '').toLowerCase().includes(videoSearch.toLowerCase()) ||
                                    (vid.speaker || '').toLowerCase().includes(videoSearch.toLowerCase());
                return matchCat && matchSearch;
              }).length === 0 && (
                <div className={`border rounded-3xl p-10 text-center space-y-3 ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                }`}>
                  <Film className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="text-sm font-bold">Tidak ada video yang sesuai dengan pencarian atau filter kategori.</p>
                  <button
                    onClick={() => {
                      setVideoSearch('');
                      setVideoCatFilter('all');
                    }}
                    className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold"
                  >
                    Reset Filter
                  </button>
                </div>
              )}

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
                  <div className="text-2xl font-black text-emerald-500 mt-2">Rp 52.450.000</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Dari 1,480 pembayaran sukses</span>
                </div>

                <div className={`border rounded-2xl p-5 transition-colors ${
                  isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className="text-[11px] uppercase font-bold text-slate-400">Token AI Terjual</span>
                  <div className="text-2xl font-black text-purple-500 mt-2">3,890 Token</div>
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
                      <strong className="text-emerald-500 font-bold">115 ms (Optimal)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gemini LLM HRD Evaluator:</span>
                      <strong className="text-sky-500 font-bold">180 ms (Optimal)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Google Neural2 TTS Synthesizer:</span>
                      <strong className="text-emerald-500 font-bold">82 ms (Ultra Fast)</strong>
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
                      <strong className="text-emerald-500 font-bold">Connected (Port 3306)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Node.js API Service:</span>
                      <strong className="text-emerald-500 font-bold">Online (Port 5000)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Memory Usage:</span>
                      <strong className="text-sky-500 font-bold">245 MB / 2.0 GB (Very Light)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* CANDIDATE DETAIL REALTIME RAPOR MODAL */}
      {selectedCandidateModal && (() => {
        const cand = realtimeCandidateData || selectedCandidateModal;
        const compScore = calculateCompositeScore(cand);
        const isLolosUnggul = cand.overallStatus === 'Lolos Unggul';
        const isLolosStandar = cand.overallStatus === 'Lolos Standar';

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in overflow-y-auto">
            <div className={`border rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl space-y-5 my-6 max-h-[92vh] overflow-y-auto ${
              isDark ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              
              {/* Header Modal */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-500">
                      Rapor Kesiapan Kerja Siswa • MySQL Live Realtime
                    </span>
                    {isLoadingReport && (
                      <span className="flex items-center gap-1 text-[11px] text-sky-400 font-bold ml-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Memperbarui data...
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black mt-1 leading-tight flex items-center gap-2">
                    <span>{cand.name}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/30">
                      {cand.id}
                    </span>
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {cand.school} • Jurusan: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{cand.major}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => openSignerModal({
                      type: 'individual',
                      student: cand,
                      schoolName: cand.school
                    })}
                    className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs rounded-xl shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
                    title="Unduh Rapor Siswa dalam Format PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCandidateModal(null);
                      setRealtimeCandidateData(null);
                    }}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Profile & Status Card */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-1.5 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">No. WhatsApp</span>
                      <strong className="text-sky-500">{cand.phone}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Target Posisi</span>
                      <strong className="capitalize">{cand.targetRole}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Perusahaan Sasaran</span>
                      <strong className="text-amber-500 truncate block">{cand.targetCompany || 'Astra / Epson'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Fisik (Tinggi / Berat)</span>
                      <span>{cand.height ? `${cand.height} cm` : '168 cm'} / {cand.weight ? `${cand.weight} kg` : '58 kg'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Terdaftar Sejak</span>
                      <span>{new Date(cand.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Total Tes Dikerjakan</span>
                      <strong className="text-emerald-500">{cand.completedTestsCount || 12} Modul</strong>
                    </div>
                  </div>
                </div>

                {/* Status Box */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-4 border-slate-200 dark:border-slate-800 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Status Kelayakan</span>
                    <span className={`inline-block text-xs font-black px-3 py-1 rounded-lg mt-0.5 ${
                      isLolosUnggul 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : isLolosStandar
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {cand.overallStatus}
                    </span>
                  </div>
                  <div className="text-right mt-1 sm:mt-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Skor Komposit</span>
                    <div className="text-xl font-black text-sky-400">
                      {compScore} <span className="text-xs text-slate-400 font-medium">/ 100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5 Core Competency Score Cards Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-sky-400" />
                  <span>Rincian Nilai 5 Aspek Asesmen Industri</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {/* 1. Kraepelin */}
                  <div className={`border rounded-2xl p-3.5 space-y-1 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                      <span>1. Tes Kraepelin & Pauli</span>
                      <span className="text-sky-500 font-extrabold">Fisik & Ritme</span>
                    </div>
                    <div className="text-2xl font-black text-sky-400">
                      {cand.kraepelinScore?.panker ? (
                        <>
                          {cand.kraepelinScore.panker} <span className="text-[11px] font-bold text-slate-400">angk/mnt</span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-slate-400">Belum Tes</span>
                      )}
                    </div>
                    <div className="text-[11px] flex justify-between font-semibold text-slate-300">
                      <span>Ketelitian:</span>
                      <strong className={cand.kraepelinScore?.janker ? "text-emerald-400" : "text-slate-500"}>
                        {cand.kraepelinScore?.janker ? `${cand.kraepelinScore.janker}%` : '-'}
                      </strong>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                      Grade: <strong className={cand.kraepelinScore?.grade ? "text-emerald-400" : "text-slate-500"}>{cand.kraepelinScore?.grade || 'Belum Diuji'}</strong>
                    </div>
                  </div>

                  {/* 2. QC Accuracy */}
                  <div className={`border rounded-2xl p-3.5 space-y-1 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                      <span>2. Ketelitian Kode QC</span>
                      <span className="text-emerald-500 font-extrabold">Speed Match</span>
                    </div>
                    <div className="text-2xl font-black text-emerald-400">
                      {cand.qcAccuracy !== undefined && cand.qcAccuracy !== null ? (
                        `${cand.qcAccuracy}%`
                      ) : (
                        <span className="text-sm font-bold text-slate-400">Belum Tes</span>
                      )}
                    </div>
                    <div className="text-[11px] flex justify-between font-semibold text-slate-300">
                      <span>Deteksi Cacat (NG):</span>
                      <strong className={cand.qcAccuracy !== undefined && cand.qcAccuracy !== null ? "text-emerald-400" : "text-slate-500"}>
                        {cand.qcAccuracy !== undefined && cand.qcAccuracy !== null ? (cand.qcAccuracy >= 85 ? 'Presisi Tinggi' : 'Standar') : '-'}
                      </strong>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                      Standar: <strong className={cand.qcAccuracy !== undefined && cand.qcAccuracy !== null ? "text-slate-200" : "text-slate-500"}>
                        {cand.qcAccuracy !== undefined && cand.qcAccuracy !== null ? 'Lolos Kualifikasi QC' : 'Belum Diuji'}
                      </strong>
                    </div>
                  </div>

                  {/* 3. Matematika Terapan */}
                  <div className={`border rounded-2xl p-3.5 space-y-1 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                      <span>3. Matematika Terapan</span>
                      <span className="text-amber-500 font-extrabold">Hitung Cepat</span>
                    </div>
                    <div className="text-2xl font-black text-amber-400">
                      {cand.mathScore !== undefined && cand.mathScore !== null ? (
                        <>
                          {cand.mathScore} <span className="text-[11px] font-bold text-slate-400">/ 100</span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-slate-400">Belum Tes</span>
                      )}
                    </div>
                    <div className="text-[11px] flex justify-between font-semibold text-slate-300">
                      <span>Perkalian 2 Menit:</span>
                      <strong className={cand.multiplicationScore?.accuracy ? "text-sky-400" : "text-slate-500"}>
                        {cand.multiplicationScore?.accuracy ? `${cand.multiplicationScore.accuracy}%` : '-'}
                      </strong>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                      Kemampuan hitung: <strong className={cand.mathScore !== undefined && cand.mathScore !== null ? "text-slate-200" : "text-slate-500"}>
                        {cand.mathScore !== undefined && cand.mathScore !== null ? 'Teruji' : 'Belum Diuji'}
                      </strong>
                    </div>
                  </div>

                  {/* 4. Logika & Silogisme */}
                  <div className={`border rounded-2xl p-3.5 space-y-1 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                      <span>4. Psikotes Logika</span>
                      <span className="text-purple-500 font-extrabold">Penalaran SOP</span>
                    </div>
                    <div className="text-2xl font-black text-purple-400">
                      {cand.psychotestScore !== undefined && cand.psychotestScore !== null ? (
                        <>
                          {cand.psychotestScore} <span className="text-[11px] font-bold text-slate-400">/ 100</span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-slate-400">Belum Tes</span>
                      )}
                    </div>
                    <div className="text-[11px] flex justify-between font-semibold text-slate-300">
                      <span>Deduksi Aturan K3:</span>
                      <strong className={cand.psychotestScore !== undefined && cand.psychotestScore !== null ? "text-purple-400" : "text-slate-500"}>
                        {cand.psychotestScore !== undefined && cand.psychotestScore !== null ? 'Disiplin Tinggi' : '-'}
                      </strong>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-0.5 border-t border-slate-800/60 truncate">
                      Kepatuhan SOP: <strong className={cand.psychotestScore !== undefined && cand.psychotestScore !== null ? "text-slate-200" : "text-slate-500"}>
                        {cand.psychotestScore !== undefined && cand.psychotestScore !== null ? 'Sesuai Standar' : 'Belum Diuji'}
                      </strong>
                    </div>
                  </div>

                  {/* 5. AI Interview HRD */}
                  <div className={`border rounded-2xl p-3.5 space-y-1 sm:col-span-2 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                      <span>5. Simulasi Interview AI HRD</span>
                      <span className="text-emerald-400 font-extrabold">Peluang Lolos</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-emerald-400">
                        {cand.interviewScore !== undefined && cand.interviewScore !== null ? (
                          `${cand.interviewScore}%`
                        ) : (
                          <span className="text-sm font-bold text-slate-400">Belum Tes</span>
                        )}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {cand.interviewScore !== undefined && cand.interviewScore !== null ? 'Tingkat Keyakinan Tim Asesor' : ''}
                      </span>
                    </div>
                    {cand.interviewScore !== undefined && cand.interviewScore !== null ? (
                      <div className="grid grid-cols-4 gap-1 text-[10px] pt-1 font-bold text-center">
                        <div className="p-1 rounded bg-slate-800/60 text-slate-300">STAR: {cand.interviewRubric?.starScore || 85}%</div>
                        <div className="p-1 rounded bg-slate-800/60 text-slate-300">Artikulasi: {cand.interviewRubric?.vocalScore || 88}%</div>
                        <div className="p-1 rounded bg-slate-800/60 text-slate-300">Etika: {cand.interviewRubric?.ethicsScore || 95}%</div>
                        <div className="p-1 rounded bg-slate-800/60 text-slate-300">Job Fit: {cand.interviewRubric?.jobFitScore || 85}%</div>
                      </div>
                    ) : (
                      <div className="py-1 px-2 rounded bg-slate-800/40 text-slate-500 text-[10px] text-center">
                        Simulasi wawancara AI belum dilaksanakan
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Assessment Recommendation Box */}
              <div className={`border rounded-2xl p-4 space-y-2 text-xs ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-1.5 font-bold text-sky-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Rekomendasi Penempatan Kerja Asesor BKK:</span>
                </div>
                <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Kandidat memiliki stamina kerja dan konsistensi hitung di atas rata-rata. Direkomendasikan untuk posisi <strong>{cand.targetRole === 'qc' ? 'Quality Control (QC Inspector)' : cand.targetRole === 'maintenance' ? 'Maintenance Operator & Teknisi Mesin' : 'Operator Line Perakitan / Assembly'}</strong> di {cand.targetCompany || 'perusahaan mitra BKK'}.
                </p>
              </div>

              {/* Footer Modal Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-2 gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => handleDeleteCandidate(cand.id)}
                  className="px-4 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-500 rounded-xl text-xs font-bold transition-colors cursor-pointer w-full sm:w-auto"
                >
                  Hapus Data Peserta
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => openSignerModal({
                      type: 'individual',
                      student: cand,
                      schoolName: cand.school
                    })}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs rounded-xl shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer flex-1 sm:flex-none justify-center"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Rapor (PDF)</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCandidateModal(null);
                      setRealtimeCandidateData(null);
                    }}
                    className={`px-5 py-2 font-bold text-xs rounded-xl transition-colors cursor-pointer flex-1 sm:flex-none justify-center ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                    }`}
                  >
                    Tutup Rapor
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* MODAL 1: ADD / EDIT VIDEO FORM */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className={`border rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto ${
            isDark ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black leading-tight">
                    {editingVideo ? 'Edit Video Edukasi' : 'Tambah Video Edukasi Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Mendukung tautan YouTube atau file video langsung dari perangkat (Landscape & Vertikal).
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className={`p-1.5 rounded-xl transition-colors ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
              
              {/* Sumber Video Switcher (YouTube vs Upload File) */}
              <div>
                <label className="block font-bold mb-1.5 text-slate-400">
                  Pilih Sumber Video <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVideoForm({ ...videoForm, sourceType: 'youtube' })}
                    className={`p-3 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      videoForm.sourceType === 'youtube'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                        : isDark
                          ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>📺 Tautan / ID YouTube</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoForm({ ...videoForm, sourceType: 'upload' })}
                    className={`p-3 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      videoForm.sourceType === 'upload'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                        : isDark
                          ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>📁 Upload File Video</span>
                  </button>
                </div>
              </div>

              {/* Judul Video */}
              <div>
                <label className="block font-bold mb-1 text-slate-400">
                  Judul Video <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={e => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="Contoh: Trik Rahasia Tes Koran Kraepelin Nilai Grafik Stabil"
                  className={`w-full p-2.5 rounded-xl border outline-none font-semibold ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500'
                  }`}
                />
              </div>

              {/* Conditional Input: YouTube Link VS Upload File */}
              {videoForm.sourceType === 'youtube' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold mb-1 text-slate-400">
                      Link YouTube atau Video ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={videoForm.youtubeInput}
                      onChange={e => setVideoForm({ ...videoForm, youtubeInput: e.target.value })}
                      placeholder="https://youtu.be/qj8B35CqQ5Y atau qj8B35CqQ5Y"
                      className={`w-full p-2.5 rounded-xl border outline-none font-bold text-xs ${
                        isDark ? 'bg-slate-900 border-slate-700 text-amber-400 focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-amber-700 focus:border-amber-500'
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      ID YouTube Terdeteksi: <strong className="text-amber-500 font-bold">{extractYoutubeId(videoForm.youtubeInput) || '-'}</strong>
                    </span>
                  </div>

                  {extractYoutubeId(videoForm.youtubeInput) && (
                    <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
                      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <img
                        src={`https://img.youtube.com/vi/${extractYoutubeId(videoForm.youtubeInput)}/hqdefault.jpg`}
                        alt="Thumbnail Preview"
                        className="w-24 h-14 object-cover rounded-lg shrink-0 border"
                      />
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-emerald-500 font-bold uppercase">Thumbnail YouTube Valid</span>
                        <p className="text-[11px] text-slate-400">Video siap diputar di dalam aplikasi (in-app embedded player).</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block font-bold mb-1 text-slate-400">
                    File Video dari Perangkat (MP4, WebM, MOV, dll) <span className="text-red-500">*</span>
                  </label>

                  <div className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                    isDark ? 'border-slate-700 bg-slate-900/40 hover:border-amber-500/50' : 'border-slate-300 bg-slate-50/50 hover:border-amber-400'
                  }`}>
                    <input
                      type="file"
                      id="video-file-upload"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      onChange={handleVideoFileSelected}
                      className="hidden"
                    />

                    {isUploadingVideo ? (
                      <div className="py-4 space-y-2 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                        <span className="font-bold text-amber-500 text-xs">Sedang Mengunggah & Menganalisis Video...</span>
                        <p className="text-[10px] text-slate-400">Mendeteksi dimensi, orientasi (landscape/vertikal) dan durasi otomatis.</p>
                      </div>
                    ) : (
                      <label htmlFor="video-file-upload" className="cursor-pointer block space-y-2">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-extrabold text-amber-500 hover:underline">
                            Klik di sini untuk memilih file video
                          </span>
                          <span className="text-slate-400 block text-[11px] mt-0.5">
                            Maksimal ukuran 100 MB. Mendukung video Landscape maupun Vertikal (Shorts / Reels).
                          </span>
                        </div>
                      </label>
                    )}
                  </div>

                  {uploadVideoError && (
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{uploadVideoError}</span>
                    </div>
                  )}

                  {videoForm.videoUrl && (
                    <div className={`p-3 rounded-2xl border space-y-2 ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-emerald-50/60 border-emerald-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>File Video Siap Diputar</span>
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 truncate max-w-[200px]">
                          {videoForm.videoUrl}
                        </span>
                      </div>

                      <div className="relative rounded-xl overflow-hidden bg-black max-h-48 flex items-center justify-center">
                        <video
                          src={videoForm.videoUrl}
                          controls
                          className="max-h-48 w-auto mx-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orientasi Video Selector (Landscape VS Portrait) */}
              <div>
                <label className="block font-bold mb-1.5 text-slate-400">
                  Orientasi Tampilan Video <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVideoForm({ ...videoForm, orientation: 'landscape' })}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      videoForm.orientation === 'landscape'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-500 ring-1 ring-amber-500'
                        : isDark
                          ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${videoForm.orientation === 'landscape' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold leading-none">🖥️ Landscape (16:9)</strong>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Format standar horizontal</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoForm({ ...videoForm, orientation: 'portrait' })}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      videoForm.orientation === 'portrait'
                        ? 'bg-purple-500/15 border-purple-500 text-purple-500 ring-1 ring-purple-500'
                        : isDark
                          ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${videoForm.orientation === 'portrait' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold leading-none">📱 Portrait (9:16)</strong>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Format vertikal / Shorts / TikTok</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Kategori Modul */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-400">
                    Kategori Modul <span className="text-red-500">*</span>
                  </label>
                  {!isCustomCategory ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(true);
                        setCustomCategoryName('');
                      }}
                      className="text-[11px] font-bold text-amber-500 hover:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Kategori Baru</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(false);
                        setVideoForm({ ...videoForm, category: categoryList[0]?.id || 'kraepelin' });
                      }}
                      className="text-[11px] font-bold text-slate-400 hover:text-slate-300 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Pilih dari Daftar</span>
                    </button>
                  )}
                </div>

                {!isCustomCategory ? (
                  <select
                    value={videoForm.category}
                    onChange={e => {
                      if (e.target.value === '__new__') {
                        setIsCustomCategory(true);
                        setCustomCategoryName('');
                      } else {
                        setVideoForm({ ...videoForm, category: e.target.value });
                      }
                    }}
                    className={`w-full p-2.5 rounded-xl border outline-none font-bold ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    {categoryList.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                    <option value="__new__" className="text-amber-500 font-bold">+ Tambah Kategori Baru...</option>
                  </select>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      autoFocus
                      value={customCategoryName}
                      onChange={e => setCustomCategoryName(e.target.value)}
                      placeholder="Ketik nama kategori baru (contoh: Tes Buta Warna Ishihara)"
                      className={`w-full p-2.5 rounded-xl border outline-none font-bold ${
                        isDark ? 'bg-slate-900 border-amber-500 text-amber-400 focus:ring-1 focus:ring-amber-500' : 'bg-amber-50 border-amber-400 text-amber-900 focus:ring-1 focus:ring-amber-400'
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 block">Kategori baru akan otomatis ditambahkan ke daftar filter aplikasi.</span>
                  </div>
                )}
              </div>

              {/* Speaker & Durasi Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-400">Nama Pemateri / Mentor</label>
                  <input
                    type="text"
                    required
                    value={videoForm.speaker}
                    onChange={e => setVideoForm({ ...videoForm, speaker: e.target.value })}
                    placeholder="Contoh: Kak Budi Hartono"
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-400">Jabatan / Peran</label>
                  <input
                    type="text"
                    value={videoForm.speakerRole}
                    onChange={e => setVideoForm({ ...videoForm, speakerRole: e.target.value })}
                    placeholder="Contoh: Praktisi Rekrutmen BKK"
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-400">Durasi Video</label>
                  <input
                    type="text"
                    value={videoForm.duration}
                    onChange={e => setVideoForm({ ...videoForm, duration: e.target.value })}
                    placeholder="Contoh: 12:45"
                    className={`w-full p-2.5 rounded-xl border outline-none font-bold ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Badge & Views & Featured Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-400">Label Badge (Opsional)</label>
                  <input
                    type="text"
                    value={videoForm.badge}
                    onChange={e => setVideoForm({ ...videoForm, badge: e.target.value })}
                    placeholder="Wajib Tonton / Populer / Baru"
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-400">Estimasi Penonton</label>
                  <input
                    type="text"
                    value={videoForm.viewsCount}
                    onChange={e => setVideoForm({ ...videoForm, viewsCount: e.target.value })}
                    placeholder="Contoh: 35.6 rb"
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={videoForm.isFeatured}
                      onChange={e => setVideoForm({ ...videoForm, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span className="font-bold text-xs text-amber-500">★ Video Unggulan (Banner)</span>
                  </label>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block font-bold mb-1 text-slate-400">Ringkasan Materi / Deskripsi</label>
                <textarea
                  rows={2}
                  value={videoForm.description}
                  onChange={e => setVideoForm({ ...videoForm, description: e.target.value })}
                  placeholder="Jelaskan poin apa saja yang dibahas dalam video tutorial ini..."
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Key Takeaways */}
              <div>
                <label className="block font-bold mb-1 text-slate-400">
                  Poin Kunci yang Wajib Diingat (1 baris per poin)
                </label>
                <textarea
                  rows={3}
                  value={videoForm.keyTakeawaysText}
                  onChange={e => setVideoForm({ ...videoForm, keyTakeawaysText: e.target.value })}
                  placeholder="Jangan terlalu cepat di awal kolom kraepelin.&#10;Tulis hanya angka satuan hasil penjumlahan.&#10;Jaga grafik tetap datar atau naik tipis."
                  className={`w-full p-2.5 rounded-xl border outline-none font-sans ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className={`px-4 py-2 font-bold rounded-xl transition-colors ${
                    isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isUploadingVideo}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md shadow-amber-500/20 transition-all transform active:scale-95 flex items-center gap-1.5"
                >
                  {isUploadingVideo && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingVideo ? 'Simpan Perubahan' : 'Terbitkan Video'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: IN-APP ADMIN VIDEO PLAYER PREVIEW */}
      {previewPlayingVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in overflow-y-auto">
          <div className={`w-full rounded-3xl border shadow-2xl overflow-hidden flex flex-col justify-between my-auto transition-all ${
            previewPlayingVideo.orientation === 'portrait' ? 'max-w-md max-h-[92vh]' : 'max-w-3xl max-h-[92vh]'
          } ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  Pratinjau Video ({previewPlayingVideo.orientation === 'portrait' ? '📱 Vertikal' : '🖥️ Landscape'})
                </span>
              </div>
              <button
                onClick={() => setPreviewPlayingVideo(null)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display */}
            <div className={`relative w-full bg-black flex items-center justify-center overflow-hidden ${
              previewPlayingVideo.orientation === 'portrait' ? 'aspect-[9/16] max-h-[62vh]' : 'aspect-video'
            }`}>
              {previewPlayingVideo.sourceType === 'upload' && previewPlayingVideo.videoUrl ? (
                <video
                  src={previewPlayingVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${previewPlayingVideo.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
                  title={previewPlayingVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            <div className="p-4 space-y-2 text-xs overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold line-clamp-1">{previewPlayingVideo.title}</h3>
                <span className="text-amber-500 font-bold">{previewPlayingVideo.duration}</span>
              </div>
              <p className="text-slate-400 leading-relaxed line-clamp-2">{previewPlayingVideo.description}</p>
              <div className="text-[11px] text-slate-400 pt-1">
                Narasumber: <strong className="text-slate-200">{previewPlayingVideo.speaker}</strong> ({previewPlayingVideo.speakerRole})
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: SUPER ADMIN CHANGE PASSWORD MODAL */}
      {isAdminPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className={`border rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-5 my-8 relative ${
            isDark ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold leading-tight">Ganti Kata Sandi Admin</h3>
                  <p className="text-[11px] text-slate-400">Akun Super Administrator</p>
                </div>
              </div>

              <button
                onClick={() => setIsAdminPasswordModalOpen(false)}
                className={`p-1.5 rounded-xl transition-colors ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Alert */}
            {adminPassStatus.type !== 'idle' && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                adminPassStatus.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : adminPassStatus.type === 'error'
                    ? 'bg-red-500/15 border-red-500/30 text-red-400'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              }`}>
                {adminPassStatus.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                {adminPassStatus.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
                {adminPassStatus.type === 'loading' && <RefreshCw className="w-4 h-4 text-amber-500 shrink-0 animate-spin" />}
                <span>{adminPassStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleChangeAdminPassword} className="space-y-3.5 text-xs">
              
              {/* Kata Sandi Saat Ini */}
              <div>
                <label className="block font-bold mb-1 text-slate-400">
                  Kata Sandi Saat Ini <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    required
                    value={adminOldPassword}
                    onChange={e => setAdminOldPassword(e.target.value)}
                    placeholder="Masukkan kata sandi lama Anda"
                    className={`w-full pl-3 pr-10 py-2.5 rounded-xl border outline-none font-sans text-xs ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Kata Sandi Baru */}
              <div>
                <label className="block font-bold mb-1 text-slate-400">
                  Kata Sandi Baru <span className="text-red-500">*</span> (Minimal 6 karakter)
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={adminNewPassword}
                    onChange={e => setAdminNewPassword(e.target.value)}
                    placeholder="Masukkan kata sandi baru"
                    className={`w-full pl-3 pr-10 py-2.5 rounded-xl border outline-none font-sans text-xs ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Kata Sandi Baru */}
              <div>
                <label className="block font-bold mb-1 text-slate-400">
                  Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={adminConfirmPassword}
                    onChange={e => setAdminConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    className={`w-full pl-3 pr-10 py-2.5 rounded-xl border outline-none font-sans text-xs ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdminPasswordModalOpen(false)}
                  className={`px-4 py-2 font-bold rounded-xl transition-colors ${
                    isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={adminPassStatus.type === 'loading'}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold rounded-xl shadow-md shadow-amber-500/20 transition-all transform active:scale-95 disabled:opacity-50"
                >
                  {adminPassStatus.type === 'loading' ? 'Menyimpan...' : 'Simpan Kata Sandi'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL PENGESAHAN TANDA TANGAN DOKUMEN PDF */}
      {signerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50/80'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">Pengesahan Dokumen PDF</h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Data pihak sekolah untuk lembar tanda tangan & validasi resmi
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isDownloadingPdf && setSignerModalOpen(false)}
                disabled={isDownloadingPdf}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Context Info */}
            <div className="p-5 space-y-4">
              <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
                isDark ? 'bg-sky-500/10 border-sky-500/20 text-sky-300' : 'bg-sky-50 border-sky-200 text-sky-800'
              }`}>
                <Building2 className="w-5 h-5 shrink-0 text-sky-500" />
                <div className="text-xs">
                  <span className="font-bold">Dokumen Tujuan: </span>
                  {signerTarget?.type === 'collective' 
                    ? `Laporan Kolektif Seleksi (${signerTarget.schoolName === 'all' ? 'Seluruh Sekolah Mitra' : signerTarget.schoolName})` 
                    : `Rapor Individual: ${signerTarget?.student?.name} (${signerTarget?.schoolName || 'Siswa'})`}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold mb-1.5 flex items-center justify-between">
                    <span>Nama Lengkap Pihak Sekolah / Pejabat</span>
                    <span className="text-[10px] font-normal text-slate-400">(dengan gelar)</span>
                  </label>
                  <input
                    type="text"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Contoh: Drs. H. Mulyadi, M.Pd"
                    disabled={isDownloadingPdf}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all focus:ring-2 focus:ring-sky-500 focus:outline-none ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                    }`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Nama ini akan dicantumkan di atas jabatan pada lembar tanda tangan.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    Jabatan / Posisi di Sekolah
                  </label>
                  <input
                    type="text"
                    value={signerTitle}
                    onChange={(e) => setSignerTitle(e.target.value)}
                    placeholder="Contoh: Koordinator BKK & Hubinmas"
                    disabled={isDownloadingPdf}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all focus:ring-2 focus:ring-sky-500 focus:outline-none ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                    }`}
                  />
                  {/* Quick Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      'Koordinator BKK & Hubinmas',
                      'Kepala Sekolah',
                      'Ketua Bursa Kerja Khusus (BKK)'
                    ].map((titleOption) => (
                      <button
                        key={titleOption}
                        type="button"
                        onClick={() => setSignerTitle(titleOption)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                          signerTitle === titleOption
                            ? 'bg-sky-500 text-white border-sky-500'
                            : isDark
                            ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {titleOption}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 flex items-center justify-between">
                    <span>NIP / NUPTK (Opsional)</span>
                    <span className="text-[10px] font-normal text-slate-400">Bisa dikosongkan</span>
                  </label>
                  <input
                    type="text"
                    value={signerNip}
                    onChange={(e) => setSignerNip(e.target.value)}
                    placeholder="Contoh: 19780512 200501 1 003"
                    disabled={isDownloadingPdf}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all focus:ring-2 focus:ring-sky-500 focus:outline-none ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                    }`}
                  />
                </div>

                {/* Auto-save preference */}
                <label className="flex items-center gap-2 cursor-pointer pt-1 select-none">
                  <input
                    type="checkbox"
                    checked={saveSignerPreference}
                    onChange={(e) => setSaveSignerPreference(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
                  />
                  <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Ingat & simpan nama ini untuk <strong>{signerTarget?.schoolName && signerTarget.schoolName !== 'all' ? signerTarget.schoolName : 'sekolah mitra'}</strong> (otomatis terisi berikutnya)
                  </span>
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2.5 ${
              isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-slate-50/90'
            }`}>
              <button
                type="button"
                onClick={() => handleConfirmDownloadPdf(true)}
                disabled={isDownloadingPdf}
                className={`w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isDark 
                    ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`}
                title="Cetak format garis titik-titik untuk tanda tangan manual di atas kertas"
              >
                Cetak Format Manual (Titik-Titik)
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setSignerModalOpen(false)}
                  disabled={isDownloadingPdf}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmDownloadPdf(false)}
                  disabled={isDownloadingPdf}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-sky-600 via-sky-500 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isDownloadingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Menyiapkan Dokumen...</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-4 h-4 text-white" />
                      <span>Cetak / Simpan PDF Resmi</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
