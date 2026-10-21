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
  Compass,
} from 'lucide-react';

// Import Authentic GeoJSON Datasets
import boundariesData from '../data/geojson/boundaries.json';
import hazardData from '../data/geojson/hazard.json';
import riskData from '../data/geojson/risk.json';
import participatoryData from '../data/geojson/participatory.json';
import priorityData from '../data/geojson/priority.json';

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
  const markersRef = useRef<maplibregl.Marker[]>([]);

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
      active: activeModeParam.includes('risiko') || activeModeParam === 'risk',
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
      active: activeModeParam.includes('partisipatif') || activeModeParam === 'participatory',
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
      slug: 'prioritas',
      title: 'Prioritas Penanganan Bencana',
      category: 'priority',
      active: activeModeParam.includes('prioritas') || activeModeParam === 'priority',
      opacity: 0.8,
      color: '#B91C1C',
      description: 'Zona tanggap darurat dropping air dan perbaikan pipa paralon.',
    },
  ]);

  // Selected feature drawer state
  const [selectedFeature, setSelectedFeature] = useState<{
    title: string;
    type: string;
    status: string;
    dusun: string;
    description: string;
    debit?: string;
    hazardClass?: string;
    coordinates?: [number, number];
    extraAttributes?: Record<string, any>;
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

  // Sample water source pins
  const waterSourcePins = [
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
      id: 'ws-4',
      title: 'Embung Pertanian Garon',
      type: 'Embung Penampung Hujan',
      status: 'Sedimentasi Tinggi',
      dusun: 'Dusun Garon RT 01',
      description: 'Embung irigasi seluas 800m2 untuk kelompok tani palawija sayur Garon.',
      debit: 'Tampungan 4.000 m3',
      hazardClass: 'Tinggi',
      coords: [110.3265, -7.2265] as [number, number],
      color: '#0284C7',
    },
  ];

  // Helper to get basemap style
  const getBasemapStyle = (type: 'streets' | 'satellite'): maplibregl.StyleSpecification => {
    if (type === 'satellite') {
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

  // Add all GeoJSON Vector Layers to MapLibre
  const setupVectorLayers = (map: maplibregl.Map) => {
    // 1. Boundaries Source & Layers
    if (!map.getSource('src-boundaries')) {
      map.addSource('src-boundaries', {
        type: 'geojson',
        data: boundariesData as any,
      });

      map.addLayer({
        id: 'layer-batas-desa-fill',
        type: 'fill',
        source: 'src-boundaries',
        paint: {
          'fill-color': '#0F172A',
          'fill-opacity': 0.05,
        },
      });

      map.addLayer({
        id: 'layer-batas-desa-line',
        type: 'line',
        source: 'src-boundaries',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 2.5,
          'line-dasharray': [3, 2],
        },
      });

      map.on('click', 'layer-batas-desa-fill', (e) => {
        if (!e.features || !e.features[0]) return;
        const p = e.features[0].properties || {};
        setSelectedFeature({
          title: p.name || 'Batas Administrasi Dusun',
          type: 'Batas Wilayah Administrasi',
          status: 'Wilayah Desa Kemitir',
          dusun: p.dusun || 'Desa Kemitir',
          description: `Wilayah administrasi RW ${p.rw} dengan ${p.rt_count} RT, estimasi populasi ${p.population} jiwa, mencakup luasan ${p.area_ha} Ha.`,
          hazardClass: 'Administrasi',
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
      });
    }

    // 2. Hazard Source & Layers
    if (!map.getSource('src-hazard')) {
      map.addSource('src-hazard', {
        type: 'geojson',
        data: hazardData as any,
      });

      map.addLayer({
        id: 'layer-bahaya-kekeringan-fill',
        type: 'fill',
        source: 'src-hazard',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.65,
        },
      });

      map.addLayer({
        id: 'layer-bahaya-kekeringan-line',
        type: 'line',
        source: 'src-hazard',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
        },
      });

      map.on('click', 'layer-bahaya-kekeringan-fill', (e) => {
        if (!e.features || !e.features[0]) return;
        const p = e.features[0].properties || {};
        setSelectedFeature({
          title: `Zona Bahaya: Kelas ${p.hazard_class}`,
          type: 'Peta Bahaya Kekeringan (Hazard)',
          status: `Skor Bahaya ${p.score}`,
          dusun: 'Kawasan Desa Kemitir',
          description: p.description || 'Zona kerawanan kekeringan lereng Gunung Ungaran.',
          hazardClass: p.hazard_class,
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
      });
    }

    // 3. Risk Source & Layers
    if (!map.getSource('src-risk')) {
      map.addSource('src-risk', {
        type: 'geojson',
        data: riskData as any,
      });

      map.addLayer({
        id: 'layer-risiko-kekeringan-fill',
        type: 'fill',
        source: 'src-risk',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.6,
        },
        layout: {
          visibility: 'none',
        },
      });

      map.addLayer({
        id: 'layer-risiko-kekeringan-line',
        type: 'line',
        source: 'src-risk',
        paint: {
          'line-color': '#991B1B',
          'line-width': 2.5,
        },
        layout: {
          visibility: 'none',
        },
      });

      map.on('click', 'layer-risiko-kekeringan-fill', (e) => {
        if (!e.features || !e.features[0]) return;
        const p = e.features[0].properties || {};
        setSelectedFeature({
          title: `Zona Risiko: ${p.risk_class}`,
          type: 'Peta Risiko Kekeringan (Risk)',
          status: `Komposit Risiko ${p.composite_risk}`,
          dusun: 'Kemitir Kidul & Garon',
          description: `${p.description} Mempengaruhi ${p.affected_kk} Kepala Keluarga.`,
          hazardClass: p.risk_class,
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
      });
    }

    // 4. Priority Intervention Source & Layers
    if (!map.getSource('src-priority')) {
      map.addSource('src-priority', {
        type: 'geojson',
        data: priorityData as any,
      });

      map.addLayer({
        id: 'layer-prioritas-fill',
        type: 'fill',
        source: 'src-priority',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.55,
        },
        layout: {
          visibility: 'none',
        },
      });

      map.addLayer({
        id: 'layer-prioritas-line',
        type: 'line',
        source: 'src-priority',
        paint: {
          'line-color': '#DC2626',
          'line-width': 3.5,
          'line-dasharray': [2, 1],
        },
        layout: {
          visibility: 'none',
        },
      });

      map.on('click', 'layer-prioritas-fill', (e) => {
        if (!e.features || !e.features[0]) return;
        const p = e.features[0].properties || {};
        setSelectedFeature({
          title: p.name || 'Zona Intervensi Prioritas',
          type: 'Prioritas Penanganan Bencana',
          status: p.urgency || 'Sangat Mendesak',
          dusun: 'Wilayah Terdampak Utama',
          description: `Rencana tindakan darurat: ${p.action}. Melindungi ${p.affected_residents} warga terdampak.`,
          hazardClass: 'Sangat Tinggi',
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
      });
    }

    // 5. Participatory Source & Layers
    if (!map.getSource('src-participatory')) {
      map.addSource('src-participatory', {
        type: 'geojson',
        data: participatoryData as any,
      });

      map.addLayer({
        id: 'layer-peta-partisipatif-area',
        type: 'fill',
        source: 'src-participatory',
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'fill-color': '#8B5CF6',
          'fill-opacity': 0.45,
        },
        layout: {
          visibility: 'none',
        },
      });

      map.addLayer({
        id: 'layer-peta-partisipatif-pipe',
        type: 'line',
        source: 'src-participatory',
        filter: ['==', '$type', 'LineString'],
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 4.5,
        },
        layout: {
          visibility: 'none',
        },
      });

      map.addLayer({
        id: 'layer-peta-partisipatif-point',
        type: 'circle',
        source: 'src-participatory',
        filter: ['==', '$type', 'Point'],
        paint: {
          'circle-radius': 8,
          'circle-color': '#EC4899',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#FFFFFF',
        },
        layout: {
          visibility: 'none',
        },
      });

      const onPartClick = (e: any) => {
        if (!e.features || !e.features[0]) return;
        const p = e.features[0].properties || {};
        setSelectedFeature({
          title: p.name || 'Data Partisipatif Warga',
          type: p.category || 'Peta Partisipatif',
          status: p.condition || p.status || 'Tervalidasi Warga',
          dusun: 'Dusun Kemitir Kidul',
          description: p.description || 'Data partisipatif hasil pemetaan warga desa.',
          hazardClass: 'Tinggi',
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
      };

      map.on('click', 'layer-peta-partisipatif-area', onPartClick);
      map.on('click', 'layer-peta-partisipatif-pipe', onPartClick);
      map.on('click', 'layer-peta-partisipatif-point', onPartClick);
    }
  };

  // Synchronize Map Layers with React Layer State
  const syncMapLayers = (map: maplibregl.Map, currentLayers: LayerState[]) => {
    currentLayers.forEach((layer) => {
      const isVisible = layer.active ? 'visible' : 'none';

      // 1. Hazard Layer
      if (layer.slug === 'bahaya-kekeringan') {
        if (map.getLayer('layer-bahaya-kekeringan-fill')) {
          map.setLayoutProperty('layer-bahaya-kekeringan-fill', 'visibility', isVisible);
          map.setPaintProperty('layer-bahaya-kekeringan-fill', 'fill-opacity', layer.opacity);
        }
        if (map.getLayer('layer-bahaya-kekeringan-line')) {
          map.setLayoutProperty('layer-bahaya-kekeringan-line', 'visibility', isVisible);
        }
      }

      // 2. Risk Layer
      if (layer.slug === 'risiko-kekeringan') {
        if (map.getLayer('layer-risiko-kekeringan-fill')) {
          map.setLayoutProperty('layer-risiko-kekeringan-fill', 'visibility', isVisible);
          map.setPaintProperty('layer-risiko-kekeringan-fill', 'fill-opacity', layer.opacity);
        }
        if (map.getLayer('layer-risiko-kekeringan-line')) {
          map.setLayoutProperty('layer-risiko-kekeringan-line', 'visibility', isVisible);
        }
      }

      // 3. Boundaries Layer
      if (layer.slug === 'batas-desa') {
        if (map.getLayer('layer-batas-desa-fill')) {
          map.setLayoutProperty('layer-batas-desa-fill', 'visibility', isVisible);
        }
        if (map.getLayer('layer-batas-desa-line')) {
          map.setLayoutProperty('layer-batas-desa-line', 'visibility', isVisible);
        }
      }

      // 4. Participatory Layer
      if (layer.slug === 'peta-partisipatif') {
        if (map.getLayer('layer-peta-partisipatif-area')) {
          map.setLayoutProperty('layer-peta-partisipatif-area', 'visibility', isVisible);
          map.setPaintProperty('layer-peta-partisipatif-area', 'fill-opacity', layer.opacity * 0.5);
        }
        if (map.getLayer('layer-peta-partisipatif-pipe')) {
          map.setLayoutProperty('layer-peta-partisipatif-pipe', 'visibility', isVisible);
        }
        if (map.getLayer('layer-peta-partisipatif-point')) {
          map.setLayoutProperty('layer-peta-partisipatif-point', 'visibility', isVisible);
        }
      }

      // 5. Priority Layer
      if (layer.slug === 'prioritas') {
        if (map.getLayer('layer-prioritas-fill')) {
          map.setLayoutProperty('layer-prioritas-fill', 'visibility', isVisible);
          map.setPaintProperty('layer-prioritas-fill', 'fill-opacity', layer.opacity * 0.6);
        }
        if (map.getLayer('layer-prioritas-line')) {
          map.setLayoutProperty('layer-prioritas-line', 'visibility', isVisible);
        }
      }

      // 6. Water Sources Marker Pins
      if (layer.slug === 'sumber-air') {
        markersRef.current.forEach((marker) => {
          const el = marker.getElement();
          if (el) {
            el.style.display = layer.active ? 'flex' : 'none';
          }
        });
      }
    });
  };

  // Map Initialization
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

      map.on('load', () => {
        setupVectorLayers(map);
        syncMapLayers(map, layers);
      });

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Add markers for water sources
      waterSourcePins.forEach((feat) => {
        const el = document.createElement('div');
        el.className = 'w-7 h-7 rounded-full border-2 border-white flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-125 z-10';
        el.style.backgroundColor = feat.color;

        const innerDot = document.createElement('div');
        innerDot.className = 'w-2.5 h-2.5 rounded-full bg-white';
        el.appendChild(innerDot);

        el.addEventListener('click', (ev) => {
          ev.stopPropagation();
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
          map.flyTo({ center: feat.coords, zoom: 15.5, duration: 800 });
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(feat.coords)
          .addTo(map);

        markersRef.current.push(marker);
      });

      mapInstance.current = map;

      return () => {
        map.remove();
      };
    } catch (e) {
      console.warn('MapLibre GL initialization error:', e);
    }
  }, [basemap, mapboxToken]);

  // Sync Layers whenever `layers` state changes
  useEffect(() => {
    if (!mapInstance.current || !mapInstance.current.isStyleLoaded()) return;
    syncMapLayers(mapInstance.current, layers);
  }, [layers]);

  // Adjust active layers when thematic filter changes from URL or pill click
  const setThematicFilter = (mode: string) => {
    setSearchParams({ mode });

    setLayers((prev) =>
      prev.map((l) => {
        if (mode === 'all') {
          return { ...l, active: true };
        }
        if (mode === 'hazard' || mode === 'bahaya-kekeringan') {
          return {
            ...l,
            active: l.category === 'hazard' || l.category === 'base',
          };
        }
        if (mode === 'risk' || mode === 'risiko-kekeringan') {
          return {
            ...l,
            active: l.category === 'risk' || l.category === 'base',
          };
        }
        if (mode === 'water' || mode === 'sumber-air') {
          return {
            ...l,
            active: l.category === 'water' || l.category === 'base',
          };
        }
        if (mode === 'participatory' || mode === 'peta-partisipatif') {
          return {
            ...l,
            active: l.category === 'participatory' || l.category === 'base',
          };
        }
        if (mode === 'priority' || mode === 'prioritas') {
          return {
            ...l,
            active: l.category === 'priority' || l.category === 'base',
          };
        }
        return l;
      })
    );

    if (mapInstance.current) {
      if (mode === 'hazard' || mode === 'bahaya-kekeringan') {
        mapInstance.current.flyTo({ center: [110.3165, -7.2285], zoom: 14.2 });
      } else if (mode === 'water' || mode === 'sumber-air') {
        mapInstance.current.flyTo({ center: [110.3155, -7.2280], zoom: 14.8 });
      } else if (mode === 'participatory') {
        mapInstance.current.flyTo({ center: [110.3195, -7.2315], zoom: 15.0 });
      } else if (mode === 'priority') {
        mapInstance.current.flyTo({ center: [110.3175, -7.2325], zoom: 15.2 });
      }
    }
  };

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

  const openInGoogleMaps = (lng: number, lat: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-slate-100">
      {/* 1. Dark App Shell Left Sidebar (Desktop) */}
      <aside className="w-16 bg-[#17202B] border-r border-[#232F3E] hidden md:flex flex-col items-center py-4 justify-between z-20 shrink-0">
        <div className="space-y-4 flex flex-col items-center">
          <div className="w-10 h-10 rounded-[6px] bg-[#16A34A] flex items-center justify-center text-white shadow-sm">
            <Layers className="w-5 h-5" />
          </div>

          <button
            onClick={() => setThematicFilter('all')}
            className={`p-2.5 rounded-[6px] transition-all ${
              activeModeParam === 'all' ? 'bg-[#16A34A] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
            title="Semua Layer"
          >
            <Layers2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setThematicFilter('hazard')}
            className={`p-2.5 rounded-[6px] transition-all ${
              activeModeParam === 'hazard' || activeModeParam === 'bahaya-kekeringan'
                ? 'bg-[#F97316] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Peta Bahaya Kekeringan"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          <button
            onClick={() => setThematicFilter('risk')}
            className={`p-2.5 rounded-[6px] transition-all ${
              activeModeParam === 'risk' || activeModeParam === 'risiko-kekeringan'
                ? 'bg-[#DC2626] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Peta Risiko Kekeringan"
          >
            <Compass className="w-4 h-4" />
          </button>

          <button
            onClick={() => setThematicFilter('water')}
            className={`p-2.5 rounded-[6px] transition-all ${
              activeModeParam === 'water' || activeModeParam === 'sumber-air'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Titik Sumber Air Bersih"
          >
            <Droplets className="w-4 h-4" />
          </button>

          <button
            onClick={() => setThematicFilter('participatory')}
            className={`p-2.5 rounded-[6px] transition-all ${
              activeModeParam === 'participatory' || activeModeParam === 'peta-partisipatif'
                ? 'bg-[#7C3AED] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Peta Partisipatif Warga"
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
          <div className="bg-white rounded-[6px] border border-[#E8EAED] px-3 py-1.5 flex items-center gap-2 shadow-sm w-60 md:w-72">
            <Search className="w-3.5 h-3.5 text-[#6F747C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari sumber air, RT/RW, pipa..."
              className="w-full text-xs text-[#151A22] placeholder:text-[#6F747C] focus:outline-none"
            />
          </div>

          <div className="flex items-center bg-white rounded-[6px] border border-[#E8EAED] p-1 shadow-sm gap-1 text-xs font-medium">
            <button
              onClick={() => setThematicFilter('all')}
              className={`px-3 py-1 rounded-[4px] transition-colors ${
                activeModeParam === 'all' ? 'bg-[#17202B] text-white shadow-xs' : 'text-[#6F747C] hover:text-[#151A22]'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setThematicFilter('hazard')}
              className={`px-3 py-1 rounded-[4px] transition-colors ${
                activeModeParam === 'hazard' || activeModeParam === 'bahaya-kekeringan'
                  ? 'bg-[#F97316] text-white shadow-xs font-semibold'
                  : 'text-[#6F747C] hover:text-[#151A22]'
              }`}
            >
              Bahaya
            </button>
            <button
              onClick={() => setThematicFilter('risk')}
              className={`px-3 py-1 rounded-[4px] transition-colors ${
                activeModeParam === 'risk' || activeModeParam === 'risiko-kekeringan'
                  ? 'bg-[#DC2626] text-white shadow-xs font-semibold'
                  : 'text-[#6F747C] hover:text-[#151A22]'
              }`}
            >
              Risiko
            </button>
            <button
              onClick={() => setThematicFilter('water')}
              className={`px-3 py-1 rounded-[4px] transition-colors ${
                activeModeParam === 'water' || activeModeParam === 'sumber-air'
                  ? 'bg-[#2563EB] text-white shadow-xs font-semibold'
                  : 'text-[#6F747C] hover:text-[#151A22]'
              }`}
            >
              Sumber Air
            </button>
            <button
              onClick={() => setThematicFilter('participatory')}
              className={`px-3 py-1 rounded-[4px] transition-colors ${
                activeModeParam === 'participatory' || activeModeParam === 'peta-partisipatif'
                  ? 'bg-[#7C3AED] text-white shadow-xs font-semibold'
                  : 'text-[#6F747C] hover:text-[#151A22]'
              }`}
            >
              Partisipatif
            </button>
          </div>
        </div>

        {/* Right: Basemap Switcher (Satellite vs Streets) */}
        <div className="bg-white rounded-[6px] border border-[#E8EAED] p-1 flex items-center gap-1 shadow-sm pointer-events-auto">
          <button
            onClick={() => setBasemap('satellite')}
            className={`px-2.5 py-1 text-xs rounded-[4px] font-medium transition-colors ${
              basemap === 'satellite'
                ? 'bg-[#16A34A] text-white'
                : 'text-[#6F747C] hover:text-[#151A22]'
            }`}
          >
            Citra Satelit {basemap === 'satellite' && '✓'}
          </button>
          <button
            onClick={() => setBasemap('streets')}
            className={`px-2.5 py-1 text-xs rounded-[4px] font-medium transition-colors ${
              basemap === 'streets'
                ? 'bg-[#16A34A] text-white'
                : 'text-[#6F747C] hover:text-[#151A22]'
            }`}
          >
            Peta Jalan (OSM) {basemap === 'streets' && '✓'}
          </button>
        </div>
      </div>

      {/* 3. Layer Manager Panel (Left Overlay) */}
      <div
        className={`absolute top-16 left-4 md:left-20 z-10 w-80 bg-white/95 backdrop-blur-md rounded-[8px] border border-[#E8EAED] shadow-lg transition-all duration-300 max-h-[calc(100vh-8rem)] flex flex-col ${
          layerPanelOpen ? 'translate-x-0 opacity-100' : '-translate-x-96 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-3.5 border-b border-[#E8EAED] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#16A34A]" />
            <h2 className="text-xs font-bold text-[#151A22] uppercase tracking-wide">
              Manajemen Layer
            </h2>
          </div>
          <span className="text-[10px] text-[#6F747C] bg-gray-100 px-2 py-0.5 rounded font-mono">
            EPSG:4326
          </span>
        </div>

        <div className="p-3 space-y-3 overflow-y-auto flex-1 text-xs">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`p-2.5 rounded-[6px] border transition-colors ${
                layer.active ? 'bg-white border-[#E8EAED] shadow-xs' : 'bg-gray-50/70 border-transparent opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={layer.active}
                    onChange={() => toggleLayer(layer.slug)}
                    className="w-3.5 h-3.5 rounded text-[#16A34A] focus:ring-[#16A34A]"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className="font-semibold text-[#151A22] text-[11px] leading-tight">
                    {layer.title}
                  </span>
                </label>

                <button
                  onClick={() => toggleLayer(layer.slug)}
                  className="text-[#6F747C] hover:text-[#151A22] p-0.5"
                  title={layer.active ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {layer.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
                </button>
              </div>

              {layer.active && (
                <div className="mt-2.5 space-y-1.5 pl-6 border-l-2 border-gray-100">
                  <div className="flex items-center justify-between text-[10px] text-[#6F747C]">
                    <span>Opasitas Layer</span>
                    <span>{Math.round(layer.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={layer.opacity}
                    onChange={(e) => updateOpacity(layer.slug, parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#16A34A]"
                  />
                  <p className="text-[10px] text-[#6F747C] italic leading-tight">
                    {layer.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend Footer */}
        <div className="p-3 border-t border-[#E8EAED] bg-gray-50/80 rounded-b-[8px]">
          <span className="text-[10px] font-bold text-[#6F747C] uppercase block mb-1.5">
            Legenda Bahaya / Risiko
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-[#151A22]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#22C55E]" />
              <span>Rendah</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#EAB308]" />
              <span>Sedang</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#F97316]" />
              <span>Tinggi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#EF4444]" />
              <span>Sangat Tinggi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layer Panel Toggle Button (Floating) */}
      <button
        onClick={() => setLayerPanelOpen(!layerPanelOpen)}
        className="absolute bottom-5 left-4 md:left-20 z-10 bg-white border border-[#E8EAED] text-[#151A22] rounded-[6px] px-3 py-1.5 shadow-md flex items-center gap-1.5 text-xs font-semibold hover:bg-gray-50"
      >
        <Layers className="w-3.5 h-3.5 text-[#16A34A]" />
        <span>{layerPanelOpen ? 'Sembunyikan Panel' : 'Panel Layer'}</span>
      </button>

      {/* 4. Map Canvas Container */}
      <div ref={mapContainer} className="w-full h-full relative" />

      {/* 5. Right Feature Inspection Drawer */}
      {selectedFeature && (
        <div className="absolute top-16 right-4 z-10 w-80 md:w-96 bg-white/95 backdrop-blur-md rounded-[8px] border border-[#E8EAED] shadow-xl p-4 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="flex items-start justify-between border-b border-[#E8EAED] pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A34A] block">
                {selectedFeature.type}
              </span>
              <h3 className="text-sm font-bold text-[#151A22] leading-snug">
                {selectedFeature.title}
              </h3>
            </div>
            <button
              onClick={() => setSelectedFeature(null)}
              className="text-[#6F747C] hover:text-[#151A22] p-1"
              aria-label="Tutup Detail"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-[#6F747C]">Status Operasional</span>
              <StatusChip
                label={selectedFeature.status}
                status={selectedFeature.status.includes('Aktif') ? 'valid' : 'pending'}
              />
            </div>

            {selectedFeature.hazardClass && (
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-[#6F747C]">Tingkat Kerawanan</span>
                <span className={`font-bold ${
                  selectedFeature.hazardClass === 'Rendah'
                    ? 'text-green-600'
                    : selectedFeature.hazardClass === 'Sedang'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {selectedFeature.hazardClass}
                </span>
              </div>
            )}

            {selectedFeature.debit && (
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-[#6F747C]">Kapasitas / Debit</span>
                <span className="font-semibold text-[#151A22]">{selectedFeature.debit}</span>
              </div>
            )}

            <div>
              <span className="text-[#6F747C] font-semibold block mb-1">Lokasi Administrasi</span>
              <div className="flex items-center gap-1.5 text-[#151A22]">
                <MapPin className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                <span>{selectedFeature.dusun}</span>
              </div>
            </div>

            <div>
              <span className="text-[#6F747C] font-semibold block mb-1">Deskripsi Kondisi</span>
              <p className="text-[#4A4F56] leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-100">
                {selectedFeature.description}
              </p>
            </div>

            {selectedFeature.coordinates && (
              <div className="pt-2 flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 flex items-center justify-center gap-1"
                  onClick={() =>
                    openInGoogleMaps(
                      selectedFeature.coordinates![0],
                      selectedFeature.coordinates![1]
                    )
                  }
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Rute Google Maps</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
