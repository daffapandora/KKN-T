import React from 'react';
import { Link } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { MapPin } from 'lucide-react';

interface FooterLinkItem {
  label: string;
  to: string;
}

interface FooterSection {
  title: string;
  links: FooterLinkItem[];
}

export const Footer: React.FC = () => {
  const sections: FooterSection[] = [
    {
      title: 'Peta Spasial',
      links: [
        { label: 'WebGIS Publik', to: '/peta' },
        { label: 'Peta Bahaya Kekeringan', to: '/peta?mode=hazard' },
        { label: 'Peta Risiko Kebencanaan', to: '/peta?mode=risk' },
        { label: 'Jalur Pipa Partisipatif', to: '/peta?mode=participatory' },
      ],
    },
    {
      title: 'Data & Logistik',
      links: [
        { label: 'Direktori Sumber Air', to: '/sumber-air' },
        { label: 'Matriks Prioritas', to: '/prioritas' },
        { label: 'Dasbor Pemantauan', to: '/dasbor' },
      ],
    },
    {
      title: 'Laporan Warga',
      links: [
        { label: 'Lapor Masalah Air', to: '/laporan' },
        { label: 'Status Validasi Lapangan', to: '/dasbor' },
      ],
    },
    {
      title: 'Edukasi & Mitigasi',
      links: [
        { label: 'Panduan Mitigasi & SOP', to: '/edukasi' },
        { label: 'Kontak Darurat Tangki', to: '/edukasi' },
      ],
    },
    {
      title: 'Portal Petugas',
      links: [
        { label: 'Masuk Akun / Aktivasi', to: '/masuk' },
      ],
    },
    {
      title: 'Legalitas',
      links: [
        { label: 'Kebijakan Privasi (UU PDP)', to: '/privasi' },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-6 sm:gap-y-8">
          {sections.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h2 className="text-xs font-bold uppercase tracking-wide text-slate-900 mb-1 sm:mb-2">
                {section.title}
              </h2>
              <ul className="text-sm text-slate-600 space-y-1">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="flex items-center min-h-[44px] sm:min-h-[32px] hover:text-emerald-700 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <MapPin className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-bold text-slate-900 block">{idCopy.brand.name}</span>
              <span className="text-xs text-slate-500 block">{idCopy.footer.copyright}</span>
            </div>
          </div>

          <ul className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
            {['Universitas Diponegoro', 'KKN Tematik 2026', 'Pemerintah Desa Kemitir'].map((label) => (
              <li key={label} className="px-3 py-1 rounded-full border border-slate-200 bg-slate-50">
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
