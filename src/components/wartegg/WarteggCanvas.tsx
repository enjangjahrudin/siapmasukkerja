import React, { useState, useRef, useEffect } from 'react';
import { 
  Pencil, 
  Eraser, 
  RotateCcw, 
  Download, 
  Info, 
  Sparkles, 
  CheckCircle, 
  HelpCircle,
  Eye
} from 'lucide-react';

interface WarteggBoxInfo {
  id: number;
  title: string;
  stimulus: string;
  meaning: string;
  idealDrawings: string[];
  tabooDrawings: string[];
}

const warteggGuides: WarteggBoxInfo[] = [
  {
    id: 1,
    title: 'Kotak 1: Titik Pusat (.)',
    stimulus: 'Titik kecil di tengah bidang',
    meaning: 'Mengukur penyesuaian diri, ego, dan adaptasi lingkungan baru.',
    idealDrawings: ['Titik pusat bunga matahari', 'Target panahan', 'Matahari terbit', 'Jam dinding bulat'],
    tabooDrawings: ['Menggambar benda mati yang menenggelamkan titik']
  },
  {
    id: 2,
    title: 'Kotak 2: Garis Lengkung (~)',
    stimulus: 'Garis lengkung kecil dinamis',
    meaning: 'Fleksibilitas perasaan, empati, dan interaksi sosial.',
    idealDrawings: ['Burung terbang', 'Gelombang laut', 'Pohon kelapa melengkung', 'Ikan berenang'],
    tabooDrawings: ['Benda mati kaku bergaris patah-patah']
  },
  {
    id: 3,
    title: 'Kotak 3: 3 Garis Vertikal Menaik (|||)',
    stimulus: 'Tiga garis tegak lurus makin tinggi',
    meaning: 'Ambisi karier, kemauan maju, dan konsistensi pengembangan diri.',
    idealDrawings: ['Tiang bendera', 'Grafik pertumbuhan/gedung bertingkat', 'Pagar rapi dengan tanaman'],
    tabooDrawings: ['Menggambar garis menurun atau memutus ketiga garis']
  },
  {
    id: 4,
    title: 'Kotak 4: Kotak Hitam Kecil (■)',
    stimulus: 'Bujur sangkar hitam padat di pojok kanan atas',
    meaning: 'Cara menghadapi tekanan (stres), kesulitan, dan beban kerja.',
    idealDrawings: ['Papan catur', 'Jendela gedung', 'Cerobong asap', 'Saklar lampu'],
    tabooDrawings: ['Mewarnai seluruh kotak menjadi hitam kelam (indikasi depresi/stres berat)']
  },
  {
    id: 5,
    title: 'Kotak 5: Dua Garis Tegak Saling Hadap (T)',
    stimulus: 'Dua garis tegak dengan arah berbeda',
    meaning: 'Daya juang, dorongan bertindak, dan penyelesaian masalah teknis.',
    idealDrawings: ['Lampu penerangan jalan', 'Dayung perahu', 'Jarum suntik medis', 'Kunci pas / obeng'],
    tabooDrawings: ['Menghubungkan kedua garis tanpa ada fungsi alat']
  },
  {
    id: 6,
    title: 'Kotak 6: Garis Horizontal & Vertikal Terpisah',
    stimulus: 'Garis datar dan garis tegak terpisah',
    meaning: 'Logika berpikir, sintesis analisis, dan orientasi fakta.',
    idealDrawings: ['Kamera foto', 'Televisi / Monitor PC', 'Rumah tinggal', 'Mobil pabrik'],
    tabooDrawings: ['Menggambar objek organik tanpa struktur']
  },
  {
    id: 7,
    title: 'Kotak 7: Titik-titik Melengkung (..)',
    stimulus: 'Kumpulan titik halus membentuk lengkungan',
    meaning: 'Kehalusan etika, stabilitas emosi, dan ketelitian detail.',
    idealDrawings: ['Kalung mutiara', 'Ulat lucu', 'Ritsleting pakaian', 'Jejak langkah'],
    tabooDrawings: ['Menimpa titik-titik halus dengan garis tebal kasar']
  },
  {
    id: 8,
    title: 'Kotak 8: Lengkungan Busur Payung (⌒)',
    stimulus: 'Garis lengkung cembung lebar',
    meaning: 'Kebijaksanaan, rasa aman, dan kepatuhan terhadap norma.',
    idealDrawings: ['Payung pelindung', 'Kubah masjid/gedung', 'Pintu gerbang pabrik', 'Helm keselamatan (K3)'],
    tabooDrawings: ['Gambar tidak memiliki penopang kokoh di bagian bawah']
  }
];

export const WarteggCanvas: React.FC = () => {
  const [selectedBox, setSelectedBox] = useState<number>(1);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [activeGuideTab, setActiveGuideTab] = useState<'guide' | 'practice'>('practice');

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const isDrawing = useRef<boolean>(false);

  // Initialize stimulus on each canvas
  useEffect(() => {
    canvasRefs.current.forEach((canvas, index) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw box border & stimulus
      drawInitialStimulus(ctx, index + 1, canvas.width, canvas.height);
    });
  }, []);

  const drawInitialStimulus = (ctx: CanvasRenderingContext2D, boxId: number, w: number, h: number) => {
    ctx.strokeStyle = '#0f172a';
    ctx.fillStyle = '#0f172a';
    ctx.lineWidth = 2;

    switch (boxId) {
      case 1: // Dot in center
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 2: // Curve top left
        ctx.beginPath();
        ctx.moveTo(w * 0.25, h * 0.3);
        ctx.bezierCurveTo(w * 0.35, h * 0.25, w * 0.3, h * 0.45, w * 0.45, h * 0.4);
        ctx.stroke();
        break;
      case 3: // 3 vertical ascending lines
        ctx.beginPath();
        ctx.moveTo(w * 0.35, h * 0.7);
        ctx.lineTo(w * 0.35, h * 0.55);
        ctx.moveTo(w * 0.45, h * 0.7);
        ctx.lineTo(w * 0.45, h * 0.45);
        ctx.moveTo(w * 0.55, h * 0.7);
        ctx.lineTo(w * 0.55, h * 0.35);
        ctx.stroke();
        break;
      case 4: // Black small square top right
        ctx.fillRect(w * 0.7, h * 0.25, 10, 10);
        break;
      case 5: // 2 perpendicular lines facing each other
        ctx.beginPath();
        ctx.moveTo(w * 0.3, h * 0.65);
        ctx.lineTo(w * 0.45, h * 0.5);
        ctx.moveTo(w * 0.6, h * 0.35);
        ctx.lineTo(w * 0.45, h * 0.5);
        ctx.stroke();
        break;
      case 6: // Horizontal and vertical lines
        ctx.beginPath();
        ctx.moveTo(w * 0.3, h * 0.4);
        ctx.lineTo(w * 0.55, h * 0.4);
        ctx.moveTo(w * 0.65, h * 0.25);
        ctx.lineTo(w * 0.65, h * 0.55);
        ctx.stroke();
        break;
      case 7: // Dotted curve
        const dots = [
          { x: w * 0.45, y: h * 0.65 },
          { x: w * 0.5, y: h * 0.62 },
          { x: w * 0.55, y: h * 0.64 },
          { x: w * 0.6, y: h * 0.7 }
        ];
        dots.forEach(d => {
          ctx.beginPath();
          ctx.arc(d.x, d.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        });
        break;
      case 8: // Large arc
        ctx.beginPath();
        ctx.arc(w / 2, h * 0.4, 26, Math.PI * 0.15, Math.PI * 0.85, true);
        ctx.stroke();
        break;
    }
  };

  const getCanvasCoordinates = (canvas: HTMLCanvasElement, e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const handleStartDraw = (index: number, e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRefs.current[index];
    if (!canvas) return;
    isDrawing.current = true;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(canvas, e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = tool === 'eraser' ? strokeWidth * 5 : strokeWidth;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : '#0f172a';
  };

  const handleDraw = (index: number, e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRefs.current[index];
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(canvas, e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleStopDraw = () => {
    isDrawing.current = false;
  };

  const handleClearBox = (index: number) => {
    const canvas = canvasRefs.current[index];
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawInitialStimulus(ctx, index + 1, canvas.width, canvas.height);
  };

  const currentGuide = warteggGuides[selectedBox - 1];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                Tes Psikodiagnostik Gambar
              </span>
              <span className="text-xs font-semibold text-slate-500">
                8 Kotak Stimulus Wartegg
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Panduan & Kanvas Interaktif Tes Wartegg
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Latihan menggambar 8 kotak Wartegg langsung di layar disertai penjelasan arti psikologis & contoh gambar yang disukai HRD.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveGuideTab('practice')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeGuideTab === 'practice'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Kanvas Gambar (8 Kotak)
            </button>
            <button
              onClick={() => setActiveGuideTab('guide')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeGuideTab === 'guide'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pedoman & Rahasia Lolos
            </button>
          </div>
        </div>
      </div>

      {activeGuideTab === 'practice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: 8 Wartegg Canvas Grid */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            
            {/* Drawing Tools Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTool('pencil')}
                  className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    tool === 'pencil' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Pensil
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    tool === 'eraser' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  Penghapus
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <span>Ketebalan:</span>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    className="w-20 accent-purple-600 cursor-pointer"
                  />
                </div>

                <button
                  onClick={() => handleClearBox(selectedBox - 1)}
                  className="p-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Hapus Kotak {selectedBox}
                </button>
              </div>
            </div>

            {/* 8 Boxes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, index) => {
                const boxId = index + 1;
                const isSelected = selectedBox === boxId;

                return (
                  <div
                    key={boxId}
                    onClick={() => setSelectedBox(boxId)}
                    className={`relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden group ${
                      isSelected 
                        ? 'border-purple-600 shadow-md ring-2 ring-purple-200 bg-white' 
                        : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                    }`}
                  >
                    {/* Box number indicator */}
                    <div className="absolute top-1.5 left-2 z-10 text-[11px] font-black text-slate-400 select-none group-hover:text-purple-600">
                      {boxId}
                    </div>

                    <canvas
                      ref={el => canvasRefs.current[index] = el}
                      width={180}
                      height={180}
                      className="w-full aspect-square touch-none cursor-crosshair bg-white"
                      onMouseDown={(e) => handleStartDraw(index, e)}
                      onMouseMove={(e) => handleDraw(index, e)}
                      onMouseUp={handleStopDraw}
                      onMouseLeave={handleStopDraw}
                      onTouchStart={(e) => handleStartDraw(index, e)}
                      onTouchMove={(e) => handleDraw(index, e)}
                      onTouchEnd={handleStopDraw}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-[11px] text-slate-500 flex items-center justify-between">
              <span>💡 Klik salah satu kotak untuk melihat penjelasan detail & ide gambar di samping kanan.</span>
              <span className="font-semibold text-purple-700">Kotak Aktif: #{selectedBox}</span>
            </div>

          </div>

          {/* Right: Live Box Explanations & Psychologist Insights */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Bedah Makna Psikologis
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-2">
                {currentGuide.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                <strong>Arti Penilaian:</strong> {currentGuide.meaning}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Ide Gambar yang Direkomendasikan:
                </h4>
                <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                  {currentGuide.idealDrawings.map((idea, i) => (
                    <li key={i}>{idea}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-red-800 flex items-center gap-1 mb-2">
                  <Info className="w-3.5 h-3.5 text-red-500" />
                  Hal yang Harus Dihindari:
                </h4>
                <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                  {currentGuide.tabooDrawings.map((taboo, i) => (
                    <li key={i}>{taboo}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-5 shadow-md">
              <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Urutan Pengerjaan yang Disarankan:
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed mb-3">
                Kombinasi terbaik: <strong>1 - 2 - 3 - 4 - 5 - 6 - 7 - 8</strong> (Teratur, cocok untuk Operator/QC yang patuh SOP) atau <strong>1 - 2 - 3 - 8 - 7 - 6 - 5 - 4</strong> (Dinamis).
              </p>
              <span className="text-[10px] text-purple-300">
                *Tulis urutan pengerjaan kotak di luar bingkai sesuai instruksi pengawas tes.
              </span>
            </div>

          </div>

        </div>
      )}

      {activeGuideTab === 'guide' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-2">
              Panduan Lengkap 8 Kotak Wartegg & Standar Penilaian Psikotes Pabrik
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tes Wartegg bukan tes kecantikan lukisan, melainkan tes proyektif untuk melihat struktur kepribadian, kestabilan emosi, daya juang, dan cara menyelesaikan instruksi kerja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warteggGuides.map((guide) => (
              <div key={guide.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Kotak #{guide.id}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">{guide.stimulus}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{guide.title}</h4>
                <p className="text-xs text-slate-600 mb-2">{guide.meaning}</p>
                
                <div className="text-[11px] bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700">
                  <strong className="text-emerald-700 block">Saran Gambar:</strong>
                  <span>{guide.idealDrawings.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
