import { describe, it, expect } from 'vitest';
import { idCopy } from '../src/i18n/id';

describe('Web App Copy and Structure Tests', () => {
  it('should have all 16 landing sections properly configured in Indonesian', () => {
    // 1. Top nav
    expect(idCopy.nav.openMap).toBe('Buka Peta');
    expect(idCopy.nav.thematicMaps).toBe('Peta Tematik');

    // 2. Hero pill
    expect(idCopy.hero.pillTag).toBe('KKN 2026');

    // 3. Hero headline
    expect(idCopy.hero.headlinePart1).toBe('Peta, data, dan partisipasi');
    expect(idCopy.hero.headlinePart2).toBe('untuk desa yang lebih tangguh.');

    // 5. Access-mode cards
    expect(idCopy.accessModes.webgis.title).toBe('WebGIS');
    expect(idCopy.accessModes.pwa.title).toBe('Aplikasi (PWA/Android)');
    expect(idCopy.accessModes.citizenReport.title).toBe('Laporan Warga');

    // 6. Coverage statement
    expect(idCopy.coverage.statement).toContain('Desa Kemitir');
    expect(idCopy.coverage.items.length).toBeGreaterThanOrEqual(4);

    // 7. Proof metrics
    expect(idCopy.metrics.label).toBe('RINGKASAN DESA');
    expect(idCopy.metrics.areaValue).toBe('1.245 ha');
    expect(idCopy.metrics.populationValue).toBe('4.832 jiwa');

    // 8, 9, 10. Capability sections 1, 2, 3
    expect(idCopy.capabilities.cap1.eyebrow).toBe('01');
    expect(idCopy.capabilities.cap2.eyebrow).toBe('02');
    expect(idCopy.capabilities.cap3.eyebrow).toBe('03');

    // 11. Teaser offline
    expect(idCopy.teaserOffline.badge).toBe('Segera hadir');

    // 12. Integrations
    expect(idCopy.integrations.items.length).toBe(6);

    // 13. Testimonial
    expect(idCopy.testimonial.author).toBe('Pemerintah Desa Kemitir');

    // 14. CTA Callout
    expect(idCopy.ctaPriority.heading).toBe('Dusun mana yang paling butuh air bersih?');

    // 15, 16. Footer
    expect(idCopy.footer.sections.legal.title).toBe('Legalitas');
    expect(idCopy.footer.copyright).toContain('2026');
  });
});
