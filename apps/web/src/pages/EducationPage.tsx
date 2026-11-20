import React, { useState, useEffect } from 'react';
import { Card, Button } from '@kemitir/ui';
import { BookOpen, Droplets, ShieldCheck, ChevronRight, CheckCircle2, ArrowRight, Phone, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article, EDUCATION_CATEGORIES, EDUCATION_ARTICLES } from '../data/education';

export const EducationPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Close modal on Escape key press (R-32)
  useEffect(() => {
    if (!activeArticle) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeArticle]);

  const articles = EDUCATION_ARTICLES;
  const categories = EDUCATION_CATEGORIES;

  const filteredArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  return (
    <div className="flex-1 bg-slate-50 py-5 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
        
        {/* Header Edukasi Mitigasi */}
        <div className="bg-emerald-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pusat Literasi & Tanggap Bencana</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
              Edukasi & Mitigasi Kekeringan Kemitir
            </h1>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Panduan taktis konservasi air, alur darurat tangki BPBD, dan pemeliharaan sumber air warga.
            </p>
          </div>

          <div className="w-full md:w-auto md:shrink-0">
            <Button as={Link} to="/laporan" variant="secondary" size="md" className="w-full md:w-auto border-transparent bg-white text-emerald-800 hover:bg-slate-100">
              Lapor Krisis Air
            </Button>
          </div>
        </div>

        {/* Emergency Hotlines with Direct Call Ergonomics */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-600">
            Kontak Cepat & Bantuan Darurat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="tel:085876543210"
              className="bg-white rounded-2xl p-4 sm:p-5 min-h-[72px] border border-slate-200 hover:border-emerald-500 transition-colors flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Satgas Bencana Desa</span>
                  <span className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    0858-7654-3210
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-xs font-semibold text-emerald-700 px-3 py-2 bg-emerald-50 rounded-lg">
                Panggil
              </span>
            </a>

            <a
              href="tel:112"
              className="bg-white rounded-2xl p-4 sm:p-5 min-h-[72px] border border-slate-200 hover:border-blue-500 transition-colors flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Tangki Air BPBD Semarang</span>
                  <span className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    112 / (024) 692-1413
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-xs font-semibold text-blue-700 px-3 py-2 bg-blue-50 rounded-lg">
                Panggil
              </span>
            </a>

            <Link
              to="/laporan?category=Kerusakan%20Pipa%20/%20Sarana%20Air"
              className="bg-white rounded-2xl p-4 sm:p-5 min-h-[72px] border border-slate-200 hover:border-amber-500 transition-colors flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Pengaduan Pipa Swadaya</span>
                  <span className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    Lapor Pipa Rusak / Bocor
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-xs font-semibold text-amber-800 px-3 py-2 bg-amber-50 rounded-lg group-hover:bg-amber-100">
                Lapor
              </span>
            </Link>
          </div>
        </div>

        {/* Category Segmented Controls */}
        <div className="flex flex-nowrap sm:flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
          {categories.map((c) => (
            <button
              type="button"
              key={c.id}
              aria-pressed={selectedCategory === c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`shrink-0 px-4 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap transition-colors select-none ${
                selectedCategory === c.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.slug}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-7 hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    {article.category}
                  </span>
                  <span className="text-slate-500 font-medium">{article.readTime}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {article.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {article.summary}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col min-[420px]:flex-row min-[420px]:items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  <span className="font-medium text-slate-800 block">{article.author}</span>
                  <span>{article.date}</span>
                </div>

                <Button
                  variant="secondary"
                  size="md"
                  className="w-full min-[420px]:w-auto"
                  onClick={() => setActiveArticle(article)}
                >
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Baca Pedoman Mitigasi */}
        {activeArticle && (
          <div className="fixed inset-0 z-[60] bg-slate-900/50 flex items-end sm:items-center justify-center sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[90dvh] sm:max-h-[85dvh] overflow-y-auto overscroll-contain p-5 sm:p-8 space-y-5 sm:space-y-6">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-700">
                    {activeArticle.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {activeArticle.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Oleh: {activeArticle.author} • {activeArticle.date}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  aria-label="Tutup panduan"
                  className="w-11 h-11 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4 text-slate-800 text-[15px] sm:text-base leading-relaxed">
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx} className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex sm:justify-end">
                <Button variant="primary" size="md" className="w-full sm:w-auto" onClick={() => setActiveArticle(null)}>
                  Tutup Panduan
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
