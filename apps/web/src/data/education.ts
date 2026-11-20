export interface Article {
  slug: string;
  title: string;
  category: 'Mitigasi' | 'Konservasi Air' | 'SOP Darurat' | 'Pertanian' | 'Kinerja Sistem';
  readTime: string;
  summary: string;
  author: string;
  date: string;
  content: string[];
}

export interface EducationCategory {
  id: string;
  label: string;
}

export const EDUCATION_CATEGORIES: EducationCategory[] = [
  { id: 'all', label: 'Semua Panduan' },
  { id: 'Konservasi Air', label: 'Konservasi Air' },
  { id: 'SOP Darurat', label: 'SOP Bantuan Tangki' },
  { id: 'Pertanian', label: 'Pertanian Hemat Air' },
  { id: 'Mitigasi', label: 'Mitigasi Mata Air' },
  { id: 'Kinerja Sistem', label: 'Kinerja Sistem' },
];

export const EDUCATION_ARTICLES: Article[] = [
  {
    slug: 'optimasi-kinerja-web-slow-app-lost-customers',
    title: 'Studi Kasus Kinerja Sistem: Slow App = Lost Customers',
    category: 'Kinerja Sistem',
    readTime: '3 mnt',
    summary: 'Slow app = lost customers. In this example, an e-commerce app took 6.2s to load. Three fixes brought it down to 2.0s: 1. database index 2. redis caching 3. image optimisation.',
    author: 'Tim Rekayasa Performa Web',
    date: 'November 2026',
    content: [
      'Slow app = lost customers. Kecepatan dan responsivitas aplikasi adalah fondasi retensi dan kenyamanan pengguna, baik untuk platform e-commerce maupun sistem informasi kebencanaan publik.',
      'Dalam studi kasus nyata, sebuah aplikasi e-commerce membutuhkan waktu 6.2 detik untuk memuat halaman awal (load time 6.2s). Melalui evaluasi terukur, tiga langkah optimasi terarah berhasil memangkas waktu muat hingga menjadi 2.0 detik (peningkatan kecepatan 67.7%):',
      '1. Database Index: Mengeliminasi Full Table Scan dengan menambahkan B-Tree index pada kolom query utama (foreign key, filter status, dan indeks spasial GIST). Latensi query terpangkas dari ratusan milidetik menjadi sub-milidetik (<5ms).',
      '2. Redis Caching: Menerapkan memory cache dengan Redis untuk data agregat populer, sesi pengguna, dan respons endpoint API statis/semi-statis. Waktu respons data turun drastis dari 1.8s menjadi <15ms.',
      '3. Image Optimisation: Mengompresi aset visual ke format WebP/AVIF, mengaktifkan responsive srcset sesuai resolusi layar perangkat, dan menerapkan lazy-loading untuk gambar di luar viewport.',
      'Relevansi untuk Kemitir Tangguh Bencana: Prinsip arsitektur yang sama diterapkan pada WebGIS dan PWA desa ini. Melalui pengindeksan spasial PostGIS (GIST spatial index), kompresi vector tiles (MVT), dan caching lokal Service Worker (Cache API), warga di pelosok perbukitan dengan sinyal seluler terbatas tetap dapat mengakses peta dan data darurat secara instan di bawah 2 detik.',
    ],
  },
  {
    slug: 'panduan-konservasi-air-rumah-tangga',
    title: 'Konservasi Air Bersih Rumah Tangga di Musim Kemarau',
    category: 'Konservasi Air',
    readTime: '4 mnt',
    summary: 'Langkah taktis hemat air harian, penampungan hujan, dan daur ulang greywater untuk pekarangan keluarga.',
    author: 'Tim KKN Tematik UNDIP',
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
    title: 'SOP Dropping Bantuan Air Bersih BPBD & PMI',
    category: 'SOP Darurat',
    readTime: '5 mnt',
    summary: 'Alur darurat tangki air bersih dari RT ke Desa, kriteria prioritas darurat, dan serah tandon balai warga.',
    author: 'Pemerintah Desa & BPBD',
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
    title: 'Irigasi Giliran & Mulsa Organik untuk Pertanian Palawija',
    category: 'Pertanian',
    readTime: '6 mnt',
    summary: 'Menjaga kelembaban tanah lahan kubis, cabai, dan labu siam tanpa membebani mata air sentral.',
    author: 'PPL Pertanian Sumowono',
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
    readTime: '4 mnt',
    summary: 'Perlindungan vegetasi bambu dan beringin radius 200m untuk menjaga cadangan air pegunungan.',
    author: 'Kelompok Pengelola Air Kemitir',
    date: 'Juli 2026',
    content: [
      'Kelestarian debit Tuk Mulyo (12.5 L/detik) sangat bergantung pada tutupan hutan lindung mikro di punggung lereng bukit bagian atas desa.',
      '1. Larangan Penebangan Pohon Pengikat Air: Pohon beringin (Ficus benjamina), aren, dan bambu petung memiliki sistem perakaran jaring yang menahan air tanah dangkal.',
      '2. Pembuatan Rorak dan Sumur Resapan: Membuat parit rorak jebakan air di sepanjang terasiring sawah membantu resapan air hujan saat presipitasi singkat.',
      '3. Pembersihan Berkala Saringan Bak Intake: Endapan pasir dan daun mati wajib dibersihkan setiap minggu agar tidak menyumbat mulut pipa transmisi menuju pemukiman.',
    ],
  },
];

