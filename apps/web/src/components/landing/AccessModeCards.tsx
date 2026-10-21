import React from 'react';
import { Link } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { Globe, Smartphone, FileText } from 'lucide-react';

export const AccessModeCards: React.FC = () => {
  return (
    <section className="border-y border-[#E8EAED] bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E8EAED]">
        {/* Card 1: WebGIS */}
        <div className="p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-[6px] border border-[#E8EAED] bg-[#F9FAFB] flex items-center justify-center text-[#151A22] mb-5">
              <Globe className="w-5 h-5 text-[#16A34A]" />
            </div>
            <h3 className="text-lg font-semibold text-[#151A22]">
              {idCopy.accessModes.webgis.title}
            </h3>
            <p className="mt-2 text-sm text-[#6F747C] leading-relaxed">
              {idCopy.accessModes.webgis.desc}
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/peta"
              className="text-xs font-semibold text-[#151A22] hover:text-[#16A34A] transition-colors"
            >
              {idCopy.accessModes.webgis.link}
            </Link>
          </div>
        </div>

        {/* Card 2: Aplikasi PWA/Android */}
        <div className="p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-[6px] border border-[#E8EAED] bg-[#F9FAFB] flex items-center justify-center text-[#151A22] mb-5">
              <Smartphone className="w-5 h-5 text-[#2563EB]" />
            </div>
            <h3 className="text-lg font-semibold text-[#151A22]">
              {idCopy.accessModes.pwa.title}
            </h3>
            <p className="mt-2 text-sm text-[#6F747C] leading-relaxed">
              {idCopy.accessModes.pwa.desc}
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/aplikasi"
              className="text-xs font-semibold text-[#151A22] hover:text-[#2563EB] transition-colors"
            >
              {idCopy.accessModes.pwa.link}
            </Link>
          </div>
        </div>

        {/* Card 3: Laporan Warga */}
        <div className="p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-[6px] border border-[#E8EAED] bg-[#F9FAFB] flex items-center justify-center text-[#151A22] mb-5">
              <FileText className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <h3 className="text-lg font-semibold text-[#151A22]">
              {idCopy.accessModes.citizenReport.title}
            </h3>
            <p className="mt-2 text-sm text-[#6F747C] leading-relaxed">
              {idCopy.accessModes.citizenReport.desc}
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/laporan"
              className="text-xs font-semibold text-[#151A22] hover:text-[#7C3AED] transition-colors"
            >
              {idCopy.accessModes.citizenReport.link}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
