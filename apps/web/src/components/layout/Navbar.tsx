import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { Button } from '@kemitir/ui';
import {
  ChevronDown,
  MapPin,
  Menu,
  X,
  BarChart3,
  Droplets,
  ShieldAlert,
  BookOpen,
  AlertCircle,
  Compass,
  ArrowRight,
  Layers,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [thematicDropdownOpen, setThematicDropdownOpen] = useState(false);
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isMapPage = location.pathname === '/peta';

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Mark with Apple-grade polish */}
        <Link to="/" className="flex items-center gap-3.5 group select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(22,163,74,0.3)] group-hover:scale-105 group-active:scale-95 transition-all duration-150">
            <MapPin className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight group-hover:text-[#16A34A] transition-colors">
              {idCopy.brand.name}
            </span>
            <span className="text-xs text-slate-500 font-medium block leading-tight mt-0.5">
              {idCopy.brand.village}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (15px font, generous spacing for 30-50yo users) */}
        <nav className="hidden lg:flex items-center gap-1.5 text-[15px]">
          <Link
            to="/peta"
            className={`px-3.5 py-2 rounded-xl transition-all font-medium ${
              isCurrent('/peta')
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            {idCopy.nav.map}
          </Link>

          <Link
            to="/dasbor"
            className={`px-3.5 py-2 rounded-xl transition-all font-medium ${
              isCurrent('/dasbor')
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Dasbor
          </Link>

          <Link
            to="/sumber-air"
            className={`px-3.5 py-2 rounded-xl transition-all font-medium ${
              isCurrent('/sumber-air')
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            {idCopy.nav.waterSources}
          </Link>

          <Link
            to="/prioritas"
            className={`px-3.5 py-2 rounded-xl transition-all font-medium ${
              isCurrent('/prioritas')
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Prioritas
          </Link>

          {/* Thematic Maps Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThematicDropdownOpen(!thematicDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all font-medium text-[15px]"
              aria-expanded={thematicDropdownOpen}
            >
              <span>{idCopy.nav.thematicMaps}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200" />
            </button>

            {thematicDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <Link
                  to="/peta?mode=hazard"
                  onClick={() => setThematicDropdownOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium hover:bg-orange-50/80 text-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-semibold">Peta Bahaya Kekeringan</span>
                    <span className="block text-xs text-slate-500">Kelerengan, NDVI & curah hujan</span>
                  </div>
                </Link>

                <Link
                  to="/peta?mode=risk"
                  onClick={() => setThematicDropdownOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium hover:bg-red-50/80 text-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-semibold">Peta Risiko Kekeringan</span>
                    <span className="block text-xs text-slate-500">Keterpaparan warga & sawah</span>
                  </div>
                </Link>

                <Link
                  to="/peta?mode=participatory"
                  onClick={() => setThematicDropdownOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium hover:bg-purple-50/80 text-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-semibold">Peta Partisipatif Warga</span>
                    <span className="block text-xs text-slate-500">Pipa swadaya & laporan RT</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/laporan"
            className={`px-3.5 py-2 rounded-xl transition-all font-medium ${
              isCurrent('/laporan')
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            {idCopy.nav.reports}
          </Link>

          <Link
            to="/edukasi"
            className={`px-3.5 py-2 rounded-xl transition-all font-medium ${
              isCurrent('/edukasi')
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            {idCopy.nav.education}
          </Link>
        </nav>

        {/* Action Buttons: Essential & Contextual */}
        <div className="hidden lg:flex items-center gap-3">
          {isMapPage ? (
            <Link to="/laporan">
              <Button variant="danger" size="md" className="gap-2 shadow-sm font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>Lapor Krisis Air</span>
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/dasbor">
                <Button variant="secondary" size="md">
                  Dasbor
                </Button>
              </Link>
              <Link to="/peta">
                <Button variant="brand" size="md" className="gap-1.5 shadow-sm font-semibold">
                  <span>Buka Peta</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button (Apple HIG 44px min tap target) */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-700 hover:text-slate-900 border border-slate-200/80 bg-slate-50 active:scale-95 transition-all"
            aria-label="Buka menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Generous tap targets for adults aged 30-50) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-5 pt-3 pb-6 space-y-2.5 animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/peta"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 py-3 px-3.5 rounded-xl text-base font-semibold transition-all ${
              isCurrent('/peta')
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-5 h-5 text-emerald-600" />
            <span>Peta Interaktif WebGIS</span>
          </Link>

          <Link
            to="/dasbor"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 py-3 px-3.5 rounded-xl text-base font-semibold transition-all ${
              isCurrent('/dasbor')
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Dasbor Monitoring Desa</span>
          </Link>

          <Link
            to="/sumber-air"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 py-3 px-3.5 rounded-xl text-base font-semibold transition-all ${
              isCurrent('/sumber-air')
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Droplets className="w-5 h-5 text-blue-500" />
            <span>Direktori Sumber Air Bersih</span>
          </Link>

          <Link
            to="/prioritas"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 py-3 px-3.5 rounded-xl text-base font-semibold transition-all ${
              isCurrent('/prioritas')
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span>Prioritas Penanganan Bencana</span>
          </Link>

          <Link
            to="/laporan"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 py-3 px-3.5 rounded-xl text-base font-semibold transition-all ${
              isCurrent('/laporan')
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <AlertCircle className="w-5 h-5 text-purple-600" />
            <span>Lapor Krisis Air Warga</span>
          </Link>

          <Link
            to="/edukasi"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 py-3 px-3.5 rounded-xl text-base font-semibold transition-all ${
              isCurrent('/edukasi')
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Edukasi & SOP Bantuan Air</span>
          </Link>

          <Link
            to="/masuk"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 py-3 px-3.5 rounded-xl text-base font-semibold transition-all ${
              isCurrent('/masuk')
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-slate-500" />
            <span>Portal Validator & Petugas Desa</span>
          </Link>

          <div className="pt-2">
            <Link to="/laporan" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="danger" size="lg" className="w-full gap-2 shadow-sm font-semibold">
                <AlertCircle className="w-5 h-5" />
                <span>Form Lapor Krisis Air Darurat</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
