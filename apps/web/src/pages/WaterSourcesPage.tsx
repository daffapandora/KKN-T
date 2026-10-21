import React, { useState } from 'react';
import { Card, Button, StatusChip } from '@kemitir/ui';
import { Droplets, Navigation, Search, Filter, Compass, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
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
      accessNotes: 'Jalan setapak beton 200m dari jalan dusun utama. Titik parkir motor aman.',
      coordinates: [110.3142, -7.2268],
      tankCapacityLiters: 15000,
    },
    {
      id: 'ws-2',
      name: 'Sumur Bor Sentral RW 02',
      type: 'Sumur Bor',
      condition: 'Baik / Layak',
      status: 'Aktif Beroperasi',
      dusun: 'Kemitir Kidul (RT 02 / RW 02)',
      debit: 8.0,
      beneficiariesKK: 92,
      roadCondition: 'Jalan Aspal Dusun (Bisa Truk Tangki)',
      accessNotes: 'Tepat di samping balai warga RT 02. Manuver truk tangki air sangat leluasa.',
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
      roadCondition: 'Jalan Tanah Curam',
      accessNotes: 'Akses jalan tanah setapak perbukitan, rawan licin saat ada embun/hujan rintik.',
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
      roadCondition: 'Jalan Makadam / Cor Blok',
      accessNotes: 'Dapat diakses pickup dan traktor roda dua.',
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
      roadCondition: 'Rabat Beton Lingkungan',
      accessNotes: 'Jalur pipa langsung mengalir ke 4 tandon pembagi lingkungan.',
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

  const openRouteInMaps = (lng: number, lat: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 1. Header & Summary Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-[#E8EAED]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-1">
            <Droplets className="w-4 h-4" />
            <span>Menu 05 & 06: Inventarisasi Sumber Air & Aksesibilitas</span>
          </div>
          <h1 className="text-3xl font-bold text-[#151A22] tracking-tight">
            Sumber Air Bersih Desa Kemitir
          </h1>
          <p className="mt-1 text-sm text-[#6F747C]">
            Data debit debit terukur, pemantauan kondisi kemarau, dan panduan aksesibilitas rute jalan ke setiap titik mata air dan sumur bor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/peta?mode=water">
            <Button variant="primary" size="sm" className="flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Buka Tampilan Peta WebGIS</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Top Statistic Proof Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        <div className="p-4 rounded-[8px] border border-[#E8EAED] bg-white">
          <span className="text-xs text-[#6F747C] block">Total Sumber Air Terdata</span>
          <span className="text-2xl font-bold text-[#151A22] mt-1 block">
            {waterSourcesData.length} Titik
          </span>
          <span className="text-[11px] text-[#16A34A] mt-1 block font-medium">100% Terverifikasi Geodesi</span>
        </div>

        <div className="p-4 rounded-[8px] border border-[#E8EAED] bg-white">
          <span className="text-xs text-[#6F747C] block">Total Debit Terukur</span>
          <span className="text-2xl font-bold text-[#2563EB] mt-1 block">
            {totalDebit.toFixed(1)} L/detik
          </span>
          <span className="text-[11px] text-[#6F747C] mt-1 block">Debit kumulatif musim kemarau</span>
        </div>

        <div className="p-4 rounded-[8px] border border-[#E8EAED] bg-white">
          <span className="text-xs text-[#6F747C] block">Warga Terlayani</span>
          <span className="text-2xl font-bold text-[#151A22] mt-1 block">
            {totalBeneficiaries} KK
          </span>
          <span className="text-[11px] text-[#6F747C] mt-1 block">Di 4 dusun utama</span>
        </div>

        <div className="p-4 rounded-[8px] border border-[#E8EAED] bg-white">
          <span className="text-xs text-[#6F747C] block">Akses Truk Tangki Air</span>
          <span className="text-2xl font-bold text-[#16A34A] mt-1 block">
            2 Titik
          </span>
          <span className="text-[11px] text-[#6F747C] mt-1 block">Siap untuk bantuan darurat</span>
        </div>
      </div>

      {/* 3. Search and Multi-filter Toolbar */}
      <div className="bg-[#F9FAFB] p-4 rounded-[8px] border border-[#E8EAED] flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="bg-white border border-[#E8EAED] rounded-[6px] px-3 py-1.5 flex items-center gap-2 w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-[#6F747C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama sumber air atau dusun..."
              className="text-xs text-[#151A22] placeholder:text-[#6F747C] focus:outline-none w-full"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs border border-[#E8EAED] rounded-[6px] px-3 py-2 bg-white text-[#151A22] focus:outline-none"
          >
            <option value="all">Semua Jenis Sarana</option>
            <option value="Mata Air">Mata Air Alami</option>
            <option value="Sumur Bor">Sumur Bor Sentral</option>
            <option value="Embung">Embung Pertanian</option>
          </select>

          {/* Condition Filter */}
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="text-xs border border-[#E8EAED] rounded-[6px] px-3 py-2 bg-white text-[#151A22] focus:outline-none"
          >
            <option value="all">Semua Kondisi Debit</option>
            <option value="Baik / Layak">Baik / Layak</option>
            <option value="Debit Menurun">Debit Menurun</option>
            <option value="Kritis saat Kemarau">Kritis saat Kemarau</option>
          </select>
        </div>

        <div className="text-xs text-[#6F747C]">
          Menampilkan <span className="font-bold text-[#151A22]">{filteredSources.length}</span> dari {waterSourcesData.length} sumber air
        </div>
      </div>

      {/* 4. Detailed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSources.map((source) => (
          <Card key={source.id} className="p-6 flex flex-col justify-between hover:border-gray-300">
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
                  {source.type}
                </span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                    source.condition === 'Baik / Layak'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : source.condition === 'Debit Menurun'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {source.condition}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#151A22] mt-2">
                {source.name}
              </h3>
              <p className="text-xs text-[#6F747C] mt-0.5">{source.dusun}</p>

              {/* Data metrics */}
              <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-gray-50 rounded-[6px] border border-[#E8EAED] text-xs">
                <div>
                  <span className="text-[#6F747C] block text-[11px]">Debit Air:</span>
                  <span className="font-bold text-[#2563EB] text-sm">
                    {source.debit} L/detik
                  </span>
                </div>
                <div>
                  <span className="text-[#6F747C] block text-[11px]">Keluarga Terlayani:</span>
                  <span className="font-bold text-[#151A22] text-sm">
                    {source.beneficiariesKK} KK
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-[#E8EAED]">
                  <span className="text-[#6F747C] block text-[11px]">Kapasitas Bak Tandon:</span>
                  <span className="font-semibold text-[#151A22]">
                    {source.tankCapacityLiters.toLocaleString('id-ID')} Liter
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#6F747C]">
                <div>
                  <strong className="text-[#151A22]">Akses Jalan:</strong> {source.roadCondition}
                </div>
                <div>
                  <strong className="text-[#151A22]">Catatan Akses:</strong> {source.accessNotes}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-[#E8EAED] flex items-center justify-between gap-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full flex items-center justify-center gap-1.5"
                onClick={() => openRouteInMaps(source.coordinates[0], source.coordinates[1])}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Rute Navigasi</span>
              </Button>

              <Link to={`/peta?mode=water`}>
                <Button variant="secondary" size="sm" title="Lihat di Peta">
                  <Compass className="w-3.5 h-3.5 text-[#6F747C]" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
