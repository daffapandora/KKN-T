import React, { useState } from 'react';
import { Card, Button, StatusChip } from '@kemitir/ui';
import { Droplets, Navigation, Search, Filter, Compass, AlertCircle, CheckCircle2, ChevronRight, Truck, Gauge, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WaterSourceItem, WATER_SOURCES_DATA } from '../data/waterSources';

export const WaterSourcesPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const waterSourcesData: WaterSourceItem[] = WATER_SOURCES_DATA;

  const filteredSources = waterSourcesData.filter((item) => {
    const matchType = selectedType === 'all' || item.type === selectedType;
    const matchCondition = selectedCondition === 'all' || item.condition === selectedCondition;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dusun.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchCondition && matchSearch;
  });

  const totalDebit = waterSourcesData.reduce((acc, curr) => acc + curr.debit, 0);
  const totalBeneficiaries = waterSourcesData.reduce((acc, curr) => acc + curr.beneficiariesKK, 0);
  const truckCount = waterSourcesData.filter((s) => s.truckAccessible).length;

  const openRouteInMaps = (lng: number, lat: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const typeOptions = [
    { id: 'all', label: 'Semua Sarana' },
    { id: 'Mata Air', label: 'Mata Air Alami' },
    { id: 'Sumur Bor', label: 'Sumur Bor' },
    { id: 'Embung', label: 'Embung Pertanian' },
  ];

  const conditionOptions = [
    { id: 'all', label: 'Semua Kondisi' },
    { id: 'Baik / Layak', label: 'Debit Baik' },
    { id: 'Debit Menurun', label: 'Debit Menurun' },
    { id: 'Kritis saat Kemarau', label: 'Kritis' },
  ];

  return (
    <div className="flex-1 bg-slate-50 py-5 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
        
        {/* 1. Header Direktori Sumber Air */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-5 sm:gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
              <Droplets className="w-3.5 h-3.5" />
              <span>Direktori Resmi Sumber Daya Air • Desa Kemitir</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
              Sumber Air Bersih & Panduan Akses
            </h1>
            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
              Katalog lengkap titik mata air pegunungan, sumur bor sentral, dan embung pertanian. Dirancang dengan ukuran teks besar dan panduan rute navigasi langsung untuk warga, petani, dan armada bantuan air.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:shrink-0">
            <Button as={Link} to="/peta?mode=water" variant="primary" size="lg" className="w-full md:w-auto">
                <Compass className="w-5 h-5" />
                <span>Buka di Peta WebGIS</span>
              </Button>
          </div>
        </div>

        {/* 2. Ringkasan Metrik Faktual Sumber Air */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-2xl p-3.5 sm:p-6 border border-slate-200 min-w-0">
            <div className="flex items-start justify-between gap-2 text-slate-500 mb-2">
              <span className="text-[11px] sm:text-sm font-semibold leading-tight">TOTAL TITIK AIR</span>
              <div className="w-8 h-8 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {waterSourcesData.length}
              <span className="text-sm sm:text-lg font-medium text-slate-500 ml-1">Titik</span>
            </div>
            <div className="mt-2 text-xs sm:text-sm font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Terverifikasi Geodesi</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 sm:p-6 border border-slate-200 min-w-0">
            <div className="flex items-start justify-between gap-2 text-slate-500 mb-2">
              <span className="text-[11px] sm:text-sm font-semibold leading-tight">DEBIT KUMULATIF</span>
              <div className="w-8 h-8 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Gauge className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-blue-600 tracking-tight">
              {totalDebit.toFixed(1)}
              <span className="text-sm sm:text-lg font-medium text-slate-500 ml-1">L/detik</span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Kapasitas saat musim kemarau
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3.5 sm:p-6 border border-slate-200 min-w-0">
            <div className="flex items-start justify-between gap-2 text-slate-500 mb-2">
              <span className="text-[11px] sm:text-sm font-semibold leading-tight">WARGA TERLAYANI</span>
              <div className="w-8 h-8 shrink-0 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {totalBeneficiaries}
              <span className="text-sm sm:text-lg font-medium text-slate-500 ml-1">KK</span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Tersebar di 4 dusun utama
            </p>
          </div>

          <div className="bg-white rounded-2xl p-3.5 sm:p-6 border border-slate-200 min-w-0">
            <div className="flex items-start justify-between gap-2 text-slate-500 mb-2">
              <span className="text-[11px] sm:text-sm font-semibold leading-tight">AKSES TRUK TANGKI</span>
              <div className="w-8 h-8 shrink-0 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-emerald-700 tracking-tight">
              {truckCount}
              <span className="text-sm sm:text-lg font-medium text-slate-500 ml-1">Titik</span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Siap manuver armada darurat
            </p>
          </div>
        </div>

        {/* 3. Filter Kategori & Pencarian Titik Air */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Pencarian Titik Air */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama mata air, sumur, atau dusun..."
                aria-label="Cari nama mata air, sumur, atau dusun"
                className="w-full pl-11 pr-16 min-h-[44px] rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] px-2 text-sm font-semibold text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
              )}
            </div>

            {/* Total Results Counter */}
            <div className="text-sm font-medium text-slate-500">
              Menampilkan <span className="font-bold text-slate-900">{filteredSources.length}</span> dari {waterSourcesData.length} sumber air
            </div>
          </div>

          {/* Segmented Controls for 30-50 age ergonomics (Large, easily tappable buttons) */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 pt-3 border-t border-slate-100">
            {/* Sarana Filter */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {typeOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  aria-pressed={selectedType === opt.id}
                  onClick={() => setSelectedType(opt.id)}
                  className={`px-3.5 min-h-[44px] sm:min-h-[40px] rounded-lg text-sm font-semibold transition-colors ${
                    selectedType === opt.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Condition Filter */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {conditionOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  aria-pressed={selectedCondition === opt.id}
                  onClick={() => setSelectedCondition(opt.id)}
                  className={`px-3.5 min-h-[44px] sm:min-h-[40px] rounded-lg text-sm font-semibold transition-colors ${
                    selectedCondition === opt.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Detailed Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-4">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {source.type}
                  </span>
                  
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 text-right ${
                      source.condition === 'Baik / Layak'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : source.condition === 'Debit Menurun'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{source.condition}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {source.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 mt-1">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{source.dusun}</span>
                  </div>
                </div>

                {/* Key Metrics Pill Grid */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 text-slate-800">
                  <div>
                    <span className="text-xs font-medium text-slate-500 block">Debit Terukur</span>
                    <span className="text-lg font-bold text-blue-600 block mt-0.5">
                      {source.debit} <span className="text-xs font-semibold text-slate-600">L/detik</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500 block">Warga Terlayani</span>
                    <span className="text-lg font-bold text-slate-900 block mt-0.5">
                      {source.beneficiariesKK} <span className="text-xs font-semibold text-slate-600">KK</span>
                    </span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200/60">
                    <span className="text-xs font-medium text-slate-500 block">Kapasitas Bak Tandon</span>
                    <span className="text-sm font-bold text-slate-900">
                      {source.tankCapacityLiters.toLocaleString('id-ID')} Liter
                    </span>
                  </div>
                </div>

                {/* Road accessibility and truck notice */}
                <div className="space-y-2 text-sm text-slate-600 leading-relaxed pt-1">
                  <div className="flex items-start gap-2">
                    <Truck className={`w-4 h-4 mt-0.5 shrink-0 ${source.truckAccessible ? 'text-emerald-600' : 'text-amber-500'}`} />
                    <div>
                      <span className="font-semibold text-slate-900">Akses Jalan: </span>
                      <span>{source.roadCondition}</span>
                      {source.truckAccessible ? (
                        <span className="inline-block ml-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Truk Tangki Bisa Masuk
                        </span>
                      ) : (
                        <span className="inline-block ml-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Hanya Motor / Setapak
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 italic pl-6">
                    "{source.accessNotes}"
                  </p>
                </div>
              </div>

              {/* Bottom Tactile Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-stretch gap-2.5">
                <Button
                  variant="brand"
                  size="md"
                  className="flex-1"
                  onClick={() => openRouteInMaps(source.coordinates[0], source.coordinates[1])}
                >
                  <Navigation className="w-4 h-4" />
                  <span>Rute Google Maps</span>
                </Button>

                <Button as={Link} to={`/peta?mode=water&search=${encodeURIComponent(source.name)}`} variant="secondary" size="icon" aria-label={`Lihat ${source.name} di Peta WebGIS`} title={`Lihat ${source.name} di Peta WebGIS`}>
                    <Compass className="w-5 h-5 text-slate-600" aria-hidden="true" />
                  </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
