import React from 'react';
import { idCopy } from '../../i18n/id';
import { Map, Database, Satellite, Compass } from 'lucide-react';

export const CoverageStatement: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <p className="text-sm sm:text-base font-medium text-[#151A22] max-w-2xl mx-auto leading-relaxed">
        {idCopy.coverage.statement}
      </p>

      {/* Airy hairline-ruled grid of monochrome marks */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-t border-l border-[#E8EAED]">
        {idCopy.coverage.items.map((item, index) => {
          const icons = [Compass, Map, Database, Satellite, Map, Compass];
          const IconComponent = icons[index % icons.length];
          return (
            <div
              key={item}
              className="p-4 sm:p-5 border-r border-b border-[#E8EAED] flex flex-col items-center justify-center text-center transition-colors hover:bg-gray-50"
            >
              <IconComponent className="w-4 h-4 text-[#6F747C] mb-2" />
              <span className="text-xs font-medium text-[#151A22]">{item}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
