import React, { useState, useEffect } from 'react';
import { Card, Button, StatusChip } from '@kemitir/ui';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  MapPin,
  ShieldAlert,
  TrendingDown,
  Users,
  ArrowRight,
  Compass,
  Truck,
  BookOpen,
  Clock,
  ShieldCheck,
  Check,
  X,
  User,
  Filter,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardMetrics, DEFAULT_DASHBOARD_METRICS } from '../data/dashboard';
import { useAuth } from '../context/AuthContext';

interface PendingReportItem {
  id: string;
  category: string;
  description: string;
  validation_status: 'pending' | 'valid' | 'rejected';
  created_at: string;
  accuracy_m?: number;
  geometry?: any;
}

export const DashboardPage: React.FC = () => {
  const { user, token, isAuthenticated, isValidator, isAdmin, isCitizen } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>(DEFAULT_DASHBOARD_METRICS);
  const [pendingReports, setPendingReports] = useState<PendingReportItem[]>([]);
  const [myReports, setMyReports] = useState<PendingReportItem[]>([]);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  // 1. Fetch Summary Metrics
  useEffect(() => {
    fetch('/api/v1/dashboard/summary')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.village) {
          setMetrics((prev) => ({
            ...prev,
            village: {
              ...prev.village,
              population: data.village.population || prev.village.population,
              households: Math.round((data.village.population || prev.village.population) / 4),
            },
            waterSystem: {
              ...prev.waterSystem,
              totalSources: data.village.waterSourcesCount || prev.waterSystem.totalSources,
            },
          }));
        }
      })
      .catch(() => {
        // Fallback to structured defaults
      });
  }, []);

  // 2. Fetch Pending Reports for Validator/Admin
  useEffect(() => {
    if ((isValidator || isAdmin) && token) {
      fetch('/api/v1/reports?status=pending', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.data) {
            setPendingReports(data.data);
          }
        })
        .catch(() => undefined);
    }
  }, [isValidator, isAdmin, token]);

  // 3. Fetch My Reports for Citizen
  useEffect(() => {
    if (isCitizen && token) {
      fetch('/api/v1/reports/mine', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.data) {
            setMyReports(data.data);
          }
        })
        .catch(() => undefined);
    }
  }, [isCitizen, token]);

  // 4. Handle Validator Approval / Rejection
  const handleValidateReport = async (reportId: string, status: 'valid' | 'rejected') => {
    if (!token) return;
    setValidatingId(reportId);
    setActionSuccessMsg('');

    try {
      const res = await fetch(`/api/v1/reports/${reportId}/validate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error('Gagal memperbarui status laporan');
      }

      // Remove from pending list
      setPendingReports((prev) => prev.filter((r) => r.id !== reportId));
      setActionSuccessMsg(
        status === 'valid'
          ? 'Laporan berhasil diverifikasi! Titik sekarang tayang di WebGIS publik.'
          : 'Laporan ditolak.'
      );
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (e: any) {
      alert(e.message || 'Terjadi kesalahan saat memproses validasi.');
    } finally {
      setValidatingId(null);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-5 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
        
        {/* 1. Header Dasbor Pemantauan */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-5 sm:gap-6 shadow-xs">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block">
                Pemantauan Tanggap Kemarau 2026
              </span>
              {isAuthenticated && user && (
                <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>
                    Masuk: {user.name} ({user.role === 'validator' ? `Validator RT ${user.rt || '-'}` : user.role === 'admin' ? 'Admin Desa' : 'Warga'})
                  </span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
              Dasbor Pantau Kebencanaan & Air Desa
            </h1>
            <p className="text-sm sm:text-lg text-slate-600">
              Desa Kemitir, Kecamatan Sumowono, Kab. Semarang • Elevasi 850 - 1.150 mdpl
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:shrink-0">
            <Button as={Link} to="/peta" variant="primary" size="lg" className="w-full md:w-auto">
              <Compass className="w-5 h-5" aria-hidden="true" />
              <span>Buka Peta WebGIS</span>
            </Button>
            <Button as={Link} to="/laporan" variant="secondary" size="lg" className="w-full md:w-auto">
              Lapor Krisis Air
            </Button>
          </div>
        </div>

        {/* Action success alert */}
        {actionSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* 2. ROLE-BASED CONSOLE: Validator Lapangan (RT/RW/Satgas) */}
        {(isValidator || isAdmin) && (
          <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 shadow-lg border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Konsol Petugas Validator RT / RW & Satgas</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                  Antrean Validasi Laporan Warga
                </h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  Laporan pending yang diverifikasi akan langsung tayang pada WebGIS publik desa
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                  {pendingReports.length} Menunggu Verifikasi
                </span>
              </div>
            </div>

            {pendingReports.length === 0 ? (
              <div className="py-8 text-center bg-slate-800/40 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
                <h3 className="text-base font-bold text-white">Semua Laporan Terverifikasi</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Tidak ada laporan darurat baru yang pending. Laporan yang masuk dari warga akan otomatis tampil di sini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-700/80 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-600/40">
                          {report.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(report.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-sm text-slate-200 leading-relaxed font-normal">
                        "{report.description}"
                      </p>

                      {report.geometry?.coordinates && (
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span>
                            {report.geometry.coordinates[1].toFixed(5)}, {report.geometry.coordinates[0].toFixed(5)} (±{report.accuracy_m || 10}m)
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-700 flex items-center gap-2.5">
                      <Button
                        variant="brand"
                        size="sm"
                        className="flex-1 min-h-[40px]"
                        disabled={validatingId === report.id}
                        onClick={() => handleValidateReport(report.id, 'valid')}
                      >
                        <Check className="w-4 h-4" />
                        <span>{validatingId === report.id ? 'Memproses...' : 'Setujui (Valid)'}</span>
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="min-h-[40px] px-3.5"
                        disabled={validatingId === report.id}
                        onClick={() => handleValidateReport(report.id, 'rejected')}
                      >
                        <X className="w-4 h-4" />
                        <span>Tolak</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. ROLE-BASED CONSOLE: Warga Terdaftar (Citizen My Reports) */}
        {isCitizen && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                  Portal Warga Terdaftar
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  Riwayat & Status Laporan Saya
                </h2>
                <p className="text-sm text-slate-500">
                  Pantau proses verifikasi langsung oleh pengurus RT/RW Desa Kemitir
                </p>
              </div>

              <Button as={Link} to="/laporan" variant="brand" size="sm">
                + Buat Laporan Baru
              </Button>
            </div>

            {myReports.length === 0 ? (
              <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-2xl">
                <p className="text-sm">Anda belum mengirimkan laporan kekeringan.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myReports.map((r) => (
                  <div key={r.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          {r.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-800">{r.description}</p>
                    </div>
                    <div>
                      {r.validation_status === 'valid' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Terverifikasi (Tayang di Peta)</span>
                        </span>
                      ) : r.validation_status === 'pending' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Menunggu Verifikasi RT</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5">
                          <X className="w-3.5 h-3.5 text-rose-600" />
                          <span>Ditolak / Kurang Bukti</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Public info banner if unauthenticated */}
        {!isAuthenticated && (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-emerald-950 block">Akses Petugas Lapangan & Pengurus RT:</strong>
                <span className="text-emerald-900/90 leading-relaxed">
                  Perangkat desa, Ketua RT/RW, dan Satgas Bencana dapat masuk ke Portal Petugas untuk memvalidasi laporan warga agar langsung tayang pada peta webGIS.
                </span>
              </div>
            </div>
            <Button as={Link} to="/masuk" variant="brand" size="sm" className="shrink-0 w-full sm:w-auto">
              Masuk ke Portal Petugas
            </Button>
          </div>
        )}

        {/* 4. Empat Widget Ringkasan Metrik Faktual */}
        <div className="grid grid-cols-1 min-[560px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Card 1: Debit Total */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 text-slate-500 mb-2">
                <span className="text-xs font-semibold">Debit Air Bersih</span>
                <div className="w-9 h-9 shrink-0 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
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
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 text-slate-500 mb-2">
                <span className="text-xs font-semibold">Warga Terdampak</span>
                <div className="w-9 h-9 shrink-0 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
                  {metrics.droughtImpact.affectedHouseholds}
                </span>
                <span className="text-sm font-semibold text-slate-500">KK</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-rose-700">
              Tersebar di {metrics.droughtImpact.affectedDusunCount} dusun elevasi atas
            </div>
          </div>

          {/* Card 3: Sumber Air Aktif */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 text-slate-500 mb-2">
                <span className="text-xs font-semibold">Sumber Air Terdata</span>
                <div className="w-9 h-9 shrink-0 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
                  {metrics.waterSystem.activeSources}
                </span>
                <span className="text-sm font-semibold text-slate-500">/ {metrics.waterSystem.totalSources} titik aktif</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700">
              100% titik telah disurvei GPS tim KKN
            </div>
          </div>

          {/* Card 4: Kesiapan Tangki */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 text-slate-500 mb-2">
                <span className="text-xs font-semibold">Kapasitas Tandon Desa</span>
                <div className="w-9 h-9 shrink-0 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
                  {(metrics.waterSystem.totalTankCapacityLiters / 1000).toFixed(0)}k
                </span>
                <span className="text-sm font-semibold text-slate-500">Liter</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-purple-700">
              {metrics.waterSystem.truckAccessibleSources} titik siap terima dropping tangki
            </div>
          </div>
        </div>

        {/* 5. Layanan Cepat & Navigasi */}
        <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Layanan & Navigasi Cepat
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Akses langsung ke setiap instrumen kebencanaan desa tanpa menu ganda
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link
                to="/sumber-air"
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors group"
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
                <ArrowRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-900 transition-colors" aria-hidden="true" />
              </Link>

              <Link
                to="/prioritas"
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors group"
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
                <ArrowRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-900 transition-colors" aria-hidden="true" />
              </Link>

              <Link
                to="/edukasi"
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors group"
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
                <ArrowRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-900 transition-colors" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* 6. Transparansi Laporan Lapangan Publik */}
        <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Laporan Lapangan Terverifikasi (Publik)
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Laporan warga yang telah diverifikasi oleh petugas RT/RW dan Satgas Desa
              </p>
            </div>

            <Button as={Link} to="/laporan" variant="secondary" size="md" className="w-full sm:w-auto">
              <span>+ Buat Laporan</span>
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {metrics.recentReports.map((report) => (
              <div key={report.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-blue-700 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
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
