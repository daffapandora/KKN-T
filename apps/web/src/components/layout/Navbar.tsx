import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { Button } from '@kemitir/ui';
import { ChevronDown, MapPin, Menu, X, BarChart3, Droplets, ShieldAlert, BookOpen, AlertCircle } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8EAED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Mark */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-[6px] bg-[#16A34A] group-hover:bg-[#15803D] transition-colors flex items-center justify-center text-white shadow-sm">
            <MapPin className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-[#151A22] block leading-none">
              {idCopy.brand.name}
            </span>
            <span className="text-[11px] text-[#6F747C] block leading-tight mt-0.5">
              {idCopy.brand.village}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm">
          <Link
            to="/peta"
            className={`transition-colors font-medium ${
              isCurrent('/peta') ? 'text-[#16A34A] font-semibold' : 'text-[#4A4F56] hover:text-[#151A22]'
            }`}
          >
            {idCopy.nav.map}
          </Link>

          <Link
            to="/dasbor"
            className={`transition-colors font-medium ${
              isCurrent('/dasbor') ? 'text-[#16A34A] font-semibold' : 'text-[#4A4F56] hover:text-[#151A22]'
            }`}
          >
            Dasbor
          </Link>

          <Link
            to="/sumber-air"
            className={`transition-colors font-medium ${
              isCurrent('/sumber-air') ? 'text-[#16A34A] font-semibold' : 'text-[#4A4F56] hover:text-[#151A22]'
            }`}
          >
            {idCopy.nav.waterSources}
          </Link>

          <Link
            to="/prioritas"
            className={`transition-colors font-medium ${
              isCurrent('/prioritas') ? 'text-[#16A34A] font-semibold' : 'text-[#4A4F56] hover:text-[#151A22]'
            }`}
          >
            Prioritas
          </Link>

          {/* Thematic Maps Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThematicDropdownOpen(!thematicDropdownOpen)}
              className="flex items-center gap-1 text-[#4A4F56] hover:text-[#151A22] transition-colors font-medium text-sm"
              aria-expanded={thematicDropdownOpen}
            >
              <span>{idCopy.nav.thematicMaps}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6F747C]" />
            </button>

            {thematicDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#E8EAED] rounded-[8px] shadow-lg py-1.5 z-50">
                <Link
                  to="/peta?layer=bahaya-kekeringan"
                  onClick={() => setThematicDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-orange-50 text-[#151A22]"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                  <span>Peta Bahaya Kekeringan</span>
                </Link>
                <Link
                  to="/peta?layer=risiko-kekeringan"
                  onClick={() => setThematicDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-red-50 text-[#151A22]"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                  <span>Peta Risiko Kekeringan</span>
                </Link>
                <Link
                  to="/peta?layer=peta-partisipatif"
                  onClick={() => setThematicDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-purple-50 text-[#151A22]"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                  <span>Peta Partisipatif Warga</span>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/laporan"
            className={`transition-colors font-medium ${
              isCurrent('/laporan') ? 'text-[#16A34A] font-semibold' : 'text-[#4A4F56] hover:text-[#151A22]'
            }`}
          >
            {idCopy.nav.reports}
          </Link>

          <Link
            to="/edukasi"
            className={`transition-colors font-medium ${
              isCurrent('/edukasi') ? 'text-[#16A34A] font-semibold' : 'text-[#4A4F56] hover:text-[#151A22]'
            }`}
          >
            {idCopy.nav.education}
          </Link>
        </nav>

        {/* Action Buttons: Non-redundant */}
        <div className="hidden lg:flex items-center gap-2.5">
          {isMapPage ? (
            <Link to="/laporan">
              <Button variant="primary" size="sm" className="shadow-sm">
                Lapor Krisis Air
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/dasbor">
                <Button variant="secondary" size="sm">
                  Dasbor
                </Button>
              </Link>
              <Link to="/peta">
                <Button variant="primary" size="sm" className="shadow-sm">
                  {idCopy.nav.openMap}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-[6px] text-[#6F747C] hover:text-[#151A22] border border-[#E8EAED]"
            aria-label="Buka menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E8EAED] px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/peta"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-sm font-medium border-b border-[#E8EAED] ${
              isCurrent('/peta') ? 'text-[#16A34A] font-bold' : 'text-[#151A22]'
            }`}
          >
            {idCopy.nav.map}
          </Link>
          <Link
            to="/dasbor"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-sm font-medium border-b border-[#E8EAED] ${
              isCurrent('/dasbor') ? 'text-[#16A34A] font-bold' : 'text-[#151A22]'
            }`}
          >
            Dasbor Monitoring
          </Link>
          <Link
            to="/sumber-air"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-sm font-medium border-b border-[#E8EAED] ${
              isCurrent('/sumber-air') ? 'text-[#16A34A] font-bold' : 'text-[#151A22]'
            }`}
          >
            {idCopy.nav.waterSources}
          </Link>
          <Link
            to="/prioritas"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-sm font-medium border-b border-[#E8EAED] ${
              isCurrent('/prioritas') ? 'text-[#16A34A] font-bold' : 'text-[#151A22]'
            }`}
          >
            Prioritas Penanganan Bencana
          </Link>
          <Link
            to="/laporan"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-sm font-medium border-b border-[#E8EAED] ${
              isCurrent('/laporan') ? 'text-[#16A34A] font-bold' : 'text-[#151A22]'
            }`}
          >
            {idCopy.nav.reports}
          </Link>
          <Link
            to="/edukasi"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-sm font-medium border-b border-[#E8EAED] ${
              isCurrent('/edukasi') ? 'text-[#16A34A] font-bold' : 'text-[#151A22]'
            }`}
          >
            {idCopy.nav.education}
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/laporan" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                Form Lapor Krisis Air
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
