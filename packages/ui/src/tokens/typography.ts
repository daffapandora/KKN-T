export const TYPOGRAPHY_TOKENS = {
  fontFamilies: {
    sans: [
      '"Plus Jakarta Sans"',
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ],
    mono: [
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      'monospace',
    ],
  },
  fontSizes: {
    hero: ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }], // 56px
    h1: ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],   // 36px
    h2: ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.015em' }], // 28px
    h3: ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],   // 20px
    body: ['0.9375rem', { lineHeight: '1.5' }],                          // 15px
    small: ['0.8125rem', { lineHeight: '1.4' }],                         // 13px
    caption: ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.05em' }], // 11px uppercase
  },
} as const;
