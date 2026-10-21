import { describe, it, expect } from 'vitest';
import {
  RegisterCitizenSchema,
  CreateReportSchema,
  UpdateValidationStatusSchema,
  GeoJsonPointSchema,
  GeoJsonPolygonSchema,
  BRAND_COLORS,
  RISK_SCALE_COLORS,
} from '../src';

describe('Shared Constants and Schemas', () => {
  it('should export the exact brand colors from specification', () => {
    expect(BRAND_COLORS.primary).toBe('#16A34A');
    expect(BRAND_COLORS.water).toBe('#2563EB');
    expect(BRAND_COLORS.warning).toBe('#F59E0B');
    expect(BRAND_COLORS.danger).toBe('#DC2626');
    expect(BRAND_COLORS.participatory).toBe('#7C3AED');
    expect(BRAND_COLORS.neutral).toBe('#6B7280');
  });

  it('should export the exact risk scale colors', () => {
    expect(RISK_SCALE_COLORS.low).toBe('#16A34A');
    expect(RISK_SCALE_COLORS.medium).toBe('#EAB308');
    expect(RISK_SCALE_COLORS.high).toBe('#F97316');
    expect(RISK_SCALE_COLORS.veryHigh).toBe('#DC2626');
  });

  it('should validate valid citizen registration with consent', () => {
    const validData = {
      name: 'Budi Santoso',
      phone: '081234567890',
      password: 'password123',
      rt: '02',
      rw: '01',
      dusun: 'Kemitir Kidul',
      consent: true,
    };

    const result = RegisterCitizenSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject registration if consent is false (UU PDP requirement)', () => {
    const invalidData = {
      name: 'Budi Santoso',
      phone: '081234567890',
      password: 'password123',
      rt: '02',
      rw: '01',
      dusun: 'Kemitir Kidul',
      consent: false,
    };

    const result = RegisterCitizenSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should validate GeoJSON point and polygon', () => {
    const point = {
      type: 'Point',
      coordinates: [110.3155, -7.2285],
    };
    expect(GeoJsonPointSchema.safeParse(point).success).toBe(true);

    const polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [110.31, -7.22],
          [110.32, -7.22],
          [110.32, -7.23],
          [110.31, -7.23],
        ],
      ],
    };
    expect(GeoJsonPolygonSchema.safeParse(polygon).success).toBe(true);
  });

  it('should require rejectReason when report is rejected', () => {
    const validReject = {
      status: 'rejected',
      rejectReason: 'Foto buram dan lokasi di luar wilayah Desa Kemitir',
    };
    expect(UpdateValidationStatusSchema.safeParse(validReject).success).toBe(true);

    const invalidReject = {
      status: 'rejected',
    };
    expect(UpdateValidationStatusSchema.safeParse(invalidReject).success).toBe(false);
  });
});
