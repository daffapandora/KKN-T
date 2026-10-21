/**
 * Brand and functional design tokens for Kemitir Tangguh Bencana.
 * Based on Section 9.2 of the Master Specification.
 */
export const BRAND_COLORS = {
  primary: '#16A34A', // Primary brand green (success, low risk)
  water: '#2563EB',   // Water blue (links, information)
  warning: '#F59E0B', // Warning orange (medium risk)
  danger: '#DC2626',  // Danger red (high risk)
  participatory: '#7C3AED', // Participatory purple
  neutral: '#6B7280', // Neutral gray
} as const;

export const NEUTRAL_UI_COLORS = {
  background: '#FFFFFF',
  text: '#151A22',
  muted: '#6F747C',
  hairline: '#E8EAED',
  darkPrimary: '#17202B',
} as const;

export const RISK_SCALE_COLORS = {
  low: '#16A34A',      // Low / Rendah
  medium: '#EAB308',   // Medium / Sedang
  high: '#F97316',     // High / Tinggi
  veryHigh: '#DC2626', // Very High / Sangat Tinggi
} as const;

export const RISK_SCALE_LABELS = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
  veryHigh: 'Sangat Tinggi',
} as const;
