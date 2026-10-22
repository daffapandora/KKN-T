import React, { useState } from 'react';
import { Card, Button } from '@kemitir/ui';
import { BookOpen, Droplets, ShieldCheck, PhoneCall, AlertTriangle, ChevronRight, CheckCircle2, FileText, ArrowRight, Phone, Sparkles, X } from 'lucide-react';
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

  const categories = [
    { id: 'all', label: 'Semua Panduan' },
    { id: 'Konservasi Air', label: 'Konservasi Air' },
    { id: 'SOP Darurat', label: 'SOP Bantuan Tangki' },
    { id: 'Pertanian', label: 'Pertanian Hemat Air' },
    { id: 'Mitigasi', label: 'Mitigasi Mata Air' },
  ];

  const filteredArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  return (
    <div className="flex-1 bg-slate-50/60 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Apple Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 rounded-3xl p-8 sm:p-10 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wide uppercase backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pusat Literasi & Tanggap Bencana Desa</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Edukasi & Mitigasi Kekeringan Kemitir
            </h1>
            <p className="text-white/90 text-base sm:text-lg leading-relaxed">
              Panduan praktis konservasi air rumah tangga, SOP resmi bantuan tangki BPBD, dan panduan perawatan pipa swadaya untuk warga usia 30-50 tahun.
            </p>
          </div>

          <div className="shrink-0">
            <Link to="/laporan">
              <Button variant="secondary" size="lg" className="bg-white text-emerald-800 hover:bg-slate-100 font-bold shadow-md">
                Lapor Krisis Air
              </Button>
            </Link>
          </div>
        </div>

        {/* Emergency Hotlines with Direct Call Ergonomics */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Kontak Cepat & Bantuan Darurat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="tel:085876543210"
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Satgas Bencana Desa</span>
                  <span className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    0858-7654-3210
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 px-2 py-1 bg-emerald-50 rounded-lg">
                Panggil
              </span>
            </a>

            <a
              href="tel:112"
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Tangki Air BPBD Semarang</span>
                  <span className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    112 / (024) 692-1413
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-700 px-2 py-1 bg-blue-50 rounded-lg">
                Panggil
              </span>
            </a>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Pengaduan Pipa Swadaya</span>
                <span className="text-sm font-bold text-slate-900">
                  Hubungi Pengurus RT Setempat
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all select-none ${
                selectedCategory === c.id
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.slug}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    {article.category}
                  </span>
                  <span className="text-slate-500 font-medium">{article.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {article.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {article.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span className="font-medium text-slate-800 block">{article.author}</span>
                  <span>{article.date}</span>
                </div>

                <Button
                  variant="secondary"
                  size="md"
                  className="font-semibold gap-1.5"
                  onClick={() => setActiveArticle(article)}
                >
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Article Reader Modal (Apple Sheet) */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                    {activeArticle.category}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    {activeArticle.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Oleh: {activeArticle.author} • {activeArticle.date}
                  </p>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-slate-800 text-base leading-relaxed">
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx} className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button variant="primary" size="md" onClick={() => setActiveArticle(null)}>
                  Tutup Panduan
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
