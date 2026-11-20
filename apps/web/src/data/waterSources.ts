export interface WaterSourceItem {
  id: string;
  name: string;
  type: string;
  condition: 'Baik / Layak' | 'Debit Menurun' | 'Kritis saat Kemarau';
  status: string;
  dusun: string;
  debit: number; // liter/detik
  beneficiariesKK: number;
  roadCondition: string;
  truckAccessible: boolean;
  accessNotes: string;
  coordinates: [number, number]; // [lng, lat]
  tankCapacityLiters: number;
}

export const WATER_SOURCES_DATA: WaterSourceItem[] = [
  {
    id: 'ws-1',
    name: 'Tuk Mulyo (Mata Air Utama)',
    type: 'Mata Air',
    condition: 'Baik / Layak',
    status: 'Aktif Mengalir Sepanjang Tahun',
    dusun: 'Kemitir Lor (RT 01 / RW 01)',
    debit: 12.5,
    beneficiariesKK: 145,
    roadCondition: 'Rabat Beton (Bisa Motor)',
    truckAccessible: false,
    accessNotes: 'Jalan rabat beton 200m dari jalan dusun. Titik parkir aman.',
    coordinates: [110.3142, -7.2268],
    tankCapacityLiters: 15000,
  },
  {
    id: 'ws-2',
    name: 'Sumur Bor Sentral RW 02',
    type: 'Sumur Bor',
    condition: 'Baik / Layak',
    status: 'Aktif Beroperasi Penuh',
    dusun: 'Kemitir Kidul (RT 02 / RW 02)',
    debit: 8.0,
    beneficiariesKK: 92,
    roadCondition: 'Aspal Dusun (Bisa Truk Tangki)',
    truckAccessible: true,
    accessNotes: 'Samping balai warga RT 02. Akses manuver truk tangki leluasa.',
    coordinates: [110.3185, -7.2295],
    tankCapacityLiters: 8000,
  },
  {
    id: 'ws-3',
    name: 'Tuk Gedang Kidul',
    type: 'Mata Air',
    condition: 'Debit Menurun',
    status: 'Kritis saat Puncak Kemarau',
    dusun: 'Kemitir Kidul (RT 04 / RW 02)',
    debit: 2.1,
    beneficiariesKK: 40,
    roadCondition: 'Tanah Curam Perbukitan',
    truckAccessible: false,
    accessNotes: 'Akses setapak lereng, rawan licin saat basah.',
    coordinates: [110.321, -7.234],
    tankCapacityLiters: 4000,
  },
  {
    id: 'ws-4',
    name: 'Embung Pertanian Garon',
    type: 'Embung',
    condition: 'Debit Menurun',
    status: 'Khusus Irigasi Sayur & Palawija',
    dusun: 'Dusun Garon',
    debit: 5.5,
    beneficiariesKK: 60,
    roadCondition: 'Makadam / Cor Blok (Bisa Pickup)',
    truckAccessible: true,
    accessNotes: 'Dapat diakses pickup dan traktor untuk pompa air alkon.',
    coordinates: [110.3095, -7.2235],
    tankCapacityLiters: 50000,
  },
  {
    id: 'ws-5',
    name: 'Mata Air Kalitengah Swadaya',
    type: 'Mata Air',
    condition: 'Baik / Layak',
    status: 'Aktif Swadaya Warga',
    dusun: 'Dusun Kalitengah',
    debit: 6.2,
    beneficiariesKK: 78,
    roadCondition: 'Rabat Beton Lingkungan',
    truckAccessible: false,
    accessNotes: 'Jalur pipa langsung mengalir ke 4 tandon pembagi lingkungan RT 01-03.',
    coordinates: [110.3255, -7.238],
    tankCapacityLiters: 12000,
  },
];

