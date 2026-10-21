export const LAYER_TYPES = {
  HAZARD: 'hazard',
  EXPOSURE: 'exposure',
  RISK: 'risk',
  BASE: 'base',
  WATER: 'water',
  ACCESS: 'access',
  PRIORITY: 'priority',
  PARTICIPATORY: 'participatory',
} as const;

export type LayerType = (typeof LAYER_TYPES)[keyof typeof LAYER_TYPES];

export const GEOMETRY_TYPES = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  POLYGON: 'Polygon',
  MULTI_POLYGON: 'MultiPolygon',
  GEOMETRY: 'Geometry',
} as const;

export type GeometryType = (typeof GEOMETRY_TYPES)[keyof typeof GEOMETRY_TYPES];

export const WATER_SOURCE_TYPES = [
  'Mata Air',
  'Sumur Bor',
  'Sumur Gali',
  'PAH (Penampung Air Hujan)',
  'Sungai / Kali',
  'Embung',
  'Lainnya',
] as const;

export const WATER_SOURCE_CONDITIONS = [
  'Baik / Layak',
  'Debit Menurun',
  'Kering / Rusak',
  'Tercemar',
] as const;
