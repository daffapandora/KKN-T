export const BORDER_TOKENS = {
  hairline: '1px solid #E8EAED',
  radius: {
    none: '0px',
    sm: '4px',
    DEFAULT: '6px',
    md: '8px',
    full: '9999px',
  },
  // Explicitly NO heavy drop shadows - tactile border rules only
  boxShadow: {
    none: 'none',
    subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
  },
} as const;
