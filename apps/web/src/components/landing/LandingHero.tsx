import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { Button } from '@kemitir/ui';
import { Search, Layers, ShieldCheck, MapPin, Compass, ArrowRight, Droplets } from 'lucide-react';

export const LandingHero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/peta?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/peta');
    }
  };

  return (
    <section className="pt-8 sm:pt-16 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      {/* Label Sistem Informasi Spasial Desa */}
      <div className="inline-flex max-w-full items-center rounded-full border border-slate-200 bg-white p-1.5 pr-3 sm:pr-4 text-xs sm:text-sm mb-6 sm:mb-8">
        <span className="rounded-full bg-slate-900 text-white px-3 py-1 font-semibold text-xs mr-2 sm:mr-3 shrink-0">
          {idCopy.hero.pillTag}
        </span>
        <span className="text-slate-600 font-medium text-left">{idCopy.hero.pillText}</span>
      </div>

      {/* Hero Headline & Ringkasan Solusi Spasial */}
      <h1 className="text-[1.875rem] min-[400px]:text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance text-slate-900 max-w-4xl mx-auto leading-[1.12]">
        <span>{idCopy.hero.headlinePart1}</span>
        <span className="block text-[#16A34A] mt-1">{idCopy.hero.headlinePart2}</span>
      </h1>

      <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-base sm:text-xl text-slate-600 font-normal leading-relaxed">
        {idCopy.hero.description}
      </p>

      {/* Aksi Utama Sistem */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3">
        <Button as={Link} to="/peta" variant="primary" size="lg" className="w-full sm:w-auto sm:min-w-[180px]">
            <Compass className="w-5 h-5 text-emerald-400" />
            <span>{idCopy.hero.ctaOpenWebGis}</span>
          </Button>
        <Button as={Link} to="/sumber-air" variant="brand" size="lg" className="w-full sm:w-auto sm:min-w-[180px]">
            <Droplets className="w-5 h-5" />
            <span>Daftar Titik Air</span>
          </Button>
        <Button as={Link} to="/laporan" variant="secondary" size="lg" className="w-full sm:w-auto sm:min-w-[150px]">
            {idCopy.hero.ctaReportCondition}
          </Button>
      </div>

      {/* Visualisasi Peta WebGIS & Kontur Lapangan Topografis */}
      <div className="mt-10 sm:mt-14 relative max-w-5xl mx-auto rounded-2xl sm:rounded-3xl border border-slate-800 bg-[#0B1120] p-2 sm:p-4 overflow-hidden shadow-2xl">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#0F172A] border border-slate-800/80">
          {/* Topographic Contour Vectors & Grid Wireframe */}
          <div className="absolute inset-0">
            <svg className="w-full h-full opacity-60" viewBox="0 0 1000 600" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.4" />
                </pattern>
                <linearGradient id="slopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
                </linearGradient>
              </defs>
              <rect width="1000" height="600" fill="url(#slopeGrad)" />
              <rect width="1000" height="600" fill="url(#grid)" />

              {/* Realistic Topographic Contour Isolines */}
              <path d="M 0,220 C 180,240 320,160 500,190 C 680,220 820,140 1000,180" fill="none" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
              <text x="30" y="210" fill="#64748B" fontSize="10" fontFamily="monospace">1.150 mdpl (Puncak Lereng)</text>

              <path d="M 0,310 C 220,330 380,260 580,290 C 760,320 860,250 1000,270" fill="none" stroke="#22C55E" strokeWidth="1.2" strokeOpacity="0.45" />
              <text x="30" y="300" fill="#22C55E" fontSize="10" fontFamily="monospace" fillOpacity="0.7">1.000 mdpl (Zona Tangkapan Air Tuk Mulyo)</text>

              <path d="M 0,420 C 260,450 440,380 650,400 C 800,420 900,360 1000,380" fill="none" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
              <text x="30" y="410" fill="#64748B" fontSize="10" fontFamily="monospace">900 mdpl (Pemukiman Dusun Kemitir Lor)</text>

              <path d="M 0,510 C 280,530 460,480 700,500 C 840,510 920,460 1000,480" fill="none" stroke="#94A3B8" strokeWidth="0.8" strokeOpacity="0.25" />
              <text x="30" y="500" fill="#64748B" fontSize="10" fontFamily="monospace">850 mdpl (Lembah Pertanian Garon)</text>

              {/* Pipeline Transmission Network Vector */}
              <path d="M 280,280 L 460,340 L 640,430 L 780,480" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeOpacity="0.8" />
              <circle cx="280" cy="280" r="4" fill="#38BDF8" />
              <circle cx="460" cy="340" r="3" fill="#38BDF8" />
              <circle cx="640" cy="430" r="3" fill="#38BDF8" />
              <circle cx="780" cy="480" r="4" fill="#38BDF8" />
            </svg>
          </div>

          {/* Top Left: Geospatial Layer State */}
          <div className="absolute top-2 left-2 right-2 sm:right-auto sm:top-4 sm:left-4 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/80 text-[11px] sm:text-xs font-medium text-white text-left shadow-lg">
            <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">WebGIS Spasial: Kontur Elevasi + Jaringan Transmisi Pipa Swadaya</span>
          </div>

          {/* Top Right: Cadastral Coordinates Badge */}
          <div className="hidden sm:flex absolute top-4 right-4 items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs font-mono font-medium text-slate-300 shadow-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>7°13'42.6"S 110°18'55.8"E</span>
          </div>

          {/* Point 1: Tuk Mulyo */}
          <div className="absolute top-[32%] left-[12%] sm:top-[38%] sm:left-[24%] flex items-center gap-2 bg-white/95 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200/90 text-[11px] sm:text-xs font-semibold shadow-lg">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Tuk Mulyo (12.5 L/s • Aktif)</span>
          </div>

          {/* Point 2: Sumur Bor RW 02 */}
          <div className="absolute bottom-[24%] right-[10%] sm:bottom-[28%] sm:right-[26%] flex items-center gap-2 bg-white/95 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200/90 text-[11px] sm:text-xs font-semibold shadow-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Sumur Bor Sentral RW 02 (Akses Tangki)</span>
          </div>
        </div>
        {/* Pencarian Lokasi & Sumber Air Lapangan: below the preview on phones, overlaid from sm up */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="mt-2 sm:mt-0 sm:absolute sm:inset-x-4 sm:bottom-8 sm:mx-auto sm:max-w-xl bg-white/95 backdrop-blur-xl rounded-2xl p-1.5 sm:p-2 border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-2"
        >
          <Search className="w-5 h-5 text-slate-400 ml-2.5 shrink-0" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={idCopy.hero.searchPlaceholder}
            aria-label={idCopy.hero.searchPlaceholder}
            className="w-full min-w-0 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          <Button type="submit" variant="primary" size="md" className="shrink-0 px-4 sm:px-5">
            {idCopy.hero.searchButton}
          </Button>
        </form>
      </div>
    </section>
  );
};
