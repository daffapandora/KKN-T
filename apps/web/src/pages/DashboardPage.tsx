import React from 'react';
import { Card, Button, StatusChip } from '@kemitir/ui';
import { Activity, AlertTriangle, CheckCircle2, Droplets, MapPin, ShieldAlert, TrendingDown, Users, ArrowUpRight, ArrowRight, Compass, Truck, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const metrics = {
    village: {
      name: 'Desa Kemitir',
      subdistrict: 'Sumowono',
      regency: 'Kabupaten Semarang',
      elevation: '850 - 1.150 mdpl',
      population: 4832,
      households: 1245,
    },
    waterSystem: {
      activeSources: 4,
      totalSources: 5,
      totalDebitLps: 23.6,
      debitChangePercent: -34.2,
      status: 'Waspada Penurunan Debit Kemarau',
    },
    droughtImpact: {
      affectedHouseholds: 380,
      affectedFarmHa: 70.5,
      highRiskAreas: 2,
      pendingCitizenReports: 3,
      verifiedReports: 12,
    },
    riskDistribution: [
      { class: 'Rendah', percentage: 32, areaHa: 380.2, color: '#16A34A' },
      { class: 'Sedang', percentage: 35, areaHa: 412.0, color: '#EAB308' },
      { class: 'Tinggi', percentage: 25, areaHa: 298.5, color: '#EA580C' },
      { class: 'Sangat Tinggi', percentage: 8, areaHa: 154.3, color: '#DC2626' },
    ],
    recentReports: [
      {
        id: 'rep-1',
        category: 'Penurunan Debit Air',
        location: 'Tuk Gedang Kidul, RT 04 / RW 02',
        time: '30 menit lalu',
        status: 'valid' as const,
        description: 'Debit mata air menyusut hingga hanya mengalir 2 L/detik, warga mulai antre tandon.',
      },
      {
        id: 'rep-2',
        category: 'Pipa Retak / Bocor',
        location: 'Jalur Transmisi Lereng Kalitengah',
        time: '3 jam lalu',
        status: 'pending' as const,
        description: 'Pipa PVC 2 dim pecah tertimpa longsor kecil material batu tebing.',
      },
      {
        id: 'rep-3',
        category: 'Kekeringan Lahan Sayur',
        location: 'Blok Sawah Garon Kidul',
        time: 'Kemarin',
        status: 'valid' as const,
        description: 'Embung pertanian surut, tanaman kubis dan cabai butuh pasokan pompa darurat.',
      },
    ],
  };

  return (
    <div className="flex-1 bg-slate-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Apple Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Monitoring Real-Time Tanggap Kemarau 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Dasbor Pantau Kebencanaan & Air Desa
            </h1>
            <p className="text-base sm:text-lg text-slate-600">
              Desa Kemitir, Kecamatan Sumowono, Kab. Semarang • Elevasi 850 - 1.150 mdpl
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link to="/peta">
              <Button variant="primary" size="lg" className="gap-2 shadow-sm font-semibold">
                <Compass className="w-5 h-5 text-emerald-400" />
                <span>Buka Peta WebGIS</span>
              </Button>
            </Link>
            <Link to="/laporan">
              <Button variant="secondary" size="lg" className="font-semibold">
                Lapor Krisis Air
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. Four Apple KPI Metric Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Debit Total */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold tracking-wider uppercase">Debit Air Bersih</span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {metrics.waterSystem.totalDebitLps}
                </span>
                <span className="text-sm font-semibold text-slate-500">L/detik</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
              <TrendingDown className="w-4 h-4 shrink-0" />
              <span>Menurun {Math.abs(metrics.waterSystem.debitChangePercent)}% dibanding musim hujan</span>
            </div>
          </div>

          {/* Card 2: Warga Butuh Bantuan */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold tracking-wider uppercase">Warga Terdampak</span>
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {metrics.droughtImpact.affectedHouseholds}
                </span>
                <span className="text-sm font-semibold text-slate-500">KK</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
              Konsentrasi utama: <strong className="text-slate-900">RT 02 Kemitir Kidul</strong>
            </div>
          </div>

          {/* Card 3: Lahan Pertanian */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold tracking-wider uppercase">Lahan Sayur Kritis</span>
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {metrics.droughtImpact.affectedFarmHa}
                </span>
                <span className="text-sm font-semibold text-slate-500">Hektar</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
              Blok sawah tadah hujan <strong className="text-slate-900">Dusun Garon</strong>
            </div>
          </div>

          {/* Card 4: Sumber Air Aktif */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold tracking-wider uppercase">Sumber Air Aktif</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {metrics.waterSystem.activeSources} / {metrics.waterSystem.totalSources}
                </span>
                <span className="text-sm font-semibold text-slate-500">Titik</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700">
              Tuk Mulyo stabil mengalir (12.5 L/s)
            </div>
          </div>
        </div>

        {/* 3. Middle Section: Risk Distribution & Quick Navigation Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Stacked Risk Distribution Bar (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Distribusi Zonasi Risiko Kekeringan
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Luas wilayah Desa Kemitir (1.245 Hektar) berdasarkan kelas risiko
                </p>
              </div>
              <Link to="/peta?mode=risk">
                <span className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
                  Lihat Peta Risiko <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

            {/* Apple Stacked Horizontal Bar */}
            <div className="h-6 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
              {metrics.riskDistribution.map((item) => (
                <div
                  key={item.class}
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                  className="h-full relative group transition-all"
                  title={`${item.class}: ${item.percentage}% (${item.areaHa} ha)`}
                />
              ))}
            </div>

            {/* Legend & Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {metrics.riskDistribution.map((item) => (
                <div key={item.class} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-bold text-slate-900">{item.class}</span>
                  </div>
                  <div className="text-lg font-extrabold text-slate-900 mt-1">
                    {item.percentage}%
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {item.areaHa} ha
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 4 Distinct High-Value Quick Actions (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Layanan & Navigasi Cepat
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Akses langsung ke setiap instrumen kebencanaan desa tanpa menu ganda
              </p>

              <div className="mt-4 space-y-3">
                <Link
                  to="/sumber-air"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        Direktori Sumber Air
                      </h4>
                      <p className="text-xs text-slate-500">Kondisi debit & rute truk tangki</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </Link>

                <Link
                  to="/prioritas"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                        Matriks Prioritas Penanganan
                      </h4>
                      <p className="text-xs text-slate-500">Peringkat alokasi bantuan darurat</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </Link>

                <Link
                  to="/edukasi"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        SOP & Edukasi Warga
                      </h4>
                      <p className="text-xs text-slate-500">Teknik hemat air & kontak darurat</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </Link>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link to="/laporan" className="block">
                <Button variant="brand" size="lg" className="w-full gap-2 font-semibold shadow-xs">
                  <Truck className="w-4 h-4" />
                  <span>Kirim Laporan Lapangan Baru</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4. Bottom Activity Stream: Recent Reports */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Laporan Lapangan Warga Terkini
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Status verifikasi transparansi dari lapangan (RT / RW / Satgas)
              </p>
            </div>

            <Link to="/laporan">
              <Button variant="secondary" size="md" className="font-semibold gap-1.5">
                <span>+ Buat Laporan</span>
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {metrics.recentReports.map((report) => (
              <div key={report.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-700 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                      {report.category}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {report.time}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {report.location}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {report.description}
                  </p>
                </div>

                <div className="shrink-0">
                  <StatusChip status={report.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
