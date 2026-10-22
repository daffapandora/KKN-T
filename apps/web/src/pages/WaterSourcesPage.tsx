import React, { useState } from 'react';
import { Card, Button, StatusChip } from '@kemitir/ui';
import { Droplets, Navigation, Search, Filter, Compass, AlertCircle, CheckCircle2, ChevronRight, Truck, Gauge, Users, Sparkles, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WaterSourceItem {
  id: string;
  name: string;
  type: string;
  condition: 'Baik / Layak' | 'Debit Menurun' | 'Kritis saat Kemarau';
  status: string;
  dusun: string;
  debit: number; // liter/detik
  beneficiariesKK: number;
  roadCondition: string;
  truckAccessible: boolean;
  accessNotes: string;
  coordinates: [number, number]; // [lng, lat]
  tankCapacityLiters: number;
}

export const WaterSourcesPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const waterSourcesData: WaterSourceItem[] = [
    {
      id: 'ws-1',
      name: 'Tuk Mulyo (Mata Air Utama)',
      type: 'Mata Air',
      condition: 'Baik / Layak',
      status: 'Aktif Mengalir Sepanjang Tahun',
      dusun: 'Kemitir Lor (RT 01 / RW 01)',
      debit: 12.5,
      beneficiariesKK: 145,
      roadCondition: 'Jalan Setapak Rabat Beton (Bisa Motor)',
      truckAccessible: false,
      accessNotes: 'Jalan setapak rabat beton 200m dari jalan dusun utama. Titik parkir motor aman.',
      coordinates: [110.3142, -7.2268],
      tankCapacityLiters: 15000,
    },
    {
      id: 'ws-2',
      name: 'Sumur Bor Sentral RW 02',
      type: 'Sumur Bor',
      condition: 'Baik / Layak',
      status: 'Aktif Beroperasi Penuh',
      dusun: 'Kemitir Kidul (RT 02 / RW 02)',
      debit: 8.0,
      beneficiariesKK: 92,
      roadCondition: 'Jalan Aspal Dusun (Bisa Truk Tangki)',
      truckAccessible: true,
      accessNotes: 'Tepat di samping balai warga RT 02. Akses manuver truk tangki air sangat leluasa.',
      coordinates: [110.3185, -7.2295],
      tankCapacityLiters: 8000,
    },
    {
      id: 'ws-3',
      name: 'Tuk Gedang Kidul',
      type: 'Mata Air',
      condition: 'Debit Menurun',
      status: 'Kritis saat Puncak Kemarau',
      dusun: 'Kemitir Kidul (RT 04 / RW 02)',
      debit: 2.1,
      beneficiariesKK: 40,
      roadCondition: 'Jalan Tanah Curam Perbukitan',
      truckAccessible: false,
      accessNotes: 'Akses jalan tanah setapak perbukitan, rawan licin saat ada embun atau hujan rintik.',
      coordinates: [110.321, -7.234],
      tankCapacityLiters: 4000,
    },
    {
      id: 'ws-4',
      name: 'Embung Pertanian Garon',
      type: 'Embung',
      condition: 'Debit Menurun',
      status: 'Khusus Irigasi Sayur & Palawija',
      dusun: 'Dusun Garon',
      debit: 5.5,
      beneficiariesKK: 60,
      roadCondition: 'Jalan Makadam / Cor Blok (Bisa Pickup)',
      truckAccessible: true,
      accessNotes: 'Dapat diakses mobil bak terbuka dan traktor roda dua untuk pompa air alkon.',
      coordinates: [110.3095, -7.2235],
      tankCapacityLiters: 50000,
    },
    {
      id: 'ws-5',
      name: 'Mata Air Kalitengah Swadaya',
      type: 'Mata Air',
      condition: 'Baik / Layak',
      status: 'Aktif Swadaya Warga',
      dusun: 'Dusun Kalitengah',
      debit: 6.2,
      beneficiariesKK: 78,
      roadCondition: 'Rabat Beton Lingkungan Pemukiman',
      truckAccessible: false,
      accessNotes: 'Jalur pipa langsung mengalir ke 4 tandon pembagi lingkungan RT 01-03.',
      coordinates: [110.3255, -7.238],
      tankCapacityLiters: 12000,
    },
  ];

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
    <div className="flex-1 bg-slate-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Apple Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide uppercase">
              <Droplets className="w-3.5 h-3.5" />
              <span>Direktori Resmi Sumber Daya Air • Desa Kemitir</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Sumber Air Bersih & Panduan Akses
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Katalog lengkap titik mata air pegunungan, sumur bor sentral, dan embung pertanian. Dirancang dengan ukuran teks besar dan panduan rute navigasi langsung untuk warga, petani, dan armada bantuan air.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/peta?mode=water">
              <Button variant="primary" size="lg" className="gap-2 shadow-sm">
                <Compass className="w-5 h-5" />
                <span>Buka di Peta WebGIS</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. Top Statistic Proof Cards (Apple Health-style) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs sm:text-sm font-semibold tracking-wide">TOTAL TITIK AIR</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {waterSourcesData.length}
              <span className="text-base sm:text-lg font-medium text-slate-500 ml-1.5">Titik</span>
            </div>
            <div className="mt-2 text-xs sm:text-sm font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Terverifikasi Geodesi</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs sm:text-sm font-semibold tracking-wide">DEBIT KUMULATIF</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Gauge className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">
              {totalDebit.toFixed(1)}
              <span className="text-base sm:text-lg font-medium text-slate-500 ml-1.5">L/detik</span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Kapasitas saat musim kemarau
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs sm:text-sm font-semibold tracking-wide">WARGA TERLAYANI</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {totalBeneficiaries}
              <span className="text-base sm:text-lg font-medium text-slate-500 ml-1.5">KK</span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Tersebar di 4 dusun utama
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs sm:text-sm font-semibold tracking-wide">AKSES TRUK TANGKI</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 tracking-tight">
              {truckCount}
              <span className="text-base sm:text-lg font-medium text-slate-500 ml-1.5">Titik</span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Siap manuver armada darurat
            </p>
          </div>
        </div>

        {/* 3. Apple Segmented Filter Bar & Search */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input (Apple Rounded Style) */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama mata air, sumur, atau dusun..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 p-1"
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 border-t border-slate-100">
            {/* Sarana Filter */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-xl">
              {typeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedType(opt.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    selectedType === opt.id
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Condition Filter */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-xl">
              {conditionOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedCondition(opt.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    selectedCondition === opt.id
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] hover:border-slate-300 transition-all duration-200"
            >
              <div className="space-y-4">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 uppercase tracking-wide">
                    {source.type}
                  </span>
                  
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
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
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2.5">
                <Button
                  variant="brand"
                  size="md"
                  className="flex-1 gap-2 font-semibold shadow-xs"
                  onClick={() => openRouteInMaps(source.coordinates[0], source.coordinates[1])}
                >
                  <Navigation className="w-4 h-4" />
                  <span>Rute Google Maps</span>
                </Button>

                <Link to={`/peta?mode=water`}>
                  <Button variant="secondary" size="md" className="px-3" title="Lihat di Peta WebGIS">
                    <Compass className="w-4 h-4 text-slate-600" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
