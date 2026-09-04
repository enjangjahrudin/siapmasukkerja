import React, { useState, useEffect } from 'react';
import { tipsAndTricksData, TipArticle } from '../../data/tips-and-tricks';
import { 
  educationVideosData, 
  EducationVideo, 
  VideoCategory,
  getStoredCategories,
  getStoredVideos, 
  fetchLiveVideos 
} from '../../data/education-videos';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  Play, 
  PlayCircle, 
  Video, 
  Eye, 
  User, 
  X, 
  Flame, 
  Award, 
  Layers, 
  Check, 
  RefreshCw,
  Smartphone,
  Upload 
} from 'lucide-react';
import { useTheme } from '../../utils/theme-context';
import { sounds } from '../../utils/sound-effects';

export const TipsHub: React.FC = () => {
  const { isDark } = useTheme();
  const [activeHubMode, setActiveHubMode] = useState<'articles' | 'videos'>('videos');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Dynamic Videos and Categories State
  const [videoList, setVideoList] = useState<EducationVideo[]>(() => getStoredVideos());
  const [categoryList, setCategoryList] = useState<VideoCategory[]>(() => getStoredCategories());

  // Listen to live video and category updates from Admin CMS
  useEffect(() => {
    fetchLiveVideos().then(v => {
      if (v && v.length > 0) setVideoList(v);
    });

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setVideoList(e.detail);
      } else {
        setVideoList(getStoredVideos());
      }
    };

    const handleCatUpdate = (e: any) => {
      if (e.detail) {
        setCategoryList(e.detail);
      } else {
        setCategoryList(getStoredCategories());
      }
    };

    window.addEventListener('siapkerja_videos_updated', handleUpdate);
    window.addEventListener('siapkerja_categories_updated', handleCatUpdate);
    return () => {
      window.removeEventListener('siapkerja_videos_updated', handleUpdate);
      window.removeEventListener('siapkerja_categories_updated', handleCatUpdate);
    };
  }, []);

  // Active Article Reader State
  const [selectedArticle, setSelectedArticle] = useState<TipArticle | null>(tipsAndTricksData[0]);

  // Active Video Player Modal / Inline State
  const [activePlayingVideo, setActivePlayingVideo] = useState<EducationVideo | null>(null);
  const [watchedVideoIds, setWatchedVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('siapkerja_watched_videos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleWatched = (id: string) => {
    setWatchedVideoIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('siapkerja_watched_videos', JSON.stringify(next));
      return next;
    });
    sounds.playCorrect();
  };

  // Filter Articles
  const filteredArticles = tipsAndTricksData.filter(art => {
    const matchCat = selectedCategory === 'all' || art.category === selectedCategory;
    const matchSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Filter Videos
  const filteredVideos = videoList.filter(vid => {
    const matchCat = selectedCategory === 'all' || vid.category === selectedCategory;
    const matchSearch = vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        vid.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        vid.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredVideo = videoList.find(v => v.isFeatured) || videoList[0];

  return (
    <div className={`w-full max-w-6xl mx-auto px-1 sm:px-4 py-2 sm:py-4 space-y-3 select-none transition-colors ${
      isDark ? 'text-white' : 'text-slate-900'
    }`}>
      
      {/* Header & Mode Switcher Card */}
      <div className={`border rounded-3xl p-4 sm:p-5 shadow-xs transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                Pusat Edukasi & Strategi Lolos
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold mt-1">
              {activeHubMode === 'videos' ? '🎬 Kumpulan Video Edukasi Seleksi Kerja' : '📖 Tips, Trik & Rahasia Lolos Pabrik'}
            </h1>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {activeHubMode === 'videos' 
                ? 'Tonton tutorial video interaktif tanpa keluar dari aplikasi (Kraepelin, Psikotes, Interview, 5S, Fisik).' 
                : 'Kumpulan panduan psikotes, tes koran, interview, budaya 5S/5R, dan persiapan fisik standar industri.'}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeHubMode === 'videos' ? 'Cari video tutorial...' : 'Cari materi tips...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none transition-all ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500'
              }`}
            />
          </div>
        </div>

        {/* Segmented Mode Switcher: Video Edukasi vs Panduan Teks */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveHubMode('videos');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
              activeHubMode === 'videos'
                ? 'bg-amber-500 text-white shadow-md'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>🎬 Video Edukasi ({videoList.length})</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveHubMode('articles');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
              activeHubMode === 'articles'
                ? 'bg-amber-500 text-white shadow-md'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 Artikel Panduan ({tipsAndTricksData.length})</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {[
            { id: 'all', label: 'Semua Materi' },
            ...categoryList.map(c => ({ id: c.id, label: c.label }))
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setSelectedCategory(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : isDark 
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-750' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* VIEW 1: KUMPULAN VIDEO EDUKASI                                      */}
      {/* =================================================================== */}
      {activeHubMode === 'videos' && (
        <div className="space-y-4">
          
          {/* Featured Video Banner (If available) */}
          {selectedCategory === 'all' && !searchQuery && featuredVideo && (
            <div 
              onClick={() => {
                sounds.playClick();
                setActivePlayingVideo(featuredVideo);
              }}
              className={`border rounded-3xl p-4 sm:p-5 cursor-pointer relative overflow-hidden group shadow-sm transition-all hover:scale-[1.01] ${
                isDark 
                  ? 'bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/40 border-amber-900/60' 
                  : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white border-amber-400 shadow-amber-500/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-64 h-36 rounded-2xl overflow-hidden shrink-0 shadow-md">
                  <img 
                    src={featuredVideo.thumbnailUrl} 
                    alt={featuredVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white text-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                      <Play className="w-6 h-6 fill-amber-600 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[10px] font-mono font-bold rounded">
                    {featuredVideo.duration}
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white border border-white/30">
                      ★ Video Unggulan
                    </span>
                    <span className="text-xs opacity-80">
                      {featuredVideo.viewsCount} ditonton
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black leading-tight">
                    {featuredVideo.title}
                  </h2>
                  <p className="text-xs opacity-90 line-clamp-2 leading-relaxed">
                    {featuredVideo.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold pt-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{featuredVideo.speaker} ({featuredVideo.speakerRole})</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => {
              const isWatched = watchedVideoIds.includes(video.id);

              return (
                <div
                  key={video.id}
                  onClick={() => {
                    sounds.playClick();
                    setActivePlayingVideo(video);
                  }}
                  className={`border rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between group shadow-xs ${
                    isDark 
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                      : 'bg-white border-slate-200 hover:border-amber-300'
                  }`}
                >
                  {/* Thumbnail & Badges */}
                  <div className={`relative w-full overflow-hidden bg-slate-900 ${video.orientation === 'portrait' ? 'aspect-[4/5] sm:aspect-video' : 'aspect-video'}`}>
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
                    
                    {/* Dark gradient overlay & Play Button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg group-hover:scale-115 transition-all">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 max-w-[80%]">
                      {video.orientation === 'portrait' && (
                        <span className="bg-purple-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                          <Smartphone className="w-2.5 h-2.5" />
                          <span>Vertikal</span>
                        </span>
                      )}
                      {video.sourceType === 'upload' && (
                        <span className="bg-sky-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                          <Upload className="w-2.5 h-2.5" />
                          <span>File</span>
                        </span>
                      )}
                      {video.badge && (
                        <span className="bg-amber-500 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow-xs">
                          {video.badge}
                        </span>
                      )}
                      {isWatched && (
                        <span className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Check className="w-2.5 h-2.5" />
                          <span>Selesai</span>
                        </span>
                      )}
                    </div>

                    {/* Duration & Views */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[10px] font-mono font-bold rounded">
                      {video.duration}
                    </div>
                  </div>

                  {/* Video Meta Body */}
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className={`text-xs sm:text-sm font-extrabold leading-snug line-clamp-2 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {video.title}
                      </h3>
                      <p className={`text-[11px] line-clamp-2 leading-relaxed ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {video.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className={`font-semibold truncate max-w-[65%] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {video.speaker}
                      </span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Tonton</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW 2: PANDUAN TEKS & ARTIKEL                                      */}
      {/* =================================================================== */}
      {activeHubMode === 'articles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Article Cards List */}
          <div className="lg:col-span-5 space-y-3">
            {filteredArticles.map((art) => {
              const isSelected = selectedArticle?.id === art.id;

              return (
                <div
                  key={art.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedArticle(art);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? isDark 
                        ? 'bg-slate-800 border-amber-500 shadow-md ring-2 ring-amber-500/20' 
                        : 'bg-white border-amber-400 shadow-md ring-2 ring-amber-100'
                      : isDark
                        ? 'bg-slate-900 hover:bg-slate-800/80 border-slate-800'
                        : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                      {art.badge}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{art.readTime}</span>
                    </div>
                  </div>

                  <h3 className={`text-sm font-bold mb-1.5 leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {art.title}
                  </h3>
                  <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {art.summary}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Full Article View */}
          <div className="lg:col-span-7">
            {selectedArticle ? (
              <div className={`border rounded-3xl p-5 sm:p-7 shadow-xs space-y-4 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 px-2.5 py-0.5 rounded-full">
                    {selectedArticle.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {selectedArticle.readTime}
                  </span>
                </div>

                <h2 className={`text-lg sm:text-xl font-extrabold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedArticle.title}
                </h2>
                <p className={`text-xs italic leading-relaxed pb-3 border-b border-slate-100 dark:border-slate-800 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  "{selectedArticle.summary}"
                </p>

                {/* Article Paragraphs */}
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
                  {selectedArticle.content.map((paragraph, idx) => (
                    <p key={idx} className={`p-3.5 rounded-2xl border ${
                      isDark 
                        ? 'bg-slate-800/60 border-slate-700/60 text-slate-200' 
                        : 'bg-slate-50 border-slate-100 text-slate-800'
                    }`}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Key Takeaways Box */}
                <div className="mt-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 sm:p-5">
                  <h4 className="text-xs sm:text-sm font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    Poin Kunci yang Wajib Diingat (Key Takeaways):
                  </h4>
                  <ul className="space-y-2 text-xs text-amber-950 dark:text-amber-100">
                    {selectedArticle.keyTakeaways.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ) : (
              <div className={`border rounded-3xl p-12 text-center space-y-2 ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
              }`}>
                <BookOpen className="w-8 h-8 mx-auto text-amber-500 opacity-60" />
                <p className="text-xs">Pilih salah satu artikel di sebelah kiri untuk membaca materi selengkapnya.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* IN-APP EMBEDDED VIDEO PLAYER MODAL (ZERO-TAB SWITCHING)             */}
      {/* =================================================================== */}
      {activePlayingVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in overflow-y-auto">
          <div className={`w-full rounded-3xl border shadow-2xl flex flex-col justify-between relative my-auto transition-all ${
            activePlayingVideo.orientation === 'portrait' ? 'max-w-md max-h-[92vh]' : 'max-w-3xl max-h-[92vh]'
          } ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-inherit z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Pemutar Video ({activePlayingVideo.orientation === 'portrait' ? '📱 Vertikal' : '🖥️ Landscape'})
                </span>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActivePlayingVideo(null);
                }}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display */}
            <div className={`relative w-full bg-black flex items-center justify-center overflow-hidden ${
              activePlayingVideo.orientation === 'portrait' ? 'aspect-[9/16] max-h-[62vh]' : 'aspect-video'
            }`}>
              {activePlayingVideo.sourceType === 'upload' && activePlayingVideo.videoUrl ? (
                <video
                  src={activePlayingVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activePlayingVideo.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
                  title={activePlayingVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>

            {/* Video Details & Action Buttons */}
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {activePlayingVideo.badge && (
                    <span className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {activePlayingVideo.badge}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    Durasi: {activePlayingVideo.duration} • {activePlayingVideo.viewsCount} penonton
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-extrabold leading-snug">
                  {activePlayingVideo.title}
                </h2>
                
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {activePlayingVideo.description}
                </p>
              </div>

              {/* Speaker Profile */}
              <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
                isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-black flex items-center justify-center shrink-0">
                  {activePlayingVideo.speaker.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold">{activePlayingVideo.speaker}</h4>
                  <p className="text-[11px] text-slate-400">{activePlayingVideo.speakerRole}</p>
                </div>
              </div>

              {/* Key Takeaways */}
              {activePlayingVideo.keyTakeaways && activePlayingVideo.keyTakeaways.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Poin Penting Video Ini:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-100">
                    {activePlayingVideo.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mark Completed Button */}
              <div className="pt-2">
                <button
                  onClick={() => toggleWatched(activePlayingVideo.id)}
                  className={`w-full py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                    watchedVideoIds.includes(activePlayingVideo.id)
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {watchedVideoIds.includes(activePlayingVideo.id)
                      ? '✓ Sudah Selesai Ditonton'
                      : 'Tandai Selesai Ditonton'}
                  </span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
