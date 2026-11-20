import React from 'react';
import { idCopy } from '../../i18n/id';
import { WifiOff, HardDriveDownload, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';

export const TeaserOffline: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-slate-50/80 p-6 sm:p-10 lg:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-sm">
        {/* Left column */}
        <div className="md:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wide uppercase">
            <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
            <span>{idCopy.teaserOffline.badge}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
            {idCopy.teaserOffline.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {idCopy.teaserOffline.desc1}
          </p>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {idCopy.teaserOffline.desc2}
          </p>

          {/* Performance engineering highlight */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Offline Response: &lt;30ms</span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>IndexedDB + CacheStorage</span>
            </span>
          </div>
        </div>

        {/* Right column: Apple-grade device mockup */}
        <div className="md:col-span-5 flex justify-center">
          <div className="w-64 rounded-[32px] border-[3px] border-slate-800 bg-slate-950 p-2.5 shadow-xl">
            {/* Speaker bar */}
            <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto mb-2" />
            <div className="aspect-[9/16] bg-slate-900 rounded-[24px] p-3.5 flex flex-col justify-between border border-slate-800 text-white">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Kemitir PWA</span>
                </span>
                <span className="text-[10px] text-amber-400 font-medium">Mode Offline</span>
              </div>

              <div className="my-auto text-center space-y-2.5 py-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <HardDriveDownload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    3 Laporan Tersimpan Lokal
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1 leading-snug">
                    Koordinat GPS & foto terkompresi aman di perangkat warga
                  </span>
                </div>
              </div>

              <div className="w-full bg-[#16A34A] text-white text-[11px] py-2 rounded-xl text-center font-semibold shadow-sm">
                Sinkronisasi Otomatis Saat Online
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
