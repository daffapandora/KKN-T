import React from 'react';
import { Link } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { Button } from '@kemitir/ui';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export const CtaCallout: React.FC = () => {
  return (
    <section className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column */}
        <div className="lg:col-span-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Pengambilan Keputusan Berbasis Data Geodesi</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
            {idCopy.ctaPriority.heading}
          </h3>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            {idCopy.ctaPriority.description}
          </p>
        </div>

        {/* Right column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-2.5">
            {idCopy.ctaPriority.links.map((link, idx) => {
              const target = idx === 0 ? 'RT 02 Kemitir Kidul' : idx === 1 ? 'Garon' : 'Kalitengah';
              return (
                <Link
                  key={link}
                  to={`/peta?mode=priority&search=${encodeURIComponent(target)}`}
                  className="p-3 min-h-[48px] rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-sm font-semibold text-slate-800 text-center flex items-center justify-center transition-colors"
                >
                  {link}
                </Link>
              );
            })}
          </div>

          <Button as={Link} to="/prioritas" variant="primary" size="lg" className="w-full">
              <span>{idCopy.ctaPriority.actionButton}</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Button>
        </div>
      </div>
    </section>
  );
};
