import React from 'react';
import { Link } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const sections = idCopy.footer.sections;

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/70 text-slate-900 mt-auto">
      {/* Dense legible navigation grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              {sections.map.title}
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {sections.map.links.map((link) => (
                <li key={link}>
                  <Link to="/peta" className="hover:text-emerald-700 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              {sections.data.title}
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {sections.data.links.map((link) => (
                <li key={link}>
                  <Link to="/sumber-air" className="hover:text-emerald-700 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              {sections.reports.title}
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {sections.reports.links.map((link) => (
                <li key={link}>
                  <Link to="/laporan" className="hover:text-emerald-700 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              {sections.education.title}
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {sections.education.links.map((link) => (
                <li key={link}>
                  <Link to="/edukasi" className="hover:text-emerald-700 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              {sections.account.title}
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {sections.account.links.map((link) => (
                <li key={link}>
                  <Link to="/masuk" className="hover:text-emerald-700 transition-colors font-medium">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              {sections.legal.title}
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {sections.legal.links.map((link) => (
                <li key={link}>
                  <Link to="/privasi" className="hover:text-emerald-700 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Identity & Trust Badges */}
      <div className="border-t border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">
                {idCopy.brand.name}
              </span>
              <span className="text-xs text-slate-500 block">
                {idCopy.footer.copyright}
              </span>
            </div>
          </div>

          {/* Institutional Trust Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="px-3 py-1 rounded-full border border-slate-200 bg-slate-50">
              Universitas Diponegoro
            </span>
            <span className="px-3 py-1 rounded-full border border-slate-200 bg-slate-50">
              KKN Tematik 2026
            </span>
            <span className="px-3 py-1 rounded-full border border-slate-200 bg-slate-50">
              Pemerintah Desa Kemitir
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
