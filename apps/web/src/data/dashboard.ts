export interface VillageOverview {
  name: string;
  subdistrict: string;
  regency: string;
  elevation: string;
  population: number;
  households: number;
}

export interface WaterSystemOverview {
  activeSources: number;
  totalSources: number;
  totalDebitLps: number;
  debitChangePercent: number;
  totalTankCapacityLiters: number;
  truckAccessibleSources: number;
  status: string;
}

export interface DroughtImpactOverview {
  affectedHouseholds: number;
  affectedDusunCount: number;
  affectedFarmHa: number;
  highRiskAreas: number;
  pendingCitizenReports: number;
  verifiedReports: number;
}

export interface RiskDistributionItem {
  class: string;
  percentage: number;
  areaHa: number;
  color: string;
}

export interface RecentReportItem {
  id: string;
  category: string;
  location: string;
  time: string;
  status: 'valid' | 'pending' | 'rejected';
  description: string;
}

export interface DashboardMetrics {
  village: VillageOverview;
  waterSystem: WaterSystemOverview;
  droughtImpact: DroughtImpactOverview;
  riskDistribution: RiskDistributionItem[];
  recentReports: RecentReportItem[];
}

export const DEFAULT_DASHBOARD_METRICS: DashboardMetrics = {
  village: {
    name: 'Desa Kemitir',
    subdistrict: 'Sumowono',
    regency: 'Kabupaten Semarang',
    elevation: '850 - 1.150 mdpl',
    population: 4832,
    households: 1245,
  },
  waterSystem: {
    activeSources: 4,
    totalSources: 5,
    totalDebitLps: 23.6,
    debitChangePercent: -34.2,
    totalTankCapacityLiters: 45000,
    truckAccessibleSources: 4,
    status: 'Waspada Penurunan Debit Kemarau',
  },
  droughtImpact: {
    affectedHouseholds: 380,
    affectedDusunCount: 4,
    affectedFarmHa: 70.5,
    highRiskAreas: 2,
    pendingCitizenReports: 3,
    verifiedReports: 12,
  },
  riskDistribution: [
    { class: 'Rendah', percentage: 32, areaHa: 380.2, color: '#16A34A' },
    { class: 'Sedang', percentage: 35, areaHa: 412.0, color: '#EAB308' },
    { class: 'Tinggi', percentage: 25, areaHa: 298.5, color: '#EA580C' },
    { class: 'Sangat Tinggi', percentage: 8, areaHa: 154.3, color: '#DC2626' },
  ],
  recentReports: [
    {
      id: 'rep-1',
      category: 'Penurunan Debit Air',
      location: 'Tuk Gedang Kidul, RT 04 / RW 02',
      time: '30 mnt lalu',
      status: 'valid',
      description: 'Debit mata air menyusut hingga 2 L/detik, warga mulai antre tandon.',
    },
    {
      id: 'rep-2',
      category: 'Pipa Retak / Bocor',
      location: 'Jalur Transmisi Kalitengah',
      time: '3 jam lalu',
      status: 'pending',
      description: 'Pipa PVC 2 dim pecah tertimpa longsor kecil material batu tebing.',
    },
    {
      id: 'rep-3',
      category: 'Kekeringan Lahan Sayur',
      location: 'Blok Sawah Garon Kidul',
      time: 'Kemarin',
      status: 'valid',
      description: 'Embung pertanian surut, tanaman kubis dan cabai butuh pompa darurat.',
    },
  ],
};

