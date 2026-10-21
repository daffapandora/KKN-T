import React from 'react';
import { idCopy } from '../../i18n/id';
import { CloudRain, Satellite, MapPin, ClipboardList, Building2, KeyRound, ExternalLink } from 'lucide-react';

export const IntegrationsGrid: React.FC = () => {
  const icons = [CloudRain, Satellite, MapPin, ClipboardList, Building2, KeyRound];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-[8px] border border-[#E8EAED] bg-white p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Heading */}
        <div className="lg:col-span-5">
          <span className="text-xs font-bold text-[#16A34A] tracking-wider uppercase block mb-2">
            Interoperabilitas Data
          </span>
          <h3 className="text-2xl font-bold text-[#151A22] tracking-tight">
            {idCopy.integrations.title}
          </h3>
          <p className="mt-3 text-sm text-[#6F747C] leading-relaxed">
            {idCopy.integrations.desc}
          </p>
        </div>

        {/* Right 2-column tiles */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {idCopy.integrations.items.map((item, idx) => {
            const IconComponent = icons[idx % icons.length];
            return (
              <div
                key={item.name}
                className="p-3.5 rounded-[6px] border border-[#E8EAED] bg-[#F9FAFB] hover:bg-white hover:border-gray-300 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-white border border-[#E8EAED] flex items-center justify-center text-[#151A22] group-hover:text-[#16A34A] transition-colors">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-[#151A22]">{item.name}</h5>
                    <span className="text-[11px] text-[#6F747C] block">{item.type}</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#151A22] transition-colors" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
