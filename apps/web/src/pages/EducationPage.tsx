import React, { useState } from 'react';
import { Card, Button, StatusChip } from '@kemitir/ui';
import { BookOpen, Droplets, ShieldCheck, PhoneCall, AlertTriangle, ChevronRight, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Article {
  slug: string;
  title: string;
  category: 'Mitigasi' | 'Konservasi Air' | 'SOP Darurat' | 'Pertanian';
  readTime: string;
  summary: string;
  author: string;
  date: string;
  content: string[];
}

export const EducationPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      slug: 'panduan-konservasi-air-rumah-tangga',
      title: 'Pedoman Konservasi Air Bersih Rumah Tangga di Musim Kemarau',
      category: 'Konservasi Air',
      readTime: '4 menit baca',
      summary: 'Langkah taktis penghematan air harian, teknik penampungan air hujan, dan pemanfaatan greywater untuk pekarangan keluarga.',
      author: 'Tim KKN Tematik UNDIP 2026',
      date: 'Oktober 2026',
      content: [
        'Musim kemarau di lereng Gunung Ungaran (Kecamatan Sumowono) seringkali menyebabkan fluktuasi debit mata air pegunungan hingga menyusut 40-75%. Pengelolaan air di tingkat keluarga adalah benteng pertahanan pertama mitigasi bencana.',
        '1. Daur Ulang Greywater: Air bekas cucian beras, sayur, dan buah memiliki nutrisi organik dan bebas deterjen keras. Sangat aman dan subur digunakan langsung untuk menyiram tanaman pekarangan.',
        '2. Pemasangan Aerator Kran Hemat Air: Menggunakan corong penyaring aerator mampu mengurangi laju aliran air kran dari 12 L/menit menjadi 4-6 L/menit tanpa mengurangi tekanan semprot.',
        '3. Jadwal Tampung Air Bergilir: Pada RT yang mengalami penurunan tekanan pipa swadaya, lakukan pengisian tandon bersama pada jam 23.00 - 04.00 WIB saat debit pipa mencapai tekanan hidrolik tertinggi.',
      ],
    },
    {
      slug: 'sop-distribusi-bantuan-tangki-air',
      title: 'Standar Operasional Prosedur (SOP) Dropping Bantuan Air Bersih BPBD & PMI',
      category: 'SOP Darurat',
      readTime: '5 menit baca',
      summary: 'Alur permohonan darurat tangki air bersih dari RT ke Pemerintah Desa Kemitir, kriteria prioritas, dan titik serah tandon umum.',
      author: 'Pemerintah Desa Kemitir & BPBD Kab. Semarang',
      date: 'September 2026',
      content: [
        'Prosedur ini disusun untuk menjamin bantuan tangki air gratis dari BPBD Kabupaten Semarang tepat sasaran dan tidak menimbulkan antrean tidak tertib di jalan dusun.',
        'Tahap 1: Ketua RT melakukan pendataan KK yang mengalami kekeringan mutlak (tidak memiliki cadangan air minum >2 hari) melalui aplikasi WebGIS atau formulir lapor desa.',
        'Tahap 2: Validator desa mengonfirmasi titik koordinat dan memastikan kelayakan akses truk tangki (lebar jalan minimal 2.8 meter dan bebas halangan kabel listrik rendah).',
        'Tahap 3: Air dialirkan secara terpusat ke tandon penampung umum (kapasitas 5.000 liter) di dekat balai warga, bukan diisikan langsung ke ember perorangan di jalan.',
      ],
    },
    {
      slug: 'irigasi-hemat-air-palawija',
      title: 'Teknik Irigasi Giliran dan Mulsa Organik untuk Pertanian Palawija Kemitir',
      category: 'Pertanian',
      readTime: '6 menit baca',
      summary: 'Solusi menjaga kelembaban tanah lahan sayur kubis, cabai, dan labu siam tanpa membebani mata air sentral.',
      author: 'Penyuluh Pertanian Lapangan (PPL) Kec. Sumowono',
      date: 'Agustus 2026',
      content: [
        'Lahan pertanian di Dusun Garon dan Kemitir Kidul didominasi tanaman hortikultura yang membutuhkan kelembaban konstan namun sangat rentan layu kekeringan.',
        '1. Penggunaan Mulsa Jerami / Serasah Daun Kering: Menutup bedengan dengan jerami tebal 5-8 cm menekan evaporasi air tanah hingga 60% dan mencegah retak lapisan olah tanah.',
        '2. Irigasi Tetes Gravitasi Botol Bekas: Manfaatkan botol plastik 1.5 liter yang dilubangi jarum pada pangkal tanaman cabai untuk menyediakan irigasi mikro sepanjang hari dengan konsumsi air sangat hemat.',
        '3. Sistem Giliran Jam Irigasi Embung: Kelompok tani membagi blok utara pada hari Senin-Rabu dan blok selatan pada Kamis-Sabtu untuk menghindari perebutan air pompa alkon.',
      ],
    },
    {
      slug: 'perlindungan-daerah-tangkapan-mata-air',
      title: 'Pemeliharaan Sumber Mata Air Alami (Tuk Mulyo & Tuk Gedang)',
      category: 'Mitigasi',
      readTime: '4 menit baca',
      summary: 'Perlindungan vegetasi bambu dan beringin di radius 200 meter sekitar mata air guna mempertahankan imbuhan air tanah pegunungan.',
      author: 'Kelompok Swadaya Masyarakat Kemitir',
      date: 'Juli 2026',
      content: [
        'Kelestarian debit Tuk Mulyo (12.5 L/detik) sangat bergantung pada tutupan hutan lindung mikro di punggung lereng bukit bagian atas desa.',
        '1. Larangan Penebangan Pohon Pengikat Air: Pohon beringin (Ficus benjamina), aren, dan bambu petung memiliki sistem perakaran jaring yang menahan air tanah dangkal.',
        '2. Pembuatan Rorak dan Sumur Resapan: Membuat parit rorak jebakan air di sepanjang terasiring sawah membantu resapan air hujan saat presipitasi singkat.',
        '3. Pembersihan Berkala Saringan Bak Intake: Endapan pasir dan daun mati wajib dibersihkan setiap minggu agar tidak menyumbat mulut pipa transmisi menuju pemukiman.',
      ],
    },
  ];

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  return (
    <div className="flex-1 bg-[#F9FAFB] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#15803D] to-[#16A34A] rounded-xl p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pusat Literasi Kebencanaan Desa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Edukasi & Mitigasi Kekeringan Kemitir
            </h1>
            <p className="text-white/90 text-sm leading-relaxed">
              Panduan praktis konservasi air, alur bantuan tangki darurat, serta strategi perlindungan mata air pegunungan untuk seluruh warga dan perangkat desa.
            </p>
          </div>
          <Link to="/laporan">
            <Button variant="secondary" className="bg-white text-[#15803D] hover:bg-white/90 shadow">
              Lapor Krisis Air
            </Button>
          </Link>
        </div>

        {/* Emergency Hotlines Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-[#16A34A] flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-[#16A34A]">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#6F747C] font-medium">Satgas Bencana Desa Kemitir</p>
              <p className="text-sm font-bold text-[#151A22]">0858-7654-3210 (Pak Kadus)</p>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-[#2563EB] flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#2563EB]">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#6F747C] font-medium">Bantuan Tangki Air BPBD Semarang</p>
              <p className="text-sm font-bold text-[#151A22]">(024) 692-1413 / 112</p>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-[#F59E0B] flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-[#F59E0B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#6F747C] font-medium">Pengaduan Pipa Rusak & Swadaya</p>
              <p className="text-sm font-bold text-[#151A22]">Hubungi Pengurus RT Setempat</p>
            </div>
          </Card>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['all', 'Konservasi Air', 'SOP Darurat', 'Pertanian', 'Mitigasi'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#16A34A] text-white shadow-sm'
                  : 'bg-white border border-[#E8EAED] text-[#4A4F56] hover:bg-gray-50'
              }`}
            >
              {cat === 'all' ? 'Semua Panduan' : cat}
            </button>
          ))}
        </div>

        {/* Articles List / Detail */}
        {activeArticle ? (
          <Card className="p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setActiveArticle(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] hover:underline"
            >
              ← Kembali ke Daftar Artikel
            </button>
            <div className="space-y-3 border-b border-[#E8EAED] pb-6">
              <div className="flex items-center gap-2">
                <StatusChip label={activeArticle.category} status="valid" />
                <span className="text-xs text-[#6F747C]">{activeArticle.readTime}</span>
                <span className="text-xs text-[#6F747C]">•</span>
                <span className="text-xs text-[#6F747C]">{activeArticle.date}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#151A22]">
                {activeArticle.title}
              </h2>
              <p className="text-xs text-[#6F747C]">Ditulis oleh: {activeArticle.author}</p>
            </div>
            <div className="space-y-4 text-sm text-[#374151] leading-relaxed">
              {activeArticle.content.map((p, idx) => (
                <p key={idx} className="bg-gray-50/70 p-4 rounded-lg border border-gray-100">
                  {p}
                </p>
              ))}
            </div>
            <div className="pt-4 border-t border-[#E8EAED] flex items-center justify-between">
              <Link to="/peta">
                <Button variant="secondary" size="sm">
                  Cek Kondisi Peta Terkini
                </Button>
              </Link>
              <button
                onClick={() => setActiveArticle(null)}
                className="text-xs font-semibold text-[#16A34A]"
              >
                Tutup Artikel
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <Card
                key={article.slug}
                className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow group cursor-pointer border border-[#E8EAED]"
                onClick={() => setActiveArticle(article)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <StatusChip label={article.category} status="valid" />
                    <span className="text-xs text-[#6F747C]">{article.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#151A22] group-hover:text-[#16A34A] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#6F747C] line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E8EAED] flex items-center justify-between mt-4">
                  <span className="text-[11px] text-[#9CA3AF]">{article.date}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#16A34A] group-hover:translate-x-1 transition-transform">
                    Baca Panduan <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
