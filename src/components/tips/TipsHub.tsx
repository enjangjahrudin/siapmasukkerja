import React, { useState } from 'react';
import { tipsAndTricksData, TipArticle } from '../../data/tips-and-tricks';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Bookmark,
  Share2
} from 'lucide-react';

export const TipsHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<TipArticle | null>(tipsAndTricksData[0]);

  const filteredArticles = tipsAndTricksData.filter(art => {
    const matchCat = selectedCategory === 'all' || art.category === selectedCategory;
    const matchSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                Pusat Edukasi & Strategi Lolos
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Tips, Trik & Rahasia Lolos Tes Pabrik
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kumpulan panduan psikotes, tes koran, interview, budaya 5S/5R, dan persiapan fisik standar industri.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari materi / tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-100 no-scrollbar">
          {[
            { id: 'all', label: 'Semua Materi' },
            { id: 'kraepelin', label: 'Tes Koran (Kraepelin)' },
            { id: 'psikotes', label: 'Wartegg & Gambar' },
            { id: 'interview', label: 'Interview HRD & User' },
            { id: 'fisik-sikap', label: '5S & Disiplin Fisik' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Articles List & Article Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Article Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredArticles.map((art) => {
            const isSelected = selectedArticle?.id === art.id;

            return (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-amber-400 shadow-md ring-2 ring-amber-100'
                    : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                    {art.badge}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{art.readTime}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-amber-700 pt-2 border-t border-slate-100">
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
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                  {selectedArticle.badge}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedArticle.readTime}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3 leading-tight">
                {selectedArticle.title}
              </h2>
              <p className="text-xs text-slate-600 pb-5 mb-5 border-b border-slate-100 italic leading-relaxed">
                "{selectedArticle.summary}"
              </p>

              {/* Article Paragraphs */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
                {selectedArticle.content.map((paragraph, idx) => (
                  <p key={idx} className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Key Takeaways Box */}
              <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
                <h4 className="text-xs sm:text-sm font-extrabold text-amber-900 flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Poin Kunci yang Wajib Diingat (Key Takeaways):
                </h4>
                <ul className="space-y-2 text-xs text-amber-950">
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
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400">
              Pilih salah satu artikel di sebelah kiri untuk membaca.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
