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
  Crosshair,
  Sliders,
  X,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
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
      description: 'Zonasi bahaya kelerengan, indeks vegetasi NDVI, dan curah hujan.',
    },
    {
      id: '2',
      slug: 'risiko-kekeringan',
      title: 'Peta Risiko Kekeringan (Risk)',
      category: 'risk',
      active: activeModeParam.includes('risiko') || activeModeParam === 'risk',
      opacity: 0.65,
      color: '#DC2626',
      description: 'Analisis risiko gabungan terhadap rumah tangga & lahan tani kritis.',
    },
    {
      id: '3',
      slug: 'sumber-air',
      title: 'Titik Sumber Air Bersih',
      category: 'water',
      active: true,
      opacity: 1,
      color: '#2563EB',
      description: 'Inventarisasi mata air pegunungan, sumur bor, & kapasitas tandon.',
    },
    {
      id: '4',
      slug: 'peta-partisipatif',
      title: 'Peta Partisipatif Warga',
      category: 'participatory',
      active: activeModeParam.includes('partisipatif') || activeModeParam === 'participatory',
      opacity: 0.85,
      color: '#7C3AED',
      description: 'Jalur pipa swadaya masyarakat, titik retakan, & sawah terdampak.',
    },
    {
      id: '5',
      slug: 'batas-desa',
      title: 'Batas Wilayah Administrasi & RT/RW',
      category: 'base',
      active: true,
      opacity: 0.9,
      color: '#0F172A',
      description: 'Batas resmi desa & 4 dusun (Kemitir Lor, Kidul, Garon, Kalitengah).',
    },
    {
      id: '6',
      slug: 'prioritas',
      title: 'Prioritas Penanganan Bencana',
      category: 'priority',
      active: activeModeParam.includes('prioritas') || activeModeParam === 'priority',
      opacity: 0.8,
      color: '#B91C1C',
      description: 'Zona tanggap darurat dropping tangki air & bantuan pompa pipa.',
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
          'circle-radius': 9,
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
        el.className =
          'w-8 h-8 rounded-full border-[2.5px] border-white flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-125 z-10';
        el.style.backgroundColor = feat.color;

        const innerDot = document.createElement('div');
        innerDot.className = 'w-3 h-3 rounded-full bg-white shadow-xs';
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

  const resetMapCenter = () => {
    if (mapInstance.current) {
      mapInstance.current.flyTo({
        center: [110.3155, -7.2285],
        zoom: 14,
        pitch: 0,
        bearing: 0,
        duration: 900,
      });
    }
  };

  const zoomIn = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomOut();
    }
  };

  const handleGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (mapInstance.current) {
            mapInstance.current.flyTo({
              center: [pos.coords.longitude, pos.coords.latitude],
              zoom: 16,
              duration: 1000,
            });
          }
        },
        (err) => {
          alert('Izin lokasi tidak diberikan atau perangkat di luar jangkauan GPS.');
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const openInGoogleMaps = (lng: number, lat: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="relative w-full h-[calc(100vh-4.5rem)] flex flex-col md:flex-row overflow-hidden bg-slate-900">
      {/* 1. Sleek Apple Left Command Dock (Desktop) */}
      <aside className="w-18 bg-[#0F172A]/90 backdrop-blur-xl border-r border-slate-800/90 hidden md:flex flex-col items-center py-5 justify-between z-20 shrink-0 select-none">
        <div className="space-y-4 flex flex-col items-center">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center text-white shadow-[0_2px_10px_rgba(22,163,74,0.35)]">
            <Layers className="w-5 h-5" />
          </div>

          <div className="w-8 h-[1px] bg-slate-800 my-1" />

          <button
            onClick={() => setThematicFilter('all')}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              activeModeParam === 'all'
                ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Semua Layer"
          >
            <Layers2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => setThematicFilter('hazard')}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              activeModeParam === 'hazard' || activeModeParam === 'bahaya-kekeringan'
                ? 'bg-[#F97316] text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Peta Bahaya Kekeringan"
          >
            <ShieldAlert className="w-5 h-5" />
          </button>

          <button
            onClick={() => setThematicFilter('risk')}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              activeModeParam === 'risk' || activeModeParam === 'risiko-kekeringan'
                ? 'bg-[#DC2626] text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Peta Risiko Kekeringan"
          >
            <Compass className="w-5 h-5" />
          </button>

          <button
            onClick={() => setThematicFilter('water')}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              activeModeParam === 'water' || activeModeParam === 'sumber-air'
                ? 'bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Titik Sumber Air Bersih"
          >
            <Droplets className="w-5 h-5" />
          </button>

          <button
            onClick={() => setThematicFilter('participatory')}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              activeModeParam === 'participatory' || activeModeParam === 'peta-partisipatif'
                ? 'bg-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Peta Partisipatif Warga"
          >
            <Activity className="w-5 h-5" />
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider text-center">
          KEMITIR
        </div>
      </aside>

      {/* 2. Apple Top Floating Control Ribbon */}
      <div className="absolute top-4 left-4 md:left-22 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Search Bar & Segmented Control */}
        <div className="flex flex-wrap items-center gap-2.5 pointer-events-auto">
          {/* Search Box */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/90 px-3.5 h-11 flex items-center gap-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] w-64 md:w-72 transition-all focus-within:ring-2 focus-within:ring-emerald-500">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mata air, dusun, pipa..."
              className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Apple Segmented Control for Thematic Layers */}
          <div className="hidden lg:flex items-center bg-slate-200/75 backdrop-blur-xl rounded-2xl p-1 shadow-inner gap-1 text-sm font-semibold select-none">
            <button
              onClick={() => setThematicFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeModeParam === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setThematicFilter('hazard')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeModeParam === 'hazard' || activeModeParam === 'bahaya-kekeringan'
                  ? 'bg-white text-orange-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bahaya
            </button>
            <button
              onClick={() => setThematicFilter('risk')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeModeParam === 'risk' || activeModeParam === 'risiko-kekeringan'
                  ? 'bg-white text-red-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Risiko
            </button>
            <button
              onClick={() => setThematicFilter('water')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeModeParam === 'water' || activeModeParam === 'sumber-air'
                  ? 'bg-white text-blue-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sumber Air
            </button>
            <button
              onClick={() => setThematicFilter('participatory')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeModeParam === 'participatory' || activeModeParam === 'peta-partisipatif'
                  ? 'bg-white text-purple-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Partisipatif
            </button>
          </div>
        </div>

        {/* Right: Basemap Switcher (Satellite vs Streets) */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/90 p-1 flex items-center gap-1 shadow-[0_4px_20px_rgba(0,0,0,0.06)] pointer-events-auto">
          <button
            onClick={() => setBasemap('satellite')}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
              basemap === 'satellite'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            Citra Satelit {basemap === 'satellite' && '✓'}
          </button>
          <button
            onClick={() => setBasemap('streets')}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
              basemap === 'streets'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            Peta Jalan (OSM) {basemap === 'streets' && '✓'}
          </button>
        </div>
      </div>

      {/* 3. Apple-grade Floating Layer Management Sheet */}
      <div
        className={`absolute top-20 left-4 md:left-22 z-10 w-88 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.15)] transition-all duration-300 max-h-[calc(100vh-9rem)] flex flex-col ${
          layerPanelOpen
            ? 'translate-x-0 opacity-100 pointer-events-auto'
            : '-translate-x-96 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Manajemen Layer Spasial
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                Kontrol visual peta tematik
              </span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
            EPSG:4326
          </span>
        </div>

        {/* Scrollable Layer Switches */}
        <div className="p-3.5 space-y-2.5 overflow-y-auto flex-1">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`p-3 rounded-2xl border transition-all ${
                layer.active
                  ? 'bg-white border-slate-200/90 shadow-sm'
                  : 'bg-slate-50/60 border-transparent opacity-65'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: layer.color }}
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block leading-snug">
                      {layer.title}
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      {layer.description}
                    </span>
                  </div>
                </div>

                {/* Apple iOS Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleLayer(layer.slug)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    layer.active ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                  aria-pressed={layer.active}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      layer.active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Opacity slider with tactile Apple feel */}
              {layer.active && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span>Transparansi / Opasitas</span>
                    <span className="font-bold text-slate-900">
                      {Math.round(layer.opacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={layer.opacity}
                    onChange={(e) => updateOpacity(layer.slug, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend Footer */}
        <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/80 rounded-b-3xl">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Legenda Zona Bahaya / Risiko
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
              <span>Rendah (Aman)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#EAB308]" />
              <span>Sedang (Waspada)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#F97316]" />
              <span>Tinggi (Siaga)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
              <span>Sangat Tinggi (Darurat)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Panel Toggle & Quick Controls (Bottom Left) */}
      <div className="absolute bottom-6 left-4 md:left-22 z-10 flex items-center gap-2.5 select-none">
        <button
          onClick={() => setLayerPanelOpen(!layerPanelOpen)}
          className="bg-white/95 backdrop-blur-xl border border-slate-200/90 text-slate-900 rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-2 text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all"
        >
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span>{layerPanelOpen ? 'Tutup Panel' : 'Panel Layer'}</span>
        </button>

        <button
          onClick={resetMapCenter}
          className="bg-white/95 backdrop-blur-xl border border-slate-200/90 text-slate-900 rounded-2xl px-3.5 py-2.5 shadow-lg flex items-center gap-1.5 text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all"
          title="Pusatkan Peta ke Desa Kemitir"
        >
          <Compass className="w-4 h-4 text-slate-700" />
          <span className="hidden sm:inline">Pusat Desa</span>
        </button>

        <button
          onClick={handleGeolocation}
          className="bg-white/95 backdrop-blur-xl border border-slate-200/90 text-slate-900 rounded-2xl px-3.5 py-2.5 shadow-lg flex items-center gap-1.5 text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all"
          title="Temukan Lokasi Saya"
        >
          <Crosshair className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Lokasi Saya</span>
        </button>
      </div>

      {/* Floating Zoom Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-10 hidden sm:flex flex-col gap-1.5 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-lg p-1">
        <button
          onClick={zoomIn}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-90 transition-all"
          title="Perbesar"
        >
          <Plus className="w-5 h-5" />
        </button>
        <div className="w-full h-[1px] bg-slate-200" />
        <button
          onClick={zoomOut}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-90 transition-all"
          title="Perkecil"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      {/* 4. Map Canvas Container */}
      <div ref={mapContainer} className="w-full h-full relative" />

      {/* 5. Apple Right Inspection Sheet (When clicking polygon, line, or pin) */}
      {selectedFeature && (
        <div className="absolute top-20 right-4 z-10 w-90 md:w-96 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.2)] p-6 space-y-4 max-h-[calc(100vh-9rem)] overflow-y-auto animate-in slide-in-from-right-4 duration-200">
          <div className="flex items-start justify-between border-b border-slate-200/80 pb-3.5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 mb-1.5">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{selectedFeature.type}</span>
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {selectedFeature.title}
              </h3>
            </div>
            <button
              onClick={() => setSelectedFeature(null)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Tutup Detail"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3.5 text-sm">
            <div className="flex items-center justify-between bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Status Operasional</span>
              <StatusChip
                label={selectedFeature.status}
                status={selectedFeature.status.includes('Aktif') ? 'valid' : 'pending'}
              />
            </div>

            {selectedFeature.hazardClass && (
              <div className="flex items-center justify-between bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Tingkat Kerawanan</span>
                <span
                  className={`font-bold text-xs uppercase px-2.5 py-1 rounded-full ${
                    selectedFeature.hazardClass === 'Rendah'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedFeature.hazardClass === 'Sedang'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {selectedFeature.hazardClass}
                </span>
              </div>
            )}

            {selectedFeature.debit && (
              <div className="flex items-center justify-between bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Kapasitas / Debit Air</span>
                <span className="font-bold text-slate-900">{selectedFeature.debit}</span>
              </div>
            )}

            <div>
              <span className="text-xs text-slate-500 font-semibold block mb-1">
                Lokasi Wilayah
              </span>
              <div className="flex items-center gap-2 text-slate-900 font-medium">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{selectedFeature.dusun}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-semibold block mb-1">
                Informasi & Analisis Bencana
              </span>
              <p className="text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 text-xs font-normal">
                {selectedFeature.description}
              </p>
            </div>

            {selectedFeature.coordinates && (
              <div className="pt-2">
                <Button
                  variant="brand"
                  size="md"
                  className="w-full gap-2 font-semibold shadow-md"
                  onClick={() =>
                    openInGoogleMaps(
                      selectedFeature.coordinates![0],
                      selectedFeature.coordinates![1]
                    )
                  }
                >
                  <Navigation className="w-4 h-4" />
                  <span>Buka Rute Navigasi Google Maps</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
