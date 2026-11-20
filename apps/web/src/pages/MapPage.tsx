import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Button, StatusChip } from '@kemitir/ui';
import {
  Search,
  Navigation,
  Droplets,
  ShieldAlert,
  Activity,
  Compass,
  Crosshair,
  Layers,
  X,
  Plus,
  Minus,
  MapPin,
  Check,
  Copy,
  Share2,
  Box,
  Info,
  AlertTriangle,
  Flame,
  ShieldCheck,
} from 'lucide-react';

// Authentic GeoJSON datasets
import boundariesData from '../data/geojson/boundaries.json';
import hazardData from '../data/geojson/hazard.json';
import riskData from '../data/geojson/risk.json';
import participatoryData from '../data/geojson/participatory.json';
import priorityData from '../data/geojson/priority.json';
import controlPointsData from '../data/geojson/controlPoints.json';
import { AccuracyMetadataModal } from '../components/map/AccuracyMetadataModal';

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

interface FeatureDetail {
  title: string;
  type: string;
  status: string;
  dusun: string;
  description: string;
  debit?: string;
  hazardClass?: string;
  coordinates?: [number, number];
}

interface SearchItem {
  id: string;
  name: string;
  categoryLabel: string;
  dusun: string;
  coordinates: [number, number];
  debit?: string;
  hazardClass?: string;
  status: string;
  description: string;
}

export const MapPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModeParam = searchParams.get('mode') || searchParams.get('layer') || 'all';

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Basemap & UI State
  const [basemap, setBasemap] = useState<'streets' | 'satellite'>('satellite');
  const [mapboxToken] = useState<string>(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    return typeof token === 'string' && token.startsWith('pk.') && !token.includes('optional') ? token : '';
  });
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [bearing, setBearing] = useState(0);
  const [copiedCoord, setCopiedCoord] = useState(false);
  const [accuracyModalOpen, setAccuracyModalOpen] = useState(false);

  // Thematic Layers configuration
  const [layers, setLayers] = useState<LayerState[]>([
    {
      id: '1',
      slug: 'bahaya-kekeringan',
      title: 'Bahaya Kekeringan (Hazard)',
      category: 'hazard',
      active: true,
      opacity: 0.4,
      color: '#EA580C',
      description: 'Zonasi bahaya kelerengan, indeks vegetasi NDVI, dan curah hujan.',
    },
    {
      id: '2',
      slug: 'risiko-kekeringan',
      title: 'Risiko Kekeringan (Risk)',
      category: 'risk',
      active: activeModeParam.includes('risiko') || activeModeParam === 'risk',
      opacity: 0.45,
      color: '#DC2626',
      description: 'Analisis risiko gabungan terhadap rumah tangga dan lahan pertanian.',
    },
    {
      id: '3',
      slug: 'sumber-air',
      title: 'Titik Sumber Air Bersih',
      category: 'water',
      active: true,
      opacity: 1,
      color: '#0284C7',
      description: 'Inventarisasi mata air pegunungan, sumur bor, dan kapasitas tandon.',
    },
    {
      id: '4',
      slug: 'peta-partisipatif',
      title: 'Peta Partisipatif Warga',
      category: 'participatory',
      active: activeModeParam.includes('partisipatif') || activeModeParam === 'participatory',
      opacity: 0.7,
      color: '#7C3AED',
      description: 'Jalur pipa swadaya masyarakat, titik retakan tanah, dan embung warga.',
    },
    {
      id: '5',
      slug: 'batas-desa',
      title: 'Batas Wilayah & Dusun',
      category: 'base',
      active: true,
      opacity: 0.85,
      color: '#334155',
      description: 'Batas resmi desa dan 4 dusun (Kemitir Lor, Kidul, Garon, Kalitengah).',
    },
    {
      id: '6',
      slug: 'prioritas',
      title: 'Prioritas Intervensi Darurat',
      category: 'priority',
      active: activeModeParam.includes('prioritas') || activeModeParam === 'priority',
      opacity: 0.5,
      color: '#B91C1C',
      description: 'Zona tanggap darurat dropping tangki air dan bantuan pompa pipa.',
    },
    {
      id: '7',
      slug: 'titik-kontrol-gcp-icp',
      title: 'Titik Kontrol GCP & ICP (Perka BIG)',
      category: 'base',
      active: true,
      opacity: 1,
      color: '#10B981',
      description: '18 titik GCP & ICP terverifikasi geodetik sesuai Perka BIG No. 15/2014 (CE90 = 0.186m).',
    },
  ]);

  // Water source markers
  const waterSourcePins = [
    {
      id: 'ws-1',
      title: 'Tuk Mulyo (Mata Air Utama)',
      type: 'Mata Air Pegunungan',
      status: 'Aktif Mengalir',
      dusun: 'RT 01 RW 01, Dusun Kemitir Lor',
      description: 'Sumber air minum utama warga Kemitir Lor. Bak penampung permanen berkapasitas 15.000 liter melayani 145 KK dengan debit stabil sepanjang kemarau.',
      debit: '12.5 liter / detik',
      hazardClass: 'Rendah',
      coords: [110.3142, -7.2268] as [number, number],
      color: '#0284C7',
    },
    {
      id: 'ws-2',
      title: 'Sumur Bor Sentral RW 02',
      type: 'Sumur Bor',
      status: 'Aktif Mengalir',
      dusun: 'Dusun Kemitir Kidul',
      description: 'Sumur bor dalam bantuan pemerintah dengan pompa celup listrik tenaga surya dan PLN, melayani kawasan pemukiman tengah.',
      debit: '8.0 liter / detik',
      hazardClass: 'Sedang',
      coords: [110.3185, -7.2295] as [number, number],
      color: '#0284C7',
    },
    {
      id: 'ws-3',
      title: 'Tuk Gedang Kidul',
      type: 'Mata Air',
      status: 'Debit Menurun',
      dusun: 'Dusun Kemitir Kidul',
      description: 'Mata air lereng perbukitan, debit mengalami penurunan drastis di puncak musim kemarau memerlukan pemantauan berkala.',
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
      description: 'Embung irigasi seluas 800m2 untuk kelompok tani palawija dan sayuran kubis, cabai, dan labu siam Dusun Garon.',
      debit: 'Tampungan 4.000 m3',
      hazardClass: 'Tinggi',
      coords: [110.3095, -7.2235] as [number, number],
      color: '#0284C7',
    },
  ];

  const searchableFeatures: SearchItem[] = [
    {
      id: 'ws-1',
      name: 'Tuk Mulyo (Mata Air Utama)',
      categoryLabel: 'Mata Air Alami',
      dusun: 'RT 01 RW 01, Dusun Kemitir Lor',
      coordinates: [110.3142, -7.2268],
      debit: '12.5 liter / detik',
      hazardClass: 'Rendah',
      status: 'Aktif Mengalir',
      description: 'Sumber air minum utama warga Kemitir Lor. Bak penampung permanen 15.000 liter melayani 145 KK.',
    },
    {
      id: 'ws-2',
      name: 'Sumur Bor Sentral RW 02',
      categoryLabel: 'Sumur Bor',
      dusun: 'RT 02 RW 02, Dusun Kemitir Kidul',
      coordinates: [110.3185, -7.2295],
      debit: '8.0 liter / detik',
      hazardClass: 'Sedang',
      status: 'Aktif Beroperasi',
      description: 'Sumur bor dalam bantuan pemerintah dengan akses jalan aspal leluasa truk tangki.',
    },
    {
      id: 'ws-3',
      name: 'Tuk Gedang Kidul',
      categoryLabel: 'Mata Air Alami',
      dusun: 'RT 04 RW 02, Dusun Kemitir Kidul',
      coordinates: [110.321, -7.234],
      debit: '2.1 liter / detik',
      hazardClass: 'Tinggi',
      status: 'Debit Menurun',
      description: 'Mata air lereng perbukitan, debit mengalami penurunan drastis di puncak musim kemarau.',
    },
    {
      id: 'ws-4',
      name: 'Embung Pertanian Garon',
      categoryLabel: 'Embung Pertanian',
      dusun: 'Dusun Garon',
      coordinates: [110.3095, -7.2235],
      debit: 'Tampungan 4.000 m3',
      hazardClass: 'Tinggi',
      status: 'Sedimentasi Tinggi',
      description: 'Embung penampung hujan untuk irigasi sawah sayur kelompok tani Garon.',
    },
    {
      id: 'vil-1',
      name: 'Dusun Kemitir Lor',
      categoryLabel: 'Wilayah Dusun',
      dusun: 'Desa Kemitir (Bagian Utara)',
      coordinates: [110.3145, -7.2265],
      status: 'Pemukiman Utama',
      description: 'Dusun Kemitir Lor dengan wilayah RT 01-03, pemukiman utama dengan pasokan Tuk Mulyo.',
    },
    {
      id: 'vil-2',
      name: 'Dusun Kemitir Kidul',
      categoryLabel: 'Wilayah Dusun',
      dusun: 'Desa Kemitir (Bagian Selatan)',
      coordinates: [110.318, -7.230],
      status: 'Zona Rawan Kemarau',
      description: 'Dusun Kemitir Kidul pada ketinggian 1.050 mdpl dengan kerentanan kemarau perbukitan.',
    },
    {
      id: 'vil-3',
      name: 'Dusun Garon',
      categoryLabel: 'Wilayah Dusun',
      dusun: 'Desa Kemitir (Sentra Pertanian)',
      coordinates: [110.309, -7.223],
      status: 'Sentra Hortikultura',
      description: 'Dusun Garon dengan hamparan 42 hektar sawah tadah hujan sayur mayur dan palawija.',
    },
    {
      id: 'vil-4',
      name: 'Dusun Kalitengah',
      categoryLabel: 'Wilayah Dusun',
      dusun: 'Desa Kemitir (Lereng Timur)',
      coordinates: [110.325, -7.2375],
      status: 'Topografi Terjal',
      description: 'Dusun Kalitengah di lereng timur dengan sistem air perpipaan swadaya masyarakat.',
    },
    {
      id: 'haz-1',
      name: 'Zona Prioritas 1: Kemitir Kidul Atas',
      categoryLabel: 'Zona Prioritas Darurat',
      dusun: 'RT 02 Kemitir Kidul',
      coordinates: [110.319, -7.231],
      hazardClass: 'Sangat Tinggi',
      status: 'Mendesak (Skor 92.4)',
      description: 'Prioritas tertinggi: mata air lokal surut dan 380 jiwa warga mengalami keterbatasan air bersih.',
    },
  ];

  // Hero search hands off its query through ?search=
  const initialSearch = searchParams.get('search');
  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
      setSearchDropdownOpen(true);
    }
  }, [initialSearch]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchDropdownOpen(false);
        setLayerPanelOpen(false);
        setSelectedFeature(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Basemap style specification
  const getBasemapStyle = (type: 'streets' | 'satellite'): maplibregl.StyleSpecification => {
    if (type === 'satellite') {
      const satelliteTiles = mapboxToken
        ? [`https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.webp?access_token=${mapboxToken}`]
        : ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'];

      return {
        version: 8,
        sources: {
          'satellite-tiles': {
            type: 'raster',
            tiles: satelliteTiles,
            tileSize: 256,
            attribution: 'Esri World Imagery, Maxar, Earthstar Geographics',
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
          attribution: 'OpenStreetMap contributors',
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

  // Add Vector Layers with Apple/Google polished styling
  const setupVectorLayers = (map: maplibregl.Map) => {
    // 1. Boundaries
    if (!map.getSource('src-boundaries')) {
      map.addSource('src-boundaries', { type: 'geojson', data: boundariesData as any });

      map.addLayer({
        id: 'layer-batas-desa-fill',
        type: 'fill',
        source: 'src-boundaries',
        paint: {
          'fill-color': '#0F172A',
          'fill-opacity': 0.04,
        },
      });

      map.addLayer({
        id: 'layer-batas-desa-line',
        type: 'line',
        source: 'src-boundaries',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 1.8,
          'line-dasharray': [4, 3],
          'line-opacity': 0.85,
        },
      });

      map.on('click', 'layer-batas-desa-fill', (e) => {
        if (!e.features || !e.features[0]) return;
        const p = e.features[0].properties || {};
        setLayerPanelOpen(false);
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

    // 2. Hazard Layer (Translucent refined tones)
    if (!map.getSource('src-hazard')) {
      map.addSource('src-hazard', { type: 'geojson', data: hazardData as any });

      map.addLayer({
        id: 'layer-bahaya-kekeringan-fill',
        type: 'fill',
        source: 'src-hazard',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.4,
        },
      });

      map.addLayer({
        id: 'layer-bahaya-kekeringan-line',
        type: 'line',
        source: 'src-hazard',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 1.6,
          'line-opacity': 0.9,
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
          description: p.description || 'Zona kerawanan kekeringan lereng perbukitan Sumowono.',
          hazardClass: p.hazard_class,
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
      });
    }

    // 3. Risk Layer
    if (!map.getSource('src-risk')) {
      map.addSource('src-risk', { type: 'geojson', data: riskData as any });

      map.addLayer({
        id: 'layer-risiko-kekeringan-fill',
        type: 'fill',
        source: 'src-risk',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.45,
        },
        layout: { visibility: 'none' },
      });

      map.addLayer({
        id: 'layer-risiko-kekeringan-line',
        type: 'line',
        source: 'src-risk',
        paint: {
          'line-color': '#991B1B',
          'line-width': 1.8,
        },
        layout: { visibility: 'none' },
      });

      map.on('click', 'layer-risiko-kekeringan-fill', (e) => {
        if (!e.features || !e.features[0]) return;
        const p = e.features[0].properties || {};
        setSelectedFeature({
          title: `Zona Risiko: ${p.risk_class}`,
          type: 'Peta Risiko Kekeringan (Risk)',
          status: `Komposit Risiko ${p.composite_risk}`,
          dusun: 'Kemitir Kidul & Garon',
          description: `${p.description} Mempengaruhi sekitar ${p.affected_kk} Kepala Keluarga.`,
          hazardClass: p.risk_class,
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
      });
    }

    // 4. Priority Intervention Layer
    if (!map.getSource('src-priority')) {
      map.addSource('src-priority', { type: 'geojson', data: priorityData as any });

      map.addLayer({
        id: 'layer-prioritas-fill',
        type: 'fill',
        source: 'src-priority',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.45,
        },
        layout: { visibility: 'none' },
      });

      map.addLayer({
        id: 'layer-prioritas-line',
        type: 'line',
        source: 'src-priority',
        paint: {
          'line-color': '#DC2626',
          'line-width': 2.2,
          'line-dasharray': [3, 2],
        },
        layout: { visibility: 'none' },
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

    // 5. Participatory Layer
    if (!map.getSource('src-participatory')) {
      map.addSource('src-participatory', { type: 'geojson', data: participatoryData as any });

      map.addLayer({
        id: 'layer-peta-partisipatif-area',
        type: 'fill',
        source: 'src-participatory',
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'fill-color': '#8B5CF6',
          'fill-opacity': 0.35,
        },
        layout: { visibility: 'none' },
      });

      map.addLayer({
        id: 'layer-peta-partisipatif-pipe',
        type: 'line',
        source: 'src-participatory',
        filter: ['==', '$type', 'LineString'],
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 3.5,
        },
        layout: { visibility: 'none' },
      });

      map.addLayer({
        id: 'layer-peta-partisipatif-point',
        type: 'circle',
        source: 'src-participatory',
        filter: ['==', '$type', 'Point'],
        paint: {
          'circle-radius': 7,
          'circle-color': '#A855F7',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
        },
        layout: { visibility: 'none' },
      });

      const onPartClick = (e: any) => {
        if (!e.features || !e.features[0]) return;
        const p = e.features[0].properties || {};
        setSelectedFeature({
          title: p.name || 'Data Partisipatif Warga',
          type: p.category || 'Peta Partisipatif',
          status: p.condition || p.status || 'Tervalidasi Warga',
          dusun: 'Dusun Kemitir Kidul',
          description: p.description || 'Data partisipatif hasil pemetaan gotong royong warga desa.',
          hazardClass: 'Tinggi',
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
      };

      map.on('click', 'layer-peta-partisipatif-area', onPartClick);
      map.on('click', 'layer-peta-partisipatif-pipe', onPartClick);
      map.on('click', 'layer-peta-partisipatif-point', onPartClick);
    }

    // 6. Control Points GCP & ICP Layer (Perka BIG No. 15/2014)
    if (!map.getSource('src-control-points')) {
      map.addSource('src-control-points', { type: 'geojson', data: controlPointsData as any });

      map.addLayer({
        id: 'layer-titik-kontrol-circle',
        type: 'circle',
        source: 'src-control-points',
        paint: {
          'circle-radius': 7,
          'circle-color': ['match', ['get', 'type'], 'ICP', '#10B981', '#3B82F6'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
        },
      });

      map.addLayer({
        id: 'layer-titik-kontrol-label',
        type: 'symbol',
        source: 'src-control-points',
        layout: {
          'text-field': ['get', 'id'],
          'text-size': 11,
          'text-offset': [0, 1.2],
          'text-anchor': 'top',
        },
        paint: {
          'text-color': '#0F172A',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1.5,
        },
      });

      map.on('click', 'layer-titik-kontrol-circle', (e) => {
        if (!e.features || !e.features[0]) return;
        const p = e.features[0].properties || {};
        setSelectedFeature({
          title: `Titik ${p.type}: ${p.id}`,
          type: 'Uji Geometri Peta Dasar (Perka BIG 15/2014)',
          status: `Elevasi: ${p.elevation_m} m | Residu 2D: ${p.delta_2d_m} m`,
          dusun: `UTM 49S: X=${p.easting_utm}, Y=${p.northing_utm}`,
          description: `Ketelitian terverifikasi GNSS Geodetik: ΔX=${p.delta_x_m}m, ΔY=${p.delta_y_m}m, ΔZ=${p.delta_z_m}m. Standar Kelas 1 Skala 1:1.000 (CE90=0.186m, LE90=1.136m).`,
          hazardClass: p.type === 'ICP' ? 'Akurasi Tinggi' : 'Titik Kontrol Tanah',
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
      });
    }

    // Cursor hover behavior
    const interactiveLayers = [
      'layer-batas-desa-fill',
      'layer-bahaya-kekeringan-fill',
      'layer-risiko-kekeringan-fill',
      'layer-prioritas-fill',
      'layer-peta-partisipatif-area',
      'layer-peta-partisipatif-pipe',
      'layer-peta-partisipatif-point',
      'layer-titik-kontrol-circle',
    ];

    interactiveLayers.forEach((layerId) => {
      map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
      });
    });
  };

  // Synchronize Map Layers with State
  const syncMapLayers = (map: maplibregl.Map, currentLayers: LayerState[]) => {
    currentLayers.forEach((layer) => {
      const isVisible = layer.active ? 'visible' : 'none';

      if (layer.slug === 'bahaya-kekeringan') {
        if (map.getLayer('layer-bahaya-kekeringan-fill')) {
          map.setLayoutProperty('layer-bahaya-kekeringan-fill', 'visibility', isVisible);
          map.setPaintProperty('layer-bahaya-kekeringan-fill', 'fill-opacity', layer.opacity);
        }
        if (map.getLayer('layer-bahaya-kekeringan-line')) {
          map.setLayoutProperty('layer-bahaya-kekeringan-line', 'visibility', isVisible);
        }
      }

      if (layer.slug === 'risiko-kekeringan') {
        if (map.getLayer('layer-risiko-kekeringan-fill')) {
          map.setLayoutProperty('layer-risiko-kekeringan-fill', 'visibility', isVisible);
          map.setPaintProperty('layer-risiko-kekeringan-fill', 'fill-opacity', layer.opacity);
        }
        if (map.getLayer('layer-risiko-kekeringan-line')) {
          map.setLayoutProperty('layer-risiko-kekeringan-line', 'visibility', isVisible);
        }
      }

      if (layer.slug === 'batas-desa') {
        if (map.getLayer('layer-batas-desa-fill')) {
          map.setLayoutProperty('layer-batas-desa-fill', 'visibility', isVisible);
        }
        if (map.getLayer('layer-batas-desa-line')) {
          map.setLayoutProperty('layer-batas-desa-line', 'visibility', isVisible);
        }
      }

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

      if (layer.slug === 'prioritas') {
        if (map.getLayer('layer-prioritas-fill')) {
          map.setLayoutProperty('layer-prioritas-fill', 'visibility', isVisible);
          map.setPaintProperty('layer-prioritas-fill', 'fill-opacity', layer.opacity * 0.6);
        }
        if (map.getLayer('layer-prioritas-line')) {
          map.setLayoutProperty('layer-prioritas-line', 'visibility', isVisible);
        }
      }

      if (layer.slug === 'titik-kontrol-gcp-icp') {
        if (map.getLayer('layer-titik-kontrol-circle')) {
          map.setLayoutProperty('layer-titik-kontrol-circle', 'visibility', isVisible);
        }
        if (map.getLayer('layer-titik-kontrol-label')) {
          map.setLayoutProperty('layer-titik-kontrol-label', 'visibility', isVisible);
        }
      }

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
        center: [110.3155, -7.2285],
        zoom: 14,
        pitch: is3D ? 45 : 0,
        bearing: 0,
      });

      map.on('rotate', () => {
        setBearing(map.getBearing());
      });

      map.on('load', () => {
        map.resize();
        setupVectorLayers(map);
        syncMapLayers(map, layers);
      });

      // Handle delayed flexbox layout resolution
      const resizeTimer = setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.resize();
        }
      }, 150);

      const resizeObserver = new ResizeObserver(() => {
        if (mapInstance.current) {
          mapInstance.current.resize();
        }
      });
      resizeObserver.observe(mapContainer.current);

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Water-source markers: the outer element is positioned by MapLibre, so styling and
      // hover scale live on an inner node. Padding gives a 44px touch target.
      waterSourcePins.forEach((feat) => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'group p-1.5 -m-1.5 bg-transparent border-0 cursor-pointer';
        el.setAttribute('aria-label', `${feat.title}, debit ${feat.debit}`);

        el.innerHTML = `
          <span class="relative flex flex-col items-center transition-transform duration-150 group-hover:scale-110 group-active:scale-95 origin-bottom">
            <span class="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center border-2 border-white shadow-lg">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            </span>
            <span class="w-2 h-2 bg-sky-600 rotate-45 -mt-1 border-r-2 border-b-2 border-white"></span>
          </span>
        `;

        const label = document.createElement('span');
        label.className =
          'hidden sm:block absolute left-1/2 -translate-x-1/2 top-full mt-0.5 bg-slate-900 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity pointer-events-none';
        label.textContent = feat.title;
        el.appendChild(label);

        el.addEventListener('click', (ev) => {
          ev.stopPropagation();
          setLayerPanelOpen(false);
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

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat(feat.coords)
          .addTo(map);

        markersRef.current.push(marker);
      });

      mapInstance.current = map;

      return () => {
        clearTimeout(resizeTimer);
        resizeObserver.disconnect();
        map.remove();
      };
    } catch (e) {
      console.warn('MapLibre GL error:', e);
    }
  }, [basemap, mapboxToken]);

  // Synchronize layers when state updates
  useEffect(() => {
    if (!mapInstance.current || !mapInstance.current.isStyleLoaded()) return;
    syncMapLayers(mapInstance.current, layers);
  }, [layers]);

  // Thematic filter pills
  const setThematicFilter = (mode: string) => {
    setSearchParams({ mode });

    setLayers((prev) =>
      prev.map((l) => {
        if (mode === 'all') return { ...l, active: true };
        if (mode === 'hazard' || mode === 'bahaya-kekeringan') {
          return { ...l, active: l.category === 'hazard' || l.category === 'base' };
        }
        if (mode === 'risk' || mode === 'risiko-kekeringan') {
          return { ...l, active: l.category === 'risk' || l.category === 'base' };
        }
        if (mode === 'water' || mode === 'sumber-air') {
          return { ...l, active: l.category === 'water' || l.category === 'base' };
        }
        if (mode === 'participatory' || mode === 'peta-partisipatif') {
          return { ...l, active: l.category === 'participatory' || l.category === 'base' };
        }
        if (mode === 'priority' || mode === 'prioritas') {
          return { ...l, active: l.category === 'priority' || l.category === 'base' };
        }
        return l;
      })
    );

    if (mapInstance.current) {
      if (mode === 'hazard' || mode === 'bahaya-kekeringan') {
        mapInstance.current.flyTo({ center: [110.3165, -7.2285], zoom: 14.2, duration: 800 });
      } else if (mode === 'water' || mode === 'sumber-air') {
        mapInstance.current.flyTo({ center: [110.3155, -7.2280], zoom: 14.8, duration: 800 });
      } else if (mode === 'participatory') {
        mapInstance.current.flyTo({ center: [110.3195, -7.2315], zoom: 15.0, duration: 800 });
      } else if (mode === 'priority') {
        mapInstance.current.flyTo({ center: [110.3175, -7.2325], zoom: 15.2, duration: 800 });
      }
    }
  };

  const toggleLayer = (slug: string) => {
    setLayers((prev) => prev.map((l) => (l.slug === slug ? { ...l, active: !l.active } : l)));
  };

  const updateOpacity = (slug: string, opacity: number) => {
    setLayers((prev) => prev.map((l) => (l.slug === slug ? { ...l, opacity } : l)));
  };

  const resetMapCenter = () => {
    if (mapInstance.current) {
      mapInstance.current.flyTo({
        center: [110.3155, -7.2285],
        zoom: 14,
        pitch: 0,
        bearing: 0,
        duration: 800,
      });
      setIs3D(false);
    }
  };

  const toggle3D = () => {
    if (mapInstance.current) {
      const next3D = !is3D;
      setIs3D(next3D);
      mapInstance.current.easeTo({
        pitch: next3D ? 50 : 0,
        duration: 600,
      });
    }
  };

  const zoomIn = () => {
    if (mapInstance.current) mapInstance.current.zoomIn({ duration: 300 });
  };

  const zoomOut = () => {
    if (mapInstance.current) mapInstance.current.zoomOut({ duration: 300 });
  };

  const handleGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (mapInstance.current) {
            mapInstance.current.flyTo({
              center: [pos.coords.longitude, pos.coords.latitude],
              zoom: 16,
              duration: 900,
            });
          }
        },
        () => {
          alert('Izin lokasi GPS tidak diberikan atau perangkat di luar jangkauan satelit.');
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleSelectSearchResult = (item: SearchItem) => {
    if (item.id.startsWith('inf-')) {
      setLayers((prev) => prev.map((l) => (l.slug === 'peta-partisipatif' ? { ...l, active: true } : l)));
    } else if (item.id.startsWith('haz-')) {
      setLayers((prev) =>
        prev.map((l) => (l.slug === 'prioritas' || l.slug === 'bahaya-kekeringan' ? { ...l, active: true } : l))
      );
    } else if (item.id.startsWith('ws-')) {
      setLayers((prev) => prev.map((l) => (l.slug === 'sumber-air' ? { ...l, active: true } : l)));
    }

    if (mapInstance.current) {
      mapInstance.current.flyTo({
        center: item.coordinates,
        zoom: 16.5,
        pitch: 35,
        bearing: 0,
        duration: 900,
      });
    }

    setSelectedFeature({
      title: item.name,
      type: item.categoryLabel,
      status: item.status,
      dusun: item.dusun,
      description: item.description,
      debit: item.debit,
      hazardClass: item.hazardClass,
      coordinates: item.coordinates,
    });

    setSearchDropdownOpen(false);
    setLayerPanelOpen(false);
  };

  const copyCoordinates = (coords: [number, number]) => {
    navigator.clipboard.writeText(`${coords[1].toFixed(5)}, ${coords[0].toFixed(5)}`);
    setCopiedCoord(true);
    setTimeout(() => setCopiedCoord(false), 2000);
  };

  const openInGoogleMaps = (lng: number, lat: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const searchResults = searchQuery.trim()
    ? searchableFeatures.filter((item) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.name.toLowerCase().includes(q) ||
          item.dusun.toLowerCase().includes(q) ||
          item.categoryLabel.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q)
        );
      })
    : [];

  const activeLayerCount = layers.filter((l) => l.active).length;

  return (
    <div className="relative w-full h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] flex-1 min-h-0 overflow-hidden bg-slate-900 select-none">
      {/* 1. Map Canvas (Full Viewport Immersion) */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" role="region" aria-label="Peta interaktif Desa Kemitir" />

      {/* 2. Floating Search & Thematic Filter Chips Bar (Google & Apple Maps standard) */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-[4.25rem] sm:right-auto w-auto sm:max-w-xl md:max-w-2xl z-20 pointer-events-none flex flex-col gap-2">
        {/* Search Input Box */}
        <div ref={searchContainerRef} className="relative pointer-events-auto sm:w-[420px]">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 pl-3.5 pr-1 min-h-[44px] flex items-center gap-2.5 shadow-md shadow-slate-900/5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="search"
              aria-label="Cari lokasi di peta"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchDropdownOpen(true);
              }}
              onFocus={() => setSearchDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchResults.length > 0) {
                  handleSelectSearchResult(searchResults[0]);
                } else if (e.key === 'Escape') {
                  setSearchDropdownOpen(false);
                }
              }}
              placeholder="Cari mata air, dusun, pipa..."
              className="w-full min-w-0 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent [&::-webkit-search-cancel-button]:hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchDropdownOpen(false);
                }}
                className="shrink-0 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Hapus kata kunci"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchDropdownOpen && (
            <div className="absolute top-full mt-1.5 left-0 right-0 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 z-50 max-h-[50dvh] overflow-y-auto overscroll-contain">
              <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                {searchQuery.trim() ? `Hasil Pencarian (${searchResults.length})` : 'Rekomendasi Pencarian'}
              </div>

              <div className="mt-1 space-y-0.5">
                {(searchQuery.trim() ? searchResults : searchableFeatures.slice(0, 5)).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSearchResult(item)}
                    type="button"
                    className="w-full text-left p-2.5 min-h-[48px] rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {item.categoryLabel.includes('Mata Air') || item.categoryLabel.includes('Sumur') ? (
                        <Droplets className="w-3.5 h-3.5" />
                      ) : item.categoryLabel.includes('Dusun') ? (
                        <MapPin className="w-3.5 h-3.5" />
                      ) : item.categoryLabel.includes('Pipa') ? (
                        <Activity className="w-3.5 h-3.5" />
                      ) : (
                        <ShieldAlert className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                          {item.name}
                        </span>
                        <span className="hidden min-[400px]:inline text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                          {item.categoryLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.dusun}</p>
                    </div>
                  </button>
                ))}

                {searchQuery.trim() && searchResults.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Tidak ditemukan data untuk "{searchQuery}".
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Floating Category Filter Chips (Apple & Google Maps standard) */}
        <div className="flex items-center gap-2 overflow-x-auto pointer-events-auto py-1 px-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x">
          {[
            { id: 'all', label: 'Semua', icon: Layers, color: 'text-slate-500' },
            { id: 'water', label: 'Sumber Air', icon: Droplets, color: 'text-sky-500' },
            { id: 'hazard', label: 'Bahaya', icon: AlertTriangle, color: 'text-amber-500' },
            { id: 'risk', label: 'Risiko', icon: ShieldAlert, color: 'text-rose-500' },
            { id: 'priority', label: 'Prioritas', icon: Flame, color: 'text-red-500' },
            { id: 'participatory', label: 'Pipa Warga', icon: Activity, color: 'text-purple-500' },
          ].map((chip) => {
            const Icon = chip.icon;
            const isActive =
              activeModeParam === chip.id ||
              (chip.id === 'all' && (!activeModeParam || activeModeParam === 'all')) ||
              (chip.id === 'hazard' && activeModeParam === 'bahaya-kekeringan') ||
              (chip.id === 'risk' && activeModeParam === 'risiko-kekeringan') ||
              (chip.id === 'water' && activeModeParam === 'sumber-air') ||
              (chip.id === 'participatory' && activeModeParam === 'peta-partisipatif') ||
              (chip.id === 'priority' && activeModeParam === 'prioritas');

            return (
              <button
                type="button"
                key={chip.id}
                aria-pressed={isActive}
                onClick={() => setThematicFilter(chip.id)}
                className={`group shrink-0 min-h-[40px] sm:min-h-[36px] px-3.5 sm:px-3 rounded-full text-xs sm:text-[13px] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                  isActive
                    ? 'bg-emerald-600 text-white border border-emerald-600 shadow-md shadow-emerald-900/15 ring-2 ring-emerald-500/25 font-semibold'
                    : 'bg-white/95 backdrop-blur-md text-slate-700 hover:text-slate-900 hover:bg-white border border-slate-200/90 shadow-sm'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : chip.color
                  }`}
                  aria-hidden="true"
                />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Floating Action Controls (Right Side - Apple & Google Maps standard) */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 flex flex-col items-end gap-2 pointer-events-none">
        {/* Layer FAB Button */}
        <button
          type="button"
          onClick={() => {
            setLayerPanelOpen((open) => !open);
            setSelectedFeature(null);
          }}
          aria-expanded={layerPanelOpen}
          className={`min-h-[44px] min-w-[44px] px-3 sm:px-3.5 rounded-2xl border flex items-center justify-center gap-2 text-sm font-semibold shadow-md transition-colors pointer-events-auto ${
            layerPanelOpen
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
          }`}
          aria-label="Pengaturan lapisan peta"
        >
          <Layers className={`w-5 h-5 ${layerPanelOpen ? 'text-emerald-400' : 'text-emerald-600'}`} aria-hidden="true" />
          <span className="hidden sm:inline">Lapisan</span>
          <span className="hidden sm:flex min-w-5 h-5 px-1 rounded-full bg-emerald-600 text-white text-[11px] items-center justify-center font-semibold">
            {activeLayerCount}
          </span>
        </button>

        {/* Navigation Control Stack */}
        <div className={`bg-white border border-slate-300 rounded-2xl shadow-md p-0.5 flex-col items-center pointer-events-auto ${selectedFeature || layerPanelOpen ? 'hidden sm:flex' : 'flex'}`}>
          {/* Compass with dynamic rotation */}
          <button
            type="button"
            onClick={resetMapCenter}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            title="Arah Utara & Pusat Peta"
            aria-label="Pusatkan Peta"
          >
            <Compass
              className="w-5 h-5 text-emerald-700 transition-transform duration-200"
              style={{ transform: `rotate(${-bearing}deg)` }}
            />
          </button>

          {/* 3D Isometric Pitch Toggle */}
          <button
            type="button"
            aria-pressed={is3D}
            onClick={toggle3D}
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
              is3D ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="Tampilan Perspektif 3D / 2D"
            aria-label="Ubah Tampilan 3D"
          >
            <Box className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Geolocation */}
          <button
            type="button"
            onClick={handleGeolocation}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            title="Lokasi GPS Saya"
            aria-label="Lokasi GPS Saya"
          >
            <Crosshair className="w-5 h-5 text-blue-600" aria-hidden="true" />
          </button>

          {/* Metadata Uji Akurasi BIG & Sensor UAV */}
          <button
            type="button"
            onClick={() => setAccuracyModalOpen(true)}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            title="Metadata Akurasi Peta (Perka BIG) & Sensor UAV"
            aria-label="Metadata Akurasi Peta"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />
          </button>

          <div className="w-6 h-px bg-slate-200 my-0.5" />

          {/* Zoom In & Out */}
          <button
            type="button"
            onClick={zoomIn}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            title="Perbesar Peta"
            aria-label="Perbesar"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={zoomOut}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            title="Perkecil Peta"
            aria-label="Perkecil"
          >
            <Minus className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 4. Layer sheet: bottom sheet on phones, floating popover from sm up */}
      {layerPanelOpen && (
        <div
          role="dialog"
          aria-label="Pengaturan lapisan spasial"
          className="absolute z-30 inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-auto sm:top-[4.5rem] sm:right-4 sm:w-96 bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl max-h-[80dvh] sm:max-h-[calc(100dvh-6.5rem)] flex flex-col"
        >
          <div className="sm:hidden flex justify-center pt-2.5" aria-hidden="true">
            <div className="w-9 h-1 rounded-full bg-slate-300" />
          </div>

          <div className="px-4 pt-2 sm:pt-4 pb-2 sm:pb-3 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
            <h2 className="text-base font-bold text-slate-900">Lapisan Peta</h2>
            <button
              type="button"
              onClick={() => setLayerPanelOpen(false)}
              className="w-11 h-11 -mr-2 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              aria-label="Tutup panel lapisan"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto overscroll-contain space-y-5 flex-1 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 mb-2">Peta dasar</h3>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Peta dasar">
                {[
                  { id: 'satellite' as const, title: 'Satelit', source: 'Esri / Maxar' },
                  { id: 'streets' as const, title: 'Peta Jalan', source: 'OpenStreetMap' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={basemap === opt.id}
                    onClick={() => setBasemap(opt.id)}
                    className={`min-h-[56px] px-3 py-2 rounded-2xl border text-left transition-colors ${
                      basemap === opt.id
                        ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-semibold text-slate-900 block">{opt.title}</span>
                    <span className="text-xs text-slate-600">{opt.source}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 mb-2">Data tematik</h3>
              <ul className="space-y-2">
                {layers.map((layer) => (
                  <li
                    key={layer.id}
                    className={`rounded-2xl border px-3 py-1 transition-colors ${
                      layer.active ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0 py-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: layer.color }}
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <span id={`layer-label-${layer.id}`} className="text-sm font-semibold text-slate-900 block leading-tight">
                            {layer.title}
                          </span>
                          <span className="text-xs text-slate-600 block mt-0.5 leading-snug">
                            {layer.description}
                          </span>
                        </div>
                      </div>

                      {/* 44px hit area around a 24x44 visual track */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={layer.active}
                        aria-labelledby={`layer-label-${layer.id}`}
                        onClick={() => toggleLayer(layer.slug)}
                        className="shrink-0 w-14 min-h-[44px] flex items-center justify-center rounded-full"
                      >
                        <span
                          className={`relative inline-flex h-7 w-12 rounded-full transition-colors duration-200 ${
                            layer.active ? 'bg-emerald-600' : 'bg-slate-400'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
                              layer.active ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </span>
                      </button>
                    </div>

                    {layer.active && layer.slug !== 'sumber-air' && (
                      <div className="border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-600 min-h-[44px]">
                        <label htmlFor={`opacity-${layer.id}`}>Transparansi</label>
                        <div className="flex items-center gap-2 flex-1 max-w-[180px]">
                          <input
                            id={`opacity-${layer.id}`}
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={layer.opacity}
                            onChange={(e) => updateOpacity(layer.slug, parseFloat(e.target.value))}
                            className="w-full h-6 cursor-pointer accent-emerald-600"
                          />
                          <span className="font-semibold text-slate-800 w-9 text-right tabular-nums">
                            {Math.round(layer.opacity * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-xs font-semibold text-slate-500 mb-2">Legenda tingkat kerawanan</h3>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs font-medium text-slate-700">
                {[
                  ['bg-emerald-500', 'Rendah (Aman)'],
                  ['bg-amber-500', 'Sedang (Waspada)'],
                  ['bg-orange-500', 'Tinggi (Siaga)'],
                  ['bg-rose-600', 'Sangat Tinggi (Darurat)'],
                ].map(([color, label]) => (
                  <li key={label} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`} aria-hidden="true" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 5. Feature sheet: bottom sheet on phones, floating card from sm up */}
      {selectedFeature && (
        <div
          role="dialog"
          aria-label={`Detail ${selectedFeature.title}`}
          className="absolute z-30 inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-auto sm:top-[4.5rem] sm:right-4 sm:w-96 bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl max-h-[70dvh] sm:max-h-[calc(100dvh-6.5rem)] flex flex-col"
        >
          <div className="sm:hidden flex justify-center pt-2.5" aria-hidden="true">
            <div className="w-9 h-1 rounded-full bg-slate-300" />
          </div>

          <div className="p-4 sm:p-5 flex-1 overflow-y-auto overscroll-contain space-y-3.5 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mb-1.5">
                  {selectedFeature.type}
                </span>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">{selectedFeature.title}</h2>
                <div className="flex items-start gap-1.5 text-sm text-slate-600 mt-1">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{selectedFeature.dusun}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFeature(null)}
                className="w-11 h-11 -mt-1 -mr-2 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors shrink-0"
                aria-label="Tutup detail fitur"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <dl className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <dt className="text-xs text-slate-600">Status</dt>
                <dd className="text-sm font-semibold text-slate-900 mt-0.5">{selectedFeature.status}</dd>
              </div>
              {selectedFeature.debit ? (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <dt className="text-xs text-slate-600">Debit / Kapasitas</dt>
                  <dd className="text-sm font-semibold text-blue-700 mt-0.5">{selectedFeature.debit}</dd>
                </div>
              ) : selectedFeature.hazardClass ? (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <dt className="text-xs text-slate-600">Tingkat Kerawanan</dt>
                  <dd className="text-sm font-semibold text-orange-700 mt-0.5">{selectedFeature.hazardClass}</dd>
                </div>
              ) : null}
            </dl>

            <p className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed">
              {selectedFeature.description}
            </p>

            {selectedFeature.coordinates && (
              <div className="space-y-2">
                <Button
                  variant="brand"
                  size="md"
                  className="w-full"
                  onClick={() => openInGoogleMaps(selectedFeature.coordinates![0], selectedFeature.coordinates![1])}
                >
                  <Navigation className="w-4 h-4" aria-hidden="true" />
                  <span>Buka Rute di Google Maps</span>
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => copyCoordinates(selectedFeature.coordinates!)}
                  >
                    {copiedCoord ? (
                      <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <Copy className="w-4 h-4" aria-hidden="true" />
                    )}
                    <span>{copiedCoord ? 'Tersalin' : 'Salin Koordinat'}</span>
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      if (navigator.share) {
                        navigator
                          .share({
                            title: selectedFeature.title,
                            text: `${selectedFeature.title} - ${selectedFeature.dusun}`,
                            url: window.location.href,
                          })
                          .catch(() => undefined);
                      } else {
                        copyCoordinates(selectedFeature.coordinates!);
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                    <span>Bagikan</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Legend toggle: bottom-left, hidden on phones while a sheet is open */}
      <div
        className={`absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-20 pointer-events-auto ${
          selectedFeature || layerPanelOpen ? 'hidden sm:block' : ''
        }`}
      >
        <button
          type="button"
          onClick={() => setLegendOpen((open) => !open)}
          aria-expanded={legendOpen}
          className="min-h-[44px] sm:min-h-[36px] px-3.5 rounded-full bg-white border border-slate-300 text-sm font-semibold text-slate-800 hover:bg-slate-50 shadow-md flex items-center gap-2 transition-colors"
        >
          <Info className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span>Legenda</span>
        </button>

        {legendOpen && (
          <div className="absolute bottom-full mb-2 left-0 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 w-60">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
              <h2 className="text-xs font-semibold text-slate-600">Tingkat kerawanan</h2>
              <button
                type="button"
                onClick={() => setLegendOpen(false)}
                className="w-9 h-9 -mr-2 flex items-center justify-center text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100"
                aria-label="Tutup legenda"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {[
                ['bg-emerald-500', 'Rendah (Aman)'],
                ['bg-amber-500', 'Sedang (Waspada)'],
                ['bg-orange-500', 'Tinggi (Siaga)'],
                ['bg-rose-600', 'Sangat Tinggi (Darurat)'],
              ].map(([color, label]) => (
                <li key={label} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${color}`} aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Metadata & Uji Akurasi BIG Modal */}
      <AccuracyMetadataModal
        isOpen={accuracyModalOpen}
        onClose={() => setAccuracyModalOpen(false)}
      />
    </div>
  );
};
