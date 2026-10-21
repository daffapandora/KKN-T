import { z } from 'zod';
import { GeoJsonGeometrySchema } from './geojson';

export const PARTICIPATORY_CATEGORIES = [
  'Jalur Pipa Air Bersih',
  'Bak / Tandon Penampungan',
  'Mata Air Swadaya Warga',
  'Lahan Kritis / Rawan Kekeringan',
  'Rencana Usulan Sarana Air',
  'Area Resapan Air',
  'Lainnya',
] as const;

export const CreateParticipatoryFeatureSchema = z.object({
  category: z.enum(PARTICIPATORY_CATEGORIES, {
    errorMap: () => ({ message: 'Pilih kategori pemetaan partisipatif yang valid' }),
  }),
  description: z.string().min(5, 'Deskripsi objek minimal 5 karakter').max(1000),
  geometry: GeoJsonGeometrySchema,
  photoIds: z.array(z.string().uuid()).max(3, 'Maksimal 3 foto').optional().default([]),
  turnstileToken: z.string().optional(),
});

export type CreateParticipatoryFeatureInput = z.infer<typeof CreateParticipatoryFeatureSchema>;
