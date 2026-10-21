import React from 'react';
import { Link } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { Button } from '@kemitir/ui';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export const CtaCallout: React.FC = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-[8px] border border-[#E8EAED] bg-white p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column */}
        <div className="lg:col-span-6">
          <div className="flex items-center gap-2 mb-2 text-[#DC2626]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wider uppercase">
              Pengambilan Keputusan Berbasis Data
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#151A22] tracking-tight">
            {idCopy.ctaPriority.heading}
          </h3>
          <p className="mt-3 text-sm text-[#6F747C] leading-relaxed">
            {idCopy.ctaPriority.description}
          </p>
        </div>

        {/* Right column */}
        <div className="lg:col-span-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {idCopy.ctaPriority.links.map((link) => (
              <div
                key={link}
                className="p-3 rounded-[6px] border border-[#E8EAED] bg-[#F9FAFB] text-xs font-medium text-[#151A22] text-center"
              >
                {link}
              </div>
            ))}
          </div>

          <Link to="/prioritas" className="block w-full">
            <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
              <span>{idCopy.ctaPriority.actionButton}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
