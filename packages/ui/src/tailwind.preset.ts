import { THEME_COLORS } from './tokens/colors';
import { TYPOGRAPHY_TOKENS } from './tokens/typography';

/**
 * Tailwind preset for Kemitir Tangguh Bencana
 */
export const kemitirTailwindPreset = {
  theme: {
    extend: {
      colors: {
        brand: THEME_COLORS.brand,
        water: THEME_COLORS.water,
        warning: THEME_COLORS.warning,
        danger: THEME_COLORS.danger,
        participatory: THEME_COLORS.participatory,
        'ui-bg': THEME_COLORS.neutral.white,
        'ui-text': THEME_COLORS.neutral.text,
        'ui-muted': THEME_COLORS.neutral.muted,
        'ui-hairline': THEME_COLORS.neutral.hairline,
        'ui-dark': THEME_COLORS.neutral.darkPrimary,
        risk: THEME_COLORS.risk,
      },
      fontFamily: {
        sans: TYPOGRAPHY_TOKENS.fontFamilies.sans,
        mono: TYPOGRAPHY_TOKENS.fontFamilies.mono,
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
      },
      borderWidth: {
        hairline: '1px',
      },
    },
  },
};

export default kemitirTailwindPreset;
