export interface PriorityArea {
  rank: number;
  areaName: string;
  dusun: string;
  rtRw: string;
  urgencyLevel: 'Sangat Mendesak' | 'Prioritas Tinggi' | 'Prioritas Sedang';
  compositeScore: number; // 0 - 100
  affectedResidents: number;
  farmAreaHa: number;
  primaryIssue: string;
  nearestWaterSource: string;
  distanceToWaterMeters: number;
  recommendedIntervention: string[];
}

export const PRIORITY_AREAS_DATA: PriorityArea[] = [
  {
    rank: 1,
    areaName: 'RT 02 Kemitir Kidul (Perbukitan Atas)',
    dusun: 'Dusun Kemitir Kidul',
    rtRw: 'RT 02 / RW 01',
    urgencyLevel: 'Sangat Mendesak',
    compositeScore: 92.4,
    affectedResidents: 380,
    farmAreaHa: 28.5,
    primaryIssue: 'Penurunan debit Tuk Gedang >75% dan pipa transmisi swadaya retak akibat pergerakan tanah lereng.',
    nearestWaterSource: 'Sumur Bor Sentral RW 02',
    distanceToWaterMeters: 850,
    recommendedIntervention: [
      'Dropping air bersih tangki darurat 2x seminggu ke balai warga',
      'Penggantian 350m pipa paralon dengan HDPE fleksibel tahan geser',
      'Pemasangan tandon penampungan darurat 5.000L di titik balai RT',
    ],
  },
  {
    rank: 2,
    areaName: 'Blok Sawah Tadah Hujan Garon',
    dusun: 'Dusun Garon',
    rtRw: 'RT 01 / RW 03',
    urgencyLevel: 'Prioritas Tinggi',
    compositeScore: 84.1,
    affectedResidents: 240,
    farmAreaHa: 42.0,
    primaryIssue: 'Kekeringan lahan sayur kubis & cabai. Debit embung pertanian surut ke level sedimentasi dasar.',
    nearestWaterSource: 'Embung Pertanian Garon',
    distanceToWaterMeters: 450,
    recommendedIntervention: [
      'Pengerukan sedimentasi dasar embung bersama kelompok tani',
      'Bantuan pompa alkon bergerak untuk suplai air dasar lembah',
      'Penetapan jadwal giliran jam pompa irigasi antar-blok sawah',
    ],
  },
  {
    rank: 3,
    areaName: 'Lereng Kalitengah Bagian Timur',
    dusun: 'Dusun Kalitengah',
    rtRw: 'RT 03 / RW 04',
    urgencyLevel: 'Prioritas Tinggi',
    compositeScore: 78.6,
    affectedResidents: 195,
    farmAreaHa: 18.0,
    primaryIssue: 'Topografi lereng terjal, warga harus menuruni tebing curam 600m untuk mengambil air bersih.',
    nearestWaterSource: 'Mata Air Kalitengah Swadaya',
    distanceToWaterMeters: 620,
    recommendedIntervention: [
      'Pembangunan bak penampung antara (booster tank) di elevasi tengah bukit',
      'Perbaikan jalan setapak rabat beton menuju mata air untuk keselamatan warga',
    ],
  },
  {
    rank: 4,
    areaName: 'Pemukiman Kemitir Lor Bawah',
    dusun: 'Dusun Kemitir Lor',
    rtRw: 'RT 03 / RW 01',
    urgencyLevel: 'Prioritas Sedang',
    compositeScore: 61.2,
    affectedResidents: 310,
    farmAreaHa: 15.0,
    primaryIssue: 'Tekanan air pipa berkurang di jam sibuk sore hari, debit Tuk Mulyo masih stabil.',
    nearestWaterSource: 'Tuk Mulyo (Mata Air Utama)',
    distanceToWaterMeters: 320,
    recommendedIntervention: [
      'Pembersihan saringan filter bak penampung utama',
      'Pemasangan stop kran pengatur tekanan pada percabangan pipa warga',
    ],
  },
];

