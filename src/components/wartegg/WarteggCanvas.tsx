import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Pencil, 
  Eraser, 
  RotateCcw, 
  Undo2,
  Download, 
  Info, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Eye,
  ArrowLeft,
  ArrowRight,
  Grid,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  FileText,
  Lightbulb,
  AlertTriangle,
  PenTool,
  BookmarkPlus,
  History,
  Trash2,
  FolderOpen,
  Calendar,
  Check,
  PlusCircle
} from 'lucide-react';
import { getActiveSession } from '../../utils/auth-storage';

interface WarteggBoxGuide {
  id: number;
  title: string;
  stimulus: string;
  category: 'Organik (Hidup)' | 'Anorganik (Benda/Teknis)';
  meaning: string;
  psychologicalAspect: string;
  idealDrawings: string[];
  tabooDrawings: string[];
  executionTips: string;
}

interface WarteggSessionHistory {
  id: string;
  sessionName: string;
  savedAt: string;
  completedCount: number;
  snapshots: Record<number, string | null>;
  titles: Record<number, string>;
  hasDrawn: Record<number, boolean>;
}

const warteggGuides: WarteggBoxGuide[] = [
  {
    id: 1,
    title: 'Kotak 1: Titik Pusat (.)',
    stimulus: 'Titik kecil di tengah bidang',
    category: 'Organik (Hidup)',
    meaning: 'Pusat ego, adaptasi lingkungan baru, dan kepercayaan diri.',
    psychologicalAspect: 'Mengukur bagaimana Anda memposisikan diri di tengah lingkungan kerja dan rekan baru.',
    idealDrawings: ['Titik pusat bunga matahari', 'Pusat bidikan panah (Bullseye)', 'Matahari terbit dengan sinar rapi', 'Jam dinding bulat dengan jarum'],
    tabooDrawings: ['Mengabaikan titik atau menenggelamkannya menjadi benda mati tak bermakna', 'Membuat titik menjadi sangat hitam berantakan'],
    executionTips: 'Jadikan titik tersebut sebagai inti/pusat dari objek yang hidup atau dinamis.'
  },
  {
    id: 2,
    title: 'Kotak 2: Garis Lengkung (~)',
    stimulus: 'Garis lengkung kecil dinamis di kiri atas',
    category: 'Organik (Hidup)',
    meaning: 'Fleksibilitas perasaan, empati emosi, dan interaksi sosial.',
    psychologicalAspect: 'Mengukur kehangatan, keramahan, dan kemampuan berkomunikasi dalam tim.',
    idealDrawings: ['Burung yang sedang terbang', 'Gelombang air laut / lumba-lumba', 'Pohon kelapa meliuk alami', 'Ikan berenang'],
    tabooDrawings: ['Benda mati kaku bergaris patah-patah (misal: pipa besi, kawat kaku)'],
    executionTips: 'Gunakan tarikan garis yang luwes, jangan kaku atau patah.'
  },
  {
    id: 3,
    title: 'Kotak 3: 3 Garis Vertikal Menaik (|||)',
    stimulus: 'Tiga garis tegak lurus makin tinggi berurutan',
    category: 'Anorganik (Benda/Teknis)',
    meaning: 'Ambisi karier, kemauan maju, dan konsistensi pengembangan diri.',
    psychologicalAspect: 'Mengukur orientasi target, kepatuhan struktur, dan semangat pencapaian prestasi.',
    idealDrawings: ['Grafik pertumbuhan performa kerja', 'Gedung pencakar langit berurutan', 'Tiang bendera dengan podium', 'Pagar modern berundak rapi'],
    tabooDrawings: ['Menggambar garis menurun ke bawah', 'Memutus ketiga garis atau membiarkannya menggantung'],
    executionTips: 'Teruskan pola kenaikan ke atas secara stabil untuk menunjukkan ambisi positif.'
  },
  {
    id: 4,
    title: 'Kotak 4: Kotak Hitam Kecil (■)',
    stimulus: 'Bujur sangkar hitam padat di pojok kanan atas',
    category: 'Anorganik (Benda/Teknis)',
    meaning: 'Cara menghadapi tekanan (stres), kesulitan, dan problem solving.',
    psychologicalAspect: 'Mengukur ketenangan menghadapi masalah rumit atau deadline kerja yang ketat.',
    idealDrawings: ['Papan catur dengan bidak', 'Jendela gedung bertingkat', 'Cerobong asap pabrik / cerobong kapal', 'Saklar lampu / panel kontrol mesin'],
    tabooDrawings: ['Mewarnai seluruh kotak menjadi hitam kelam (indikasi depresi/stres berat)', 'Membuat gambar seram'],
    executionTips: 'Integrasikan kotak hitam sebagai bagian dari konstruksi yang fungsional dan teratur.'
  },
  {
    id: 5,
    title: 'Kotak 5: Dua Garis Saling Hadap (T)',
    stimulus: 'Dua garis tegak dengan sudut saling hadap',
    category: 'Anorganik (Benda/Teknis)',
    meaning: 'Daya juang, dorongan bertindak (drive), dan penyelesaian masalah teknis.',
    psychologicalAspect: 'Mengukur inisiatif, energi kerja, dan kemampuan mengatasi hambatan mekanikal.',
    idealDrawings: ['Lampu penerangan jalan (PJU)', 'Dayung perahu / kano', 'Jarum suntik medis / pipet laboratorium', 'Kunci pas / obeng / alat pertukangan'],
    tabooDrawings: ['Menghubungkan kedua garis tanpa ada fungsi alat yang jelas', 'Garis dibuat tumpul tak bertenaga'],
    executionTips: 'Tarik garis tegas dan kokoh yang menggambarkan alat kerja atau instrumen aktif.'
  },
  {
    id: 6,
    title: 'Kotak 6: Dua Garis Terpisah (— |)',
    stimulus: 'Garis horizontal dan garis vertikal terpisah',
    category: 'Anorganik (Benda/Teknis)',
    meaning: 'Logika berpikir, sintesis analisis, dan orientasi fakta.',
    psychologicalAspect: 'Mengukur kecerdasan praktis dalam menyatukan dua informasi terpisah menjadi satu solusi utuh.',
    idealDrawings: ['Kamera foto / lensa', 'Televisi / Monitor PC / Layar HMI', 'Rumah tinggal / denah arsitektur', 'Mobil / forklift pabrik'],
    tabooDrawings: ['Menggambar objek organik tanpa struktur atau bentuk tidak simetris'],
    executionTips: 'Satukan kedua garis tersebut ke dalam satu kesatuan struktur geometri yang utuh.'
  },
  {
    id: 7,
    title: 'Kotak 7: Titik-titik Melengkung (..)',
    stimulus: 'Kumpulan titik halus membentuk lengkungan',
    category: 'Organik (Hidup)',
    meaning: 'Kehalusan etika, stabilitas emosi, ketelitian, dan rasa keindahan.',
    psychologicalAspect: 'Mengukur kehati-hatian, kepatuhan etika, dan kepekaan rasa dalam berinteraksi.',
    idealDrawings: ['Kalung mutiara / perhiasan', 'Ulat lucu di atas daun', 'Ritsleting pakaian rapi', 'Bunga melati / rangkaian anggrek'],
    tabooDrawings: ['Menimpa titik-titik halus dengan garis tebal kasar atau mencoretnya'],
    executionTips: 'Sentuh titik-titik tersebut dengan halus dan teliti agar kesan keanggunan tetap terjaga.'
  },
  {
    id: 8,
    title: 'Kotak 8: Lengkungan Busur Payung (⌒)',
    stimulus: 'Garis lengkung cembung lebar di bagian atas',
    category: 'Organik (Hidup)',
    meaning: 'Kebijaksanaan, rasa aman, dan kepatuhan terhadap norma / aturan perusahaan.',
    psychologicalAspect: 'Mengukur kedewasaan sosial, kebutuhan akan perlindungan, dan loyalitas terhadap aturan.',
    idealDrawings: ['Payung pelindung hujan', 'Kubah gedung / masjid megah', 'Pintu gerbang pabrik dengan gapura', 'Helm keselamatan kerja (Safety Helmet K3)'],
    tabooDrawings: ['Gambar tidak memiliki penopang kokoh di bagian bawah atau tampak melayang rapuh'],
    executionTips: 'Berikan dasar atau tiang penopang yang kokoh di bawah lengkungan tersebut.'
  }
];

export const WarteggCanvas: React.FC = () => {
  const activeUser = getActiveSession();
  const userId = activeUser?.id || 'guest_user';
  const DRAFT_STORAGE_KEY = `siapkerja_wartegg_draft_${userId}`;
  const HISTORY_STORAGE_KEY = `siapkerja_wartegg_history_${userId}`;

  // Navigation & View State
  const [currentView, setCurrentView] = useState<'grid' | 'focus'>('grid');
  const [activeBoxId, setActiveBoxId] = useState<number>(1);
  const [activeGuideTab, setActiveGuideTab] = useState<'practice' | 'history' | 'guide'>('practice');

  // Drawing Tools State
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [pencilColor, setPencilColor] = useState<string>('#0f172a');

  // User input per box (Nama Gambar)
  const [boxTitles, setBoxTitles] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.titles) return parsed.titles;
      }
    } catch (e) {
      console.error('Failed to load wartegg titles draft', e);
    }
    return { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '' };
  });

  // Track if user actually made drawing on this box
  const [boxHasDrawn, setBoxHasDrawn] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.hasDrawn) return parsed.hasDrawn;
      }
    } catch (e) {
      console.error('Failed to load wartegg hasDrawn draft', e);
    }
    return { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };
  });

  // Canvas Snapshots storage (Base64 for all 8 boxes)
  const [boxSnapshots, setBoxSnapshots] = useState<Record<number, string | null>>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.snapshots) return parsed.snapshots;
      }
    } catch (e) {
      console.error('Failed to load wartegg snapshots draft', e);
    }
    return { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null };
  });

  // Saved Session Histories
  const [histories, setHistories] = useState<WarteggSessionHistory[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load wartegg histories', e);
    }
    return [];
  });

  // Save Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [saveSessionName, setSaveSessionName] = useState<string>('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // History for Undo per box
  const boxHistories = useRef<Record<number, string[]>>({
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: []
  });

  // Canvas Refs
  const focusCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Save draft to localStorage whenever snapshots, titles, or hasDrawn change
  useEffect(() => {
    try {
      const draftData = {
        snapshots: boxSnapshots,
        titles: boxTitles,
        hasDrawn: boxHasDrawn,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
    } catch (e) {
      console.error('Failed to save wartegg draft', e);
    }
  }, [boxSnapshots, boxTitles, boxHasDrawn, DRAFT_STORAGE_KEY]);

  // Save history to localStorage
  const saveHistoriesToStorage = (newHistories: WarteggSessionHistory[]) => {
    setHistories(newHistories);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistories));
    } catch (e) {
      console.error('Failed to save wartegg history', e);
    }
  };

  // Helper: Draw the original stimulus for a given box
  const drawStimulus = useCallback((ctx: CanvasRenderingContext2D, boxId: number, size: number) => {
    ctx.save();
    ctx.strokeStyle = '#0f172a';
    ctx.fillStyle = '#0f172a';
    ctx.lineWidth = Math.max(2, size * 0.012);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const w = size;
    const h = size;

    switch (boxId) {
      case 1: // Dot in center
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, size * 0.018, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 2: // Curve top left
        ctx.beginPath();
        ctx.moveTo(w * 0.22, h * 0.28);
        ctx.bezierCurveTo(w * 0.32, h * 0.22, w * 0.28, h * 0.44, w * 0.42, h * 0.38);
        ctx.stroke();
        break;
      case 3: // 3 vertical ascending lines
        ctx.beginPath();
        ctx.moveTo(w * 0.35, h * 0.72);
        ctx.lineTo(w * 0.35, h * 0.56);
        ctx.moveTo(w * 0.45, h * 0.72);
        ctx.lineTo(w * 0.45, h * 0.45);
        ctx.moveTo(w * 0.55, h * 0.72);
        ctx.lineTo(w * 0.55, h * 0.34);
        ctx.stroke();
        break;
      case 4: // Black small square top right
        const sqSize = size * 0.065;
        ctx.fillRect(w * 0.68, h * 0.22, sqSize, sqSize);
        break;
      case 5: // 2 perpendicular lines facing each other
        ctx.beginPath();
        ctx.moveTo(w * 0.28, h * 0.68);
        ctx.lineTo(w * 0.45, h * 0.51);
        ctx.moveTo(w * 0.62, h * 0.34);
        ctx.lineTo(w * 0.45, h * 0.51);
        ctx.stroke();
        break;
      case 6: // Horizontal and vertical lines
        ctx.beginPath();
        ctx.moveTo(w * 0.28, h * 0.42);
        ctx.lineTo(w * 0.54, h * 0.42);
        ctx.moveTo(w * 0.65, h * 0.26);
        ctx.lineTo(w * 0.65, h * 0.58);
        ctx.stroke();
        break;
      case 7: // Dotted curve
        const dots = [
          { x: w * 0.42, y: h * 0.68 },
          { x: w * 0.48, y: h * 0.64 },
          { x: w * 0.54, y: h * 0.66 },
          { x: w * 0.60, y: h * 0.72 }
        ];
        dots.forEach(d => {
          ctx.beginPath();
          ctx.arc(d.x, d.y, size * 0.012, 0, Math.PI * 2);
          ctx.fill();
        });
        break;
      case 8: // Large arc
        ctx.beginPath();
        ctx.arc(w / 2, h * 0.38, size * 0.18, Math.PI * 0.12, Math.PI * 0.88, true);
        ctx.stroke();
        break;
    }
    ctx.restore();
  }, []);

  // Initialize focus canvas when entering focus mode or switching box
  const initFocusCanvas = useCallback((boxId: number) => {
    const canvas = focusCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution setup (500x500 internal resolution)
    const size = 500;
    canvas.width = size;
    canvas.height = size;

    const existingSnapshot = boxSnapshots[boxId];
    if (existingSnapshot && boxHasDrawn[boxId]) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
      };
      img.src = existingSnapshot;
      boxHistories.current[boxId] = [existingSnapshot];
    } else {
      // Clear with clean white background and draw initial stimulus
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      drawStimulus(ctx, boxId, size);
      
      const baseSnapshot = canvas.toDataURL('image/png');
      boxHistories.current[boxId] = [baseSnapshot];
      // Do NOT set boxHasDrawn to true here! It remains false until user actually strokes.
    }
  }, [boxSnapshots, boxHasDrawn, drawStimulus]);

  useEffect(() => {
    if (currentView === 'focus') {
      const timer = setTimeout(() => {
        initFocusCanvas(activeBoxId);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentView, activeBoxId, initFocusCanvas]);

  // Open single-box focus view
  const handleOpenFocusBox = (boxId: number) => {
    setActiveBoxId(boxId);
    setCurrentView('focus');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to overview grid
  const handleBackToGrid = () => {
    saveCurrentCanvasSnapshot();
    setCurrentView('grid');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch to previous / next box in focus mode
  const handleNavigateBox = (direction: 'prev' | 'next') => {
    saveCurrentCanvasSnapshot();
    if (direction === 'prev' && activeBoxId > 1) {
      setActiveBoxId(activeBoxId - 1);
    } else if (direction === 'next' && activeBoxId < 8) {
      setActiveBoxId(activeBoxId + 1);
    }
  };

  // Save current canvas state
  const saveCurrentCanvasSnapshot = () => {
    const canvas = focusCanvasRef.current;
    if (!canvas) return;
    if (boxHasDrawn[activeBoxId]) {
      const dataUrl = canvas.toDataURL('image/png');
      setBoxSnapshots(prev => ({ ...prev, [activeBoxId]: dataUrl }));
    }
  };

  // Get touch or mouse coordinates scaled to internal canvas resolution
  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = focusCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handleStartDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = focusCanvasRef.current;
    if (!canvas) return;
    isDrawing.current = true;
    const pos = getCanvasCoordinates(e);
    lastPos.current = pos;

    // Mark that this box now has user drawing!
    if (!boxHasDrawn[activeBoxId]) {
      setBoxHasDrawn(prev => ({ ...prev, [activeBoxId]: true }));
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, (tool === 'eraser' ? strokeWidth * 3 : strokeWidth) / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? '#ffffff' : pencilColor;
    ctx.fill();
  };

  const handleDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !lastPos.current) return;
    const canvas = focusCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPos = getCanvasCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = tool === 'eraser' ? strokeWidth * 5 : strokeWidth;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : pencilColor;
    ctx.stroke();

    lastPos.current = currentPos;
  };

  const handleStopDraw = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    lastPos.current = null;

    // Push snapshot into history for undo
    const canvas = focusCanvasRef.current;
    if (!canvas) return;
    const snapshot = canvas.toDataURL('image/png');
    
    // Maintain maximum 15 undo steps
    const history = boxHistories.current[activeBoxId] || [];
    boxHistories.current[activeBoxId] = [...history.slice(-14), snapshot];
    setBoxSnapshots(prev => ({ ...prev, [activeBoxId]: snapshot }));
    setBoxHasDrawn(prev => ({ ...prev, [activeBoxId]: true }));
  };

  // Undo action for active box
  const handleUndo = () => {
    const history = boxHistories.current[activeBoxId] || [];
    if (history.length <= 1) return;

    // Pop the latest state
    const newHistory = [...history];
    newHistory.pop();
    const previousSnapshot = newHistory[newHistory.length - 1];
    boxHistories.current[activeBoxId] = newHistory;

    const canvas = focusCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // If we are back to base snapshot (length 1), it may be clean again
      if (newHistory.length === 1) {
        setBoxSnapshots(prev => ({ ...prev, [activeBoxId]: null }));
        setBoxHasDrawn(prev => ({ ...prev, [activeBoxId]: false }));
      } else {
        setBoxSnapshots(prev => ({ ...prev, [activeBoxId]: previousSnapshot }));
      }
    };
    img.src = previousSnapshot;
  };

  // Clear active box and restore its initial stimulus
  const handleClearActiveBox = () => {
    const canvas = focusCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStimulus(ctx, activeBoxId, canvas.width);

    const snapshot = canvas.toDataURL('image/png');
    boxHistories.current[activeBoxId] = [snapshot];
    setBoxSnapshots(prev => ({ ...prev, [activeBoxId]: null }));
    setBoxHasDrawn(prev => ({ ...prev, [activeBoxId]: false }));
  };

  // Reset / Clear entire active draft
  const handleStartNewSession = () => {
    if (window.confirm('Mulai sesi latihan baru? Seluruh 8 kotak kanvas aktif akan dikosongkan. (Pastikan Anda sudah menyimpan ke Riwayat jika ingin menyimpan hasil sebelumnya).')) {
      setBoxSnapshots({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null });
      setBoxHasDrawn({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false });
      setBoxTitles({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '' });
      boxHistories.current = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] };
      
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      if (currentView === 'focus') {
        setTimeout(() => initFocusCanvas(activeBoxId), 50);
      }
      showNotification('Sesi latihan baru siap dimulai! Kanvas telah dikosongkan.');
    }
  };

  // Save current 8 boxes session to history
  const handleSaveToHistory = () => {
    const name = saveSessionName.trim() || `Latihan Wartegg (${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })})`;
    
    const completedCount = Object.values(boxHasDrawn).filter(Boolean).length;
    const newSession: WarteggSessionHistory = {
      id: `wartegg_${Date.now()}`,
      sessionName: name,
      savedAt: new Date().toISOString(),
      completedCount,
      snapshots: { ...boxSnapshots },
      titles: { ...boxTitles },
      hasDrawn: { ...boxHasDrawn }
    };

    const updated = [newSession, ...histories];
    saveHistoriesToStorage(updated);
    setIsSaveModalOpen(false);
    setSaveSessionName('');
    showNotification(`Sesi "${name}" berhasil disimpan ke Riwayat!`);
  };

  // Restore a saved history session to active canvas
  const handleRestoreSession = (session: WarteggSessionHistory) => {
    if (window.confirm(`Buka sesi "${session.sessionName}" ke kanvas pengerjaan?`)) {
      setBoxSnapshots({ ...session.snapshots });
      setBoxTitles({ ...session.titles });
      setBoxHasDrawn({ ...session.hasDrawn });
      setActiveGuideTab('practice');
      setCurrentView('grid');
      showNotification(`Sesi "${session.sessionName}" berhasil dimuat ke kanvas!`);
    }
  };

  // Delete a history item
  const handleDeleteHistory = (sessionId: string, sessionName: string) => {
    if (window.confirm(`Hapus sesi "${sessionName}" dari riwayat?`)) {
      const updated = histories.filter(h => h.id !== sessionId);
      saveHistoriesToStorage(updated);
      showNotification(`Sesi "${sessionName}" telah dihapus.`);
    }
  };

  // Download compilation image for any session or active canvas
  const handleDownloadCompilationSheet = (
    customSnapshots?: Record<number, string | null>, 
    customTitles?: Record<number, string>,
    sessionTitleName?: string
  ) => {
    const targetSnapshots = customSnapshots || boxSnapshots;
    const targetTitles = customTitles || boxTitles;
    const targetHasDrawn = customSnapshots ? null : boxHasDrawn;

    const sheetCanvas = document.createElement('canvas');
    const cols = 4;
    const rows = 2;
    const boxSize = 240;
    const padding = 20;
    const headerHeight = 90;
    const footerHeight = 70;

    sheetCanvas.width = cols * (boxSize + padding) + padding;
    sheetCanvas.height = rows * (boxSize + padding + 35) + headerHeight + footerHeight;

    const ctx = sheetCanvas.getContext('2d');
    if (!ctx) return;

    // Background sheet
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

    // Header Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('LEMBAR JAWABAN TES WARTEGG (8 KOTAK)', padding, 40);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    const subTitle = sessionTitleName 
      ? `Sesi: ${sessionTitleName} • Kandidat: ${activeUser?.name || 'Kandidat'} • SMK BuatDigital.id`
      : `Platform Simulasi Tes Masuk Kerja — BuatDigital.id • Kandidat: ${activeUser?.name || 'Kandidat'}`;
    ctx.fillText(subTitle, padding, 65);

    // Render each box
    let loadedCount = 0;
    const boxesToDraw = Array.from({ length: 8 }, (_, i) => i + 1);

    boxesToDraw.forEach((boxId) => {
      const colIndex = (boxId - 1) % cols;
      const rowIndex = Math.floor((boxId - 1) / cols);

      const x = padding + colIndex * (boxSize + padding);
      const y = headerHeight + rowIndex * (boxSize + padding + 35);

      // Draw Box Border & Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, boxSize, boxSize);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, boxSize, boxSize);

      const snap = targetSnapshots[boxId];
      const title = targetTitles[boxId];
      const isDrawn = targetHasDrawn ? targetHasDrawn[boxId] : Boolean(snap);

      const drawFooterInfo = () => {
        // Label title under box
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 11px sans-serif';
        const label = title ? `${boxId}. ${title}` : `${boxId}. (Tanpa Judul)`;
        ctx.fillText(label, x, y + boxSize + 18);

        loadedCount++;
        if (loadedCount === 8) {
          const link = document.createElement('a');
          const cleanName = (sessionTitleName || 'Tes_Wartegg').replace(/[^a-zA-Z0-9]/g, '_');
          link.download = `Lembar_${cleanName}_${Date.now()}.png`;
          link.href = sheetCanvas.toDataURL('image/png');
          link.click();
        }
      };

      if (snap && isDrawn) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, x, y, boxSize, boxSize);
          ctx.fillStyle = '#64748b';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(`Kotak ${boxId}`, x + 8, y + 18);
          drawFooterInfo();
        };
        img.src = snap;
      } else {
        // Draw initial stimulus
        ctx.save();
        ctx.translate(x, y);
        drawStimulus(ctx, boxId, boxSize);
        ctx.restore();
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`Kotak ${boxId}`, x + 8, y + 18);
        drawFooterInfo();
      }
    });
  };

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const currentGuide = warteggGuides[activeBoxId - 1];
  // Calculate completed boxes accurately based on actual drawing or title
  const totalCompletedBoxes = Object.values(boxHasDrawn).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                Tes Psikodiagnostik Gambar
              </span>
              <span className="text-xs font-semibold text-slate-500">
                8 Kotak Stimulus
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-1">
              Kanvas Interaktif Tes Wartegg
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulasi pengerjaan 8 kotak stimulus Wartegg berukuran luas, auto-save tersimpan aman, riwayat latihan & bedah makna psikologis.
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => {
                setActiveGuideTab('practice');
                if (currentView === 'focus') setCurrentView('grid');
              }}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeGuideTab === 'practice'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Kanvas Tes</span>
            </button>

            <button
              onClick={() => setActiveGuideTab('history')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 relative ${
                activeGuideTab === 'history'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Riwayat ({histories.length})</span>
            </button>

            <button
              onClick={() => setActiveGuideTab('guide')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeGuideTab === 'guide'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Pedoman HRD</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PRACTICE CANVAS (OVERVIEW GRID OR SINGLE FOCUS)                    */}
      {/* ========================================================================= */}
      {activeGuideTab === 'practice' && (
        <>
          {/* VIEW 1: OVERVIEW GRID OF 8 BOXES */}
          {currentView === 'grid' && (
            <div className="space-y-4">
              
              {/* Progress & Action Bar */}
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-300">Progres Pengerjaan</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      totalCompletedBoxes === 8 
                        ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/40' 
                        : 'bg-purple-500/30 text-purple-200 border-purple-400/40'
                    }`}>
                      {totalCompletedBoxes} / 8 Kotak Selesai
                    </span>
                    <span className="text-[10px] text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      Auto-Save Aktif
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Klik pada kotak untuk menggambar di kanvas luas (1 kotak per halaman). Data tidak akan hilang saat berpindah tab.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                  {/* Save session button */}
                  <button
                    onClick={() => {
                      setSaveSessionName(`Latihan Wartegg - ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`);
                      setIsSaveModalOpen(true);
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                    title="Simpan sesi gambar ini ke riwayat tersimpan"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-amber-300" />
                    <span>Simpan Sesi</span>
                  </button>

                  {/* Download compilation button */}
                  <button
                    onClick={() => handleDownloadCompilationSheet()}
                    className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Lembar</span>
                  </button>

                  {/* Start new session / clear draft button */}
                  {totalCompletedBoxes > 0 && (
                    <button
                      onClick={handleStartNewSession}
                      className="px-3 py-2 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1"
                      title="Mulai Sesi Baru / Kosongkan Kanvas Aktif"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">Sesi Baru</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 8 Boxes Grid Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {warteggGuides.map((guide) => {
                  const boxId = guide.id;
                  const isDone = Boolean(boxHasDrawn[boxId]);
                  const title = boxTitles[boxId];

                  return (
                    <div
                      key={boxId}
                      onClick={() => handleOpenFocusBox(boxId)}
                      className="group bg-white border-2 border-slate-200 hover:border-purple-500 rounded-2xl p-3 sm:p-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                            isDone 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-slate-100 group-hover:bg-purple-600 group-hover:text-white text-slate-700'
                          }`}>
                            {boxId}
                          </span>
                          <span className="truncate text-[11px] sm:text-xs">Kotak {boxId}</span>
                        </span>
                        {isDone ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Ada Gambar</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400">
                            Belum diisi
                          </span>
                        )}
                      </div>

                      {/* Box Preview Thumbnail */}
                      <div className="relative aspect-square w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center group-hover:border-purple-300 transition-colors">
                        {boxSnapshots[boxId] && isDone ? (
                          <img
                            src={boxSnapshots[boxId]!}
                            alt={`Preview Kotak ${boxId}`}
                            className="w-full h-full object-contain bg-white"
                          />
                        ) : (
                          <div className="relative w-full h-full flex items-center justify-center bg-white">
                            {/* Render small stimulus preview */}
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                              {boxId === 1 && <circle cx="50" cy="50" r="2.5" fill="#0f172a" />}
                              {boxId === 2 && <path d="M 22 28 Q 30 22 35 34 T 42 38" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />}
                              {boxId === 3 && (
                                <g stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
                                  <line x1="35" y1="72" x2="35" y2="56" />
                                  <line x1="45" y1="72" x2="45" y2="45" />
                                  <line x1="55" y1="72" x2="55" y2="34" />
                                </g>
                              )}
                              {boxId === 4 && <rect x="68" y="22" width="7" height="7" fill="#0f172a" />}
                              {boxId === 5 && (
                                <g stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
                                  <line x1="28" y1="68" x2="45" y2="51" />
                                  <line x1="62" y1="34" x2="45" y2="51" />
                                </g>
                              )}
                              {boxId === 6 && (
                                <g stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
                                  <line x1="28" y1="42" x2="54" y2="42" />
                                  <line x1="65" y1="26" x2="65" y2="58" />
                                </g>
                              )}
                              {boxId === 7 && (
                                <g fill="#0f172a">
                                  <circle cx="42" cy="68" r="1.5" />
                                  <circle cx="48" cy="64" r="1.5" />
                                  <circle cx="54" cy="66" r="1.5" />
                                  <circle cx="60" cy="72" r="1.5" />
                                </g>
                              )}
                              {boxId === 8 && (
                                <path d="M 32 46 A 18 18 0 0 1 68 46" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                              )}
                            </svg>
                          </div>
                        )}

                        {/* Hover Overlay Button */}
                        <div className="absolute inset-0 bg-purple-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-white text-center">
                          <Maximize2 className="w-5 h-5 mb-1" />
                          <span className="text-[11px] font-bold">Buka & Gambar</span>
                        </div>
                      </div>

                      {/* Card Footer Info */}
                      <div className="mt-2.5 space-y-1">
                        <div className="text-[11px] font-semibold text-slate-700 truncate">
                          {guide.title.split(': ')[1]}
                        </div>
                        <div className="text-[10px] text-purple-700 font-medium truncate">
                          {guide.category}
                        </div>
                        {title && (
                          <div className="text-[10px] text-slate-600 italic truncate bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                            "{title}"
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenFocusBox(boxId);
                          }}
                          className="w-full mt-1.5 py-1.5 bg-slate-100 group-hover:bg-purple-600 group-hover:text-white text-slate-700 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <span>{isDone ? 'Lanjut / Edit Gambar' : 'Mulai Gambar'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Helpful Tips Card at bottom of grid */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Petunjuk Pengerjaan & Penyimpanan:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] sm:text-xs">
                  <li><strong>Tersimpan Otomatis (Auto-Save):</strong> Gambar Anda tersimpan otomatis di perangkat. Jika refresh atau berpindah menu, gambar tidak akan hilang.</li>
                  <li><strong>Simpan Sesi ke Riwayat:</strong> Anda dapat menyimpan kumpulan gambar ini ke tab <em>Riwayat</em> agar bisa dibuka atau diunduh kapan saja di kemudian hari.</li>
                  <li><strong>Sesi Baru:</strong> Klik tombol <em>Sesi Baru</em> jika ingin mengosongkan kanvas dan mengulang latihan dari awal.</li>
                </ul>
              </div>

            </div>
          )}

          {/* VIEW 2: SINGLE-BOX DEDICATED WORKSPACE (1 HALAMAN 1 KOTAK LUAS) */}
          {currentView === 'focus' && (
            <div className="space-y-4">
              
              {/* Back to Grid & Navigation Bar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs flex items-center justify-between gap-2">
                <button
                  onClick={handleBackToGrid}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Daftar 8 Kotak</span>
                </button>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handleNavigateBox('prev')}
                    disabled={activeBoxId <= 1}
                    className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 rounded-xl transition-all text-xs font-bold flex items-center gap-1"
                    title="Kotak Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  <div className="bg-purple-50 border border-purple-200 text-purple-900 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1">
                    <span>Kotak #{activeBoxId}</span>
                    <span className="text-purple-400 font-normal">/ 8</span>
                  </div>

                  <button
                    onClick={() => handleNavigateBox('next')}
                    disabled={activeBoxId >= 8}
                    className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 rounded-xl transition-all text-xs font-bold flex items-center gap-1"
                    title="Kotak Berikutnya"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Workspace Card: Canvas & Drawing Toolbar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
                
                {/* Active Box Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {currentGuide.category}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        Stimulus: {currentGuide.stimulus}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                      {currentGuide.title}
                    </h2>
                  </div>

                  {/* Object title input field */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Judul Gambar:</label>
                    <input
                      type="text"
                      value={boxTitles[activeBoxId] || ''}
                      onChange={(e) => setBoxTitles({ ...boxTitles, [activeBoxId]: e.target.value })}
                      placeholder="cth: Bunga Matahari / Kamera"
                      className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 w-48 sm:w-56"
                    />
                  </div>
                </div>

                {/* Toolbar Controls */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
                  
                  {/* Tool selection: Pencil vs Eraser */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setTool('pencil')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        tool === 'pencil' 
                          ? 'bg-slate-900 text-white shadow-xs' 
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Pensil 2B</span>
                    </button>
                    <button
                      onClick={() => setTool('eraser')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        tool === 'eraser' 
                          ? 'bg-slate-900 text-white shadow-xs' 
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      <Eraser className="w-3.5 h-3.5" />
                      <span>Penghapus</span>
                    </button>
                  </div>

                  {/* Stroke thickness slider */}
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                    <span>Ketebalan:</span>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(Number(e.target.value))}
                      className="w-24 accent-purple-600 cursor-pointer"
                    />
                    <span className="w-4 text-center text-purple-700 font-bold">{strokeWidth}px</span>
                  </div>

                  {/* Actions: Undo & Reset Canvas */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleUndo}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-all flex items-center gap-1"
                      title="Batalkan Coretan Terakhir (Undo)"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Undo</span>
                    </button>

                    <button
                      onClick={handleClearActiveBox}
                      className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg border border-red-200 transition-all flex items-center gap-1"
                      title="Hapus Coretan Kotak Ini Saja"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Hapus Kotak Ini</span>
                    </button>
                  </div>

                </div>

                {/* LARGE CANVAS AREA (1 Halaman 1 Kotak Luas) */}
                <div className="flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-100/70 border-2 border-dashed border-slate-300 rounded-2xl">
                  <div className="relative w-full max-w-[380px] sm:max-w-[460px] aspect-square bg-white rounded-2xl shadow-md border-4 border-slate-800 overflow-hidden touch-none select-none">
                    
                    {/* Corner box number watermark */}
                    <div className="absolute top-2 left-3 z-10 text-xs sm:text-sm font-black text-slate-300 select-none pointer-events-none">
                      {activeBoxId}
                    </div>

                    {/* Interactive Drawing Canvas */}
                    <canvas
                      ref={focusCanvasRef}
                      className="w-full h-full cursor-crosshair touch-none bg-white block"
                      onMouseDown={handleStartDraw}
                      onMouseMove={handleDraw}
                      onMouseUp={handleStopDraw}
                      onMouseLeave={handleStopDraw}
                      onTouchStart={handleStartDraw}
                      onTouchMove={handleDraw}
                      onTouchEnd={handleStopDraw}
                    />

                  </div>

                  <div className="mt-3 text-center text-[11px] text-slate-500 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-purple-600" />
                    <span>Gunakan jari atau mouse untuk menggambar langsung pada kanvas di atas.</span>
                  </div>
                </div>

                {/* Navigation Bottom Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={handleBackToGrid}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Simpan & Kembali ke Daftar Kotak</span>
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {activeBoxId < 8 ? (
                      <button
                        onClick={() => handleNavigateBox('next')}
                        className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Lanjut ke Kotak {activeBoxId + 1}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleBackToGrid}
                        className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Selesai 8 Kotak (Lihat Hasil)</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* =================================================================== */}
              {/* BEDAH MAKNA PSIKOLOGIS & PANDUAN HRD (CARD SECTION DI BAWAH KANVAS)  */}
              {/* =================================================================== */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="text-xs uppercase font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Bedah Makna Psikologis Kotak #{activeBoxId}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Standar Seleksi Karyawan / Pabrik
                  </span>
                </div>

                {/* Meaning Explanation */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">Arti Penilaian Psikotes:</h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                    <strong>{currentGuide.meaning}</strong> — {currentGuide.psychologicalAspect}
                  </p>
                </div>

                {/* Ideal vs Taboo Drawings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  
                  {/* Recommended Drawings */}
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                    <h5 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Ide Gambar yang Direkomendasikan HRD:
                    </h5>
                    <ul className="text-xs text-emerald-950 space-y-1.5 list-disc list-inside">
                      {currentGuide.idealDrawings.map((idea, i) => (
                        <li key={i} className="font-medium">{idea}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Taboo Drawings */}
                  <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 space-y-2">
                    <h5 className="text-xs font-extrabold text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Hal yang Harus Dihindari:
                    </h5>
                    <ul className="text-xs text-rose-950 space-y-1.5 list-disc list-inside">
                      {currentGuide.tabooDrawings.map((taboo, i) => (
                        <li key={i} className="font-medium">{taboo}</li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Execution Tip */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Tips Eksekusi Tarikan Garis:</strong>
                    <span>{currentGuide.executionTips}</span>
                  </div>
                </div>

              </div>

            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RIWAYAT SESI GAMBAR SAYA (SAVED SESSIONS)                          */}
      {/* ========================================================================= */}
      {activeGuideTab === 'history' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-purple-600" />
                <span>Riwayat Sesi Gambar Wartegg Saya</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar kumpulan gambar yang pernah Anda simpan. Anda dapat membuka kembali, mengunduh, atau menghapusnya.
              </p>
            </div>

            {totalCompletedBoxes > 0 && (
              <button
                onClick={() => {
                  setSaveSessionName(`Latihan Wartegg - ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`);
                  setIsSaveModalOpen(true);
                }}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-amber-300" />
                <span>Simpan Sesi Aktif Ini</span>
              </button>
            )}
          </div>

          {histories.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Belum Ada Sesi Tersimpan</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Setelah Anda menggambar di kanvas, klik tombol <strong>"Simpan Sesi"</strong> untuk menyimpan lembar pengerjaan ke dalam riwayat ini.
              </p>
              <button
                onClick={() => setActiveGuideTab('practice')}
                className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-purple-700 transition-all inline-flex items-center gap-1.5"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Buka Kanvas Latihan</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {histories.map((session) => (
                <div
                  key={session.id}
                  className="bg-slate-50/70 border border-slate-200 hover:border-purple-300 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-1">
                          {session.sessionName}
                        </h4>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(session.savedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        session.completedCount === 8
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-purple-100 text-purple-800 border-purple-200'
                      }`}>
                        {session.completedCount} / 8 Kotak
                      </span>
                    </div>

                    {/* 8-box Mini Gallery Preview */}
                    <div className="grid grid-cols-4 gap-1.5 mt-3 p-2 bg-white rounded-xl border border-slate-200">
                      {Array.from({ length: 8 }).map((_, idx) => {
                        const boxId = idx + 1;
                        const snap = session.snapshots[boxId];
                        const isDrawn = session.hasDrawn?.[boxId];

                        return (
                          <div
                            key={boxId}
                            className="aspect-square bg-slate-50 rounded border border-slate-200 overflow-hidden relative flex items-center justify-center"
                          >
                            <span className="absolute top-0.5 left-0.5 text-[8px] font-bold text-slate-400">
                              {boxId}
                            </span>
                            {snap && isDrawn ? (
                              <img src={snap} alt={`Kotak ${boxId}`} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-[8px] text-slate-300">•</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => handleRestoreSession(session)}
                      className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
                      title="Buka kembali sesi ini ke kanvas"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Buka ke Kanvas</span>
                    </button>

                    <button
                      onClick={() => handleDownloadCompilationSheet(session.snapshots, session.titles, session.sessionName)}
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition-colors"
                      title="Download Lembar Gambar Sesi Ini"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteHistory(session.id, session.sessionName)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition-colors"
                      title="Hapus Sesi Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PANDUAN LENGKAP TEORI & PEDOMAN LOLOS                                */}
      {/* ========================================================================= */}
      {activeGuideTab === 'guide' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Materi Teori & Panduan HRD
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-2">
              Kunci Rahasia Lolos Tes Wartegg Seleksi Kerja Pabrik & Perusahaan
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Tes Wartegg (diciptakan oleh Ehrig Wartegg) adalah tes kepribadian proyektif. Penilai tidak mencari keindahan lukisan karya seni, melainkan <strong>konsistensi struktur kepribadian, kestabilan emosi, dan kemampuan menyelesaikan instruksi kerja secara runut</strong>.
            </p>
          </div>

          {/* 4 Rules of Wartegg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-purple-800">1. Keseimbangan Organik vs Anorganik</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kotak 1, 2, 7, 8 adalah stimulus lengkung/titik (organik = makhluk hidup). Kotak 3, 4, 5, 6 adalah garis lurus/kaku (anorganik = benda mati/teknis). Jangan terbalik!
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-purple-800">2. Kebersihan & Kerapian Lembar</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hindari menghapus terlalu sering sampai kertas kotor atau bolong. Tekanan garis yang stabil menunjukkan emosi yang stabil dan keyakinan diri.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-purple-800">3. Urutan Pengerjaan</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Urutan <strong>1 - 2 - 3 - 4 - 5 - 6 - 7 - 8</strong> menunjukkan pribadi yang disiplin, taat SOP, dan teratur. Urutan kombinasi 1-2-3-8-7-6-5-4 menunjukkan fleksibilitas tinggi.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-purple-800">4. Penamaan Objek yang Spesifik</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Beri judul objek yang jelas dan realistis. Jangan memberi judul abstrak seperti "garis tak tentu" atau "bayangan hantu".
              </p>
            </div>
          </div>

          {/* 8 Boxes Breakdown Cards */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-extrabold text-slate-900">Rangkuman 8 Karakteristik Kotak:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {warteggGuides.map((guide) => (
                <div key={guide.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Kotak #{guide.id} ({guide.category.split(' ')[0]})
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium truncate max-w-[160px]">{guide.stimulus}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{guide.title}</h4>
                  <p className="text-xs text-slate-600 mb-2">{guide.meaning}</p>
                  
                  <div className="text-[11px] bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 space-y-1">
                    <div>
                      <strong className="text-emerald-700">Contoh Disukai: </strong>
                      <span>{guide.idealDrawings.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SIMPAN SESI GAMBAR KE RIWAYAT                                      */}
      {/* ========================================================================= */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-2.5 text-purple-900">
              <div className="w-9 h-9 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
                <BookmarkPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Simpan Sesi Wartegg</h3>
                <p className="text-xs text-slate-500">Simpan pengerjaan 8 kotak ini ke riwayat tersimpan.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama / Label Sesi Latihan:
              </label>
              <input
                type="text"
                value={saveSessionName}
                onChange={(e) => setSaveSessionName(e.target.value)}
                placeholder="cth: Latihan Tes PT Astra Daihatsu"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Total kotak dengan coretan: <strong>{totalCompletedBoxes} dari 8 kotak</strong>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveToHistory}
                className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan ke Riwayat</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
