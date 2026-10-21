import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { Button } from '@kemitir/ui';
import { ChevronDown, MapPin, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [thematicDropdownOpen, setThematicDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8EAED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Mark */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[6px] bg-[#16A34A] flex items-center justify-center text-white shadow-sm">
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
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#151A22]">
          <Link to="/peta" className="hover:text-[#16A34A] transition-colors font-medium">
            {idCopy.nav.map}
          </Link>
          <Link to="/sumber-air" className="hover:text-[#16A34A] transition-colors font-medium">
            {idCopy.nav.waterSources}
          </Link>

          {/* Thematic Maps Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThematicDropdownOpen(!thematicDropdownOpen)}
              className="flex items-center gap-1 hover:text-[#16A34A] transition-colors font-medium text-sm"
              aria-expanded={thematicDropdownOpen}
            >
              <span>{idCopy.nav.thematicMaps}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6F747C]" />
            </button>

            {thematicDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#E8EAED] rounded-[6px] shadow-sm py-1.5 z-50">
                <Link
                  to="/peta?layer=bahaya-kekeringan"
                  onClick={() => setThematicDropdownOpen(false)}
                  className="block px-3 py-2 text-xs hover:bg-gray-50 text-[#151A22]"
                >
                  Peta Bahaya Kekeringan
                </Link>
                <Link
                  to="/peta?layer=risiko-kekeringan"
                  onClick={() => setThematicDropdownOpen(false)}
                  className="block px-3 py-2 text-xs hover:bg-gray-50 text-[#151A22]"
                >
                  Peta Risiko Kekeringan
                </Link>
                <Link
                  to="/peta?layer=peta-partisipatif"
                  onClick={() => setThematicDropdownOpen(false)}
                  className="block px-3 py-2 text-xs hover:bg-gray-50 text-[#151A22]"
                >
                  Peta Partisipatif Warga
                </Link>
              </div>
            )}
          </div>

          <Link to="/laporan" className="hover:text-[#16A34A] transition-colors font-medium">
            {idCopy.nav.reports}
          </Link>
          <Link to="/edukasi" className="hover:text-[#16A34A] transition-colors font-medium">
            {idCopy.nav.education}
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link to="/masuk">
            <Button variant="secondary" size="sm">
              {idCopy.nav.login}
            </Button>
          </Link>
          <Link to="/peta">
            <Button variant="primary" size="sm">
              {idCopy.nav.openMap}
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
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
        <div className="md:hidden bg-white border-b border-[#E8EAED] px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/peta"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#151A22] border-b border-[#E8EAED]"
          >
            {idCopy.nav.map}
          </Link>
          <Link
            to="/sumber-air"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#151A22] border-b border-[#E8EAED]"
          >
            {idCopy.nav.waterSources}
          </Link>
          <Link
            to="/laporan"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#151A22] border-b border-[#E8EAED]"
          >
            {idCopy.nav.reports}
          </Link>
          <Link
            to="/edukasi"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#151A22] border-b border-[#E8EAED]"
          >
            {idCopy.nav.education}
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/masuk" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full">
                {idCopy.nav.login}
              </Button>
            </Link>
            <Link to="/peta" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                {idCopy.nav.openMap}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
