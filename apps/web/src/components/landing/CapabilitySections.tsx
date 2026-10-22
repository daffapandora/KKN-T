import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { idCopy } from '../../i18n/id';
import { Layers, Droplets, Share2, CheckCircle2, ArrowRight } from 'lucide-react';

export const CapabilitySections: React.FC = () => {
  const [activeCap1Row, setActiveCap1Row] = useState(0);
  const [activeCap2Row, setActiveCap2Row] = useState(0);
  const [activeCap3Row, setActiveCap3Row] = useState(0);

  return (
    <div className="space-y-24 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* =========================================================================
          Capability 1: Peta Multi-Layer (Green Eyebrow 01)
      ========================================================================= */}
      <section className="border border-[#E8EAED] rounded-[8px] p-6 lg:p-10 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-[#16A34A] tracking-wider uppercase">
            {idCopy.capabilities.cap1.eyebrow}
          </span>
          <span className="text-xs text-[#6F747C]">/ Analisis Spasial Komprehensif</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#151A22] tracking-tight">
          {idCopy.capabilities.cap1.title}
        </h2>
        <p className="mt-2 text-sm text-[#6F747C] max-w-xl">
          {idCopy.capabilities.cap1.desc}
        </p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left rows */}
          <div className="lg:col-span-5 space-y-2">
            {idCopy.capabilities.cap1.rows.map((row, idx) => {
              const isActive = activeCap1Row === idx;
              return (
                <div
                  key={row.title}
                  onClick={() => setActiveCap1Row(idx)}
                  className={`p-4 rounded-[6px] border transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#16A34A] bg-[#F0FDF4]/50 border-l-[3px]'
                      : 'border-[#E8EAED] bg-white hover:bg-gray-50'
                  }`}
                >
                  <h4 className="text-sm font-semibold text-[#151A22]">{row.title}</h4>
                  <p className="mt-1 text-xs text-[#6F747C] leading-relaxed">{row.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Right Framed Map Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-[6px] border border-[#E8EAED] bg-[#17202B] p-3">
              <div className="relative aspect-[4/3] rounded-[4px] overflow-hidden bg-slate-900 flex flex-col justify-between p-4">
                <div className="flex justify-between items-center text-xs text-white">
                  <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-[4px] border border-slate-700">
                    <Layers className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Multi-layer WebGIS Mode</span>
                  </div>
                  <span className="text-[11px] text-slate-400">EPSG:4326</span>
                </div>

                {/* SVG Visual Demo */}
                <div className="my-auto text-center p-6 bg-slate-800/40 border border-slate-700/50 rounded-[4px]">
                  <span className="text-xs font-medium text-white block">
                    Menampilkan: {idCopy.capabilities.cap1.rows[activeCap1Row].title}
                  </span>
                  <span className="text-[11px] text-slate-300 mt-1 block">
                    Peta Desa Kemitir dengan tumpang susun curah hujan dan batas dusun
                  </span>
                </div>

                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#16A34A]/20 text-[#22c55e] border border-[#16A34A]/40">
                    Rendah
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#EAB308]/20 text-[#fde047] border border-[#EAB308]/40">
                    Sedang
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#DC2626]/20 text-[#f87171] border border-[#DC2626]/40">
                    Sangat Tinggi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center pt-4 border-t border-[#E8EAED]">
          <Link
            to="/peta"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#151A22] hover:text-[#16A34A] transition-colors"
          >
            <span>{idCopy.capabilities.cap1.link}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          Capability 2: Sumber Air dan Aksesibilitas (Blue Eyebrow 02)
      ========================================================================= */}
      <section className="border border-[#E8EAED] rounded-[8px] p-6 lg:p-10 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">
            {idCopy.capabilities.cap2.eyebrow}
          </span>
          <span className="text-xs text-[#6F747C]">/ Logistik & Ketahanan Air</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#151A22] tracking-tight">
          {idCopy.capabilities.cap2.title}
        </h2>
        <p className="mt-2 text-sm text-[#6F747C] max-w-xl">
          {idCopy.capabilities.cap2.desc}
        </p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left rows */}
          <div className="lg:col-span-5 space-y-2">
            {idCopy.capabilities.cap2.rows.map((row, idx) => {
              const isActive = activeCap2Row === idx;
              return (
                <div
                  key={row.title}
                  onClick={() => setActiveCap2Row(idx)}
                  className={`p-4 rounded-[6px] border transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#2563EB] bg-[#EFF6FF]/50 border-l-[3px]'
                      : 'border-[#E8EAED] bg-white hover:bg-gray-50'
                  }`}
                >
                  <h4 className="text-sm font-semibold text-[#151A22]">{row.title}</h4>
                  <p className="mt-1 text-xs text-[#6F747C] leading-relaxed">{row.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Right Water Detail Mockup */}
          <div className="lg:col-span-7">
            <div className="rounded-[6px] border border-[#E8EAED] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between border-b border-[#E8EAED] pb-4">
                <div>
                  <span className="text-xs font-bold text-[#2563EB] tracking-wide uppercase">
                    Mata Air Alami
                  </span>
                  <h4 className="text-lg font-bold text-[#151A22] mt-0.5">Tuk Mulyo Kemitir</h4>
                  <p className="text-xs text-[#6F747C]">RT 01 RW 01, Dusun Kemitir Lor</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                  Layak Minum
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-b border-[#E8EAED] text-xs">
                <div>
                  <span className="text-[#6F747C] block">Debit Puncak Kemarau:</span>
                  <span className="font-semibold text-[#151A22]">12.5 liter / detik</span>
                </div>
                <div>
                  <span className="text-[#6F747C] block">Pemanfaatan:</span>
                  <span className="font-semibold text-[#151A22]">145 Kepala Keluarga</span>
                </div>
                <div>
                  <span className="text-[#6F747C] block">Kondisi Bak Penampung:</span>
                  <span className="font-semibold text-[#151A22]">Permanen (Baik)</span>
                </div>
                <div>
                  <span className="text-[#6F747C] block">Akses Truk Tangki:</span>
                  <span className="font-semibold text-[#151A22]">Dapat dijangkau</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs">
                <span className="text-[#6F747C]">Navigasi langsung via Google Maps / Apple Maps</span>
                <Link
                  to="/sumber-air"
                  className="font-medium text-[#2563EB] hover:underline"
                >
                  Buka Rute Navigasi
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center pt-4 border-t border-[#E8EAED]">
          <Link
            to="/sumber-air"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#151A22] hover:text-[#2563EB] transition-colors"
          >
            <span>{idCopy.capabilities.cap2.link}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          Capability 3: Peta Partisipatif (Purple Eyebrow 03)
      ========================================================================= */}
      <section className="border border-[#E8EAED] rounded-[8px] p-6 lg:p-10 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-[#7C3AED] tracking-wider uppercase">
            {idCopy.capabilities.cap3.eyebrow}
          </span>
          <span className="text-xs text-[#6F747C]">/ Kolaborasi Warga & Verifikasi</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#151A22] tracking-tight">
          {idCopy.capabilities.cap3.title}
        </h2>
        <p className="mt-2 text-sm text-[#6F747C] max-w-xl">
          {idCopy.capabilities.cap3.desc}
        </p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left rows */}
          <div className="lg:col-span-5 space-y-2">
            {idCopy.capabilities.cap3.rows.map((row, idx) => {
              const isActive = activeCap3Row === idx;
              return (
                <div
                  key={row.title}
                  onClick={() => setActiveCap3Row(idx)}
                  className={`p-4 rounded-[6px] border transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#7C3AED] bg-[#F5F3FF]/50 border-l-[3px]'
                      : 'border-[#E8EAED] bg-white hover:bg-gray-50'
                  }`}
                >
                  <h4 className="text-sm font-semibold text-[#151A22]">{row.title}</h4>
                  <p className="mt-1 text-xs text-[#6F747C] leading-relaxed">{row.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Right Compare View Mockup */}
          <div className="lg:col-span-7">
            <div className="rounded-[6px] border border-[#E8EAED] bg-[#F9FAFB] p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[#151A22]">
                  Validasi Tumpang-Tindih Spasial
                </span>
                <span className="text-[11px] text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-medium">
                  Partisipasi Aktif
                </span>
              </div>

              <div className="bg-white p-4 rounded-[6px] border border-[#E8EAED] space-y-3">
                <div className="flex items-start justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#151A22] block">
                      Jalur Pipa Swadaya RT 02 Dusun Kemitir Kidul
                    </span>
                    <span className="text-[#6F747C]">Ditambahkan oleh warga via GPS smartphone</span>
                  </div>
                  <span className="text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    Tervalidasi RT
                  </span>
                </div>

                <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs">
                  <span className="font-semibold text-amber-900 block">
                    Korelasi Bahaya (Spatial Auto-Derived):
                  </span>
                  <span className="text-amber-800">
                    Pipa melintasi Zona Bahaya Tinggi (kemiringan terjal & tanah retak). Memerlukan perkuatan klem penyangga.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center pt-4 border-t border-slate-100">
          <Link
            to="/peta?mode=participatory"
            className="inline-flex items-center gap-2 text-sm font-bold text-purple-700 hover:text-purple-800 transition-colors"
          >
            <span>{idCopy.capabilities.cap3.link}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
