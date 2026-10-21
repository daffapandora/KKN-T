import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Navigation,
  ExternalLink,
  ShieldAlert,
  Droplets,
  Activity,
  Layers2,
  Info,
  Maximize2,
  Check,
} from 'lucide-react';

interface LayerState {
  id: string;
  slug: string;
  title: string;
  category: 'base' | 'hazard' | 'risk' | 'water' | 'participatory' | 'priority';
  active: boolean;
  opacity: number;
  color: string;
  description: string;
}

export const MapPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModeParam = searchParams.get('mode') || searchParams.get('layer') || 'all';

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

  // Basemap state: Streets vs Satellite (Mapbox / Esri high-res satellite)
  const [basemap, setBasemap] = useState<'streets' | 'satellite'>('satellite');
  const [mapboxToken, setMapboxToken] = useState<string>(
    import.meta.env.VITE_MAPBOX_TOKEN || ''
  );

  const [layers, setLayers] = useState<LayerState[]>([
    {
      id: '1',
      slug: 'bahaya-kekeringan',
      title: 'Peta Bahaya Kekeringan (Hazard)',
      category: 'hazard',
      active: true,
      opacity: 0.7,
      color: '#F97316',
      description: 'Hasil integrasi curah hujan BMKG, indeks vegetasi NDVI, kelerengan, dan pola aliran.',
    },
    {
      id: '2',
      slug: 'risiko-kekeringan',
      title: 'Peta Risiko Kekeringan (Risk)',
      category: 'risk',
      active: activeModeParam.includes('risiko'),
      opacity: 0.65,
      color: '#DC2626',
      description: 'Matriks bahaya dikalikan keterpaparan penduduk & lahan sawah.',
    },
    {
      id: '3',
      slug: 'sumber-air',
      title: 'Titik Sumber Air Bersih',
      category: 'water',
      active: true,
      opacity: 1,
      color: '#2563EB',
      description: 'Inventarisasi mata air pegunungan, sumur bor sentral, dan debit kemarau.',
    },
    {
      id: '4',
      slug: 'peta-partisipatif',
      title: 'Peta Partisipatif Warga',
      category: 'participatory',
      active: activeModeParam.includes('partisipatif'),
      opacity: 0.85,
      color: '#7C3AED',
      description: 'Jalur pipa swadaya, bak penampung warga, dan sawah kritis terverifikasi.',
    },
    {
      id: '5',
      slug: 'batas-desa',
      title: 'Batas Wilayah Administrasi & RT/RW',
      category: 'base',
      active: true,
      opacity: 0.9,
      color: '#151A22',
      description: 'Batas desa dan 4 dusun (Kemitir Lor, Kemitir Kidul, Garon, Kalitengah).',
    },
    {
      id: '6',
      slug: 'prioritas-penanganan',
      title: 'Prioritas Penanganan Bencana',
      category: 'priority',
      active: activeModeParam.includes('prioritas'),
      opacity: 0.75,
      color: '#B91C1C',
      description: 'Urutan intervensi bantuan tangki air dan perbaikan pipa desa.',
    },
  ]);

  const [selectedFeature, setSelectedFeature] = useState<{
    title: string;
    type: string;
    status: string;
    description: string;
    dusun?: string;
    debit?: string;
    hazardClass?: string;
    coordinates?: [number, number];
  } | null>({
    title: 'Tuk Mulyo (Mata Air Utama)',
    type: 'Mata Air Pegunungan',
    status: 'Aktif Mengalir',
    dusun: 'RT 01 RW 01, Dusun Kemitir Lor',
    description: 'Sumber air minum utama Dusun Kemitir Lor. Memiliki bak penampung permanen berkapasitas 15.000 liter yang melayani 145 KK.',
    debit: '12.5 liter / detik',
    hazardClass: 'Rendah',
    coordinates: [110.3142, -7.2268],
  });

  const [layerPanelOpen, setLayerPanelOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample spatial feature pins
  const sampleFeatures = [
    {
      id: 'ws-1',
      title: 'Tuk Mulyo (Mata Air Utama)',
      type: 'Mata Air Pegunungan',
      status: 'Aktif Mengalir',
      dusun: 'RT 01 RW 01, Dusun Kemitir Lor',
      description: 'Sumber air minum utama warga Kemitir Lor. Debit stabil sepanjang kemarau.',
      debit: '12.5 liter / detik',
      hazardClass: 'Rendah',
      coords: [110.3142, -7.2268] as [number, number],
      color: '#2563EB',
    },
    {
      id: 'ws-2',
      title: 'Sumur Bor Sentral RW 02',
      type: 'Sumur Bor',
      status: 'Aktif Mengalir',
      dusun: 'Dusun Kemitir Kidul',
      description: 'Sumur bor bantuan pemerintah dengan pompa celup tenaga surya & PLN.',
      debit: '8.0 liter / detik',
      hazardClass: 'Sedang',
      coords: [110.3185, -7.2295] as [number, number],
      color: '#2563EB',
    },
    {
      id: 'ws-3',
      title: 'Tuk Gedang Kidul',
      type: 'Mata Air',
      status: 'Debit Menurun',
      dusun: 'Dusun Kemitir Kidul',
      description: 'Debit mengalami penyusutan drastis di puncak musim kemarau.',
      debit: '2.1 liter / detik',
      hazardClass: 'Tinggi',
      coords: [110.321, -7.234] as [number, number],
      color: '#F59E0B',
    },
    {
      id: 'pf-1',
      title: 'Jalur Pipa Transmisi RT 02',
      type: 'Peta Partisipatif Warga',
      status: 'Tervalidasi RT',
      dusun: 'Dusun Kemitir Kidul',
      description: 'Pipa paralon 2 inch sepanjang 350m yang melintasi tebing terjal rawan retak.',
      hazardClass: 'Tinggi',
      coords: [110.316, -7.231] as [number, number],
      color: '#7C3AED',
    },
  ];

  // Helper to get basemap style
  const getBasemapStyle = (type: 'streets' | 'satellite'): maplibregl.StyleSpecification => {
    if (type === 'satellite') {
      // If Mapbox token is provided, use Mapbox Satellite raster tiles; otherwise use high-res Esri World Imagery (free, no token required)
      const satelliteTiles = mapboxToken
        ? [
            `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.webp?access_token=${mapboxToken}`,
          ]
        : [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ];

      return {
        version: 8,
        sources: {
          'satellite-tiles': {
            type: 'raster',
            tiles: satelliteTiles,
            tileSize: 256,
            attribution: mapboxToken
              ? '© Mapbox © OpenStreetMap'
              : '© Esri World Imagery, Maxar, Earthstar Geographics',
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'satellite-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      } as maplibregl.StyleSpecification;
    }

    // Streets style using OpenStreetMap tiles
    return {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: 'osm-layer',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    } as maplibregl.StyleSpecification;
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: getBasemapStyle(basemap),
        center: [110.3155, -7.2285], // Center of Desa Kemitir
        zoom: 14,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
      map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

      // Add markers for sample features
      sampleFeatures.forEach((feat) => {
        const el = document.createElement('div');
        el.className = 'w-6 h-6 rounded-full border-2 border-white flex items-center justify-center cursor-pointer shadow-md transition-transform hover:scale-125';
        el.style.backgroundColor = feat.color;

        const innerDot = document.createElement('div');
        innerDot.className = 'w-2 h-2 rounded-full bg-white';
        el.appendChild(innerDot);

        el.addEventListener('click', () => {
          setSelectedFeature({
            title: feat.title,
            type: feat.type,
            status: feat.status,
            dusun: feat.dusun,
            description: feat.description,
            debit: feat.debit,
            hazardClass: feat.hazardClass,
            coordinates: feat.coords,
          });
          map.flyTo({ center: feat.coords, zoom: 15, duration: 800 });
        });

        new maplibregl.Marker({ element: el })
          .setLngLat(feat.coords)
          .addTo(map);
      });

      mapInstance.current = map;

      return () => {
        map.remove();
      };
    } catch (e) {
      console.warn('MapLibre GL initialization fallback:', e);
    }
  }, [basemap, mapboxToken]);

  // Adjust active layers when mode changes from URL
  useEffect(() => {
    if (activeModeParam === 'all') return;

    setLayers((prev) =>
      prev.map((l) => {
        if (activeModeParam === 'hazard' || activeModeParam === 'bahaya-kekeringan') {
          return { ...l, active: l.category === 'hazard' || l.category === 'base' };
        }
        if (activeModeParam === 'risk' || activeModeParam === 'risiko-kekeringan') {
          return { ...l, active: l.category === 'risk' || l.category === 'base' };
        }
        if (activeModeParam === 'water' || activeModeParam === 'sumber-air') {
          return { ...l, active: l.category === 'water' || l.category === 'base' };
        }
        if (activeModeParam === 'participatory' || activeModeParam === 'peta-partisipatif') {
          return { ...l, active: l.category === 'participatory' || l.category === 'base' };
        }
        if (activeModeParam === 'priority' || activeModeParam === 'prioritas') {
          return { ...l, active: l.category === 'priority' || l.category === 'base' };
        }
        return l;
      })
    );
  }, [activeModeParam]);

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

  const setThematicFilter = (mode: string) => {
    setSearchParams({ mode });
  };

  const openInGoogleMaps = (lng: number, lat: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-slate-100">
      {/* 1. Dark App Shell Left Sidebar (Desktop) */}
      <aside className="w-16 bg-[#17202B] border-r border-[#232F3E] hidden md:flex flex-col items-center py-4 justify-between z-20 shrink-0">
        <div className="space-y-5 flex flex-col items-center">
          <div className="w-10 h-10 rounded-[6px] bg-[#16A34A] flex items-center justify-center text-white shadow-sm">
            <Layers className="w-5 h-5" />
          </div>

          <button
            onClick={() => setThematicFilter('all')}
            className={`p-2.5 rounded-[6px] transition-colors ${
              activeModeParam === 'all' ? 'bg-[#16A34A] text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Semua Layer"
          >
            <Layers2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setThematicFilter('hazard')}
            className={`p-2.5 rounded-[6px] transition-colors ${
              activeModeParam === 'hazard' ? 'bg-[#F97316] text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Peta Bahaya"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          <button
            onClick={() => setThematicFilter('water')}
            className={`p-2.5 rounded-[6px] transition-colors ${
              activeModeParam === 'water' ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Sumber Air"
          >
            <Droplets className="w-4 h-4" />
          </button>

          <button
            onClick={() => setThematicFilter('participatory')}
            className={`p-2.5 rounded-[6px] transition-colors ${
              activeModeParam === 'participatory' ? 'bg-[#7C3AED] text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Peta Partisipatif"
          >
            <Activity className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">
          GIS
        </div>
      </aside>

      {/* 2. Top Thematic Switcher Ribbon (Mobile & Desktop) */}
      <div className="absolute top-3 left-4 md:left-20 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Search Bar & Thematic Tabs */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          <div className="bg-white rounded-[6px] border border-[#E8EAED] px-3 py-1.5 flex items-center gap-2 shadow-sm w-64 md:w-80">
            <Search className="w-3.5 h-3.5 text-[#6F747C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari sumber air, RT/RW, pipa..."
              className="w-full text-xs text-[#151A22] placeholder:text-[#6F747C] focus:outline-none"
            />
          </div>

          <div className="hidden lg:flex items-center bg-white rounded-[6px] border border-[#E8EAED] p-1 shadow-sm gap-1 text-xs font-medium">
            <button
              onClick={() => setThematicFilter('all')}
              className={`px-2.5 py-1 rounded-[4px] transition-colors ${
                activeModeParam === 'all' ? 'bg-[#17202B] text-white' : 'text-[#6F747C] hover:text-[#151A22]'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setThematicFilter('hazard')}
              className={`px-2.5 py-1 rounded-[4px] transition-colors ${
                activeModeParam === 'hazard' ? 'bg-[#F97316] text-white' : 'text-[#6F747C] hover:text-[#151A22]'
              }`}
            >
              Bahaya
            </button>
            <button
              onClick={() => setThematicFilter('risk')}
              className={`px-2.5 py-1 rounded-[4px] transition-colors ${
                activeModeParam === 'risk' ? 'bg-[#DC2626] text-white' : 'text-[#6F747C] hover:text-[#151A22]'
              }`}
            >
              Risiko
            </button>
            <button
              onClick={() => setThematicFilter('water')}
              className={`px-2.5 py-1 rounded-[4px] transition-colors ${
                activeModeParam === 'water' ? 'bg-[#2563EB] text-white' : 'text-[#6F747C] hover:text-[#151A22]'
              }`}
            >
              Sumber Air
            </button>
            <button
              onClick={() => setThematicFilter('participatory')}
              className={`px-2.5 py-1 rounded-[4px] transition-colors ${
                activeModeParam === 'participatory' ? 'bg-[#7C3AED] text-white' : 'text-[#6F747C] hover:text-[#151A22]'
              }`}
            >
              Partisipatif
            </button>
          </div>
        </div>

        {/* Right: Basemap Selector (Streets vs Satellite) */}
        <div className="pointer-events-auto flex items-center bg-white rounded-[6px] border border-[#E8EAED] p-1 shadow-sm gap-1 text-xs">
          <button
            onClick={() => setBasemap('satellite')}
            className={`px-3 py-1 rounded-[4px] font-medium transition-colors flex items-center gap-1.5 ${
              basemap === 'satellite'
                ? 'bg-[#16A34A] text-white'
                : 'text-[#6F747C] hover:text-[#151A22]'
            }`}
          >
            <span>Citra Satelit</span>
            {basemap === 'satellite' && <Check className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setBasemap('streets')}
            className={`px-3 py-1 rounded-[4px] font-medium transition-colors flex items-center gap-1.5 ${
              basemap === 'streets'
                ? 'bg-[#17202B] text-white'
                : 'text-[#6F747C] hover:text-[#151A22]'
            }`}
          >
            <span>Peta Jalan (OSM)</span>
            {basemap === 'streets' && <Check className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 3. Floating Layer Panel (White, 1px border, no heavy shadow) */}
      <div
        className={`absolute top-16 left-4 md:left-20 w-80 bg-white/95 backdrop-blur-sm rounded-[8px] border border-[#E8EAED] p-4 shadow-sm z-10 transition-all ${
          layerPanelOpen ? 'block' : 'hidden'
        } max-h-[calc(100vh-8rem)] overflow-y-auto`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E8EAED]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#16A34A]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151A22]">
              Manajemen Layer
            </h4>
          </div>
          <span className="text-[10px] text-[#6F747C] font-mono">EPSG:4326</span>
        </div>

        {/* Layer list with sliders */}
        <div className="divide-y divide-[#E8EAED] mt-2">
          {layers.map((layer) => (
            <div key={layer.slug} className="py-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#151A22]">
                  <input
                    type="checkbox"
                    checked={layer.active}
                    onChange={() => toggleLayer(layer.slug)}
                    className="rounded border-[#E8EAED] text-[#16A34A] focus:ring-brand-500 h-3.5 w-3.5"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
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
                <div className="mt-2 pl-6 pr-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#6F747C]">Opasitas:</span>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={layer.opacity}
                      onChange={(e) => updateOpacity(layer.slug, parseFloat(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer accent-[#16A34A]"
                    />
                    <span className="text-[10px] text-[#6F747C] w-6 text-right">
                      {Math.round(layer.opacity * 100)}%
                    </span>
                  </div>
                  <p className="text-[10px] text-[#6F747C] italic">{layer.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend Box */}
        <div className="mt-4 pt-3 border-t border-[#E8EAED]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F747C] block mb-2">
            Legenda Bahaya / Risiko
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] bg-[#16A34A]" />
              <span className="text-[#151A22]">Rendah</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] bg-[#EAB308]" />
              <span className="text-[#151A22]">Sedang</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] bg-[#F97316]" />
              <span className="text-[#151A22]">Tinggi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] bg-[#DC2626]" />
              <span className="text-[#151A22]">Sangat Tinggi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Full-bleed Map Canvas */}
      <div className="flex-1 h-full w-full relative">
        <div ref={mapContainer} className="w-full h-full" />
      </div>

      {/* 5. Right Feature Inspection Drawer / Summary Panel */}
      {selectedFeature && (
        <aside className="absolute right-4 top-16 bottom-4 w-84 md:w-96 bg-white/95 backdrop-blur-sm rounded-[8px] border border-[#E8EAED] p-5 shadow-sm z-10 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-start justify-between border-b border-[#E8EAED] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
                  {selectedFeature.type}
                </span>
                <h3 className="text-base font-bold text-[#151A22] mt-0.5">
                  {selectedFeature.title}
                </h3>
                {selectedFeature.dusun && (
                  <p className="text-xs text-[#6F747C] mt-0.5">{selectedFeature.dusun}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-[#6F747C] hover:text-[#151A22] text-sm font-bold p-1"
                title="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <StatusChip status="valid" label={selectedFeature.status} />
              {selectedFeature.hazardClass && (
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                  Zona {selectedFeature.hazardClass}
                </span>
              )}
            </div>

            <p className="mt-4 text-xs text-[#6F747C] leading-relaxed">
              {selectedFeature.description}
            </p>

            {selectedFeature.debit && (
              <div className="mt-4 p-3 bg-blue-50/50 rounded-[6px] border border-blue-100 text-xs">
                <span className="text-[#6F747C] block text-[11px]">Pengukuran Debit Air Lapangan:</span>
                <span className="font-semibold text-[#2563EB] text-sm">
                  {selectedFeature.debit}
                </span>
              </div>
            )}

            {selectedFeature.coordinates && (
              <div className="mt-3 p-3 bg-gray-50 rounded-[6px] border border-[#E8EAED] text-xs font-mono text-[#6F747C]">
                <span>Lng: {selectedFeature.coordinates[0].toFixed(5)}, Lat: {selectedFeature.coordinates[1].toFixed(5)}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E8EAED] space-y-2 mt-4">
            {selectedFeature.coordinates && (
              <Button
                variant="primary"
                size="sm"
                className="w-full flex items-center justify-center gap-2"
                onClick={() =>
                  openInGoogleMaps(
                    selectedFeature.coordinates![0],
                    selectedFeature.coordinates![1]
                  )
                }
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Buka Rute Navigasi (Google Maps)</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setSelectedFeature(null)}
            >
              Tutup Rincian
            </Button>
          </div>
        </aside>
      )}
    </div>
  );
};
