import React, { useEffect, useState } from 'react';
import { idCopy } from '../../i18n/id';

interface SummaryData {
  village: {
    areaHectares: number;
    population: number;
    waterSourcesCount: number;
    publicFacilitiesCount: number;
  };
}

export const ProofMetrics: React.FC = () => {
  const [data, setData] = useState<SummaryData | null>(null);

  useEffect(() => {
    fetch('/api/v1/dashboard/summary')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.village) setData(json);
      })
      .catch(() => {
        // Fallback to default copy values
      });
  }, []);

  const area = data ? `${data.village.areaHectares.toLocaleString('id-ID')} ha` : idCopy.metrics.areaValue;
  const population = data
    ? `${data.village.population.toLocaleString('id-ID')} jiwa`
    : idCopy.metrics.populationValue;
  const water = data
    ? `${data.village.waterSourcesCount} titik`
    : idCopy.metrics.waterSourcesValue;
  const facilities = data
    ? `${data.village.publicFacilitiesCount} unit`
    : idCopy.metrics.facilitiesValue;

  return (
    <section className="border-t border-b border-[#E8EAED] bg-[#F9FAFB] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#6F747C]">
            {idCopy.metrics.label}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-[#E8EAED] bg-white">
          <div className="p-6 border-r border-b border-[#E8EAED] text-center">
            <span className="block text-2xl sm:text-3xl font-bold text-[#151A22]">{area}</span>
            <span className="mt-1 block text-xs text-[#6F747C]">{idCopy.metrics.area}</span>
          </div>

          <div className="p-6 border-r border-b border-[#E8EAED] text-center">
            <span className="block text-2xl sm:text-3xl font-bold text-[#151A22]">{population}</span>
            <span className="mt-1 block text-xs text-[#6F747C]">{idCopy.metrics.population}</span>
          </div>

          <div className="p-6 border-r border-b border-[#E8EAED] text-center">
            <span className="block text-2xl sm:text-3xl font-bold text-[#2563EB]">{water}</span>
            <span className="mt-1 block text-xs text-[#6F747C]">{idCopy.metrics.waterSources}</span>
          </div>

          <div className="p-6 border-r border-b border-[#E8EAED] text-center">
            <span className="block text-2xl sm:text-3xl font-bold text-[#151A22]">{facilities}</span>
            <span className="mt-1 block text-xs text-[#6F747C]">{idCopy.metrics.facilities}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
