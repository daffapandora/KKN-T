import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { Button } from '@kemitir/ui';
import { useAuth } from '../../context/AuthContext';
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
  LogOut,
  User,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close the drawer whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on Escape key press (R-32)
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock page scroll behind the drawer so the sheet is the only scroll surface
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileMenuOpen]);

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Peta WebGIS', path: '/peta', icon: Compass },
    { label: 'Dasbor', path: '/dasbor', icon: BarChart3 },
    { label: 'Sumber Air', path: '/sumber-air', icon: Droplets },
    { label: 'Prioritas', path: '/prioritas', icon: ShieldAlert },
    { label: 'Edukasi', path: '/edukasi', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 group select-none min-w-0 min-h-[44px]"
          aria-label={`${idCopy.brand.name}, ke beranda`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#16A34A] flex items-center justify-center text-white shrink-0">
            <MapPin className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 block leading-tight truncate">
              {idCopy.brand.name}
            </span>
            <span className="hidden min-[380px]:block text-[11px] sm:text-xs text-slate-500 font-medium leading-tight mt-0.5 truncate">
              {idCopy.brand.village}
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <nav aria-label="Navigasi utama" className="hidden lg:flex items-center gap-1 text-[15px]">
          {navItems.map((item) => {
            const active = isCurrent(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={`px-3.5 min-h-[40px] inline-flex items-center rounded-xl transition-colors font-medium ${
                  active
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions & Auth status */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <Button as={Link} to="/laporan" variant="brand" size="md" className="min-h-[40px] py-0">
            <PlusCircle className="w-4 h-4" aria-hidden="true" />
            <span>Lapor Krisis Air</span>
          </Button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                to="/dasbor"
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-semibold text-slate-800"
                title="Buka Dasbor Petugas/Warga"
              >
                {user.role === 'validator' || user.role === 'admin' ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <User className="w-4 h-4 text-slate-600 shrink-0" />
                )}
                <span className="truncate max-w-[120px]">{user.name.split(' ')[0]}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-white text-slate-700 shadow-2xs">
                  {user.role === 'validator' ? `RT ${user.rt || '-'}` : user.role === 'admin' ? 'Admin' : 'Warga'}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-slate-500 hover:text-rose-600 px-2 min-h-[36px]"
                title="Keluar Akun"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button as={Link} to="/masuk" variant="secondary" size="md" className="min-h-[40px] py-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Masuk</span>
            </Button>
          )}
        </div>

        {/* Compact actions (phones and tablets) */}
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <Button as={Link} to="/laporan" variant="brand" size="sm" className="px-3.5">
            <PlusCircle className="w-4 h-4" aria-hidden="true" />
            <span>Lapor</span>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {/* Drawer: scrolls on its own so tall menus never run off short phones */}
      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Tutup menu"
            tabIndex={-1}
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-x-0 top-14 sm:top-16 bottom-0 bg-slate-900/30 cursor-default"
          />
          <div
            id="mobile-menu-drawer"
            className="lg:hidden absolute inset-x-0 top-full bg-white border-b border-slate-200 px-3 sm:px-6 pt-2 pb-4 max-h-[calc(100dvh-3.5rem)] sm:max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain"
          >
            <nav aria-label="Menu navigasi">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isCurrent(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center gap-3 min-h-[48px] px-3.5 rounded-xl text-base transition-colors ${
                          active
                            ? 'bg-slate-100 text-slate-900 font-semibold'
                            : 'text-slate-700 font-medium hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-emerald-600' : 'text-slate-400'}`} aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-2 pt-2 border-t border-slate-100">
              {isAuthenticated && user ? (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-900 block truncate">{user.name}</span>
                      <span className="text-xs text-emerald-800 font-semibold block">
                        {user.role === 'validator' ? `Validator RT ${user.rt || '-'}` : user.role === 'admin' ? 'Administrator Desa' : `Warga ${user.dusun || ''}`}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-rose-600 hover:text-rose-800 px-2.5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </Button>
                  </div>
                  <Link
                    to="/dasbor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 text-xs font-semibold text-slate-700 bg-white rounded-xl border border-slate-200 hover:bg-slate-100"
                  >
                    Buka Dasbor Petugas / Warga
                  </Link>
                </div>
              ) : (
                <Link
                  to="/masuk"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 min-h-[48px] px-3.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />
                  <span>Portal Petugas & Warga</span>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};
