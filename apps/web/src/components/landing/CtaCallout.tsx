import React from 'react';
import { Link } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { Button } from '@kemitir/ui';
import { ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CtaCallout: React.FC = () => {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.03)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column */}
        <div className="lg:col-span-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wide">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Pengambilan Keputusan Berbasis Data Geodesi</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {idCopy.ctaPriority.heading}
          </h3>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            {idCopy.ctaPriority.description}
          </p>
        </div>

        {/* Right column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {idCopy.ctaPriority.links.map((link) => (
              <div
                key={link}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 text-xs sm:text-sm font-semibold text-slate-800 text-center flex items-center justify-center shadow-xs"
              >
                {link}
              </div>
            ))}
          </div>

          <Link to="/prioritas" className="block w-full pt-2">
            <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2.5 font-bold shadow-md">
              <span>{idCopy.ctaPriority.actionButton}</span>
              <ArrowRight className="w-5 h-5 text-emerald-400" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
