import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { Button } from '@kemitir/ui';
import {
  MapPin,
  Menu,
  X,
  Compass,
  BarChart3,
  Droplets,
  ShieldAlert,
  BookOpen,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Exactly 5 distinct, non-redundant primary destinations
  const navItems = [
    { label: 'Peta WebGIS', path: '/peta', icon: Compass },
    { label: 'Dasbor', path: '/dasbor', icon: BarChart3 },
    { label: 'Sumber Air', path: '/sumber-air', icon: Droplets },
    { label: 'Prioritas', path: '/prioritas', icon: ShieldAlert },
    { label: 'Edukasi', path: '/edukasi', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        
        {/* Brand Identity: Apple-grade Proportion & Hierarchy */}
        <Link to="/" className="flex items-center gap-3 group select-none shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(22,163,74,0.25)] group-hover:scale-105 group-active:scale-95 transition-all duration-150">
            <MapPin className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight group-hover:text-[#16A34A] transition-colors">
              {idCopy.brand.name}
            </span>
            <span className="text-xs text-slate-500 font-medium block leading-tight mt-0.5">
              {idCopy.brand.village}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links: Clean, Spaced, Zero Redundancy */}
        <nav className="hidden md:flex items-center gap-1 text-[15px]">
          {navItems.map((item) => {
            const active = isCurrent(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-2 rounded-xl transition-all font-medium ${
                  active
                    ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button (Right): Single, Distinct Primary Action (+ Lapor Krisis) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link to="/laporan">
            <Button
              variant="brand"
              size="md"
              className="gap-2 font-bold shadow-xs h-10 px-4 min-h-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Lapor Krisis Air</span>
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/laporan">
            <button className="h-9 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Lapor</span>
            </button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:text-slate-900 border border-slate-200/80 bg-slate-50 active:scale-95 transition-all"
            aria-label="Menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-2xl border-b border-slate-200/80 px-4 pt-3 pb-6 space-y-1.5 animate-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 py-3 px-3.5 rounded-xl text-base font-semibold transition-all ${
                  active
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/masuk"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Portal Validator / Petugas Desa</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
