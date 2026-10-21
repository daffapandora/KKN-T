import React from 'react';
import { idCopy } from '../../i18n/id';
import { Quote } from 'lucide-react';

export const TestimonialCard: React.FC = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="border-t border-[#E8EAED] pt-10 pb-6">
        <Quote className="w-8 h-8 text-[#16A34A] opacity-80 mb-4" />
        <blockquote className="text-lg sm:text-xl font-normal text-[#151A22] leading-relaxed max-w-4xl">
          {idCopy.testimonial.quote}
        </blockquote>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#E8EAED] pt-4">
          {/* Lower left attribution */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#17202B] text-white flex items-center justify-center text-xs font-semibold">
              PK
            </div>
            <div>
              <span className="text-xs font-semibold text-[#151A22] block">
                {idCopy.testimonial.author}
              </span>
              <span className="text-[11px] text-[#6F747C] block">
                {idCopy.testimonial.role}
              </span>
            </div>
          </div>

          {/* Lower right mark */}
          <div className="text-right">
            <span className="text-[11px] font-medium text-[#6F747C] block">
              Kolaborasi KKN Tematik 2026
            </span>
            <span className="text-xs font-semibold text-[#151A22] block">
              Universitas Diponegoro × Desa Kemitir
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
