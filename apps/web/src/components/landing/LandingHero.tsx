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
    }
  };

  return (
    <section className="pt-12 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      {/* 1. Apple Announcement Pill */}
      <div className="inline-flex items-center rounded-full border border-slate-200/90 bg-white/90 p-1.5 pr-4 text-xs sm:text-sm mb-8 shadow-xs backdrop-blur-md transition-all hover:border-slate-300">
        <span className="rounded-full bg-slate-900 text-white px-3 py-1 font-bold text-xs tracking-wide mr-3">
          {idCopy.hero.pillTag}
        </span>
        <span className="text-slate-600 font-semibold">{idCopy.hero.pillText}</span>
      </div>

      {/* 2. Hero Headline and Copy (Apple Large Legible Hierarchy) */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.12]">
        <span>{idCopy.hero.headlinePart1}</span>
        <span className="block text-[#16A34A] mt-1">{idCopy.hero.headlinePart2}</span>
      </h1>

      <p className="mt-6 max-w-2xl mx-auto text-base sm:text-xl text-slate-600 font-normal leading-relaxed">
        {idCopy.hero.description}
      </p>

      {/* 3. Hero CTAs (Apple 52px Minimum Height for 30-50yo Ergonomics) */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
        <Link to="/peta">
          <Button variant="primary" size="lg" className="min-w-[180px] gap-2 font-bold shadow-md">
            <Compass className="w-5 h-5 text-emerald-400" />
            <span>{idCopy.hero.ctaOpenWebGis}</span>
          </Button>
        </Link>
        <Link to="/sumber-air">
          <Button variant="brand" size="lg" className="min-w-[180px] gap-2 font-bold shadow-md">
            <Droplets className="w-5 h-5" />
            <span>Daftar Titik Air</span>
          </Button>
        </Link>
        <Link to="/laporan">
          <Button variant="secondary" size="lg" className="min-w-[150px] font-semibold border-slate-300">
            {idCopy.hero.ctaReportCondition}
          </Button>
        </Link>
      </div>

      {/* 4. Hero Demonstration Frame (Apple Dark Slate Glass) */}
      <div className="mt-14 relative max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-slate-950 p-2 sm:p-4 shadow-2xl overflow-hidden">
        {/* Atmospheric Map Preview Container */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80">
          {/* Simulated Satellite & Hazard Overlay Graphic */}
          <div className="absolute inset-0 opacity-80 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:20px_20px]">
            {/* Topographic contours and terrain simulation */}
            <svg className="w-full h-full opacity-40" viewBox="0 0 1000 600" preserveAspectRatio="none">
              <path
                d="M 50,150 Q 200,80 400,200 T 800,250 L 950,550 L 50,550 Z"
                fill="#16A34A"
                fillOpacity="0.3"
              />
              <path
                d="M 250,220 Q 450,150 650,260 T 900,400 L 950,550 L 250,550 Z"
                fill="#F59E0B"
                fillOpacity="0.3"
              />
              <path
                d="M 450,300 Q 600,220 750,320 T 850,500 L 900,550 L 450,550 Z"
                fill="#DC2626"
                fillOpacity="0.35"
              />
            </svg>
          </div>

          {/* Apple Frosted Badges on Map */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/85 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs sm:text-sm font-semibold text-white shadow-lg">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Peta Tematik: Bahaya + Sumber Air + Jalur Pipa</span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-900/85 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs sm:text-sm font-semibold text-white shadow-lg">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Desa Kemitir, Sumowono</span>
          </div>

          {/* Map water source pins */}
          <div className="absolute top-1/3 left-1/4 flex items-center gap-2 bg-white text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold shadow-md">
            <MapPin className="w-4 h-4 text-blue-600 fill-current" />
            <span>Tuk Mulyo (12.5 L/detik)</span>
          </div>

          <div className="absolute bottom-1/3 right-1/3 flex items-center gap-2 bg-white text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold shadow-md">
            <MapPin className="w-4 h-4 text-emerald-600 fill-current" />
            <span>Sumur Bor Sentral RW 02</span>
          </div>

          {/* Centered White Search Card Overlay (Apple Rounded Style) */}
          <div className="absolute inset-x-0 bottom-8 max-w-xl mx-auto px-4">
            <form
              onSubmit={handleSearch}
              className="bg-white/95 backdrop-blur-xl rounded-2xl p-2 border border-slate-200 shadow-xl flex items-center gap-2"
            >
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={idCopy.hero.searchPlaceholder}
                className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="h-11 px-5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-95 transition-all shrink-0 shadow-xs"
              >
                {idCopy.hero.searchButton}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
