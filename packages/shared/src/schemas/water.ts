import { z } from 'zod';

export const NearestWaterSourceQuerySchema = z.object({
  lng: z.coerce.number().min(-180).max(180),
  lat: z.coerce.number().min(-90).max(90),
  limit: z.coerce.number().int().min(1).max(20).default(5),
});

export type NearestWaterSourceQuery = z.infer<typeof NearestWaterSourceQuerySchema>;

export const WaterSourceFilterSchema = z.object({
  type: z.string().optional(),
  condition: z.string().optional(),
  bbox: z.string().regex(/^[-0-9.]+,[-0-9.]+,[-0-9.]+,[-0-9.]+$/, 'Format bbox: minLng,minLat,maxLng,maxLat').optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type WaterSourceFilter = z.infer<typeof WaterSourceFilterSchema>;
