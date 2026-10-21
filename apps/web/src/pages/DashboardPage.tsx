import React from 'react';
import { Card, Button, StatusChip } from '@kemitir/ui';
import { Activity, AlertTriangle, CheckCircle2, Droplets, MapPin, ShieldAlert, TrendingDown, Users, ArrowUpRight } from 'lucide-react';
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
      totalDebitLps: 23.6,
      debitChangePercent: -34.2,
      status: 'Waspada Penurunan Debit',
    },
    droughtImpact: {
      affectedHouseholds: 380,
      affectedFarmHa: 70.5,
      highRiskAreas: 2,
      pendingCitizenReports: 3,
      verifiedReports: 12,
    },
    riskDistribution: [
      { class: 'Rendah', percentage: 32, areaHa: 380.2, color: '#22C55E' },
      { class: 'Sedang', percentage: 35, areaHa: 412.0, color: '#EAB308' },
      { class: 'Tinggi', percentage: 25, areaHa: 298.5, color: '#F97316' },
      { class: 'Sangat Tinggi', percentage: 8, areaHa: 154.3, color: '#EF4444' },
    ],
  };

  return (
    <div className="flex-1 bg-[#F9FAFB] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8EAED] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Monitoring Real-Time Tanggap Kemarau 2026
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#151A22] mt-1">
              Dasbor Pantau Kekeringan & Sumber Air
            </h1>
            <p className="text-sm text-[#6F747C]">
              Kecamatan Sumowono, Kabupaten Semarang • Elevasi 850 - 1.150 mdpl
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/peta">
              <Button variant="primary" size="sm" className="flex items-center gap-1.5 shadow-sm">
                <span>Eksplorasi Peta WebGIS</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/laporan">
              <Button variant="secondary" size="sm">
                Form Lapor Krisis
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Key Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-5 border-l-4 border-l-[#2563EB]">
            <div className="flex items-center justify-between text-[#6F747C] text-xs font-medium">
              <span>Debit Air Bersih Total</span>
              <Droplets className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#151A22]">{metrics.waterSystem.totalDebitLps}</span>
              <span className="text-xs text-[#6F747C]">liter/detik</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-600">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Menurun {Math.abs(metrics.waterSystem.debitChangePercent)}% dibanding normal</span>
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-[#EF4444]">
            <div className="flex items-center justify-between text-[#6F747C] text-xs font-medium">
              <span>Warga Butuh Intervensi</span>
              <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#151A22]">{metrics.droughtImpact.affectedHouseholds}</span>
              <span className="text-xs text-[#6F747C]">KK Terdampak</span>
            </div>
            <p className="mt-2 text-[11px] text-[#6F747C]">
              Konsentrasi utama di RT 02 Kemitir Kidul
            </p>
          </Card>

          <Card className="p-5 border-l-4 border-l-[#F59E0B]">
            <div className="flex items-center justify-between text-[#6F747C] text-xs font-medium">
              <span>Lahan Pertanian Kritis</span>
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#151A22]">{metrics.droughtImpact.affectedFarmHa}</span>
              <span className="text-xs text-[#6F747C]">Hektar Lahan</span>
            </div>
            <p className="mt-2 text-[11px] text-[#6F747C]">
              Sawah tadah hujan sayur kubis & cabai Garon
            </p>
          </Card>

          <Card className="p-5 border-l-4 border-l-[#16A34A]">
            <div className="flex items-center justify-between text-[#6F747C] text-xs font-medium">
              <span>Sumber Air Aktif</span>
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#151A22]">4 / 5</span>
              <span className="text-xs text-[#6F747C]">Titik Terpantau</span>
            </div>
            <p className="mt-2 text-[11px] text-[#16A34A] font-medium">
              Tuk Mulyo stabil (12.5 L/s)
            </p>
          </Card>
        </div>

        {/* Hazard Distribution & Priority Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Breakdown */}
          <Card className="p-6 space-y-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#151A22]">Distribusi Kerawanan Wilayah Desa</h3>
                <p className="text-xs text-[#6F747C]">Berdasarkan analisis GIS kemiringan lereng, curah hujan, & akuifer</p>
              </div>
              <Link to="/prioritas" className="text-xs font-semibold text-[#16A34A] hover:underline flex items-center gap-1">
                Matriks Lengkap <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Visual Bar */}
            <div className="h-4 w-full rounded-full overflow-hidden flex bg-gray-100">
              {metrics.riskDistribution.map((item) => (
                <div
                  key={item.class}
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  title={`${item.class}: ${item.percentage}%`}
                />
              ))}
            </div>

            {/* Legend Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {metrics.riskDistribution.map((item) => (
                <div key={item.class} className="p-3 rounded-lg border border-[#E8EAED] bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-semibold text-[#151A22]">{item.class}</span>
                  </div>
                  <p className="text-lg font-bold text-[#151A22] mt-2">{item.percentage}%</p>
                  <p className="text-[11px] text-[#6F747C]">{item.areaHa} Ha wilayah</p>
                </div>
              ))}
            </div>

            {/* Quick action alert */}
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div className="text-xs text-orange-950 space-y-1">
                <p className="font-semibold">Peringatan Kritis Musim Kemarau (Puncak Agustus - Oktober)</p>
                <p>
                  Dusun Kemitir Kidul RT 02 dan Dusun Garon berada dalam zona bahaya tinggi hingga sangat tinggi. Rekomendasi dropping air tangki dan optimalisasi pipa gravitasi Tuk Mulyo sedang berjalan.
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Shortcuts */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-[#151A22]">Akses Cepat Data Desa</h3>
            <div className="space-y-2.5">
              <Link
                to="/sumber-air"
                className="p-3 rounded-lg border border-[#E8EAED] hover:border-[#16A34A] hover:bg-green-50/30 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#151A22] group-hover:text-[#16A34A]">
                      Direktori Sumber Air
                    </p>
                    <p className="text-[11px] text-[#6F747C]">Kapasitas, debit, & rute jalan</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#16A34A]" />
              </Link>

              <Link
                to="/prioritas"
                className="p-3 rounded-lg border border-[#E8EAED] hover:border-[#16A34A] hover:bg-green-50/30 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#151A22] group-hover:text-[#16A34A]">
                      Prioritas Penanganan
                    </p>
                    <p className="text-[11px] text-[#6F747C]">Rangking RT krisis air</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#16A34A]" />
              </Link>

              <Link
                to="/edukasi"
                className="p-3 rounded-lg border border-[#E8EAED] hover:border-[#16A34A] hover:bg-green-50/30 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#151A22] group-hover:text-[#16A34A]">
                      Edukasi & SOP Bantuan
                    </p>
                    <p className="text-[11px] text-[#6F747C]">Hotline darurat & mitigasi</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#16A34A]" />
              </Link>

              <Link
                to="/laporan"
                className="p-3 rounded-lg border border-[#E8EAED] hover:border-[#16A34A] hover:bg-green-50/30 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#151A22] group-hover:text-[#16A34A]">
                      Laporan Krisis Warga
                    </p>
                    <p className="text-[11px] text-[#6F747C]">Partisipasi masyarakat RT</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#16A34A]" />
              </Link>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};
