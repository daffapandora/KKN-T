import React from 'react';
import { idCopy } from '../../i18n/id';
import { CloudRain, Satellite, MapPin, ClipboardList, Building2, KeyRound, CheckCircle2 } from 'lucide-react';

export const IntegrationsGrid: React.FC = () => {
  const icons = [CloudRain, Satellite, MapPin, ClipboardList, Building2, KeyRound];

  return (
    <section className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-xl border border-[#E8EAED] bg-white p-5 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Heading */}
        <div className="lg:col-span-5">
          <span className="text-xs font-semibold text-[#16A34A] uppercase tracking-wide block mb-2">
            Interoperabilitas Data
          </span>
          <h3 className="text-2xl font-bold text-[#151A22] tracking-tight">
            {idCopy.integrations.title}
          </h3>
          <p className="mt-3 text-sm text-[#6F747C] leading-relaxed">
            {idCopy.integrations.desc}
          </p>
        </div>

        {/* Right 2-column tiles with provenance status */}
        <div className="lg:col-span-7 grid grid-cols-1 min-[560px]:grid-cols-2 gap-3">
          {idCopy.integrations.items.map((item, idx) => {
            const IconComponent = icons[idx % icons.length];
            return (
              <div
                key={item.name}
                className="p-3.5 rounded-lg border border-[#E8EAED] bg-[#F9FAFB] flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 shrink-0 rounded-md bg-white border border-[#E8EAED] flex items-center justify-center text-[#151A22] text-[#16A34A]">
                    <IconComponent className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-[#151A22]">{item.name}</h5>
                    <span className="text-[11px] text-[#6F747C] block">{item.type}</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                  <span>Terhubung</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
