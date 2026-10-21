import { z } from 'zod';

export const PositionSchema = z.tuple([
  z.number().min(-180).max(180), // Longitude
  z.number().min(-90).max(90),   // Latitude
]);

export type Position = z.infer<typeof PositionSchema>;

export const GeoJsonPointSchema = z.object({
  type: z.literal('Point'),
  coordinates: PositionSchema,
});

export const GeoJsonLineStringSchema = z.object({
  type: z.literal('LineString'),
  coordinates: z.array(PositionSchema).min(2),
});

export const GeoJsonPolygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(PositionSchema).min(4)),
});

export const GeoJsonMultiPolygonSchema = z.object({
  type: z.literal('MultiPolygon'),
  coordinates: z.array(z.array(z.array(PositionSchema).min(4))),
});

export const GeoJsonGeometrySchema = z.discriminatedUnion('type', [
  GeoJsonPointSchema,
  GeoJsonLineStringSchema,
  GeoJsonPolygonSchema,
  GeoJsonMultiPolygonSchema,
]);

export type GeoJsonGeometry = z.infer<typeof GeoJsonGeometrySchema>;

export const GeoJsonFeatureSchema = z.object({
  type: z.literal('Feature'),
  id: z.string().optional(),
  geometry: GeoJsonGeometrySchema,
  properties: z.record(z.any()).nullable().optional(),
});

export const GeoJsonFeatureCollectionSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(GeoJsonFeatureSchema),
});

export type GeoJsonFeature = z.infer<typeof GeoJsonFeatureSchema>;
export type GeoJsonFeatureCollection = z.infer<typeof GeoJsonFeatureCollectionSchema>;
