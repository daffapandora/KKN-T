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
      'Pantau sebaran mata air, peta risiko kekeringan, dan kondisi sarana air desa secara langsung dalam satu sistem spasial.',
    ctaOpenWebGis: 'Buka WebGIS',
    ctaReportCondition: 'Laporkan Kondisi',
    searchPlaceholder: 'Cari lokasi, sumber air, atau RT/RW...',
    searchButton: 'Cari',
  },

  accessModes: {
    webgis: {
      title: 'WebGIS',
      desc: 'Peta multi-layer spasial, zona risiko kekeringan, dan analisis tutupan lahan desa.',
      link: 'Jelajahi WebGIS →',
    },
    pwa: {
      title: 'Aplikasi (PWA/Android)',
      desc: 'Aplikasi ringan hemat kuota dengan GPS dan kamera untuk pemantauan lapangan.',
      link: 'Buka di Ponsel →',
    },
    citizenReport: {
      title: 'Laporan Warga',
      desc: 'Kanal cepat untuk melaporkan debit air surut, pipa bocor, atau permohonan tangki.',
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
      desc: 'Tumpang-susun data bahaya alam, permukiman, dan fasilitas publik secara instan.',
      rows: [
        { title: 'Bahaya Kekeringan (Hazard)', desc: 'Curah hujan, vegetasi NDVI, kelerengan, dan pola aliran.' },
        { title: 'Keterpaparan (Exposure)', desc: 'Sebaran penduduk, fasilitas desa, dan lahan sawah palawija.' },
        { title: 'Risiko Kekeringan (Risk)', desc: 'Analisis tumpang-tindih bahaya terhadap kerentanan warga.' },
        { title: 'Sumber Air Bersih', desc: 'Lokasi mata air, sumur bor, dan jalur pipa transmisi.' },
      ],
      link: 'Lihat Demonstrasi Layer Peta →',
    },
    cap2: {
      eyebrow: '02',
      title: 'Sumber air dan aksesibilitas',
      desc: 'Informasi debit, kondisi fisik sarana, dan rute navigasi armada tangki.',
      rows: [
        { title: 'Inventarisasi Sumber Air', desc: 'Klasifikasi mata air, sumur bor, tandon, dan embung.' },
        { title: 'Pemantauan Debit', desc: 'Status kelayakan air dan tren debit kemarau faktual.' },
        { title: 'Jarak & Aksesibilitas', desc: 'Kalkulasi jarak terdekat dan kelayakan jalan truk tangki.' },
        { title: 'Dokumentasi Lapangan', desc: 'Foto berkala kondisi bak penampung dan debit mata air.' },
      ],
      link: 'Lihat Daftar Sumber Air →',
    },
    cap3: {
      eyebrow: '03',
      title: 'Peta partisipatif',
      desc: 'Warga memetakan jalur pipa swadaya dan melaporkan titik rawan di lingkungannya.',
      rows: [
        { title: 'Pemetaan Jalur Pipa', desc: 'Tandai jalur transmisi pipa warga, tandon, dan bak bagi.' },
        { title: 'Bukti Foto & GPS', desc: 'Foto lapangan dengan koordinat otomatis dari ponsel warga.' },
        { title: 'Verifikasi Pengurus RT', desc: 'Konfirmasi berjenjang oleh RT/RW sebelum data dipublikasikan.' },
        { title: 'Deteksi Jalur Rawan', desc: 'Pipa melintasi tebing terjal langsung terdeteksi di sistem.' },
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
