import React, { useState } from 'react';
import { X, ExternalLink, ShieldCheck, Layers, Cpu, Database, CheckCircle2, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@kemitir/ui';

interface AccuracyMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccuracyMetadataModal: React.FC<AccuracyMetadataModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'accuracy' | 'sensors' | 'points' | 'drive'>('accuracy');

  if (!isOpen) return null;

  const controlPointsList = [
    { id: 'ICP 2', type: 'ICP', utm: '421468.21, 9201405.07', z: 1005.15, dxy: 0.042, dz: -0.053 },
    { id: 'ICP 4', type: 'ICP', utm: '421672.32, 9201499.41', z: 973.39, dxy: 0.124, dz: 0.116 },
    { id: 'ICP 7', type: 'ICP', utm: '421471.66, 9201026.99', z: 1063.13, dxy: 0.074, dz: 0.512 },
    { id: 'ICP 12', type: 'ICP', utm: '419582.22, 9202528.69', z: 856.81, dxy: 0.099, dz: -0.380 },
    { id: 'ICP 8', type: 'ICP', utm: '419568.60, 9200867.28', z: 1169.01, dxy: 0.119, dz: 0.808 },
    { id: 'ICP 1', type: 'ICP', utm: '418743.93, 9200959.56', z: 1124.36, dxy: 0.057, dz: 0.383 },
    { id: 'ICP 10', type: 'ICP', utm: '419281.38, 9201231.44', z: 1139.02, dxy: 0.164, dz: 0.244 },
    { id: 'ICP 11', type: 'ICP', utm: '419503.24, 9200373.78', z: 1110.67, dxy: 0.238, dz: -0.088 },
    { id: 'ICP 3', type: 'ICP', utm: '420679.64, 9201430.51', z: 1101.60, dxy: 0.023, dz: 1.575 },
    { id: 'ICP 5', type: 'ICP', utm: '420547.92, 9201305.01', z: 1127.89, dxy: 0.185, dz: 0.517 },
    { id: 'ICP 9', type: 'ICP', utm: '420693.34, 9200420.05', z: 1113.07, dxy: 0.085, dz: 1.285 },
    { id: 'ICP 6', type: 'ICP', utm: '421943.69, 9200590.59', z: 1027.00, dxy: 0.066, dz: 0.011 },
    { id: 'GCP 8', type: 'GCP', utm: '421755.92, 9200821.05', z: 1042.76, dxy: 0.011, dz: 0.001 },
    { id: 'GCP 12', type: 'GCP', utm: '419670.46, 9202348.32', z: 949.84, dxy: 0.003, dz: 0.003 },
    { id: 'GCP 9', type: 'GCP', utm: '420297.23, 9201030.25', z: 1165.60, dxy: 0.012, dz: 0.003 },
    { id: 'GCP 11', type: 'GCP', utm: '419419.45, 9200219.98', z: 1116.42, dxy: 0.002, dz: 0.002 },
    { id: 'GCP 3', type: 'GCP', utm: '421075.98, 9202081.04', z: 920.91, dxy: 0.004, dz: 0.001 },
    { id: 'GCP 7', type: 'GCP', utm: '422220.92, 9200467.07', z: 1037.53, dxy: 0.002, dz: 0.001 },
  ];

  const driveLinks = [
    { title: 'Folder Induk Peta Foto Kemitir', desc: 'Arsip utama data fotogrametri dan turunan GIS', url: 'https://drive.google.com/drive/folders/12azqkvMbPMFPutg-R1l0G_ycj7clcSKC' },
    { title: 'Model Elevasi (DTM & DSM)', desc: 'DTM Kemitir.tif (14.4 GB) & DSM final.tif (17.8 GB)', url: 'https://drive.google.com/drive/folders/1geaj-rF-Z-o6L8VrCU0QDUipLEUtIpd_' },
    { title: 'Ortomosaik RGB 8-Bit', desc: 'RGB_Kemitir.tif (2.6 GB), Orthomosaik final, laporan kalibrasi', url: 'https://drive.google.com/drive/folders/1OKv9DnV97dmKzYrnRYRLib6yxI9ngiAI' },
    { title: 'Multispektral (4-Band M3M)', desc: 'MultiSpektral high res.tif (55.4 GB), 4 band pantulan reflektansi', url: 'https://drive.google.com/drive/folders/1Ej85xjeFDU3OFwgo2NBv0qxQbLzB_c2s' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header Modal */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Uji Akurasi Geometri & Sensor Peta Dasar</h2>
              <p className="text-xs text-slate-500">Sesuai Peraturan Kepala BIG No. 15 Tahun 2014 • Desa Kemitir</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigasi */}
        <div className="flex border-b border-slate-200 px-6 gap-2 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('accuracy')}
            className={`py-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'accuracy'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Hasil Uji BIG</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sensors')}
            className={`py-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'sensors'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Sensor & DEM</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('points')}
            className={`py-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'points'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>18 Titik GCP / ICP</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('drive')}
            className={`py-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'drive'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Data Cloud (Drive)</span>
          </button>
        </div>

        {/* Konten Modal */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          
          {/* TAB 1: Hasil Uji BIG */}
          {activeTab === 'accuracy' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">Ketelitian Horizontal</div>
                  <div className="text-2xl font-bold text-emerald-900 mt-1">0.186 m</div>
                  <div className="text-xs text-emerald-700 mt-0.5">CE90 (RMSEr: 0.123 m)</div>
                  <div className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-200 text-emerald-900">
                    Kelas 1 • Skala 1:1.000
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Ketelitian Vertikal</div>
                  <div className="text-2xl font-bold text-blue-900 mt-1">1.136 m</div>
                  <div className="text-xs text-blue-700 mt-0.5">LE90 (RMSEz: 0.688 m)</div>
                  <div className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-200 text-blue-900">
                    Kelas 3 • Skala 1:2.500
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Resolusi Citra (GSD)</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">4.0 cm</div>
                  <div className="text-xs text-slate-500 mt-0.5">Ground Sampling Distance</div>
                  <div className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
                    Dukung Skala s/d 1:400
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Kesimpulan Standar Teknis Perka BIG No. 15 Tahun 2014
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 list-disc pl-5">
                  <li><strong>Peta 2D (Orthofoto):</strong> Memenuhi ketelitian geometrik tertinggi <strong>Kelas 1 hingga skala 1:1.000</strong> (hasil hitung formula 1:930).</li>
                  <li><strong>Peta 3D (Topografi):</strong> Faktor pembatas utama adalah ketelitian vertikal (LE90 = 1.136m), memenuhi <strong>Kelas 2 skala 1:4.000</strong> dan <strong>Kelas 3 skala 1:2.500</strong>.</li>
                  <li><strong>Titik Sampel Uji:</strong> Dilakukan pengujian terhadap 12 Independent Check Point (ICP) yang diukur menggunakan GPS Geodetik GNSS RTK di seluruh dusun Desa Kemitir.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: Sensor & DEM */}
          {activeTab === 'sensors' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <FileText className="w-4 h-4 text-blue-600" />
                    DSM (Digital Surface Model)
                  </div>
                  <p className="text-xs text-slate-600">
                    Dibuat dari hasil pengolahan fotogrametri <strong>Sensor RGB</strong> (DJI Mavic 3 Enterprise, focal length 12.29mm).
                  </p>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>• Jumlah Foto: 7.607 foto udara</li>
                    <li>• Ketinggian Terbang: 168 m AGL</li>
                    <li>• Luas Cakupan: 12.4 km²</li>
                    <li>• Resolusi Grid: 4.51 cm / piksel</li>
                    <li>• Tie Points: 20.997.852 titik sambung</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Cpu className="w-4 h-4 text-emerald-600" />
                    DTM (Digital Terrain Model)
                  </div>
                  <p className="text-xs text-slate-600">
                    Dibuat dari hasil fotogrametri <strong>Multispektral</strong> dengan klasifikasi filter elevasi tanah (Ground Points).
                  </p>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>• Jumlah Foto: 30.424 citra multispektral</li>
                    <li>• Titik Permukaan Tanah (Ground): 43.642.741 titik</li>
                    <li>• Titik Vegetasi Lebat: 100.745.612 titik</li>
                    <li>• Resolusi Grid DEM: 4.44 cm / piksel</li>
                    <li>• Sistem Koordinat: DGN95 / UTM Zone 49S (EPSG:23879)</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <h4 className="font-semibold text-amber-900 text-xs sm:text-sm">
                  Spesifikasi 4-Band Sensor Multispektral (Analisis Kekeringan & NDVI)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs">
                  <div className="p-2 bg-white rounded-xl border border-amber-200/80">
                    <span className="font-bold text-emerald-700">Band 1 - Green</span>
                    <div className="text-slate-500">0,544 – 0,576 µm</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-amber-200/80">
                    <span className="font-bold text-rose-700">Band 2 - Red</span>
                    <div className="text-slate-500">0,634 – 0,666 µm</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-amber-200/80">
                    <span className="font-bold text-orange-700">Band 3 - Red Edge</span>
                    <div className="text-slate-500">0,714 – 0,746 µm</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-amber-200/80">
                    <span className="font-bold text-purple-700">Band 4 - NIR</span>
                    <div className="text-slate-500">0,834 – 0,886 µm</div>
                  </div>
                </div>
                <p className="text-xs text-amber-800 mt-2">
                  Kombinasi band NIR dan Red digunakan untuk formulasi NDVI (Normalized Difference Vegetation Index) guna memetakan tingkat kekeringan kanopi tanaman kebun warga Kemitir.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: 18 Titik GCP & ICP */}
          {activeTab === 'points' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Sebaran 18 titik titik ikat (GCP) dan titik kontrol independen (ICP) diukur dengan receiver GNSS Geodetik di lapangan.
              </p>
              <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0">
                    <tr>
                      <th className="p-2">ID Titik</th>
                      <th className="p-2">Tipe</th>
                      <th className="p-2">Koordinat UTM 49S (X, Y)</th>
                      <th className="p-2">Elevasi Z</th>
                      <th className="p-2">Residu 2D</th>
                      <th className="p-2">Residu Z</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {controlPointsList.map((pt) => (
                      <tr key={pt.id} className="hover:bg-slate-50">
                        <td className="p-2 font-bold text-slate-900">{pt.id}</td>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            pt.type === 'ICP' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {pt.type}
                          </span>
                        </td>
                        <td className="p-2 font-mono text-slate-600">{pt.utm}</td>
                        <td className="p-2 font-mono">{pt.z.toFixed(2)} m</td>
                        <td className="p-2 font-mono text-slate-700">{pt.dxy.toFixed(3)} m</td>
                        <td className="p-2 font-mono text-slate-700">{pt.dz.toFixed(3)} m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Data Drive */}
          {activeTab === 'drive' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Citra GeoTIFF mentah (berukuran 2 GB hingga 55 GB per file) di-hosting di Google Drive resmi proyek pemetaan Desa Kemitir:
              </p>
              <div className="space-y-2">
                {driveLinks.map((link) => (
                  <a
                    key={link.title}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-emerald-800 flex items-center gap-1.5">
                        {link.title}
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{link.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Modal */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
          <span className="text-xs text-slate-500">
            KKN Tematik Universitas Diponegoro 2026
          </span>
          <Button
            variant="primary"
            onClick={() => window.open('https://drive.google.com/drive/folders/12azqkvMbPMFPutg-R1l0G_ycj7clcSKC', '_blank')}
            className="flex items-center gap-1.5 text-xs py-2 px-4"
          >
            <Database className="w-4 h-4" />
            <span>Buka Google Drive Peta</span>
          </Button>
        </div>

      </div>
    </div>
  );
};
