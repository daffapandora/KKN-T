import { describe, it, expect } from 'vitest';
import { THEME_COLORS, BORDER_TOKENS, TYPOGRAPHY_TOKENS } from '../src';

describe('UI Design Tokens', () => {
  it('should maintain exact palette hex values', () => {
    expect(THEME_COLORS.brand.DEFAULT).toBe('#16A34A');
    expect(THEME_COLORS.water.DEFAULT).toBe('#2563EB');
    expect(THEME_COLORS.warning.DEFAULT).toBe('#F59E0B');
    expect(THEME_COLORS.danger.DEFAULT).toBe('#DC2626');
    expect(THEME_COLORS.participatory.DEFAULT).toBe('#7C3AED');
    expect(THEME_COLORS.neutral.text).toBe('#151A22');
    expect(THEME_COLORS.neutral.hairline).toBe('#E8EAED');
    expect(THEME_COLORS.neutral.darkPrimary).toBe('#17202B');
  });

  it('should enforce 1px hairline border and no drop shadows', () => {
    expect(BORDER_TOKENS.hairline).toBe('1px solid #E8EAED');
    expect(BORDER_TOKENS.boxShadow.none).toBe('none');
  });

  it('should have Plus Jakarta Sans and Inter in typography', () => {
    expect(TYPOGRAPHY_TOKENS.fontFamilies.sans).toContain('"Plus Jakarta Sans"');
    expect(TYPOGRAPHY_TOKENS.fontFamilies.sans).toContain('Inter');
  });
});
