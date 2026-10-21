import kemitirPreset from '../../packages/ui/src/tailwind.preset.ts';

export default {
  presets: [kemitirPreset],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
