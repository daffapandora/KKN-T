import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { idCopy } from '../i18n/id';
import { Button, StatusChip } from '@kemitir/ui';
import {
  Layers,
  MapPin,
  Search,
  Filter,
  Eye,
  EyeOff,
  Sliders,
  Maximize2,
  Navigation,
  Compass,
  Plus,
  Minus,
  Check,
} from 'lucide-react';

interface LayerState {
  id: string;
  slug: string;
  title: string;
  active: boolean;
  opacity: number;
  color: string;
}

export const MapPage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

  const [basemap, setBasemap] = useState<'streets' | 'satellite'>('streets');
  const [layers, setLayers] = useState<LayerState[]>([
    {
      id: '1',
      slug: 'bahaya-kekeringan',
      title: 'Bahaya Kekeringan (Hazard)',
      active: true,
      opacity: 0.7,
      color: '#F97316',
    },
    {
      id: '2',
      slug: 'sumber-air',
      title: 'Sumber Air Bersih',
      active: true,
      opacity: 1,
      color: '#2563EB',
    },
    {
      id: '3',
      slug: 'peta-partisipatif',
      title: 'Peta Partisipatif Warga',
      active: true,
      opacity: 0.8,
      color: '#7C3AED',
    },
    {
      id: '4',
      slug: 'batas-desa',
      title: 'Batas Wilayah Desa',
      active: true,
      opacity: 0.9,
      color: '#151A22',
    },
  ]);

  const [selectedFeature, setSelectedFeature] = useState<{
    title: string;
    type: string;
    status: string;
    description: string;
    debit?: string;
  } | null>({
    title: 'Tuk Mulyo (Mata Air Utama)',
    type: 'Mata Air Pegunungan',
    status: 'Aktif Mengalir',
    description: 'Sumber air minum utama Dusun Kemitir Lor. Memiliki bak penampung permanen berkapasitas 15.000 liter.',
    debit: '12.5 liter / detik',
  });

  const [layerPanelOpen, setLayerPanelOpen] = useState(true);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: [
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
            },
          },
          layers: [
            {
              id: 'osm-tiles-layer',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [110.3155, -7.2285], // Desa Kemitir coordinates
        zoom: 14,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
      map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

      // Add sample marker for Desa Kemitir center
      new maplibregl.Marker({ color: '#2563EB' })
        .setLngLat([110.3142, -7.2268])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div style="font-family: inherit; font-size: 12px;">
              <strong style="color: #151A22;">Tuk Mulyo (Mata Air)</strong><br />
              <span style="color: #6F747C;">Debit: 12.5 L/detik</span>
            </div>
          `)
        )
        .addTo(map);

      mapInstance.current = map;

      return () => {
        map.remove();
      };
    } catch (e) {
      console.warn('MapLibre GL initialization error (e.g. non-webgl environment):', e);
    }
  }, []);

  const toggleLayer = (slug: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.slug === slug ? { ...l, active: !l.active } : l))
    );
  };

  const updateOpacity = (slug: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.slug === slug ? { ...l, opacity } : l))
    );
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* 1. Dark App Shell Sidebar (Desktop) */}
      <aside className="w-16 bg-[#17202B] border-r border-[#232F3E] hidden md:flex flex-col items-center py-4 justify-between z-20 shrink-0">
        <div className="space-y-6">
          <div className="w-10 h-10 rounded-[6px] bg-[#16A34A] flex items-center justify-center text-white">
            <MapPin className="w-5 h-5" />
          </div>
          <button
            onClick={() => setLayerPanelOpen(!layerPanelOpen)}
            className={`p-2.5 rounded-[6px] transition-colors ${
              layerPanelOpen ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Layer Peta"
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* 2. Floating Top Search & Filter Bar */}
      <div className="absolute top-4 left-4 md:left-20 right-4 md:right-auto md:w-96 z-10 flex gap-2">
        <div className="w-full bg-white rounded-[6px] border border-[#E8EAED] px-3 py-2 flex items-center gap-2 shadow-sm">
          <Search className="w-4 h-4 text-[#6F747C]" />
          <input
            type="text"
            placeholder="Cari lokasi, sumber air, atau RT/RW..."
            className="w-full text-xs text-[#151A22] placeholder:text-[#6F747C] focus:outline-none"
          />
        </div>
        <button
          onClick={() => setLayerPanelOpen(!layerPanelOpen)}
          className="bg-white px-3 py-2 rounded-[6px] border border-[#E8EAED] shadow-sm flex items-center justify-center text-[#151A22] hover:bg-gray-50 md:hidden"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Floating Layer Panel (White, 1px border, no heavy shadow) */}
      {layerPanelOpen && (
        <div className="absolute top-16 left-4 md:left-20 w-80 bg-white rounded-[6px] border border-[#E8EAED] p-4 shadow-sm z-10 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8EAED]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#16A34A]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#151A22]">
                Layer Spasial
              </h4>
            </div>
            <span className="text-[10px] text-[#6F747C] font-medium">Multi-overlay</span>
          </div>

          <div className="divide-y divide-[#E8EAED] mt-2">
            {layers.map((layer) => (
              <div key={layer.slug} className="py-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#151A22]">
                    <input
                      type="checkbox"
                      checked={layer.active}
                      onChange={() => toggleLayer(layer.slug)}
                      className="rounded border-[#E8EAED] text-[#16A34A] focus:ring-brand-500 h-3.5 w-3.5"
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span>{layer.title}</span>
                  </label>
                  <button
                    onClick={() => toggleLayer(layer.slug)}
                    className="text-[#6F747C] hover:text-[#151A22]"
                  >
                    {layer.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {layer.active && (
                  <div className="mt-2 pl-6 pr-1 flex items-center gap-2">
                    <span className="text-[10px] text-[#6F747C]">Transparansi</span>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={layer.opacity}
                      onChange={(e) => updateOpacity(layer.slug, parseFloat(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#16A34A]"
                    />
                    <span className="text-[10px] text-[#6F747C] w-6 text-right">
                      {Math.round(layer.opacity * 100)}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Basemap Switcher */}
          <div className="mt-4 pt-3 border-t border-[#E8EAED]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F747C] block mb-2">
              Peta Dasar (Basemap)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setBasemap('streets')}
                className={`py-1.5 px-2 rounded-[4px] border text-xs font-medium transition-colors ${
                  basemap === 'streets'
                    ? 'border-[#17202B] bg-[#17202B] text-white'
                    : 'border-[#E8EAED] bg-white text-[#151A22]'
                }`}
              >
                Peta Jalan
              </button>
              <button
                onClick={() => setBasemap('satellite')}
                className={`py-1.5 px-2 rounded-[4px] border text-xs font-medium transition-colors ${
                  basemap === 'satellite'
                    ? 'border-[#17202B] bg-[#17202B] text-white'
                    : 'border-[#E8EAED] bg-white text-[#151A22]'
                }`}
              >
                Citra Satelit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Full-bleed Map View Container */}
      <div className="flex-1 h-full w-full relative">
        <div ref={mapContainer} className="w-full h-full bg-slate-100" />
      </div>

      {/* 5. Right Feature Inspection Drawer / Summary Panel */}
      {selectedFeature && (
        <aside className="absolute right-4 top-4 bottom-4 w-80 bg-white rounded-[6px] border border-[#E8EAED] p-5 shadow-sm z-10 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
                {selectedFeature.type}
              </span>
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-[#6F747C] hover:text-[#151A22] text-xs font-semibold"
              >
                ✕
              </button>
            </div>
            <h3 className="text-base font-bold text-[#151A22] mt-1">
              {selectedFeature.title}
            </h3>
            <div className="mt-2">
              <StatusChip status="valid" label={selectedFeature.status} />
            </div>

            <p className="mt-4 text-xs text-[#6F747C] leading-relaxed">
              {selectedFeature.description}
            </p>

            {selectedFeature.debit && (
              <div className="mt-4 p-3 bg-blue-50/50 rounded-[4px] border border-blue-100 text-xs">
                <span className="text-[#6F747C] block text-[11px]">Debit Air Terukur:</span>
                <span className="font-semibold text-[#2563EB] text-sm">
                  {selectedFeature.debit}
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E8EAED] space-y-2">
            <Button variant="primary" size="sm" className="w-full">
              Buka Navigasi Rute
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setSelectedFeature(null)}
            >
              Tutup Panel
            </Button>
          </div>
        </aside>
      )}
    </div>
  );
};
