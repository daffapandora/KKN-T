import React from 'react';
import { Card, Button } from '@kemitir/ui';
import { AlertTriangle, Award, CheckCircle2, ChevronRight, Droplets, MapPin, ShieldAlert, Truck, Users, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PriorityArea, PRIORITY_AREAS_DATA } from '../data/priorities';

export const PriorityPage: React.FC = () => {
  const priorityList: PriorityArea[] = PRIORITY_AREAS_DATA;

  return (
    <div className="flex-1 bg-slate-50 py-5 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
        
        {/* 1. Header Matriks Prioritas */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-5 sm:gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Matriks Prioritas & Pengambilan Keputusan • APBDes & BPBD</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
              Prioritas Penanganan Kekeringan Desa
            </h1>
            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
              Pemeringkatan objektif berbasis analisis spasial geodesi multi-kriteria. Menentukan alokasi prioritas bantuan tangki air BPBD, perbaikan pipa swadaya, dan dana tanggap darurat desa agar tepat sasaran.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:shrink-0">
            <Button as={Link} to="/peta?mode=priority" variant="primary" size="lg" className="w-full md:w-auto">
                <MapPin className="w-5 h-5" aria-hidden="true" />
                <span>Buka Peta Zona Prioritas</span>
              </Button>
          </div>
        </div>

        {/* 2. Metodologi Pembobotan Ilmiah Spasial */}
        <div className="bg-amber-50 rounded-2xl p-4 sm:p-6 border border-amber-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-950">
                  Metodologi Pembobotan Ilmiah Spasial
                </h3>
                <p className="text-sm sm:text-base text-amber-900/90 mt-1 leading-relaxed">
                  Skor dihitung tanpa perkiraan subjektif menggunakan 3 bobot kriteria utama:
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-950 text-xs sm:text-sm font-medium">
                    Bahaya Kekeringan Geodesi: <strong className="text-amber-800">40%</strong>
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-950 text-xs sm:text-sm font-medium">
                    Kepadatan Warga & Lahan: <strong className="text-amber-800">35%</strong>
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-950 text-xs sm:text-sm font-medium">
                    Jarak Akses ke Air: <strong className="text-amber-800">25%</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="md:shrink-0">
              <Button as={Link} to="/edukasi" variant="secondary" size="md" className="w-full md:w-auto text-amber-950 border-amber-300 hover:bg-amber-100">
                  <span>Lihat SOP Distribusi</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
          </div>
        </div>

        {/* 3. Ranked Priority Areas */}
        <div className="space-y-6">
          {priorityList.map((area) => {
            const isRank1 = area.rank === 1;
            const isRank2 = area.rank === 2;

            return (
              <div
                key={area.rank}
                id={`rank-${area.rank}`}
                className={`bg-white rounded-2xl border p-4 sm:p-6 lg:p-8 ${
                  isRank1
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : isRank2
                    ? 'border-orange-200'
                    : 'border-slate-200/80'
                }`}
              >
                {/* Header Row: Rank Badge, Title, Urgency Score */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center font-bold text-base sm:text-lg shrink-0 ${
                        isRank1
                          ? 'bg-rose-600 text-white'
                          : isRank2
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-800 text-white'
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">Rank</span>
                      <span>#{area.rank}</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            area.urgencyLevel === 'Sangat Mendesak'
                              ? 'bg-rose-50 text-rose-800 border-rose-200 font-bold'
                              : area.urgencyLevel === 'Prioritas Tinggi'
                              ? 'bg-orange-50 text-orange-800 border-orange-200 font-bold'
                              : 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                          }`}
                        >
                          {area.urgencyLevel}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">• {area.rtRw}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                        {area.areaName}
                      </h2>
                      <p className="text-sm font-medium text-slate-500">{area.dusun}</p>
                    </div>
                  </div>

                  {/* Urgency Score Progress Bar */}
                  <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-100 w-full lg:w-auto lg:min-w-[240px]">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-600">SKOR URGENSI:</span>
                      <span className="text-base font-bold text-slate-900">
                        {area.compositeScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          area.compositeScore > 90
                            ? 'bg-rose-600'
                            : area.compositeScore > 80
                            ? 'bg-orange-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${area.compositeScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 pt-4 sm:pt-6">
                  {/* Left Column: Problem & Metrics */}
                  <div className="lg:col-span-6 space-y-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Kondisi Lapangan Terkini
                      </h3>
                      <p className="text-sm sm:text-base text-slate-800 font-normal leading-relaxed mt-1">
                        {area.primaryIssue}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-100 text-sm">
                      <div>
                        <span className="text-xs font-medium text-slate-500 block">Warga Terdampak</span>
                        <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                          {area.affectedResidents} <span className="text-xs font-normal text-slate-500">Jiwa</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-slate-500 block">Lahan Terdampak</span>
                        <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                          {area.farmAreaHa} <span className="text-xs font-normal text-slate-500">Hektar</span>
                        </span>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-slate-200/60">
                        <span className="text-xs font-medium text-slate-500 block">Akses Sumber Air Terdekat</span>
                        <span className="font-semibold text-slate-900">
                          {area.nearestWaterSource} ({area.distanceToWaterMeters} meter)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Recommended Action Checklist */}
                  <div className="lg:col-span-6 space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Rencana Tindakan Darurat & Teknis
                    </h3>
                    <div className="space-y-2.5">
                      {area.recommendedIntervention.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-sm text-slate-800"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <Button as={Link} to={`/peta?mode=priority&search=${encodeURIComponent(area.areaName)}`} variant="secondary" size="md" className="w-full sm:w-auto">
                          <MapPin className="w-4 h-4 text-slate-600" aria-hidden="true" />
                          <span>Buka Lokasi di Peta</span>
                        </Button>

                      {isRank1 && (
                        <Button as={Link} to="/laporan?category=Kebutuhan%20Bantuan%20Tangki%20Air" variant="danger" size="md" className="w-full sm:w-auto">
                            <Truck className="w-4 h-4" />
                            <span>Permintaan Tangki Air</span>
                          </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
