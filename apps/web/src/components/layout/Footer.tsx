import React from 'react';
import { Link } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const sections = idCopy.footer.sections;

  return (
    <footer className="border-t border-[#E8EAED] bg-[#F9FAFB] text-[#151A22]">
      {/* 15. Dense pale-gray navigation grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#151A22] mb-3">
              {sections.map.title}
            </h5>
            <ul className="space-y-2 text-xs text-[#6F747C]">
              {sections.map.links.map((link) => (
                <li key={link}>
                  <Link to="/peta" className="hover:text-[#151A22] transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#151A22] mb-3">
              {sections.data.title}
            </h5>
            <ul className="space-y-2 text-xs text-[#6F747C]">
              {sections.data.links.map((link) => (
                <li key={link}>
                  <Link to="/sumber-air" className="hover:text-[#151A22] transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#151A22] mb-3">
              {sections.reports.title}
            </h5>
            <ul className="space-y-2 text-xs text-[#6F747C]">
              {sections.reports.links.map((link) => (
                <li key={link}>
                  <Link to="/laporan" className="hover:text-[#151A22] transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#151A22] mb-3">
              {sections.education.title}
            </h5>
            <ul className="space-y-2 text-xs text-[#6F747C]">
              {sections.education.links.map((link) => (
                <li key={link}>
                  <Link to="/edukasi" className="hover:text-[#151A22] transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#151A22] mb-3">
              {sections.account.title}
            </h5>
            <ul className="space-y-2 text-xs text-[#6F747C]">
              {sections.account.links.map((link) => (
                <li key={link}>
                  <Link to="/masuk" className="hover:text-[#151A22] transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#151A22] mb-3">
              {sections.legal.title}
            </h5>
            <ul className="space-y-2 text-xs text-[#6F747C]">
              {sections.legal.links.map((link) => (
                <li key={link}>
                  <Link to="/privasi" className="hover:text-[#151A22] transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 16. Footer identity & trust badges */}
      <div className="border-t border-[#E8EAED] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-[4px] bg-[#16A34A] flex items-center justify-center text-white">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#151A22] block">
                {idCopy.brand.name}
              </span>
              <span className="text-[11px] text-[#6F747C] block">
                {idCopy.footer.copyright}
              </span>
            </div>
          </div>

          {/* Small trust badges */}
          <div className="flex items-center gap-4 text-[11px] text-[#6F747C]">
            <span className="px-2 py-1 rounded border border-[#E8EAED] bg-[#F9FAFB]">
              Universitas Diponegoro
            </span>
            <span className="px-2 py-1 rounded border border-[#E8EAED] bg-[#F9FAFB]">
              KKN Tematik 2026
            </span>
            <span className="px-2 py-1 rounded border border-[#E8EAED] bg-[#F9FAFB]">
              Pemerintah Desa Kemitir
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
