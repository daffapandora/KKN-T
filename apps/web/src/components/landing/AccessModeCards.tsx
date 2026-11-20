import React from 'react';
import { Link } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { Globe, Smartphone, FileText, ArrowRight } from 'lucide-react';

export const AccessModeCards: React.FC = () => {
  return (
    <section className="border-y border-slate-200/80 bg-white py-2 sm:py-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
        {/* Card 1: WebGIS */}
        <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-between hover:bg-slate-50/60 transition-colors group">
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-md">
                Spasial Desktop
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {idCopy.accessModes.webgis.title}
            </h3>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {idCopy.accessModes.webgis.desc}
            </p>
          </div>
          <div className="mt-5 sm:mt-8">
            <Link
              to="/peta"
              className="inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
            >
              <span>{idCopy.accessModes.webgis.link.replace(' →', '')}</span>
              <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 2: Akses Mobile & Offline */}
        <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-between hover:bg-slate-50/60 transition-colors group">
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-11 h-11 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-sm">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-medium text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                Offline PWA
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {idCopy.accessModes.pwa.title}
            </h3>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {idCopy.accessModes.pwa.desc}
            </p>
          </div>
          <div className="mt-5 sm:mt-8">
            <Link
              to="/sumber-air"
              className="inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-slate-900 hover:text-blue-700 transition-colors"
            >
              <span>Lihat Sumber Air & Navigasi</span>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 3: Laporan Warga */}
        <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-between hover:bg-slate-50/60 transition-colors group">
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-medium text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                Partisipatif
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {idCopy.accessModes.citizenReport.title}
            </h3>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {idCopy.accessModes.citizenReport.desc}
            </p>
          </div>
          <div className="mt-5 sm:mt-8">
            <Link
              to="/laporan"
              className="inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
            >
              <span>{idCopy.accessModes.citizenReport.link.replace(' →', '')}</span>
              <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
