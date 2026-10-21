import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { Button } from '@kemitir/ui';
import { Search, Layers, ShieldCheck, MapPin } from 'lucide-react';

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
    <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      {/* 1. Announcement Pill */}
      <div className="inline-flex items-center rounded-full border border-[#E8EAED] bg-white p-1 pr-3 text-xs mb-8 transition-colors hover:border-gray-300">
        <span className="rounded-full bg-[#17202B] text-white px-2.5 py-0.5 font-semibold text-[11px] tracking-wide mr-2.5">
          {idCopy.hero.pillTag}
        </span>
        <span className="text-[#6F747C] font-medium">{idCopy.hero.pillText}</span>
      </div>

      {/* 2. Hero Headline and Copy */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#151A22] max-w-4xl mx-auto leading-[1.15]">
        <span>{idCopy.hero.headlinePart1}</span>
        <span className="block text-[#16A34A]">{idCopy.hero.headlinePart2}</span>
      </h1>

      <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-[#6F747C] font-normal leading-relaxed">
        {idCopy.hero.description}
      </p>

      {/* 3. Hero CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/peta">
          <Button variant="primary" size="lg" className="min-w-[150px]">
            {idCopy.hero.ctaOpenWebGis}
          </Button>
        </Link>
        <Link to="/laporan">
          <Button variant="outline" size="lg" className="min-w-[150px]">
            {idCopy.hero.ctaReportCondition}
          </Button>
        </Link>
      </div>

      {/* 4. Hero Product Demonstration Frame */}
      <div className="mt-14 relative max-w-5xl mx-auto rounded-[8px] border border-[#E8EAED] bg-[#17202B] p-2 sm:p-4 shadow-sm overflow-hidden">
        {/* Atmospheric Map Preview Container */}
        <div className="relative aspect-[16/9] w-full rounded-[6px] overflow-hidden bg-slate-900 border border-slate-800">
          {/* Simulated Satellite & Hazard Overlay Graphic */}
          <div className="absolute inset-0 opacity-80 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Topographic contours and terrain simulation */}
            <svg className="w-full h-full opacity-40" viewBox="0 0 1000 600" preserveAspectRatio="none">
              <path
                d="M 50,150 Q 200,80 400,200 T 800,250 L 950,550 L 50,550 Z"
                fill="#16A34A"
                fillOpacity="0.25"
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

          {/* Interactive UI Badge Overlay on Map */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#17202B]/90 backdrop-blur-md px-3 py-1.5 rounded-[6px] border border-slate-700 text-xs text-white">
            <Layers className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Layer Aktif: Bahaya + Sumber Air + Partisipatif</span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#17202B]/90 backdrop-blur-md px-3 py-1.5 rounded-[6px] border border-slate-700 text-xs text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Desa Kemitir, Sumowono</span>
          </div>

          {/* Map water source pins */}
          <div className="absolute top-1/3 left-1/4 flex items-center gap-1.5 bg-white text-[#151A22] px-2 py-1 rounded-[4px] border border-slate-300 text-[11px] font-medium shadow-sm">
            <MapPin className="w-3 h-3 text-[#2563EB] fill-current" />
            <span>Tuk Mulyo (12.5 L/detik)</span>
          </div>

          <div className="absolute bottom-1/3 right-1/3 flex items-center gap-1.5 bg-white text-[#151A22] px-2 py-1 rounded-[4px] border border-slate-300 text-[11px] font-medium shadow-sm">
            <MapPin className="w-3 h-3 text-[#2563EB] fill-current" />
            <span>Sumur Bor Sentral RW 02</span>
          </div>

          {/* Centered White Search Card Overlay */}
          <div className="absolute inset-x-0 bottom-8 max-w-xl mx-auto px-4">
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-[8px] p-2 border border-[#E8EAED] shadow-md flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-[#6F747C] ml-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={idCopy.hero.searchPlaceholder}
                className="w-full text-sm text-[#151A22] placeholder:text-[#6F747C] focus:outline-none"
              />
              <button
                type="submit"
                className="h-9 px-4 rounded-[6px] bg-[#17202B] text-white text-xs font-medium hover:bg-[#232F3E] transition-colors shrink-0"
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
