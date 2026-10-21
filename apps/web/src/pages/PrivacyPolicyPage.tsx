import React from 'react';
import { Card } from '@kemitir/ui';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-2 text-[#16A34A]">
        <ShieldCheck className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Kepatuhan Regulasi UU PDP No. 27 Tahun 2022
        </span>
      </div>
      <h1 className="text-3xl font-bold text-[#151A22]">
        Kebijakan Privasi & Perlindungan Data Pribadi
      </h1>
      <p className="mt-2 text-sm text-[#6F747C]">
        Sistem Informasi Spasial & Mitigasi Kekeringan Desa Kemitir (Kemitir Tangguh Bencana)
      </p>

      <Card className="mt-8 p-6 md:p-8 space-y-6 text-sm text-[#151A22] leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-[#151A22] mb-2">1. Prinsip Umum</h2>
          <p className="text-[#6F747C]">
            Pemerintah Desa Kemitir bersama Tim KKN Universitas Diponegoro berkomitmen penuh melindungi privasi setiap warga pelapor dan pengguna sistem WebGIS sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022).
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#151A22] mb-2">2. Data yang Dikumpulkan (Prinsip Minimalisasi)</h2>
          <p className="text-[#6F747C]">
            Kami hanya mengumpulkan data yang mutlak diperlukan untuk keperluan mitigasi kekeringan:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-[#6F747C]">
            <li>Nama lengkap dan nomor telepon/WhatsApp (disimpan secara terenkripsi/hash).</li>
            <li>Wilayah domisili tingkat RT/RW dan Dusun.</li>
            <li>Koordinat GPS lokasi kejadian atau objek sarana air yang dilaporkan.</li>
            <li>Foto dokumentasi lapangan (data EXIF sensitif dihapus dari berkas foto sebelum disimpan).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#151A22] mb-2">3. Tujuan Penggunaan Data</h2>
          <p className="text-[#6F747C]">
            Data yang terkumpul hanya dimanfaatkan untuk:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-[#6F747C]">
            <li>Verifikasi dan validasi laporan kekeringan oleh perangkat desa berwenang.</li>
            <li>Penentuan prioritas intervensi bantuan air bersih dan pemeliharaan saluran pipa.</li>
            <li>Penyusunan peta risiko kebencanaan Desa Kemitir.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#151A22] mb-2">4. Privasi Peta Publik</h2>
          <p className="text-[#6F747C]">
            Peta yang dapat diakses publik <strong>TIDAK PERNAH</strong> menampilkan identitas warga atau nomor telepon pelapor. Data pribadi hanya dapat dilihat oleh akun Validator Desa resmi.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#151A22] mb-2">5. Hak Subjek Data & Penghapusan</h2>
          <p className="text-[#6F747C]">
            Warga memiliki hak untuk meminta pembaruan atau penghapusan data akun dan riwayat laporan kapan saja melalui Sekretariat Kantor Desa Kemitir atau administrator sistem.
          </p>
        </section>
      </Card>
    </div>
  );
};
