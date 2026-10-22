import React from 'react';
import { Link } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { Globe, Smartphone, FileText, ArrowRight } from 'lucide-react';

export const AccessModeCards: React.FC = () => {
  return (
    <section className="border-y border-slate-200/80 bg-white py-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
        {/* Card 1: WebGIS */}
        <div className="p-8 lg:p-10 flex flex-col justify-between hover:bg-slate-50/50 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 mb-6 shadow-xs">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {idCopy.accessModes.webgis.title}
            </h3>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              {idCopy.accessModes.webgis.desc}
            </p>
          </div>
          <div className="mt-8">
            <Link
              to="/peta"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors group"
            >
              <span>{idCopy.accessModes.webgis.link}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 2: Akses Mobile & Offline */}
        <div className="p-8 lg:p-10 flex flex-col justify-between hover:bg-slate-50/50 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 mb-6 shadow-xs">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {idCopy.accessModes.pwa.title}
            </h3>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              {idCopy.accessModes.pwa.desc}
            </p>
          </div>
          <div className="mt-8">
            <Link
              to="/sumber-air"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 transition-colors group"
            >
              <span>Lihat Sumber Air & Navigasi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 3: Laporan Warga */}
        <div className="p-8 lg:p-10 flex flex-col justify-between hover:bg-slate-50/50 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-600 mb-6 shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {idCopy.accessModes.citizenReport.title}
            </h3>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              {idCopy.accessModes.citizenReport.desc}
            </p>
          </div>
          <div className="mt-8">
            <Link
              to="/laporan"
              className="inline-flex items-center gap-2 text-sm font-bold text-purple-700 hover:text-purple-800 transition-colors group"
            >
              <span>{idCopy.accessModes.citizenReport.link}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
