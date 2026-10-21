import { z } from 'zod';
import { GeoJsonPointSchema } from './geojson';
import { VALIDATION_STATUS } from '../constants/roles';

export const REPORT_CATEGORIES = [
  'Kekeringan Lahan Pertanian',
  'Krisis Air Bersih Rumah Tangga',
  'Mata Air Mengering / Debit Menurun',
  'Kerusakan Pipa / Sarana Air',
  'Kebutuhan Bantuan Tangki Air',
  'Lainnya',
] as const;

export const CreateReportSchema = z.object({
  category: z.enum(REPORT_CATEGORIES, {
    errorMap: () => ({ message: 'Pilih kategori laporan yang valid' }),
  }),
  description: z.string().min(10, 'Deskripsi laporan minimal 10 karakter').max(1000),
  geometry: GeoJsonPointSchema,
  accuracyMeters: z.number().nonnegative().max(500, 'Akurasi GPS terlalu rendah (> 500m)'),
  photoIds: z.array(z.string().uuid()).max(3, 'Maksimal 3 foto per laporan').optional().default([]),
  turnstileToken: z.string().optional(),
});

export type CreateReportInput = z.infer<typeof CreateReportSchema>;

export const UpdateValidationStatusSchema = z.object({
  status: z.enum([VALIDATION_STATUS.VALID, VALIDATION_STATUS.REJECTED]),
  rejectReason: z.string().min(5, 'Alasan penolakan minimal 5 karakter').optional(),
}).refine(
  (data) => data.status !== VALIDATION_STATUS.REJECTED || (data.rejectReason && data.rejectReason.length >= 5),
  {
    message: 'Alasan penolakan wajib disertakan jika laporan ditolak',
    path: ['rejectReason'],
  }
);

export type UpdateValidationStatusInput = z.infer<typeof UpdateValidationStatusSchema>;
