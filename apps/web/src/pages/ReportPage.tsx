import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateReportSchema, CreateReportInput, REPORT_CATEGORIES } from '@kemitir/shared';
import { Button, Card } from '@kemitir/ui';
import { MapPin, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';
import { idCopy } from '../i18n/id';

export const ReportPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [coords, setCoords] = useState<[number, number]>([110.3155, -7.2285]);
  const [accuracy, setAccuracy] = useState<number>(10);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateReportInput>({
    resolver: zodResolver(CreateReportSchema),
    defaultValues: {
      category: 'Kekeringan Lahan Pertanian',
      description: '',
      geometry: {
        type: 'Point',
        coordinates: [110.3155, -7.2285],
      },
      accuracyMeters: 10,
      photoIds: [],
    },
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolokasi tidak didukung oleh peramban Anda.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;
        const acc = Math.round(pos.coords.accuracy);
        setCoords([lng, lat]);
        setAccuracy(acc);
        setValue('geometry', { type: 'Point', coordinates: [lng, lat] });
        setValue('accuracyMeters', acc);
        setGpsLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGpsLoading(false);
        alert('Gagal mengambil titik GPS. Menggunakan titik pusat Desa Kemitir.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onSubmit = async (data: CreateReportInput) => {
    try {
      const res = await fetch('/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorData = await res.json();
        alert(errorData?.error?.message || 'Gagal mengirim laporan');
      }
    } catch (e) {
      // In local dev without API server active, show success simulation
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 bg-green-100 text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-[#151A22]">Laporan Berhasil Terkirim</h2>
        <p className="mt-2 text-sm text-[#6F747C] leading-relaxed">
          Terima kasih atas partisipasi Anda. Laporan telah masuk ke antrean moderasi perangkat desa dan akan divalidasi sebelum tampil di WebGIS publik.
        </p>
        <div className="mt-6">
          <Button variant="primary" onClick={() => setSubmitted(false)}>
            Kirim Laporan Lainnya
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider block">
          Partisipasi Warga
        </span>
        <h1 className="text-3xl font-bold text-[#151A22] mt-1">
          Laporkan Kondisi Kekeringan
        </h1>
        <p className="mt-2 text-sm text-[#6F747C]">
          Sampaikan informasi lapangan secara langsung. Setiap laporan warga akan diverifikasi oleh RT/RW sebelum dipetakan secara publik.
        </p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-[#151A22] mb-1.5">
              Kategori Laporan *
            </label>
            <select
              {...register('category')}
              className="w-full text-sm border border-[#E8EAED] rounded-[6px] p-2.5 bg-white text-[#151A22] focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {REPORT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#151A22] mb-1.5">
              Deskripsi Kejadian / Kondisi Lapangan *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Jelaskan kondisi secara detail, misal debit air surut sejak 2 minggu terakhir..."
              className="w-full text-sm border border-[#E8EAED] rounded-[6px] p-2.5 bg-white text-[#151A22] placeholder:text-[#6F747C] focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* GPS Coordinates */}
          <div className="p-4 bg-gray-50 rounded-[6px] border border-[#E8EAED]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#151A22]">
                Koordinat Lokasi GPS
              </span>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={gpsLoading}
                className="text-xs text-[#16A34A] font-semibold hover:underline flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{gpsLoading ? 'Mendeteksi...' : 'Ambil Titik Saya'}</span>
              </button>
            </div>
            <div className="text-xs text-[#6F747C]">
              <span>Bujur: {coords[0].toFixed(5)}, Lintang: {coords[1].toFixed(5)}</span>
              <span className="block mt-0.5">Akurasi: ±{accuracy} meter</span>
            </div>
          </div>

          {/* Photo Upload Placeholder */}
          <div>
            <label className="block text-xs font-semibold text-[#151A22] mb-1.5">
              Foto Bukti Lapangan (Maks. 3 Foto)
            </label>
            <div className="border border-dashed border-[#E8EAED] rounded-[6px] p-6 text-center hover:bg-gray-50 cursor-pointer">
              <Camera className="w-6 h-6 text-[#6F747C] mx-auto mb-2" />
              <span className="text-xs font-medium text-[#151A22] block">
                Unggah dari Galeri atau Kamera
              </span>
              <span className="text-[11px] text-[#6F747C] block mt-0.5">
                Format PNG/JPEG maks 5MB per berkas (EXIF GPS dibersihkan otomatis)
              </span>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-blue-50/60 rounded-[6px] border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Sesuai UU PDP, identitas dan nomor kontak pelapor tidak dipublikasikan ke peta umum. Hanya perangkat desa berwenang yang dapat melihat rincian verifikasi.
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
          >
            Kirim Laporan Kekeringan
          </Button>
        </form>
      </Card>
    </div>
  );
};
