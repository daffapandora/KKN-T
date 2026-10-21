/**
 * Kamus Bahasa Indonesia Terpusat (Indonesian Copywriting Dictionary)
 * Sesuai Section 8 Master Prompt: Semua copy diletakkan di berkas kamus tunggal.
 */

export const idCopy = {
  brand: {
    name: 'Kemitir Tangguh Bencana',
    shortName: 'Kemitir Tangguh',
    tagline: 'Peta, Data, dan Partisipasi untuk Desa yang Lebih Tangguh',
    village: 'Desa Kemitir, Kec. Sumowono',
    univ: 'KKN Universitas Diponegoro 2026',
    subtext: 'Sistem Informasi Spasial & Mitigasi Kekeringan',
  },

  nav: {
    map: 'Peta',
    waterSources: 'Sumber Air',
    reports: 'Laporan',
    education: 'Edukasi',
    thematicMaps: 'Peta Tematik',
    login: 'Masuk',
    openMap: 'Buka Peta',
    dashboard: 'Dasbor',
    admin: 'Admin',
  },

  hero: {
    pillTag: 'KKN 2026',
    pillText: 'Sistem informasi kekeringan Desa Kemitir',
    headlinePart1: 'Peta, data, dan partisipasi',
    headlinePart2: 'untuk desa yang lebih tangguh.',
    description:
      'Pusat data spasial mitigasi kekeringan Desa Kemitir. Mengintegrasikan analisis bahaya ilmiah geodesi, inventarisasi sumber air bersih, dan pemetaan partisipatif warga secara transparan dalam satu sistem.',
    ctaOpenWebGis: 'Buka WebGIS',
    ctaReportCondition: 'Laporkan Kondisi',
    searchPlaceholder: 'Cari lokasi, sumber air, atau RT/RW...',
    searchButton: 'Cari',
  },

  accessModes: {
    webgis: {
      title: 'WebGIS',
      desc: 'Visualisasi peta multi-layer, analisis tumpang-tindih bahaya vs risiko, dan inventarisasi spasial lengkap melalui peramban.',
      link: 'Jelajahi WebGIS →',
    },
    pwa: {
      title: 'Aplikasi (PWA/Android)',
      desc: 'Pasang langsung di gawai pintar tanpa instalasi rumit. Terhubung ke sensor GPS dan kamera untuk survei lapangan.',
      link: 'Buka di Ponsel →',
    },
    citizenReport: {
      title: 'Laporan Warga',
      desc: 'Kanal partisipasi aktif warga untuk melaporkan debit air surut, kekeringan lahan, atau kerusakan saluran air.',
      link: 'Kirim Laporan →',
    },
  },

  coverage: {
    statement:
      'Meliputi seluruh wilayah administrasi, 4 dusun utama, 18 RT/RW, dan puluhan titik mata air pegunungan di Desa Kemitir.',
    items: [
      'Dusun Kemitir Lor',
      'Dusun Kemitir Kidul',
      'Dusun Garon',
      'Dusun Kalitengah',
      'Data NDVI & NDMI Satelit',
      'Survei GPS Geodesi',
    ],
  },

  metrics: {
    label: 'RINGKASAN DESA',
    area: 'Luas Wilayah',
    areaValue: '1.245 ha',
    population: 'Penduduk',
    populationValue: '4.832 jiwa',
    waterSources: 'Sumber Air',
    waterSourcesValue: '28 titik',
    facilities: 'Fasilitas Umum',
    facilitiesValue: '12 unit',
  },

  capabilities: {
    cap1: {
      eyebrow: '01',
      title: 'Peta multi-layer',
      desc: 'Overlay spasial instan untuk memahami keterkaitan antara faktor bahaya alam dan permukiman warga.',
      rows: [
        { title: 'Bahaya Kekeringan (Hazard)', desc: 'Analisis curah hujan, tutupan vegetasi NDVI, kelerengan, dan pola aliran.' },
        { title: 'Keterpaparan (Exposure)', desc: 'Distribusi penduduk, fasilitas umum, dan lahan sawah tadah hujan.' },
        { title: 'Risiko Kekeringan (Risk)', desc: 'Matriks tumpang-tindih bahaya terhadap kerentanan sosial dan ekonomi.' },
        { title: 'Sumber Air Bersih', desc: 'Sebaran mata air pegunungan, sumur bor sentral, dan jalur transmisi.' },
      ],
      link: 'Lihat Demonstrasi Layer Peta →',
    },
    cap2: {
      eyebrow: '02',
      title: 'Sumber air dan aksesibilitas',
      desc: 'Data mendalam setiap sumber air bersih: debit aliran, kondisi sarana, rute tempuh, dan panduan navigasi.',
      rows: [
        { title: 'Inventarisasi Terperinci', desc: 'Identifikasi jenis sumber air (mata air, sumur bor, PAH, embung) dan kondisi fisik.' },
        { title: 'Pemantauan Kondisi', desc: 'Status kelayakan air dan tren debit pada puncak musim kemarau.' },
        { title: 'Jarak & Aksesibilitas', desc: 'Pencarian sumber air terdekat berbasis algoritma spasial KNN dengan rute jalan.' },
        { title: 'Dokumentasi Visual', desc: 'Foto lapangan berkala kondisi mata air dan bak penampung warga.' },
      ],
      link: 'Lihat Daftar Sumber Air →',
    },
    cap3: {
      eyebrow: '03',
      title: 'Peta partisipatif',
      desc: 'Warga bukan hanya penerima data, melainkan kontributor utama pemetaan pipa air dan titik rawan.',
      rows: [
        { title: 'Pemetaan Titik, Garis & Poligon', desc: 'Warga menandai jalur pipa swadaya, bak tandon komunal, dan sawah kritis.' },
        { title: 'Bukti Foto Lapangan', desc: 'Lampiran foto asli dengan koordinat GPS terverifikasi dan stempel waktu.' },
        { title: 'Validasi Perangkat Desa', desc: 'Pemeriksaan berjenjang oleh ketua RT, RW, dan validator desa sebelum tayang publik.' },
        { title: 'Tumpang Susun Bahaya', desc: 'Objek warga langsung dikomparasikan dengan zona bahaya hasil analisis geodesi.' },
      ],
      link: 'Pelajari Pemetaan Partisipatif →',
    },
  },

  teaserOffline: {
    badge: 'Segera hadir',
    title: 'Mode offline & antrean laporan',
    desc1:
      'Kami sedang mengembangkan kemampuan penyimpanan lokal (Service Worker & Cache API) untuk mendukung relawan di area blank spot lereng perbukitan.',
    desc2:
      'Laporan dan koordinat yang diambil di lokasi tanpa sinyal akan disimpan otomatis dan dikirim saat perangkat kembali terhubung ke jaringan internet.',
  },

  integrations: {
    title: 'Sumber data terintegrasi',
    desc: 'Menggabungkan data ilmiah resmi, pemodelan spasial universitas, dan data lapangan perangkat desa.',
    items: [
      { name: 'Data Hujan BMKG', type: 'Iklim & Curah Hujan' },
      { name: 'Satelit Sentinel (NDVI/NDMI)', type: 'Indeks Kekeringan Vegetasi' },
      { name: 'Survei Geodesi UNDIP', type: 'Ketinggian & Batas Administrasi' },
      { name: 'Survei Lapangan KKN', type: 'Debit & Titik Mata Air' },
      { name: 'Pemerintah Desa Kemitir', type: 'Data Kependudukan & Fasilitas' },
      { name: 'Kode Undangan RT/RW', type: 'Autentikasi Aman Warga' },
    ],
  },

  testimonial: {
    quote:
      '"Integrasi antara peta bahaya ilmiah dari mahasiswa dengan data warga di lapangan membantu kami memprioritaskan penyaluran bantuan air dan perbaikan pipa secara tepat sasaran tanpa perkiraan yang keliru."',
    author: 'Pemerintah Desa Kemitir',
    role: 'Kecamatan Sumowono, Kabupaten Semarang',
  },

  ctaPriority: {
    heading: 'Dusun mana yang paling butuh air bersih?',
    description:
      'Sistem menghitung peringkat prioritas penanganan berdasarkan gabungan kelas risiko kekeringan dan keterbatasan akses ke mata air terdekat.',
    actionButton: 'Lihat Prioritas Penanganan',
    links: [
      'Prioritas 1: Kemitir Kidul (RT 02)',
      'Prioritas 2: Dusun Garon Sawah',
      'Prioritas 3: Lereng Kalitengah',
    ],
  },

  footer: {
    sections: {
      map: {
        title: 'Peta',
        links: ['WebGIS Publik', 'Peta Bahaya', 'Peta Risiko', 'Peta Partisipatif'],
      },
      data: {
        title: 'Data',
        links: ['Sumber Air Bersih', 'Batas Wilayah', 'Jalur Pipa', 'Statistik Desa'],
      },
      reports: {
        title: 'Laporan',
        links: ['Lapor Kekeringan', 'Status Laporan', 'Panduan Pelaporan', 'Kriteria Validasi'],
      },
      education: {
        title: 'Edukasi',
        links: ['Panduan Mitigasi', 'Tips Hemat Air', 'Konservasi Mata Air', 'Kesiapsiagaan'],
      },
      account: {
        title: 'Akun',
        links: ['Masuk Petugas', 'Daftar Warga', 'Bantuan Akun', 'Kode RT/RW'],
      },
      legal: {
        title: 'Legalitas',
        links: ['Kebijakan Privasi (UU PDP)', 'Syarat Penggunaan', 'Kontak Desa'],
      },
    },
    copyright: '© 2026 Pemerintah Desa Kemitir & Tim KKN Universitas Diponegoro.',
    subtext: 'Dibuat untuk ketangguhan masyarakat Desa Kemitir, Sumowono.',
  },

  common: {
    loading: 'Memuat data...',
    error: 'Terjadi kesalahan saat memuat data',
    empty: 'Belum ada data tersedia',
    save: 'Simpan',
    cancel: 'Batal',
    submit: 'Kirim',
    search: 'Cari',
    filter: 'Saring',
    detail: 'Detail',
  },
} as const;

export default idCopy;
