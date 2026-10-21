export {
  BRAND_COLORS,
  NEUTRAL_UI_COLORS,
  RISK_SCALE_COLORS,
  RISK_SCALE_LABELS,
} from '@kemitir/shared';

export const THEME_COLORS = {
  brand: {
    DEFAULT: '#16A34A',
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
  },
  water: {
    DEFAULT: '#2563EB',
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },
  warning: {
    DEFAULT: '#F59E0B',
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
  },
  danger: {
    DEFAULT: '#DC2626',
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
  },
  participatory: {
    DEFAULT: '#7C3AED',
    50: '#F5F3FF',
    100: '#EDE9FE',
    600: '#7C3AED',
  },
  neutral: {
    white: '#FFFFFF',
    text: '#151A22',
    muted: '#6F747C',
    hairline: '#E8EAED',
    darkPrimary: '#17202B',
  },
  risk: {
    low: '#16A34A',
    medium: '#EAB308',
    high: '#F97316',
    veryHigh: '#DC2626',
  },
} as const;
