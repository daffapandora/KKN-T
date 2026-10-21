import React from 'react';
import { Card, Button } from '@kemitir/ui';
import { AlertTriangle, Award, CheckCircle2, ChevronRight, Droplets, MapPin, ShieldAlert, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PriorityArea {
  rank: number;
  areaName: string;
  dusun: string;
  rtRw: string;
  urgencyLevel: 'Sangat Mendesak' | 'Prioritas Tinggi' | 'Prioritas Sedang';
  compositeScore: number; // 0 - 100
  affectedResidents: number;
  farmAreaHa: number;
  primaryIssue: string;
  nearestWaterSource: string;
  distanceToWaterMeters: number;
  recommendedIntervention: string[];
}

export const PriorityPage: React.FC = () => {
  const priorityList: PriorityArea[] = [
    {
      rank: 1,
      areaName: 'RT 02 Kemitir Kidul (Perbukitan Atas)',
      dusun: 'Dusun Kemitir Kidul',
      rtRw: 'RT 02 / RW 01',
      urgencyLevel: 'Sangat Mendesak',
      compositeScore: 92.4,
      affectedResidents: 380,
      farmAreaHa: 28.5,
      primaryIssue: 'Mata air lokal (Tuk Gedang) mengalami penurunan debit >75% dan jalur pipa transmisi swadaya retak akibat pergerakan tanah.',
      nearestWaterSource: 'Sumur Bor Sentral RW 02',
      distanceToWaterMeters: 850,
      recommendedIntervention: [
        'Dropping air bersih tangki darurat 2x seminggu',
        'Penggantian 350m pipa paralon dengan pipa HDPE fleksibel',
        'Pemasangan tandon penampungan darurat 5.000L di titik balai RT',
      ],
    },
    {
      rank: 2,
      areaName: 'Blok Sawah Tadah Hujan Garon',
      dusun: 'Dusun Garon',
      rtRw: 'RT 01 / RW 03',
      urgencyLevel: 'Prioritas Tinggi',
      compositeScore: 84.1,
      affectedResidents: 240,
      farmAreaHa: 42.0,
      primaryIssue: 'Kekeringan lahan pertanian sayur & palawija. Debit embung menyusut drastis.',
      nearestWaterSource: 'Embung Pertanian Garon',
      distanceToWaterMeters: 450,
      recommendedIntervention: [
        'Pengerukan sedimentasi dasar embung pertanian',
        'Bantuan pompa air alkon bergerak untuk mengambil air sungai dasar lembah',
        'Sosialisasi jadwal giliran irigasi kelompok tani',
      ],
    },
    {
      rank: 3,
      areaName: 'Lereng Kalitengah Bagian Timur',
      dusun: 'Dusun Kalitengah',
      rtRw: 'RT 03 / RW 04',
      urgencyLevel: 'Prioritas Tinggi',
      compositeScore: 78.6,
      affectedResidents: 195,
      farmAreaHa: 18.0,
      primaryIssue: 'Topografi lereng curam, warga harus menuruni tebing sejauh 600m untuk mengambil air bersih.',
      nearestWaterSource: 'Mata Air Kalitengah Swadaya',
      distanceToWaterMeters: 620,
      recommendedIntervention: [
        'Pembangunan bak tandon antara (booster tank)',
        'Perbaikan jalan setapak rabat beton menuju mata air untuk keamanan warga',
      ],
    },
    {
      rank: 4,
      areaName: 'Pemukiman Kemitir Lor Bawah',
      dusun: 'Dusun Kemitir Lor',
      rtRw: 'RT 03 / RW 01',
      urgencyLevel: 'Prioritas Sedang',
      compositeScore: 61.2,
      affectedResidents: 310,
      farmAreaHa: 15.0,
      primaryIssue: 'Tekanan air pipa berkurang di jam sibuk sore hari, namun debit mata air Tuk Mulyo masih mencukupi.',
      nearestWaterSource: 'Tuk Mulyo (Mata Air Utama)',
      distanceToWaterMeters: 320,
      recommendedIntervention: [
        'Pembersihan filter bak penampung utama',
        'Pemasangan meteran air swadaya untuk mencegah kebocoran liar',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-[#E8EAED]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626] uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Menu 08: Analisis Pengambilan Keputusan (Decision Support System)</span>
          </div>
          <h1 className="text-3xl font-bold text-[#151A22] tracking-tight">
            Prioritas Penanganan Kekeringan Desa Kemitir
          </h1>
          <p className="mt-1 text-sm text-[#6F747C] max-w-3xl">
            Peringkat urgensi penanganan wilayah yang dihitung secara objektif berdasarkan gabungan indeks bahaya geodesi, kepadatan penduduk terdampak, dan jarak tempuh ke sumber air terdekat.
          </p>
        </div>

        <Link to="/peta?mode=priority">
          <Button variant="primary" size="sm" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Lihat Peta Zona Prioritas</span>
          </Button>
        </Link>
      </div>

      {/* 2. Methodology Alert Box */}
      <div className="my-8 p-4 bg-amber-50 rounded-[8px] border border-amber-200 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-sm font-semibold mb-1">
            Metodologi Pemeringkatan Ilmiah
          </strong>
          Skor Prioritas dihitung dengan formula pembobotan spasial: <br />
          <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-950">
            Skor = (Bahaya Kekeringan × 40%) + (Kepadatan Penduduk & Lahan × 35%) + (Jarak Akses Sumber Air × 25%)
          </code>
          . Hal ini memastikan distribusi bantuan logistik tangki air bersih dan dana alokasi desa tepat sasaran tanpa perkiraan subjektif.
        </div>
      </div>

      {/* 3. Ranked Areas List */}
      <div className="space-y-6">
        {priorityList.map((area) => (
          <Card key={area.rank} className="p-6 md:p-8 hover:border-gray-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#E8EAED] pb-5">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-[8px] flex items-center justify-center font-bold text-lg text-white shadow-sm shrink-0 ${
                    area.rank === 1
                      ? 'bg-[#DC2626]'
                      : area.rank === 2
                      ? 'bg-[#F97316]'
                      : 'bg-[#EAB308]'
                  }`}
                >
                  #{area.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${
                        area.urgencyLevel === 'Sangat Mendesak'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : area.urgencyLevel === 'Prioritas Tinggi'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}
                    >
                      {area.urgencyLevel}
                    </span>
                    <span className="text-xs text-[#6F747C]">{area.dusun} ({area.rtRw})</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#151A22] mt-1">
                    {area.areaName}
                  </h3>
                </div>
              </div>

              {/* Composite Score Pill */}
              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="text-xs text-[#6F747C] block">Indeks Kerentanan</span>
                  <span className="text-2xl font-bold text-[#151A22] block font-mono">
                    {area.compositeScore} / 100
                  </span>
                </div>
              </div>
            </div>

            {/* Details & stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-[6px] border border-[#E8EAED]">
                <span className="text-[#6F747C] block mb-1">Masyarakat Terdampak:</span>
                <span className="text-base font-bold text-[#151A22]">
                  {area.affectedResidents} Jiwa
                </span>
                <span className="text-[11px] text-[#6F747C] block mt-0.5">
                  Lahan Kritis: {area.farmAreaHa} Hektar
                </span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-[6px] border border-[#E8EAED]">
                <span className="text-[#6F747C] block mb-1">Sumber Air Terdekat:</span>
                <span className="text-base font-bold text-[#2563EB]">
                  {area.nearestWaterSource}
                </span>
                <span className="text-[11px] text-[#6F747C] block mt-0.5 font-medium">
                  Jarak Tempuh: ±{area.distanceToWaterMeters} meter
                </span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-[6px] border border-[#E8EAED]">
                <span className="text-[#6F747C] block mb-1">Status Kebutuhan:</span>
                <span className="text-sm font-semibold text-[#DC2626]">
                  Bantuan Mendesak Diperlukan
                </span>
                <span className="text-[11px] text-[#6F747C] block mt-0.5">
                  Dalam 7 hari ke depan
                </span>
              </div>
            </div>

            {/* Problem Description */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#151A22] mb-1">
                Akar Permasalahan di Lapangan:
              </h4>
              <p className="text-sm text-[#6F747C] leading-relaxed">
                {area.primaryIssue}
              </p>
            </div>

            {/* Recommended Interventions Checklist */}
            <div className="p-4 bg-white rounded-[6px] border border-[#E8EAED]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#16A34A] mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Rekomendasi Rencana Aksi Perangkat Desa & Relawan KKN:</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#151A22]">
                {area.recommendedIntervention.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-1.5 shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
