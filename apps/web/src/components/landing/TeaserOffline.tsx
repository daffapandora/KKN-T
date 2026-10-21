import React from 'react';
import { idCopy } from '../../i18n/id';
import { WifiOff, HardDriveDownload } from 'lucide-react';

export const TeaserOffline: React.FC = () => {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-[8px] border border-[#E8EAED] bg-[#F9FAFB] p-8 lg:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left column */}
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#17202B] text-white text-[11px] font-semibold tracking-wide uppercase mb-4">
            <WifiOff className="w-3 h-3 text-[#16A34A]" />
            <span>{idCopy.teaserOffline.badge}</span>
          </div>

          <h3 className="text-2xl font-bold text-[#151A22] tracking-tight">
            {idCopy.teaserOffline.title}
          </h3>

          <p className="mt-3 text-sm text-[#6F747C] leading-relaxed">
            {idCopy.teaserOffline.desc1}
          </p>

          <p className="mt-2 text-sm text-[#6F747C] leading-relaxed">
            {idCopy.teaserOffline.desc2}
          </p>
        </div>

        {/* Right column: Framed device mockup */}
        <div className="md:col-span-5 flex justify-center">
          <div className="w-56 rounded-[12px] border-2 border-[#17202B] bg-white p-3 shadow-sm">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
            <div className="aspect-[9/16] bg-slate-50 border border-[#E8EAED] rounded-[8px] p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-gray-500 border-b border-gray-200 pb-2">
                <span>Offline Cache</span>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </div>

              <div className="my-auto text-center space-y-2">
                <HardDriveDownload className="w-6 h-6 text-[#16A34A] mx-auto" />
                <span className="text-[11px] font-semibold text-gray-800 block">
                  3 Laporan Terantre
                </span>
                <span className="text-[9px] text-gray-500 block leading-tight">
                  Sinkronisasi otomatis saat terhubung internet
                </span>
              </div>

              <div className="w-full bg-[#17202B] text-white text-[9px] py-1.5 rounded text-center font-medium">
                Simpan di Perangkat
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
